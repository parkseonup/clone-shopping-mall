import { SyntheticEvent } from 'react';
import { CartItemType } from '../../graphql/cart';
import {
  useAddCart,
  useDeleteCart,
  useUpdateCart,
} from '../../servies/mutations/cart';

export function ButtonToAddCart({ id }: { id: string }) {
  const { mutate: addCart } = useAddCart();

  return (
    <button type="button" onClick={() => addCart(id)}>
      장바구니 담기
    </button>
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

export function InputToUpdateCartAmount({
  id,
  amount,
  labelText,
}: Pick<CartItemType, 'id' | 'amount'> & { labelText: string }) {
  const { mutate: updateCart } = useUpdateCart();

  const onChangeAmount = (e: SyntheticEvent) => {
    const amount = +(e.target as HTMLInputElement).value;
    updateCart({ id, amount });
  };

  return (
    <label>
      {labelText}:
      <input
        type="number"
        defaultValue={amount}
        onChange={onChangeAmount}
        min={1}
      />
    </label>
  );
}
