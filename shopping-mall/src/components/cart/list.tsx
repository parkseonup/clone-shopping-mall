import { useRef } from 'react';
import { CartType } from '../../graphql/cart';
import CartItem from './item';

function CartList({ cart }: { cart: CartType }) {
  const checkItemsRef = useRef(null);

  if (cart.length < 1) return null;

  return (
    <div>
      <label>
        <input type="checkbox" name="" id="" />
      </label>

      <ul>
        {cart.map(cartItem => (
          <CartItem {...cartItem} key={cartItem.id} />
        ))}
      </ul>
    </div>
  );
}

export default CartList;
