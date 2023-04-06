import { createRef, SyntheticEvent, useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { CartType } from "../../graphql/cart";
import { checkedCartState } from "../../recoils/cart";
import WillPay from "../willPay";
import CartItem from "./item";

// TODO: ref의 매개변수로 node가 등록되었을 때 node가 undefined일 경우가 어떻게 생기는지 알아보기
// FIXME: item을 삭제했을 때는 전체 체크가 동작을 안함. (item 삭제시 onChange 이벤트가 안읽히기 때문)
const CartList = ({ items }: { items: CartType[] }) => {
  const navigate = useNavigate();
  const [checkedCartData, setCheckedCartData] =
    useRecoilState(checkedCartState);
  const formRef = useRef<HTMLFormElement>(null);
  const checkboxRefs = items.map(() => createRef<HTMLInputElement>());
  const [formData, setFormData] = useState<FormData>();

  const setAllCheckedFormItems = () => {
    // 개별 선택
    if (!formRef.current) return;

    const data = new FormData(formRef.current);
    const selectedCount = data.getAll("select-item").length;
    const allChecked = selectedCount === items.length;
    formRef.current.querySelector<HTMLInputElement>(".select-all")!.checked =
      allChecked;
  };

  const setItemsCheckedFormAll = (targetInput: HTMLInputElement) => {
    // 전체 선택
    const allChecked = targetInput.checked;
    checkboxRefs.forEach((inputElem) => {
      inputElem.current!.checked = allChecked;
    });
  };

  const handleCheckboxChagned = (e?: SyntheticEvent) => {
    if (!formRef.current) return;

    const targetInput = e?.target as HTMLInputElement;

    if (targetInput && targetInput.classList.contains("select-all")) {
      setItemsCheckedFormAll(targetInput);
    } else {
      setAllCheckedFormItems();
    }

    const data = new FormData(formRef.current);
    setFormData(data);
  };

  const handleSubmit = () => {
    if (checkedCartData.length) navigate("/payment");
    else alert("결제할 상품이 없습니다.");
  };

  useEffect(() => {
    // 초기 마운트시 checkedCartState에서 체크된 아이템 확인해서 동기화
    checkedCartData.forEach((item) => {
      const checkedItem = checkboxRefs.find((ref) => {
        return ref.current!.dataset.id === item.id;
      });
      if (checkedItem) checkedItem.current!.checked = true;
    });
    setAllCheckedFormItems();
  }, []);

  useEffect(() => {
    // 장바구니 아이템 업데이트, 또는 개별 아이템 선택될 때마다 checkedCartState 업데이트
    const checkedItems = checkboxRefs.reduce<CartType[]>((res, ref, i) => {
      if (ref.current!.checked) res.push(items[i]);
      return res;
    }, []);

    setCheckedCartData(checkedItems);
  }, [items, formData]);

  return (
    <div>
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
      <WillPay submitTitle="결제창으로" handleSubmit={handleSubmit} />
    </div>
  );
};

export default CartList;
