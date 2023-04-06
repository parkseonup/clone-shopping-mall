import { atom } from "recoil";
import { CartType } from "../graphql/cart";

export const checkedCartState = atom<CartType[]>({
  key: "checkedCartState",
  default: [],
});
