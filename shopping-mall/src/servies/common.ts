import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      cacheTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

export const BASE_URL = 'http://localhost:3000';
export const API_URL = `${BASE_URL}/graphql`;

export const QueryKeys = {
  PRODUCTS: {
    default: ['PRODUCTS'] as const,
    products: (category: SecondKey) => ['PRODUCTS', category] as const,
    productsOfPage: (category: SecondKey, page: number) =>
      ['PRODUCTS', category, page] as const,
    product: (id?: string) => ['PRODUCTS', 'product', id] as const,
  },
  CART: {
    default: ['CART'] as const,
  },
};

export type SecondKey = 'products' | 'admin';
