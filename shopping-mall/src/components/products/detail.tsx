import { ProductType } from '../../graphql/products';
import { useAddCart } from '../../servies/mutations/cart';

export default function ProductDetail({
  id,
  title,
  imageUrl,
  description,
  price,
}: ProductType) {
  const { mutate: addCart } = useAddCart();

  return (
    <div>
      <h3>{title}</h3>
      <img src={imageUrl} alt="" />
      <p>{description}</p>
      <p>가격: {price}</p>

      <button type="button" onClick={() => addCart(id)}>
        장바구니 담기
      </button>
    </div>
  );
}
