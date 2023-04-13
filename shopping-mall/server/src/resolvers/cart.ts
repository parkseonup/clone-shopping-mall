import { Resolvers } from "./types";

// 임시 데이터 -> 나중에 firebase DB 생성
const mockProducts = (() =>
  Array.from({ length: 20 }).map((_, i) => ({
    id: i + 1 + "",
    title: `임시제목${i + 1}`,
    imageUrl: `https://picsum.photos/id/${i + 20}/200/150`,
    price: 50000,
    description: `임시설명${i + 1}`,
    createdAt: new Date(1661646735501883 + i * 1000 * 60 * 60 * 24).toString(),
  })))();
let cartData = [{ id: "1", amount: 2 }]; // [{ id, imageUrl, price, title, amount }]

const cartResolver: Resolvers = {
  Query: {
    cart: (parent, args, context, info) => cartData,
  },
  Mutation: {
    addCart: (parent, { id }, context, info) => {
      const newCartData = [...cartData];
      const targetProduct = mockProducts.find((product) => product.id === id);

      if (!targetProduct) throw new Error("없는 데이터입니다.");

      const newItem = {
        ...targetProduct,
        amount: (newCartData[id]?.amount || 0) + 1,
      };
      newCartData[id] = newItem;
      cartData = newCartData;

      return newItem;
    },
    updateCart: (parent, { id, amount }, context, info) => {
      const newCartData = [...cartData];
      const newItem = {
        ...newCartData[id],
        amount,
      };

      newCartData[id] = newItem;
      cartData = newCartData;

      return newItem;
    },
    deleteCart: (parent, { id }, context, info) => {
      const newCartData = cartData.filter((cartItem) => cartItem.id !== id);
      cartData = newCartData;
      return id;
    },
    excutePay: (parent, { ids }, context, info) => {
      const newCartData = cartData.filter(
        (cartItem) => !ids.includes(cartItem.id)
      );
      cartData = newCartData;
      return ids;
    },
  },
};

export default cartResolver;
