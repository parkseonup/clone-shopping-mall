import { atom, selectorFamily } from "recoil";

/** 장바구니 목록: [[ id, count ]] */
export const cartState = atom<Map<string, number>>({
  key: "cartState",
  default: new Map(),
});

/**
 * get: 제품 id를 인수로 전달하면 장바구니 목록에서 해당 제품 뽑아오기
 * set: 제품 id를 인수로 전달하고 newValue로 장바구니에 담긴 개수 업데이트
 */
export const cartItemSelector = selectorFamily<number | undefined, string>({
  key: "cartItem",
  get:
    (id: string) =>
    ({ get }) => {
      const carts = get(cartState);
      return carts.get(id);
    },
  set:
    (id: string) =>
    ({ get, set }, newValue) => {
      if (typeof newValue === "number") {
        const newCart = new Map([...get(cartState)]);
        newCart.set(id, newValue);
        set(cartState, newCart);
      }
    },
});
