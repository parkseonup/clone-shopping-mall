import { CartItemType } from '../../graphql/cart';
import { SyntheticEvent, useContext, useEffect, useRef, useState } from 'react';
import ProductCard from '../product/productCard';
import { ButtonToDeleteCart, InputToUpdateCartAmount } from './actions';
import {
  ProductsToPayContext,
  ProductsToPayDispatchContext,
} from '../../context/productsToPay';

export default function CartItem({ data: cartItem }: { data: CartItemType }) {
  const { id, amount, product } = cartItem;
  const checkboxRef = useRef(null);
  const checkedItems = useContext(ProductsToPayContext);
  const isChecked = !!checkedItems?.find(checkedItem => id === checkedItem.id);
  const setCheckedItems = useContext(ProductsToPayDispatchContext);

  if (!setCheckedItems)
    throw new Error('Cannot find ProductsToPayDispatchContext');

  const onChangeCheckbox = (e: SyntheticEvent) => {
    setCheckedItems({
      type: (e.target as HTMLInputElement).checked ? 'added' : 'deleted',
      items: [cartItem],
    });
  };

  useEffect(() => {
    if (!product.createdAt) {
      setCheckedItems({
        type: 'deleted',
        items: [cartItem],
      });
    }
  }, []);

  return (
    <li>
      <label>
        <input
          type="checkbox"
          ref={checkboxRef}
          disabled={!product.createdAt}
          onChange={onChangeCheckbox}
          checked={isChecked}
        />
      </label>

      <ProductCard
        data={{ ...product }}
        controls={
          <>
            {product.createdAt ? (
              <InputToUpdateCartAmount
                id={id}
                amount={amount}
                labelText={'개수'}
              />
            ) : null}
            <ButtonToDeleteCart id={id} />
          </>
        }
      />
    </li>
  );
}
