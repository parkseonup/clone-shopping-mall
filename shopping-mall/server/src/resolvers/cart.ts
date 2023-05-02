import { DBField, writeDB } from "../dbController";
import { Cart, Resolvers } from "./types";

const setJSON = (data: Cart) => {
  writeDB(DBField.CART, data);
};

const cartResolver: Resolvers = {
  Query: {
    cart: (parent, args, { db }) => db.cart,
  },
  Mutation: {
    addCart: (parent, { id }, { db }) => {
      const targetProduct = db.products.find((product) => product.id === id);

      if (!targetProduct) throw new Error("없는 데이터입니다.");

      const targetCartIndex = db.cart?.findIndex(
        (cartItem) => cartItem.id === id
      );

      if (targetCartIndex === undefined || targetCartIndex < 0) {
        const newItem = { id, amount: 1 };
        db.cart.push(newItem);
        setJSON(db.cart);
        return newItem;
      }

      const newItem = {
        id,
        amount: db.cart[targetCartIndex].amount + 1,
      };
      db.cart[targetCartIndex] = newItem;
      setJSON(db.cart);

      return newItem;
    },
    updateCart: (parent, { id, amount }, { db }) => {
      const targetCartIndex = db.cart?.findIndex(
        (cartItem) => cartItem.id === id
      );

      if (targetCartIndex === undefined || targetCartIndex < 0)
        throw new Error("장바구니에 id가 없습니다.");

      const newItem = {
        id,
        amount,
      };

      db.cart[targetCartIndex] = newItem;
      setJSON(db.cart);

      return newItem;
    },
    deleteCart: (parent, { id }, { db }) => {
      const newCart = db.cart.filter((cartItem) => cartItem.id !== id);
      db.cart = newCart;
      setJSON(db.cart);
      return id;
    },
    executePay: (parent, { ids }, { db }) => {
      const newCart = db.cart.filter((cartItem) => !ids.includes(cartItem.id));
      const hasDeletedItem = ids.some((id: string) => {
        const product = db.products.find((product) => product.id === id);
        return !product?.createdAt;
      });

      if (hasDeletedItem) throw new Error("품절된 상품이 포함되어 있습니다.");

      db.cart = newCart;
      setJSON(db.cart);
      return ids;
    },
  },
  CartItem: {
    product: (cartItem, args, { db }) =>
      db.products.find((product) => product.id === cartItem.id),
  },
};

export default cartResolver;
