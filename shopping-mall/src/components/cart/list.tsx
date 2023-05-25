import { SyntheticEvent, createRef, useEffect, useRef, useState } from 'react';
import { CartType } from '../../graphql/cart';
import CartItem from './item';

function CartList({ cart }: { cart: CartType }) {
  const formRef = useRef<HTMLFormElement>(null);
  const cartCheckboxRef = useRef<HTMLInputElement>(null);
  const cartItemCheckboxRefs = cart.map(() => createRef<HTMLInputElement>());
  const [checkedItems, setCheckedItems] = useState<CartType>([]);

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

  const handleChangeCheckbox = (e: SyntheticEvent) => {
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
    if (!cartCheckboxRef.current) return;

    cartItemCheckboxRefs.forEach(ref => {
      if (!ref.current || ref.current.disabled) return;

      const refId = ref.current.name.replace('cart-item__checkbox', '');

      ref.current.checked = !!checkedItems.find(
        checkedItem => checkedItem.id === refId
      );
    });

    cartCheckboxRef.current.checked =
      checkedItems.length ===
      cart.filter(cartItem => cartItem.product.createdAt).length;
  }, [cart, checkedItems]);

  /* --------------------------------- return --------------------------------- */
  if (cart.length < 1) return null;

  return (
    <form ref={formRef} onChange={handleChangeCheckbox}>
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

      <button type="submit">결제 창으로</button>
    </form>
  );
}

export default CartList;
