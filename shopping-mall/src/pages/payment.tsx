import { useRecoilValue } from 'recoil';
import PreviewPayment from '../components/previewPayment';
import { useMutation } from 'react-query';
import { fetchData } from '../fetcher';
import { EXECUTE_PAY } from '../graphql/payment';
import { useNavigate } from 'react-router-dom';
import { productsToPay } from '../recoil/atoms';

function PaymentPage() {
  const navigate = useNavigate();
  const { mutate: executePay } = useMutation(
    (ids: string[]) => fetchData(EXECUTE_PAY, { ids }),
    {
      onSuccess: () => {
        alert('결제가 완료되었습니다.');
        navigate('/', { replace: true });
      },
    }
  );
  const paymentList = useRecoilValue(productsToPay);
  const ids = paymentList.map(paymentItem => paymentItem.id);

  const onExecutePay = () => {
    executePay(ids);
  };

  return (
    <>
      <h2>결제 페이지</h2>

      <PreviewPayment
        products={paymentList}
        onClick={onExecutePay}
        buttonText="결제하기"
      />
    </>
  );
}

export default PaymentPage;
