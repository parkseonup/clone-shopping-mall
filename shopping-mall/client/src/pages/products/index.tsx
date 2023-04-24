import { useRef, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { graphqlFetcher, QueryKeys } from "../../queryClient";
import { GET_PRODUCTS, ProductsType } from "../../graphql/products";
import ProductList from "../../components/product/list";
import useIntersection from "../../hooks/useIntersection";

const ProductListPage = () => {
  const fetchMoreRef = useRef<HTMLDivElement>(null);
  const intersecting = useIntersection(fetchMoreRef);

  /**
   * - 무한 스크롤을 구현하기 위해 useQuery 대신 useInfiniteQuery를 사용한다.
   * - 스크롤 끝에 위치하는 상품(cursor)를 queryFn의 파라미터로 전달한다.
   *
   * - isSuccess: 데이터를 요청하는 중에는 중복으로 데이터를 요청하지 않도록 isSuccess를 활용한다.
   * - hasNextPage: 다음으로 요청할 데이터가 있는지 확인하고, 불필요한 데이터 요청을 줄인다.
   * - fetchNextPage: 다음 데이터 요청을 할 수 있는 메서드이다.
   * - isFetchingNextPage: 다음 데이터 요청을 수신하고 있는 동안에는 true를 반환하므로, 데이터를 요청하는 중에 중복 요청하지 않도록 한다.
   * - data: {
   *    pages: [{ products: Array(15) }, ...], // 요청되는 데이터의 목록이 추가된다.
   *    pageParam: [undefined, ...], // 데이터 요청시 파라미터로 전달된 값이 배열로 들어온다.
   *  }
   */
  const { data, isSuccess, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery<ProductsType>(
      [QueryKeys.PRODUCTS],
      ({ pageParam = "" }) =>
        graphqlFetcher(GET_PRODUCTS, { cursor: pageParam }),
      {
        /**
         * @param lastPage { products: Array(15) }
         * @param allPages [{ products: Array(15) }]
         */
        getNextPageParam: (lastPage) => lastPage.products.at(-1)?.id,
      }
    );

  useEffect(() => {
    if (!intersecting || !isSuccess || !hasNextPage || isFetchingNextPage)
      return;

    fetchNextPage();
  }, [intersecting]);

  return (
    <div>
      <h2>상품목록</h2>
      <ProductList list={data?.pages || []} />
      <div ref={fetchMoreRef} />
    </div>
  );
};

export default ProductListPage;
