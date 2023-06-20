import { useAddCart } from '../../servies/mutations/cart';

export function ButtonToAddCart({ id }: { id: string }) {
  const { mutate: addCart } = useAddCart();

  return (
    <button type="button" onClick={() => addCart(id)}>
      장바구니 담기
    </button>
  );
}
