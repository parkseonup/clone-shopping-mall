import { CartType } from "../../graphql/cart";

const ItemData = ({
  title,
  imageUrl,
  price,
}: Pick<CartType, "title" | "imageUrl" | "price">) => {
  return (
    <>
      <p className="cart-item__title">{title}</p>
      <img src={imageUrl} alt="" />
      <p className="cart-item__price">{price}</p>
    </>
  );
};

export default ItemData;
