import { useMutation } from 'react-query';
import { CartItemType, DELETE_CART, UPDATE_CART } from '../../graphql/cart';
import { QueryKeys, fetchData, queryClient } from '../../fetcher';
import { ForwardedRef, SyntheticEvent, forwardRef } from 'react';
import ItemData from './itemData';

function CartItem(
  {
    cartItem,
    checkedItemState,
    changeCheckedState,
    deleteCheckedState,
  }: {
    cartItem: CartItemType;
    checkedItemState: boolean;
    changeCheckedState: (item: CartItemType, isChecked: boolean) => void;
    deleteCheckedState: (item: CartItemType) => void;
  },
  ref: ForwardedRef<HTMLInputElement>
) {
  const {
    id,
    amount,
    product: { title, imageUrl, price, createdAt },
  } = cartItem;
  const { mutate: updateCart } = useMutation(
    ({ id, amount }: { id: string; amount: number }) =>
      fetchData(UPDATE_CART, { cartId: id, amount })
  );
  const { mutate: deleteCart } = useMutation(
    (id: string) => fetchData(DELETE_CART, { cartId: id }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([QueryKeys.CART]);
      },
    }
  );

  const handleCheckItem = (e: SyntheticEvent) => {
    const isChecked = (e.target as HTMLInputElement).checked;
    changeCheckedState(cartItem, isChecked);
  };

  const handleChangeAmount = (e: SyntheticEvent) => {
    const amount = +(e.target as HTMLInputElement).value;
    updateCart({ id, amount });
  };

  const handleDeleteItem = () => {
    deleteCart(id);
    deleteCheckedState(cartItem);
  };

  return (
    <li>
      <label>
        <input
          type="checkbox"
          name=""
          id=""
          onChange={handleCheckItem}
          ref={ref}
          defaultChecked={checkedItemState}
          disabled={!createdAt}
          className="cartItemCheckbox"
        />
      </label>

      <ItemData title={title} imageUrl={imageUrl} price={price} />

      {createdAt ? (
        <label>
          개수:
          <input
            type="number"
            name=""
            id=""
            defaultValue={amount}
            onChange={handleChangeAmount}
          />
        </label>
      ) : (
        <strong>품절된 상품입니다.</strong>
      )}
      <button type="button" onClick={handleDeleteItem}>
        삭제
      </button>
    </li>
  );
}

export default forwardRef(CartItem);
