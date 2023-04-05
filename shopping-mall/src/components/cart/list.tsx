import { SyntheticEvent, useRef } from "react";
import { CartType } from "../../graphql/cart";
import CartItem from "./item";

// TODO: 강사님 코드로 다시 짜보고 어떤게 더 좋은지 고민해보기
// TODO: ref의 매개변수로 node가 등록되었을 때 node가 undefined일 경우가 어떻게 생기는지 알아보기
const CartList = ({ items }: { items: CartType[] }) => {
  const cartAllcheckboxRef = useRef<HTMLInputElement>(null);
  const cartItemCheckboxRef = useRef(new Map());

  function handleChangeCheckbox(e: SyntheticEvent) {
    if (e.target === cartAllcheckboxRef.current) {
      cartItemCheckboxRef.current.forEach(
        (checkbox) => (checkbox.checked = cartAllcheckboxRef.current!.checked)
      );
    } else {
      const checkedItemCount = [...cartItemCheckboxRef.current.values()].filter(
        (checkbox) => checkbox.checked
      ).length;

      cartAllcheckboxRef.current!.checked =
        checkedItemCount === items.length ? true : false;
    }
  }

  return (
    <form onChange={handleChangeCheckbox}>
      <label>
        <input
          type="checkbox"
          className="select-all"
          name="select-all"
          ref={cartAllcheckboxRef}
        />
      </label>
      <ul className="cart">
        {items.map((item) => (
          <CartItem
            {...item}
            key={item.id}
            ref={(node: HTMLInputElement) => {
              node
                ? cartItemCheckboxRef.current.set(item.id, node)
                : cartItemCheckboxRef.current.delete(item.id);
            }}
          />
        ))}
      </ul>
    </form>
  );
};

export default CartList;
