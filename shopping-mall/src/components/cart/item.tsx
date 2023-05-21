import { useMutation } from 'react-query';
import { CartItemType, DELETE_CART, UPDATE_CART } from '../../graphql/cart';
import { QueryKeys, fetchData, queryClient } from '../../fetcher';
import { SyntheticEvent } from 'react';

function CartItem({
  id,
  amount,
  product: { title, imageUrl, price },
}: CartItemType) {
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

  const handleChangeAmount = (e: SyntheticEvent) => {
    const amount = +(e.target as HTMLInputElement).value;
    updateCart({ id, amount });
  };

  return (
    <li>
      <label>
        <input type="checkbox" name="" id="" />
      </label>
      <h3>{title}</h3>
      <img src={imageUrl} alt="" />
      <p>가격: {price}</p>

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
      <button type="button" onClick={() => deleteCart(id)}>
        삭제
      </button>
    </li>
  );
}

export default CartItem;
