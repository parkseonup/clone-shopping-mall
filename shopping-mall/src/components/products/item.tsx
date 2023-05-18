import { Link } from 'react-router-dom';
import { ProductType } from '../../graphql/products';

function ProductItem({ id, title, imageUrl, price }: ProductType) {
  return (
    <li>
      <Link to={`/products/${id}`}>
        <h3>{title}</h3>
        <img src={imageUrl} alt="" />
        <p>가격: {price}</p>
      </Link>

      <button type="button">장바구니 담기</button>
    </li>
  );
}

export default ProductItem;
