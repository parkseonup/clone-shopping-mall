import CartList from '../components/cart/list';
import PreviewPayment from '../components/previewPayment';
import { useNavigate } from 'react-router-dom';
import { useGetCart } from '../servies/queries/cart';

export default function CartPage() {
  const { data } = useGetCart();
  const navigate = useNavigate();

  if (!data) return null;

  const onRedirectPayment = () => {
    navigate('/payment');
  };

  return (
    <>
      <h2>장바구니 페이지</h2>
      <CartList cart={data.cart} />
      <PreviewPayment onClick={onRedirectPayment} buttonText="결제 창으로" />
    </>
  );
}
