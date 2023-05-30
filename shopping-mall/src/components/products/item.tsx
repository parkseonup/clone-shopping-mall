import { Link } from 'react-router-dom';
import { ProductType } from '../../graphql/products';
import ItemData from '../common/itemData';
import { useAddCart } from '../../servies/mutations/cart';

export default function ProductItem({
  id,
  title,
  imageUrl,
  price,
}: ProductType) {
  const { mutate: addCart } = useAddCart();

  return (
    <li>
      <Link to={`/products/${id}`}>
        <ItemData title={title} imageUrl={imageUrl} price={price} />
      </Link>

      <button type="button" onClick={() => addCart(id)}>
        장바구니 담기
      </button>
    </li>
  );
}
