import { SyntheticEvent, useContext, useRef } from 'react';
import { CartType } from '../../graphql/cart';
import CartItem from './item';
import {
  ProductsToPayContext,
  ProductsToPayDispatchContext,
} from '../../context/productsToPay';

export default function CartList({ cart }: { cart: CartType }) {
  const formRef = useRef<HTMLFormElement>(null);
  const checkboxRef = useRef<HTMLInputElement>(null);
  const checkedItems = useContext(ProductsToPayContext);
  const setCheckedItems = useContext(ProductsToPayDispatchContext);
  const existentCart = cart.filter(cartItem => cartItem.product.createdAt);

  if (!checkedItems) throw new Error('Cannot find ProductsToPayContext');
  if (!setCheckedItems)
    throw new Error('Cannot find ProductsToPayDispatchContext');

  const onChangeCheckbox = (e: SyntheticEvent) => {
    if (!formRef.current) return;

    const action = (e.target as HTMLInputElement).checked
      ? ({
          type: 'added',
          items: existentCart,
        } as const)
      : ({ type: 'deletedAll' } as const);

    setCheckedItems(action);
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
                checkedItems.length === existentCart.length &&
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
