import { Link } from "react-router-dom";
import { Product } from "../../types";

const ProductItem = ({ id, title, price, category, images }: Product) => (
  <li className="product-item">
    <Link to={`/products/${id}`}>
      <h3 className="product-item__title">{title}</h3>
      <img src={images[0]} className="product-item__image" alt="" />
      <p className="product-item__category">{category.name}</p>
      <p className="product-item__price">{price}</p>
    </Link>
  </li>
);

export default ProductItem;
