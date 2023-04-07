import { useQuery } from "@tanstack/react-query";
import CartList from "../../components/cart";
import { CartType, GET_CART } from "../../graphql/cart";
import { graphqlFetcher, QueryKeys } from "../../queryClient";

const Cart = () => {
  const { data } = useQuery([QueryKeys.CART], () => graphqlFetcher(GET_CART), {
    staleTime: 0,
    cacheTime: 1000,
  });

  const cartList = Object.values(data || {}) as CartType[];

  if (!cartList.length) return <p>장바구니가 비었습니다.</p>;

  return (
    <div>
      <h2>장바구니</h2>
      <CartList items={cartList} />
    </div>
  );
};

export default Cart;
