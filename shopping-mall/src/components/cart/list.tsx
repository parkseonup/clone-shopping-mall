import { SyntheticEvent, useRef } from 'react';
import CartItem from './item';
import useCartIdsToPay from '../hooks/useCartIdsToPay';
import { useGetCart } from '../../servies/queries/cart';

export default function CartList() {
  const { data: cart } = useGetCart();
  const formRef = useRef<HTMLFormElement>(null);
  const checkboxRef = useRef<HTMLInputElement>(null);
  const [cartIdsToPay, setCartIdsToPay] = useCartIdsToPay();
  const existentCart = cart.filter(cartItem => cartItem.product.createdAt);

  const onChangeCheckbox = (e: SyntheticEvent) => {
    if (!formRef.current) return;

    const action = (e.target as HTMLInputElement).checked
      ? ({
          type: 'added',
          ids: existentCart.map(({ id }) => id),
        } as const)
      : ({ type: 'deletedAll' } as const);

    setCartIdsToPay(action);
  };

  return (
    <>
      {cart.length > 0 ? (
        <form ref={formRef}>
          <label>
            <input
              type="checkbox"
              ref={checkboxRef}
              onChange={onChangeCheckbox}
              disabled={existentCart.length < 1}
              checked={
                cartIdsToPay.length === existentCart.length &&
                existentCart.length > 0
              }
            />
          </label>

          <ul>
            {cart.map(cartItem => (
              <CartItem data={cartItem} key={cartItem.id}></CartItem>
            ))}
          </ul>
        </form>
      ) : null}
    </>
  );
}
