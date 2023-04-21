import { useMutation } from "@tanstack/react-query";
import { ForwardedRef, forwardRef, SyntheticEvent } from "react";
import { CartType, UPDATE_CART, DELETE_CART } from "../../graphql/cart";
import { getClient, graphqlFetcher, QueryKeys } from "../../queryClient";
import ItemData from "./itemData";

const CartItem = (
  { id, amount, product: { title, imageUrl, price } }: CartType,
  ref: ForwardedRef<HTMLInputElement>
) => {
  const queryClient = getClient();

  const { mutate: updateCart } = useMutation(
    ({ id, amount }: { id: string; amount: number }) =>
      graphqlFetcher(UPDATE_CART, { id, amount }),
    {
      onMutate: async ({ id, amount }) => {
        await queryClient.cancelQueries({ queryKey: [QueryKeys.CART] });

        const { cart: previousCart } = queryClient.getQueryData<{
          cart: CartType[];
        }>([QueryKeys.CART]) || { cart: [] };

        if (!previousCart) return null;

        const targetCartIndex = previousCart?.findIndex(
          (cartItem) => cartItem.id === id
        );

        if (targetCartIndex === undefined || targetCartIndex < 0)
          return previousCart;

        const newCart = [...previousCart];
        newCart[targetCartIndex] = { ...newCart[targetCartIndex], amount };

        queryClient.setQueryData([QueryKeys.CART], { cart: newCart });

        return previousCart;
      },
      onSuccess: ({ updateCart: newCartItem }) => {
        const { cart: previousCart } = queryClient.getQueryData<{
          cart: CartType[];
        }>([QueryKeys.CART]) || { cart: [] };
        const newCart = [...previousCart];

        const targetCartIndex = previousCart?.findIndex(
          (cartItem) => cartItem.id === id
        );

        if (
          !previousCart ||
          targetCartIndex === undefined ||
          targetCartIndex < 0
        )
          return;

        newCart[targetCartIndex] = newCartItem;

        queryClient.setQueryData([QueryKeys.CART], { cart: newCart });
      },
    }
  );

  const { mutate: deleteCart } = useMutation(
    ({ id }: { id: string }) => graphqlFetcher(DELETE_CART, { id }),
    {
      onMutate: async ({ id }) => {
        await queryClient.cancelQueries({ queryKey: [QueryKeys.CART] });
        const { cart: previousCart } = queryClient.getQueryData<{
          cart: CartType[];
        }>([QueryKeys.CART]) || { cart: [] };

        const newCart = previousCart.filter((cartItem) => cartItem.id !== id);

        queryClient.setQueryData([QueryKeys.CART], { cart: newCart });

        return previousCart;
      },
      onSuccess: () => {
        const { cart: previousCart } = queryClient.getQueryData<{
          cart: CartType[];
        }>([QueryKeys.CART]) || { cart: [] };

        const newCart = previousCart.filter((cartItem) => cartItem.id !== id);

        queryClient.setQueryData([QueryKeys.CART], { cart: newCart });
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
