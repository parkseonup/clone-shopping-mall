import request from 'graphql-request';
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

// const BASE_URL = import.meta.env.BASE_URL;
const BASE_URL = 'http://localhost:3000';

export const QueryKeys = {
  PRODUCTS: 'PRODUCTS',
  CART: 'CART',
};

// TODO: document 타입 정의
export const fetchData = async (document: any, variables = {}) =>
  await request({
    url: `${BASE_URL}/graphql`,
    document,
    variables,
  });
