import { useParams } from 'react-router-dom';
import { useGetProduct } from '../../servies/queries/products';
import ProductCard from '../../components/product/productCard';
import ButtonToAddCart from '../../components/cart/buttonToAddCart';

export default function ProductDetailPage() {
  const { id } = useParams() as { id: string };
  const { product } = useGetProduct(id);

  return (
    <>
      <h2>상품 상세 페이지</h2>

      <main>
        <ProductCard data={product} controls={<ButtonToAddCart id={id} />} />
      </main>
    </>
  );
}
