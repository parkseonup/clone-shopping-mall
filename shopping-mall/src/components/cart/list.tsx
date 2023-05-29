import { SyntheticEvent, createRef, useEffect, useRef } from 'react';
import { CartType } from '../../graphql/cart';
import CartItem from './item';
import { useRecoilState } from 'recoil';
import { productsToPay } from '../../recoil/atoms';

function CartList({ cart }: { cart: CartType }) {
  const formRef = useRef<HTMLFormElement>(null);
  const cartCheckboxRef = useRef<HTMLInputElement>(null);
  const cartItemCheckboxRefs = cart.map(() => createRef<HTMLInputElement>());
  const [checkedItems, setCheckedItems] = useRecoilState(productsToPay);

  const changeCartCheckbox = (targetInput: HTMLInputElement) => {
    // 개별 선택시 전체 선택 change function
    const targetInputId = targetInput.name.replace('cart-item__checkbox', '');
    const cartItem = cart.find(cartItem => cartItem.id === targetInputId);

    let newCheckedItems = [...checkedItems];

    if (!cartItem) return;

    if (targetInput.checked) {
      if (!checkedItems.includes(cartItem)) newCheckedItems.push(cartItem);
    } else {
      newCheckedItems = newCheckedItems.filter(
        checkedItem => checkedItem.id !== targetInputId
      );
    }

    setCheckedItems(newCheckedItems);
  };

  const changeCartItemsCheckbox = (targetInput: HTMLInputElement) => {
    // 전체 선택시 개별 선택 change function
    const newCheckedItems = targetInput.checked
      ? cart.filter(cartItem => cartItem.product.createdAt)
      : [];

    setCheckedItems(newCheckedItems);
  };

  const onChangeCheckbox = (e: SyntheticEvent) => {
    // Form Change Event Handler
    if (!formRef.current) return;

    const targetInput = e.target as HTMLInputElement;

    if (targetInput.className === 'cart__checkbox') {
      changeCartItemsCheckbox(targetInput);
    } else if (targetInput.className === 'cart-item__checkbox') {
      changeCartCheckbox(targetInput);
    }
  };

  useEffect(() => {
    // cart가 변경되었을 경우
    const newCheckedItems = [...checkedItems];

    newCheckedItems.forEach((checkedItem, i) => {
      const cartItem = cart.find(
        cartItem => cartItem.id === checkedItem.id && cartItem.product.createdAt
      );

      if (cartItem) newCheckedItems[i] = cartItem;
      else newCheckedItems.splice(i, 1);
    });

    setCheckedItems(newCheckedItems);
  }, [cart]);

  useEffect(() => {
    // 결제 항목이 변경되었을 경우
    if (!cartCheckboxRef.current) return;

    cartItemCheckboxRefs.forEach(ref => {
      if (!ref.current || ref.current.disabled) return;

      const refId = ref.current.name.replace('cart-item__checkbox', '');

      ref.current.checked = !!checkedItems.find(
        checkedItem => checkedItem.id === refId
      );
    });

    const existentCartLength = cart.filter(
      cartItem => cartItem.product.createdAt
    ).length;

    cartCheckboxRef.current.checked =
      checkedItems.length === existentCartLength && existentCartLength > 0;
    cartCheckboxRef.current.disabled =
      cart.filter(cartItem => cartItem.product.createdAt).length === 0;
  }, [checkedItems]);

  /* --------------------------------- return --------------------------------- */
  if (cart.length < 1) return null;

  return (
    <>
      <form ref={formRef} onChange={onChangeCheckbox}>
        <label>
          <input
            type="checkbox"
            name="cart__checkbox"
            className="cart__checkbox"
            ref={cartCheckboxRef}
          />
        </label>

        <ul>
          {cart.map((cartItem, i) => (
            <CartItem
              {...cartItem}
              key={cartItem.id}
              ref={cartItemCheckboxRefs[i]}
            />
          ))}
        </ul>
      </form>
    </>
  );
}

export default CartList;
