import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import { ProductType } from "../../graphql/products";
import { cartItemSelector } from "../../recoils/cart";

const ProductItem = ({ id, title, imageUrl, price }: ProductType) => {
  const [cartAmount, setCartAmount] = useRecoilState(cartItemSelector(id));

  const addToCart = () => setCartAmount((prev) => (prev || 0) + 1);

  return (
    <li className="product-item">
      <Link to={`/products/${id}`}>
        <h3 className="product-item__title">{title}</h3>
        <img src={imageUrl} className="product-item__image" alt="" />
        <p className="product-item__price">{price}</p>
      </Link>
      <button className="product-item__add-cart" onClick={addToCart}>
        장바구니 담기
      </button>
      <p>{cartAmount || 0}</p>
    </li>
  );
};

export default ProductItem;
