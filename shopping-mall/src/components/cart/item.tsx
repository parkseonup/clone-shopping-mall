import { CartItemType } from '../../graphql/cart';
import { ForwardedRef, SyntheticEvent, forwardRef } from 'react';
import ItemData from '../common/itemData';
import { useDeleteCart, useUpdateCart } from '../../servies/mutations/cart';

const CartItem = forwardRef(function CartItem(
  { id, amount, product: { title, imageUrl, price, createdAt } }: CartItemType,
  ref: ForwardedRef<HTMLInputElement>
) {
  const { mutate: updateCart } = useUpdateCart();
  const { mutate: deleteCart } = useDeleteCart();

  const onChangeAmount = (e: SyntheticEvent) => {
    const amount = +(e.target as HTMLInputElement).value;
    updateCart({ id, amount });
  };

  const onDeleteItem = () => {
    deleteCart(id);
  };

  return (
    <li>
      <label>
        <input
          type="checkbox"
          name={`cart-item__checkbox${id}`}
          ref={ref}
          disabled={!createdAt}
          className="cart-item__checkbox"
        />
      </label>

      <ItemData title={title} imageUrl={imageUrl} price={price} />

      {createdAt ? (
        <label>
          개수:
          <input
            type="number"
            defaultValue={amount}
            onChange={onChangeAmount}
            min={1}
          />
        </label>
      ) : (
        <strong>품절된 상품입니다.</strong>
      )}
      <button type="button" onClick={onDeleteItem}>
        삭제
      </button>
    </li>
  );
});

export default CartItem;
