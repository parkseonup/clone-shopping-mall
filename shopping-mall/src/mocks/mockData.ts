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
    createdAt: 1600000000000 + i * 60 || null,
  })
);

mockProducts[2].createdAt = null;

export const mockCart: CartType = [
  {
    id: '1',
    amount: 1,
    product: {
      id: '1',
      title: '제목_1',
      description: '설명_1',
      imageUrl: 'https://picsum.photos/id/31/200/300.jpg',
      price: 3000,
      createdAt: 1600000000000,
    },
  },
  {
    id: '2',
    amount: 1,
    product: {
      id: '2',
      title: '제목_2',
      description: '설명_2',
      imageUrl: 'https://picsum.photos/id/32/200/300.jpg',
      price: 3000,
      createdAt: 1600000000060,
    },
  },
  {
    id: '3',
    amount: 1,
    product: {
      id: '3',
      title: '제목_3',
      description: '설명_3',
      imageUrl: 'https://picsum.photos/id/33/200/300.jpg',
      price: 3000,
      createdAt: null,
    },
  },
];
