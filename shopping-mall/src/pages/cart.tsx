import CartList from '../components/cart/list';
import PreviewPayment from '../components/previewPayment';
import { useNavigate } from 'react-router-dom';

export default function CartPage() {
  return (
    <>
      <h2>장바구니 페이지</h2>
      <CartList />
      <PreviewPayment controls={<ButtonToGoPayment />} />
    </>
  );
}

function ButtonToGoPayment() {
  const navigate = useNavigate();

  const onClick = () => {
    navigate('/payment');
  };

  return (
    <button type="button" onClick={onClick}>
      결제창으로
    </button>
  );
}
