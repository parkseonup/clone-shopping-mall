import { ProductList } from '../../components/products';
import Pagination from '../../components/common/pagination';
import { useState } from 'react';
import { useGetProuctsByPage } from '../../servies/queries/products';

export default function ProductsPage() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const PRODUCTS_COUNT_TO_DISPLAY = 8;
  const { data } = useGetProuctsByPage({
    page: currentPage,
    key: 'products',
    count: PRODUCTS_COUNT_TO_DISPLAY,
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
