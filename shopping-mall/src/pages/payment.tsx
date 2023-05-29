import PreviewPayment from '../components/previewPayment';
import { useMutation } from 'react-query';
import { fetchData } from '../fetcher';
import { EXECUTE_PAY } from '../graphql/payment';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { ProductsToPayDispatchContext } from '../context/productsToPay';

export default function PaymentPage() {
  const navigate = useNavigate();
  const setPaymentList = useContext(ProductsToPayDispatchContext);

  if (!setPaymentList)
    throw new Error('Cannot find ProductsToPayDispatchContext');

  const { mutate: executePay } = useMutation({
    mutationFn: (ids: string[]) => fetchData(EXECUTE_PAY, { ids }),
    onSuccess: () => {
      setPaymentList({ type: 'deletedAll' });
      alert('결제가 완료되었습니다.');
      navigate('/products', { replace: true });
    },
  });

  const onExecutePay = (ids: string[] = []) => {
    executePay(ids);
  };

  return (
    <>
      <h2>결제 페이지</h2>

      <PreviewPayment
        onClick={ids => onExecutePay(ids)}
        buttonText="결제하기"
      />
    </>
  );
}
