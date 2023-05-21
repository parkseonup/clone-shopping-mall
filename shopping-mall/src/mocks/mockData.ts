import { CartType } from '../graphql/cart';
import { ProductsType } from '../graphql/products';

export const mockProducts: ProductsType = Array.from(
  { length: 60 },
  (_, i) => ({
    id: i + 1 + '',
    title: `제목_${i + 1}`,
    description: `설명_${i + 1}`,
    imageUrl: `https://picsum.photos/id/${i + 1 + 30}/200/300.jpg`,
    price: 3000,
    createdAt: Date.now(),
  })
);

export const mockCart: CartType = [];
