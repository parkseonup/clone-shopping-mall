import { useCallback, useEffect, useState } from 'react';

export default function useIntersect(
  onIntersect: (
    entry: IntersectionObserverEntry,
    observer: IntersectionObserver
  ) => any,
  options?: { root?: HTMLElement; rootMargin?: string; threshold?: number }
) {
  const [target, setTarget] = useState<any>();

  const changeTarget = (target: HTMLElement) => {
    setTarget(target);
  };

  const checkIntersect = useCallback(
    ([entry]: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      onIntersect(entry, observer);
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

  return [target, changeTarget];
}
