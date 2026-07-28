import { useEffect, useRef, useState } from 'react';

/* 섹션이 스크롤로 뷰포트에 들어오면 부드럽게 fade+slide up 되는 래퍼.
   한 번 나타난 뒤에는 다시 관찰하지 않음(재스크롤 시 깜빡임 방지). */
export default function Reveal({ children, as: Tag = 'div' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -80px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`reveal${visible ? ' reveal-visible' : ''}`}>
      {children}
    </Tag>
  );
}
