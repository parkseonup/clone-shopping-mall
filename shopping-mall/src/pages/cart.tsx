import { useQuery } from 'react-query';
import CartList from '../components/cart/list';
import { QueryKeys, fetchData } from '../fetcher';
import { CartType, GET_CART } from '../graphql/cart';

function CartPage() {
  const { data } = useQuery<Promise<unknown>, Error, { cart: CartType }>(
    [QueryKeys.CART],
    () => fetchData(GET_CART),
    {
      staleTime: 1,
      cacheTime: 1,
    }
  );

  if (!data) return null;

  return (
    <>
      <h2>장바구니 페이지</h2>
      <CartList cart={data.cart} />
    </>
  );
}

export default CartPage;
