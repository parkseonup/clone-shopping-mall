import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ADD_CART } from "../../graphql/cart";
import { ProductType } from "../../graphql/products";
import { graphqlFetcher } from "../../queryClient";

const ProductItem = ({ id, title, imageUrl, price }: ProductType) => {
  const { mutate: addToCart } = useMutation((id: string) =>
    graphqlFetcher(ADD_CART, { id })
  );

  return (
    <li className="product-item">
      <Link to={`/products/${id}`}>
        <h3 className="product-item__title">{title}</h3>
        <img src={imageUrl} className="product-item__image" alt="" />
        <p className="product-item__price">{price}</p>
      </Link>
      <button className="product-item__add-cart" onClick={() => addToCart(id)}>
        장바구니 담기
      </button>
    </li>
  );
};

export default ProductItem;
