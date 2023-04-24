import { Resolvers } from "./types";

const productResolver: Resolvers = {
  Query: {
    products: (parent, { cursor = "" }, { db }) => {
      const fromIndex =
        db.products.findIndex((product) => product.id === cursor) + 1; // cursor에 해당하는 상품의 다음 상품부터 15개를 출력해야 함.
      return db.products.slice(fromIndex, fromIndex + 15) || [];
    },
    product: (parent, { id }, { db }) => {
      const targetProduct = db.products.find((product) => product.id === id);

      return targetProduct || null;
    },
  },
};

export default productResolver;
