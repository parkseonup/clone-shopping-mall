import { ProductList } from '../../components/products';
import Pagination from '../../components/common/pagination';
import { useState } from 'react';
import { useGetProuctsByPage } from '../../servies/queries/products';

export default function ProductsPage() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const PRODUCTS_COUNT_TO_DISPLAY = 8;
  const { data } = useGetProuctsByPage({
    page: currentPage,
    category: 'products',
    count: PRODUCTS_COUNT_TO_DISPLAY,
  });

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <h2>상품 페이지</h2>

      <main>
        <ProductList products={data.products} />
        <Pagination
          currentPage={currentPage}
          totalPage={data.totalPage}
          onPageChange={onPageChange}
        />
      </main>
    </>
  );
}
