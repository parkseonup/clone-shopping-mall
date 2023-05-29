import PreviewPayment from '../components/previewPayment';
import { useMutation } from 'react-query';
import { fetchData } from '../fetcher';
import { EXECUTE_PAY } from '../graphql/payment';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { productsToPay } from '../recoil/atoms';

function PaymentPage() {
  const navigate = useNavigate();
  const setPaymentList = useSetRecoilState(productsToPay);
  const { mutate: executePay } = useMutation(
    (ids: string[]) => fetchData(EXECUTE_PAY, { ids }),
    {
      onSuccess: () => {
        setPaymentList([]);
        alert('결제가 완료되었습니다.');
        navigate('/products', { replace: true });
      },
    }
  );

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

export default PaymentPage;
