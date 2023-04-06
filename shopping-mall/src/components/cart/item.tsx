import { useMutation } from "@tanstack/react-query";
import { ForwardedRef, forwardRef, SyntheticEvent } from "react";
import { CartType, UPDATE_CART, DELETE_CART } from "../../graphql/cart";
import { getClient, graphqlFetcher, QueryKeys } from "../../queryClient";
import ItemData from "./itemData";

const CartItem = (
  { id, title, imageUrl, price, amount }: CartType,
  ref: ForwardedRef<HTMLInputElement>
) => {
  const queryClient = getClient();

  const { mutate: updateCart } = useMutation(
    ({ id, amount }: { id: string; amount: number }) =>
      graphqlFetcher(UPDATE_CART, { id, amount }),
    {
      onMutate: async ({ id, amount }) => {
        await queryClient.cancelQueries({ queryKey: [QueryKeys.CART] });

        const previousCart = queryClient.getQueryData<{
          [key: string]: CartType;
        }>([QueryKeys.CART]);

        if (!previousCart?.[id]) return previousCart;

        const newCart = {
          ...previousCart,
          [id]: {
            ...previousCart[id],
            amount,
          },
        };

        queryClient.setQueryData([QueryKeys.CART], newCart);

        return { previousCart };
      },
      onSuccess: (newCartItem) => {
        const previousCart = queryClient.getQueryData<{
          [key: string]: CartType;
        }>([QueryKeys.CART]);

        const newCart = {
          ...previousCart,
          [id]: newCartItem,
        };

        queryClient.setQueryData([QueryKeys.CART], newCart);
      },
    }
  );

  const { mutate: deleteCart } = useMutation(
    ({ id }: { id: string }) => graphqlFetcher(DELETE_CART, { id }),
    {
      onMutate: async ({ id }) => {
        await queryClient.cancelQueries({ queryKey: [QueryKeys.CART] });
        const previousCart = queryClient.getQueryData<{
          [key: string]: CartType;
        }>([QueryKeys.CART]);

        const newCart = { ...previousCart };
        delete newCart[id];

        queryClient.setQueryData([QueryKeys.CART], newCart);

        return { previousCart };
      },
      onSuccess: () => {
        const previousCart = queryClient.getQueryData<{
          [key: string]: CartType;
        }>([QueryKeys.CART]);

        const newCart = { ...previousCart };
        delete newCart[id];

        queryClient.setQueryData([QueryKeys.CART], newCart);
      },
    }
  );

  const handleUpdateAmount = (e: SyntheticEvent) => {
    const amount = +(e.target as HTMLInputElement).value;
    updateCart({ id, amount });
  };

  const handleDeleteCart = () => {
    deleteCart({ id });
  };

  return (
    <li className="cart-item">
      <input
        type="checkbox"
        className="cart-item__checkbox"
        name="select-item"
        ref={ref}
        data-id={id}
      />
      <ItemData title={title} imageUrl={imageUrl} price={price} />
      <input
        type="number"
        className="cart-item__amount"
        value={amount}
        onChange={handleUpdateAmount}
        min={1}
      />
      <button
        type="button"
        className="cart-item__delete"
        onClick={handleDeleteCart}
      >
        삭제
      </button>
    </li>
  );
};

export default forwardRef(CartItem);
