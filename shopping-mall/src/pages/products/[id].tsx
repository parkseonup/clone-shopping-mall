import { useParams } from 'react-router-dom';
import ProductDetail from '../../components/products/detail';

function ProductDetailPage() {
  const { id } = useParams();

  const product = {
    id: 'id...',
    title: '제목...',
    imageUrl: 'https://...',
    price: 3000,
    description: '설명...',
    createdAt: Date.now(),
  }; // TODO: product id로 data fetch 받아오기

  return (
    <>
      <h2>상품 상세 페이지</h2>

      <main>
        <ProductDetail {...product} />
      </main>
    </>
  );
}

export default ProductDetailPage;
