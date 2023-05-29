import { useInfiniteQuery } from 'react-query';
import { GET_PRODUCTS, ProductsType } from '../../graphql/products';
import ProductItem from './item';
import { QueryKeys, fetchData } from '../../fetcher';
import { useEffect, useRef } from 'react';
import useIntersect from '../hooks/useIntersect';

// TODO: ref 타입 에러 잡기
function ProductList() {
  const hasNextPageRef = useRef<boolean>();
  const isFetchingNextPageRef = useRef<boolean>();

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

  const executeFetchNextPage = () => {
    if (!hasNextPageRef.current || isFetchingNextPageRef.current) return;

    fetchNextPage();
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setTarget] = useIntersect(executeFetchNextPage);

  useEffect(() => {
    hasNextPageRef.current = hasNextPage;
    isFetchingNextPageRef.current = isFetchingNextPage;
  }, [hasNextPage, isFetchingNextPage]);

  if (!data) return null;

  return (
    <div>
      <ul>
        {data.pages
          .flatMap(page => page.products)
          .map(product => (
            <ProductItem {...product} key={product.id} />
          ))}
      </ul>

      <div ref={setTarget}>spinner</div>
    </div>
  );
}

export default ProductList;
