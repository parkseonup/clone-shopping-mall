import { atom } from 'recoil';
import { CartType } from '../graphql/cart';

export const productsToPay = atom<CartType>({
  key: 'productsToPay',
  default: [],
});
