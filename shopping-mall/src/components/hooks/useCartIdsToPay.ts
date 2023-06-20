import { useContext } from 'react';
import {
  CartIdsToPayContext,
  CartIdsToPayDispatchContext,
} from '../../context/productsToPay';

export default function useCartIdsToPay() {
  const cartIdsToPay = useContext(CartIdsToPayContext);
  const dispatch = useContext(CartIdsToPayDispatchContext);

  if (!cartIdsToPay)
    throw new Error(`${CartIdsToPayContext}를 찾을 수 없습니다.`);
  if (!dispatch)
    throw new Error(`${CartIdsToPayDispatchContext}를 찾을 수 없습니다.`);

  return [cartIdsToPay, dispatch] as const;
}
