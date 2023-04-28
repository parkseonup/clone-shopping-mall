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
   * - data: {
   *    pages: [{ products: Array(15) }, ...], // 요청되는 데이터의 목록이 추가된다.
   *    pageParam: [undefined, ...], // 데이터 요청시 파라미터로 전달된 값이 배열로 들어온다.
   *  }
   */
  const { data, isSuccess, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery<ProductsType>(
    [QueryKeys.PRODUCTS, "products"],
    ({ pageParam = "" }) => graphqlFetcher(GET_PRODUCTS, { cursor: pageParam }),
    {
      /**
       * @param lastPage { products: Array(15) }
       * @param allPages [{ products: Array(15) }]
       */
      getNextPageParam: lastPage => lastPage.products.at(-1)?.id,
    }
  );

  useEffect(() => {
    if (!intersecting || !isSuccess || !hasNextPage || isFetchingNextPage) return;

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
