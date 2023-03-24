import { Link } from "react-router-dom";
import { ProductType } from "../../graphql/products";

const ProductItem = ({ id, title, imageUrl, price }: ProductType) => (
  <li className="product-item">
    <Link to={`/products/${id}`}>
      <h3 className="product-item__title">{title}</h3>
      <img src={imageUrl} className="product-item__image" alt="" />
      <p className="product-item__price">{price}</p>
    </Link>
  </li>
);

export default ProductItem;
