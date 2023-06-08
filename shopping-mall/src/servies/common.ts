import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      cacheTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: false,
    },
  },
});

export const BASE_URL = 'http://localhost:3000';
export const API_URL = `${BASE_URL}/graphql`;

export const QueryKeys = {
  PRODUCTS: {
    default: ['PRODUCTS'],
    products: (category: SecondKey) => ['PRODUCTS', category],
    productsOfPage: (category: SecondKey, page: number) => [
      'PRODUCTS',
      category,
      page,
    ],
    product: (id?: string) => ['PRODUCTS', 'product', id],
  },
  CART: {
    default: ['CART'],
  },
} as const;

export type SecondKey = 'products' | 'admin';

export type ResponseError = {
  response: {
    status: number;
    errors: {
      message: string;
      extensions: {
        code: string;
        metadata?: {
          id: string;
        };
      };
    }[];
  };
};
