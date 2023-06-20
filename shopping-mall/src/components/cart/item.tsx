import { CartItemType } from '../../graphql/cart';
import { SyntheticEvent, useEffect, useRef } from 'react';
import ProductCard from '../product/productCard';
import useCartIdsToPay from '../hooks/useCartIdsToPay';
import { useDeleteCart, useUpdateCart } from '../../servies/mutations/cart';

export default function CartItem({ data: cartItem }: { data: CartItemType }) {
  const { id, amount, product } = cartItem;
  const checkboxRef = useRef(null);
  const [cartIdsToPay, setCartIdsToPay] = useCartIdsToPay();
  const isChecked = cartIdsToPay.includes(id);

  const onChangeCheckbox = (e: SyntheticEvent) => {
    setCartIdsToPay({
      type: (e.target as HTMLInputElement).checked ? 'added' : 'deleted',
      ids: [id],
    });
  };

  useEffect(() => {
    if (!product.createdAt) {
      setCartIdsToPay({
        type: 'deleted',
        ids: [id],
      });
    }
  }, []);

  return (
    <li>
      <label>
        <input
          type="checkbox"
          ref={checkboxRef}
          disabled={!product.createdAt}
          onChange={onChangeCheckbox}
          checked={isChecked}
        />
      </label>

      <ProductCard
        data={{ ...product }}
        controls={
          <>
            {product.createdAt ? (
              <InputToUpdateCartAmount id={id} amount={amount} />
            ) : null}
            <ButtonToDeleteCart id={id} />
          </>
        }
      />
    </li>
  );
}

export function InputToUpdateCartAmount({
  id,
  amount,
}: Pick<CartItemType, 'id' | 'amount'>) {
  const { mutate: updateCart } = useUpdateCart();

  const onChangeAmount = (e: SyntheticEvent) => {
    const amount = +(e.target as HTMLInputElement).value;
    updateCart({ id, amount });
  };

  return (
    <label>
      개수:
      <input
        type="number"
        defaultValue={amount}
        onChange={onChangeAmount}
        min={1}
      />
    </label>
  );
}

export function ButtonToDeleteCart({ id }: { id: string }) {
  const { mutate: deleteCart } = useDeleteCart();

  return (
    <button type="button" onClick={() => deleteCart(id)}>
      삭제
    </button>
  );
}
