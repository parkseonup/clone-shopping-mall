import {
  SyntheticEvent,
  createRef,
  useContext,
  useEffect,
  useRef,
} from 'react';
import { CartType } from '../../graphql/cart';
import CartItem from './item';
import {
  ProductsToPayContext,
  ProductsToPayDispatchContext,
} from '../../context/productsToPay';

function CartList({ cart }: { cart: CartType }) {
  console.log('[CartList]');
  const formRef = useRef<HTMLFormElement>(null);
  const cartCheckboxRef = useRef<HTMLInputElement>(null);
  const cartItemCheckboxRefs = cart.map(() => createRef<HTMLInputElement>());
  const checkedItems = useContext(ProductsToPayContext);
  const setCheckedItems = useContext(ProductsToPayDispatchContext);

  if (!checkedItems) throw new Error('Cannot find ProductsToPayContext');
  if (!setCheckedItems)
    throw new Error('Cannot find ProductsToPayDispatchContext');

  const changeCartCheckbox = (targetInput: HTMLInputElement) => {
    // 개별 선택시 전체 선택 change function
    const targetInputId = targetInput.name.replace('cart-item__checkbox', '');
    const cartItem = cart.find(cartItem => cartItem.id === targetInputId);

    if (!cartItem) return;

    if (targetInput.checked) {
      setCheckedItems({
        type: 'added',
        items: [cartItem],
      });
    } else {
      setCheckedItems({
        type: 'deleted',
        items: [cartItem],
      });
    }
  };

  const changeCartItemsCheckbox = (targetInput: HTMLInputElement) => {
    // 전체 선택시 개별 선택 change function
    setCheckedItems({
      type: targetInput.checked ? 'added' : 'deleted',
      items: cart.filter(cartItem => cartItem.product.createdAt),
    });
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
    setCheckedItems({
      type: 'updated',
      items: cart.filter(cartItem => cartItem.product.createdAt),
    });
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
