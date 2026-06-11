import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { getTerms, saveTerm as apiSave, deleteTerm as apiDelete } from '../services/dictionaryService';

const DictionaryContext = createContext({
  terms: [], loaded: false,
  isSaved: () => false,
  save: async () => {},
  remove: async () => {},
});

export function DictionaryProvider({ children }) {
  const { user } = useAuth();
  const [terms,  setTerms]  = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
    if (user?.id) {
      getTerms(user.id).then(({ data }) => {
        setTerms(data ?? []);
        setLoaded(true);
      });
    } else {
      setTerms([]);
      setLoaded(true);
    }
  }, [user?.id]);

  const isSaved = useCallback((term) => terms.some(t => t.term === term), [terms]);

  const save = useCallback(async ({ term, meaning = '', sourceType = '', sourceId = '' }) => {
    if (!user || isSaved(term)) return { alreadySaved: true };
    const result = await apiSave({ userId: user.id, term, meaning, sourceType, sourceId });
    if (!result.error && !result.alreadySaved && result.data) {
      setTerms(prev => [result.data, ...prev]);
    }
    return result;
  }, [user, isSaved]);

  const remove = useCallback(async (id) => {
    await apiDelete(id);
    setTerms(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <DictionaryContext.Provider value={{ terms, loaded, isSaved, save, remove }}>
      {children}
    </DictionaryContext.Provider>
  );
}

export const useDictionaryCtx = () => useContext(DictionaryContext);
