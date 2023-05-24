import { SyntheticEvent, createRef, useEffect, useRef, useState } from 'react';
import { CartItemType, CartType } from '../../graphql/cart';
import CartItem from './item';

// TODO: formData 활용해서 코드 분리하기...
function CartList({ cart }: { cart: CartType }) {
  const allCheckboxRef = useRef<HTMLInputElement>(null);
  const checkboxRefs = cart.map(() => createRef<HTMLInputElement>());
  const [checkedTarget, setCheckedTarget] = useState<'Item' | 'All'>();
  const [checkedState, setCheckedState] = useState<CartType>([]);
  const existentCart = cart.filter(cartItem => cartItem.product.createdAt);

  /* ------------------------------ 전체 선택 event handler ----------------------------- */
  const handleCheckAll = (e: SyntheticEvent) => {
    const isChecked = (e.target as HTMLInputElement).checked;
    const newCheckedState: CartType = [];

    if (isChecked) {
      existentCart.forEach(cartItem => {
        if (cartItem.product.createdAt) newCheckedState.push(cartItem);
      });
    }

    setCheckedTarget('All');
    setCheckedState(newCheckedState);
  };

  /* ------------------------------ 개별 선택 event handler ----------------------------- */
  const changeCheckedState = (item: CartItemType, isChecked: boolean) => {
    const newCheckedState = [...checkedState];
    const targetIndex = newCheckedState.findIndex(
      checkedItem => checkedItem.id === item.id
    );

    if (isChecked && targetIndex < 0) newCheckedState.push(item);
    if (!isChecked && targetIndex > -1) newCheckedState.splice(targetIndex, 1);

    setCheckedTarget('Item');
    setCheckedState(newCheckedState);
  };

  const deleteCheckedState = (item: CartItemType) => {
    const newCheckedState = [...checkedState];
    const targetIndex = newCheckedState.findIndex(
      checkedItem => checkedItem.id === item.id
    );

    if (targetIndex < 0) return;

    newCheckedState.splice(targetIndex, 1);
    setCheckedTarget('Item');
    setCheckedState(newCheckedState);
  };

  useEffect(() => {
    if (!allCheckboxRef.current || !checkedTarget || existentCart.length < 1)
      return;

    if (checkedTarget === 'Item') {
      const checkedStateIds = checkedState.map(checkedItem =>
        checkedItem.product.createdAt ? checkedItem.product.id : null
      );

      allCheckboxRef.current.checked = existentCart.every(cartItem =>
        checkedStateIds.includes(cartItem.product.id)
      );
    } else if (checkedTarget === 'All') {
      checkboxRefs.forEach(ref => {
        if (ref.current && allCheckboxRef.current && !ref.current.disabled)
          ref.current.checked = allCheckboxRef.current.checked;
      });
    }
  }, [existentCart, checkedState, checkedTarget]);

  /* --------------------------------- return --------------------------------- */
  if (cart.length < 1) return null;

  return (
    <form>
      <label>
        <input
          type="checkbox"
          name=""
          id=""
          ref={allCheckboxRef}
          onChange={handleCheckAll}
          disabled={existentCart.length < 1}
          className="cartAllCheckbox"
        />
      </label>

      <ul>
        {cart.map((cartItem, i) => (
          <CartItem
            cartItem={cartItem}
            key={cartItem.id}
            checkedItemState={
              !!checkedState.find(checkedItem => checkedItem.id === cartItem.id)
            }
            changeCheckedState={changeCheckedState}
            deleteCheckedState={deleteCheckedState}
            ref={checkboxRefs[i]}
          />
        ))}
      </ul>

      <button type="submit">결제 창으로</button>
    </form>
  );
}

export default CartList;
