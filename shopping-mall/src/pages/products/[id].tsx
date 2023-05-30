import { useParams } from 'react-router-dom';
import ProductDetail from '../../components/products/detail';
import { useGetProduct } from '../../servies/queries/products';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { data } = useGetProduct(id);

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
