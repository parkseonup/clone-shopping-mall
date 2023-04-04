import { CartType } from "../../graphql/cart";
import CartItem from "./item";

const CartList = ({ items }: { items: CartType[] }) => (
  <form>
    <label>
      <input type="checkbox" className="select-all" name="select-all" />
    </label>
    <ul className="cart">
      {items.map((item) => (
        <CartItem {...item} key={item.id} />
      ))}
    </ul>
  </form>
);

export default CartList;
