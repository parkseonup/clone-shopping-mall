import { Link } from 'react-router-dom';
import { ProductType } from '../../graphql/products';
import { useMutation } from 'react-query';
import { fetchData } from '../../fetcher';
import { ADD_CART } from '../../graphql/cart';
import ItemData from '../itemData';

function ProductItem({ id, title, imageUrl, price }: ProductType) {
  const { mutate: addCart } = useMutation((id: string) =>
    fetchData(ADD_CART, { productId: id })
  );

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

export default ProductItem;
