import PreviewPayment from '../components/previewPayment';
import { useNavigate } from 'react-router-dom';
import { useDeletePaidCart } from '../servies/mutations/payment';
import useCartIdsToPay from '../components/hooks/useCartIdsToPay';

export default function PaymentPage() {
  return (
    <>
      <h2>결제 페이지</h2>

      <main>
        <PreviewPayment controls={<ButtonToExecutePay />} />
      </main>
    </>
  );
}

function ButtonToExecutePay() {
  const navigate = useNavigate();
  const [cartIdsToPay, dispatchCartIdsToPay] = useCartIdsToPay();

  const { mutate: executePay } = useDeletePaidCart(() => {
    dispatchCartIdsToPay({ type: 'deletedAll' });
    alert('결제가 완료되었습니다.');
    navigate('/products', { replace: true });
  });

  const handleExecutePay = () => {
    executePay(cartIdsToPay);
  };

  return (
    <button type="button" onClick={handleExecutePay}>
      결제하기
    </button>
  );
}
