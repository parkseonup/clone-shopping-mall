import { useQuery } from 'react-query';
import ProductList from '../../components/products/list';
import { QueryKeys, fetchData } from '../../fetcher';
import { GET_PRODUCTS, ProductsType } from '../../graphql/products';

function ProductsPage() {
  const { data } = useQuery<
    Promise<unknown>,
    Error,
    { products: ProductsType }
  >([QueryKeys.PRODUCTS, 'products'], () => fetchData(GET_PRODUCTS));

  if (!data)
    return (
      <>
        <h2>상품 목록 페이지</h2>
        <p>상품이 없습니다.</p>
      </>
    );

  return (
    <>
      <main>
        <ProductList list={data.products} />
      </main>
    </>
  );
}

export default ProductsPage;
