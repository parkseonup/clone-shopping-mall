import { redirect, useParams } from 'react-router-dom';
import ProductDetail from '../../components/products/detail';
import { useQuery } from 'react-query';
import { QueryKeys, fetchData } from '../../fetcher';
import { GET_PRODUCT, ProductType } from '../../graphql/products';

function ProductDetailPage() {
  const { id } = useParams();
  const { data } = useQuery<Promise<unknown>, Error, { product: ProductType }>(
    [QueryKeys.PRODUCTS, id],
    async () => await fetchData(GET_PRODUCT, { id })
  );

  if (!data) return null;

  return (
    <>
      <h2>상품 상세 페이지</h2>

      <main>
        <ProductDetail {...data.product} />
      </main>
    </>
  );
}

export default ProductDetailPage;
