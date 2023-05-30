import { useQuery } from 'react-query';
import { API_URL, QueryKeys } from '../common';
import request from 'graphql-request';
import { CartType, GET_CART } from '../../graphql/cart';

export const useGetCart = () =>
  useQuery<{ cart: CartType }>({
    queryKey: [QueryKeys.CART],
    queryFn: async () =>
      await request({
        url: API_URL,
        document: GET_CART,
      }),
    staleTime: 1,
    cacheTime: 1,
  });
