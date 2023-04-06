import { createRef, SyntheticEvent, useRef } from "react";
import { CartType } from "../../graphql/cart";
import CartItem from "./item";

// TODO: ref의 매개변수로 node가 등록되었을 때 node가 undefined일 경우가 어떻게 생기는지 알아보기
// FIXME: item을 삭제했을 때는 전체 체크가 동작을 안함. (item 삭제시 onChange 이벤트가 안읽히기 때문)
const CartList = ({ items }: { items: CartType[] }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const checkboxRefs = items.map(() => createRef<HTMLInputElement>());

  const handleCheckboxChagned = (e: SyntheticEvent) => {
    if (!formRef.current) return;

    const targetInput = e.target as HTMLInputElement;
    const data = new FormData(formRef.current);
    const selectedCount = data.getAll("select-item").length;

    if (targetInput.classList.contains("select-all")) {
      const allChecked = targetInput.checked;
      checkboxRefs.forEach((checkboxRef) => {
        checkboxRef.current!.checked = allChecked;
      });
    } else {
      const allChecked = selectedCount === items.length;
      formRef.current.querySelector<HTMLInputElement>(".select-all")!.checked =
        allChecked;
    }
  };

  return (
    <form ref={formRef} onChange={handleCheckboxChagned}>
      <label>
        <input type="checkbox" className="select-all" name="select-all" />
      </label>
      <ul className="cart">
        {items.map((item, i) => (
          <CartItem {...item} key={item.id} ref={checkboxRefs[i]} />
        ))}
      </ul>
    </form>
  );
};

export default CartList;
