import { useInfiniteQuery } from 'react-query';
import { GET_PRODUCTS, ProductsType } from '../../graphql/products';
import ProductItem from './item';
import { QueryKeys, fetchData } from '../../fetcher';
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * TODO: 너무 잦은 컴포넌트 리렌더링. 리팩토링 할 때 수정해보기 (총 5번 렌더링 -> fetch 요청 GET 받고 추가 호출)
 *
 * 1. 초기 렌더링
 * 2. JSX 만들어지고 리렌더링 (setSpinner로 상태 변경)
 * ---- fetch
 * 3. data 변경으로 리렌더링
 *
 * -> 초기 렌더링 시 fetch 2번 일어나는 문제임. 나머지는 정상 동작함.
 */
function ProductList() {
  const observerRef = useRef<IntersectionObserver>();
  const hasNextPageRef = useRef<boolean>();
  const isFetchingNextPageRef = useRef<boolean>();
  const [spinner, setSpinner] = useState<HTMLDivElement>();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<
      Promise<unknown> | { products: ProductsType },
      Error,
      { products: ProductsType }
    >(
      [QueryKeys.PRODUCTS, 'products'],
      /**
       * @param pageParam: (이하 cursor). GET_PRODUCTS의 마지막에 위치하는 상품 id.
       * 초기 GET_PRODUCTS 전에는 아무런 상품이 없으므로 빈 문자열을 전달한다.
       */
      ({ pageParam = '' }) => fetchData(GET_PRODUCTS, { cursor: pageParam }),
      {
        getNextPageParam: lastPage => {
          if ('products' in lastPage) {
            return lastPage.products.at(-1)?.id;
          }
        },
      }
    );

  const getObserver = useCallback(() => {
    observerRef.current = new IntersectionObserver(entries => {
      const isIntersecting = entries.some(entry => entry.isIntersecting);

      if (
        isIntersecting &&
        hasNextPageRef.current &&
        !isFetchingNextPageRef.current
      ) {
        console.log(
          '[isFetchingNextPageRef.current]',
          isFetchingNextPageRef.current
        );
        fetchNextPage();
      }
    });

    return observerRef.current;
  }, [observerRef.current]);

  useEffect(() => {
    if (spinner) getObserver().observe(spinner);
  }, [spinner]);

  useEffect(() => {
    hasNextPageRef.current = hasNextPage;
    isFetchingNextPageRef.current = isFetchingNextPage;
  }, [hasNextPage, isFetchingNextPage]);

  if (!data) return null;

  console.log('[data.pages]', data.pages);

  return (
    <div>
      <ul>
        {data.pages
          .flatMap(page => page.products)
          .map(product => (
            <ProductItem {...product} key={product.id} />
          ))}
      </ul>

      <div
        ref={node => {
          if (node) setSpinner(node);
        }}>
        spinner
      </div>
    </div>
  );
}

export default ProductList;
