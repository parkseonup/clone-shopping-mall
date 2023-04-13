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

const productResolver: Resolvers = {
  Query: {
    products: (parent, args, context, info) => mockProducts,
    product: (parent, { id }, context, info) => {
      const targetProduct = mockProducts.find((product) => product.id === id);

      return targetProduct || null;
    },
  },
};

export default productResolver;
