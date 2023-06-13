import { Dispatch, ReactNode, createContext, useReducer } from 'react';
import { CartType } from '../graphql/cart';

type Action =
  | {
      type: 'added' | 'updated' | 'deleted';
      items: CartType;
    }
  | { type: 'deletedAll' };
type DispatchType = Dispatch<Action>;

export const ProductsToPayContext = createContext<CartType | null>(null);
export const ProductsToPayDispatchContext = createContext<DispatchType | null>(
  null
);

export function ProductsToPayProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [productsToPay, dispatch] = useReducer(
    productsToPayReducer,
    initialProductsToPay
  );

  return (
    <ProductsToPayContext.Provider value={productsToPay}>
      <ProductsToPayDispatchContext.Provider value={dispatch}>
        {children}
      </ProductsToPayDispatchContext.Provider>
    </ProductsToPayContext.Provider>
  );
}

function productsToPayReducer(productsToPay: CartType, action: Action) {
  switch (action.type) {
    case 'added': {
      let newProductsToPay = [...productsToPay];

      action.items.forEach(item => {
        const targetIndex = newProductsToPay.findIndex(
          product => product.id === item.id
        );

        if (targetIndex < 0) newProductsToPay = [...newProductsToPay, item];
      });

      return newProductsToPay;
    }
    case 'updated': {
      let newProductsToPay = [...productsToPay];
      const existentCartIds = action.items.map(item => item.id);

      // cart에서 삭제된 아이템을 찾아서 지우기
      newProductsToPay = newProductsToPay.filter(product =>
        existentCartIds.includes(product.id)
      );

      // cart에서 업데이트된 아이템을 찾아서 업데이트하기
      action.items.forEach(item => {
        const targetIndex = newProductsToPay.findIndex(
          product => product.id === item.id
        );

        if (targetIndex > -1) newProductsToPay.splice(targetIndex, 1, item);
      });

      return newProductsToPay;
    }
    case 'deleted': {
      const newProductsToPay = [...productsToPay];

      action.items.forEach(item => {
        const targetIndex = newProductsToPay.findIndex(
          product => product.id === item.id
        );

        if (targetIndex > -1) newProductsToPay.splice(targetIndex, 1);
      });

      return newProductsToPay;
    }
    case 'deletedAll': {
      return [];
    }
  }
}

const initialProductsToPay: CartType = [];
