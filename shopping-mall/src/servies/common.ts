import { QueryClient } from 'react-query';

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
  PRODUCTS: 'PRODUCTS',
  CART: 'CART',
};
export type SecondKey = 'products' | 'admin';
