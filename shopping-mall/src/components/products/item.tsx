import { Link } from 'react-router-dom';
import { ProductType } from '../../graphql/products';
import { useMutation } from 'react-query';
import { fetchData } from '../../fetcher';
import { ADD_CART } from '../../graphql/cart';

function ProductItem({ id, title, imageUrl, price }: ProductType) {
  const { mutate: addCart } = useMutation((id: string) =>
    fetchData(ADD_CART, { productId: id })
  );

  return (
    <li>
      <Link to={`/products/${id}`}>
        <h3>{title}</h3>
        <img src={imageUrl} alt="" />
        <p>가격: {price}</p>
      </Link>

      <button type="button" onClick={() => addCart(id)}>
        장바구니 담기
      </button>
    </li>
  );
}

export default ProductItem;
