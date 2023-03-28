import { CartType } from "../../graphql/cart";

const CartItem = ({ title, price, amount }: CartType) => (
  <li>
    {title} / 가격: {price} / 개수: {amount}
  </li>
);

export default CartItem;
