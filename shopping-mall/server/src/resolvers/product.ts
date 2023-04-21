import { Resolvers } from "./types";

const productResolver: Resolvers = {
  Query: {
    products: (parent, args, { db }) => db.products,
    product: (parent, { id }, { db }) => {
      const targetProduct = db.products.find((product) => product.id === id);

      return targetProduct || null;
    },
  },
};

export default productResolver;
