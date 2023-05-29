import { useQuery } from 'react-query';
import { ProductList } from '../../components/products';
import { QueryKeys, fetchData } from '../../fetcher';
import { GET_PRODUCTS, ProductsType } from '../../graphql/products';
import Pagination from '../../components/common/pagination';
import { useState } from 'react';

export default function ProductsPage() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const PRODUCTS_COUNT_TO_DISPLAY = 8;

  const { data } = useQuery<
    Promise<unknown> | { products: ProductsType; lastPageNumber: number },
    Error,
    { products: ProductsType; lastPageNumber: number }
  >({
    queryKey: [QueryKeys.PRODUCTS, currentPage],
    queryFn: () =>
      fetchData(GET_PRODUCTS, {
        page: currentPage,
        count: PRODUCTS_COUNT_TO_DISPLAY,
      }),
    keepPreviousData: true,
  });

  if (!data)
    return (
      <>
        <h2>상품 페이지</h2>
        <p>상품이 없습니다.</p>
      </>
    );

  const fetchPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const fetchNextPage = () => {
    if (currentPage < data.lastPageNumber) setCurrentPage(currentPage + 1);
  };

  const fetchPage = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <h2>상품 페이지</h2>

      <ProductList products={data.products} />
      <Pagination
        currentPage={currentPage}
        lastPage={data.lastPageNumber}
        onClickPrevPage={fetchPrevPage}
        onClickNextPage={fetchNextPage}
        onClickPage={fetchPage}
      />
    </>
  );
}
