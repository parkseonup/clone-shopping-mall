import { RefObject, useCallback, useEffect, useRef, useState } from "react";

/**
 * TODO: 리팩토링
 * - custom hook을 좀더 사용성 있게 만들순 없나?
 * - 꼭 observer가 ref 객체에 저장되어야 하나?
 * - useRef를 사용해서 target node를 저장하는게 옳은가?
 */
const useIntersection = (targetRef: RefObject<HTMLElement>) => {
  const [intersecting, setIntersecting] = useState(false);
  const observerRef = useRef<IntersectionObserver>();

  /** IntersectionObserver 인스턴스가 생성된 적 있는지 체크하고 호출된 적 없는 초기 상태라면 observer.current에 등록한다. */
  const getObserver = useCallback(() => {
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        entries => {
          setIntersecting(entries.some(entry => entry.isIntersecting));
        },
        { rootMargin: "1px" }
      );
    }

    return observerRef.current;
  }, [observerRef.current]);

  /** fetchMoreRef.current에 More Element가 저장되었는지 확인하고, IntersectionObserver의 인스턴스가 More Element를 관찰(observe)하도록 한다. */
  useEffect(() => {
    if (targetRef.current) getObserver().observe(targetRef.current);
  }, [targetRef.current]);

  return intersecting;
};

export default useIntersection;
