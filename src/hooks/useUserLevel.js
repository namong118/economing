import { useAuth } from '../context/AuthContext'

export function useUserLevel() {
  const { profile } = useAuth()
  const userLevel = profile?.economic_level ?? 'beginner'
  return { userLevel }
}
