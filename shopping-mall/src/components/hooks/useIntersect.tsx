import { useCallback, useEffect, useState } from 'react';

export default function useIntersect(
  onIntersect: (
    entry: IntersectionObserverEntry,
    observer: IntersectionObserver
  ) => any,
  options?: { root?: HTMLElement; rootMargin?: string; threshold?: number }
) {
  const [target, setTarget] = useState<HTMLElement>();

  const checkIntersect = useCallback(
    ([entry]: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      if (entry.isIntersecting) onIntersect(entry, observer);
    },
    []
  );

  useEffect(() => {
    let observer;

    if (target) {
      observer = new IntersectionObserver(
        ([entry], observer) => checkIntersect([entry], observer),
        { ...options }
      );
      observer.observe(target);
    }
  }, [target, options, checkIntersect]);

  return [target, setTarget];
}
