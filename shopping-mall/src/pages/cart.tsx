import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import CartList from '../components/cart/list';
import { QueryKeys, fetchData } from '../fetcher';
import { CartType, GET_CART } from '../graphql/cart';
import PreviewPayment from '../components/previewPayment';
import { useNavigate } from 'react-router-dom';
import { productsToPay } from '../recoil/atoms';

function CartPage() {
  const { data } = useQuery<Promise<unknown>, Error, { cart: CartType }>(
    [QueryKeys.CART],
    () => fetchData(GET_CART),
    {
      staleTime: 1,
      cacheTime: 1,
    }
  );
  const paymentList = useRecoilValue(productsToPay);
  const navigate = useNavigate();

  if (!data) return null;

  const onRedirectPayment = () => {
    navigate('/payment');
  };

  return (
    <>
      <h2>장바구니 페이지</h2>
      <CartList cart={data.cart} />
      <PreviewPayment
        products={paymentList}
        onClick={onRedirectPayment}
        buttonText="결제 창으로"
      />
    </>
  );
}

export default CartPage;
