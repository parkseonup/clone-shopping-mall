import { useRef, useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { graphqlFetcher, QueryKeys } from "../../queryClient";
import { GET_PRODUCTS, ProductsType } from "../../graphql/products";
import useIntersection from "../../hooks/useIntersection";
import AdminList from "./list";
import AddForm from "./addForm";

const Admin = () => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
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
  const { data, isSuccess, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery<ProductsType>(
      [QueryKeys.PRODUCTS, "admin"],
      ({ pageParam = "" }) =>
        graphqlFetcher(GET_PRODUCTS, { cursor: pageParam, showDeleted: true }),
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

  const startEdit = (index: number) => () => {
    setEditingIndex(index);
  };

  const doneEdit = () => {
    setEditingIndex(null);
  };

  return (
    <>
      <AddForm />
      <AdminList
        list={data?.pages || []}
        editingIndex={editingIndex}
        startEdit={startEdit}
        doneEdit={doneEdit}
      />
      <div ref={fetchMoreRef} />
    </>
  );
};

export default Admin;
