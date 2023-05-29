import { useMutation } from 'react-query';
import { CartItemType, DELETE_CART, UPDATE_CART } from '../../graphql/cart';
import { QueryKeys, fetchData, queryClient } from '../../fetcher';
import { ForwardedRef, SyntheticEvent, forwardRef } from 'react';
import ItemData from '../common/itemData';

const CartItem = forwardRef(function CartItem(
  { id, amount, product: { title, imageUrl, price, createdAt } }: CartItemType,
  ref: ForwardedRef<HTMLInputElement>
) {
  const { mutate: updateCart } = useMutation({
    mutationFn: ({ id, amount }: { id: string; amount: number }) =>
      fetchData(UPDATE_CART, { cartId: id, amount }),
    onSuccess: () => queryClient.invalidateQueries([QueryKeys.CART]),
  });
  const { mutate: deleteCart } = useMutation({
    mutationFn: (id: string) => fetchData(DELETE_CART, { cartId: id }),
    onSuccess: () => queryClient.invalidateQueries([QueryKeys.CART]),
  });

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
