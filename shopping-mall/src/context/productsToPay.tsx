import { Dispatch, ReactNode, createContext, useReducer } from 'react';

type IdsType = string[];

export type Action =
  | {
      type: 'added' | 'updated' | 'deleted';
      ids: IdsType;
    }
  | { type: 'deletedAll' };
type DispatchType = Dispatch<Action>;

export const CartIdsToPayContext = createContext<IdsType | null>(null);
export const CartIdsToPayDispatchContext = createContext<DispatchType | null>(
  null
);

export function ProductsToPayProvider({ children }: { children: ReactNode }) {
  const [productsToPay, dispatch] = useReducer(
    productsToPayReducer,
    initialProductsToPay
  );

  return (
    <CartIdsToPayContext.Provider value={productsToPay}>
      <CartIdsToPayDispatchContext.Provider value={dispatch}>
        {children}
      </CartIdsToPayDispatchContext.Provider>
    </CartIdsToPayContext.Provider>
  );
}

function productsToPayReducer(productsToPay: IdsType, action: Action) {
  switch (action.type) {
    case 'added': {
      return [
        ...productsToPay,
        ...action.ids.filter(id => !productsToPay.includes(id)),
      ];
    }
    case 'deleted': {
      return productsToPay.filter(id => !action.ids.includes(id));
    }
    case 'deletedAll': {
      return [];
    }
    default: {
      return productsToPay;
    }
  }
}

const initialProductsToPay: IdsType = [];
