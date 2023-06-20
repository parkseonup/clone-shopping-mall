import { ReactNode } from 'react';
import { styled } from 'styled-components';
import { useGetCart } from '../../servies/queries/cart';
import { CartType } from '../../graphql/cart';
import ProductCard from '../product/productCard';
import useCartIdsToPay from '../hooks/useCartIdsToPay';

const useGetCartToPay = () => {
  const { data: cart } = useGetCart();
  const [cartIdsToPay] = useCartIdsToPay();

  let cartToPay: CartType = [];

  for (const id of cartIdsToPay) {
    const foundCartItem = cart.find(cartItem => cartItem.id === id);

    if (!foundCartItem) continue;

    cartToPay = [...cartToPay, foundCartItem];
  }

  return { cartToPay };
};

export default function PreviewPayment({ controls }: { controls?: ReactNode }) {
  const { cartToPay } = useGetCartToPay();
  const totalAmount = cartToPay.reduce(
    (result, { amount, product: { price, createdAt } }) => {
      if (createdAt) result += amount * price;
      return result;
    },
    0
  );

  return (
    <>
      {cartToPay.length > 0 ? (
        <PreviewWrapper>
          <h3>결제 목록</h3>

          <ul>
            {cartToPay.map(({ id, amount, product }) => (
              <li key={id}>
                <ProductCard data={{ ...product }} />
                {product.createdAt ? (
                  <p>금액: {amount * product.price}원</p>
                ) : null}
              </li>
            ))}
          </ul>

          <p>총 금액: {totalAmount}원</p>

          {controls}
        </PreviewWrapper>
      ) : null}
    </>
  );
}

const PreviewWrapper = styled.div`
  margin: 10px;
  padding: 10px;
  border: 1px solid #000;
`;
