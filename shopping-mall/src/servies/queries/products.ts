import { API_URL, QueryKeys, SecondKey } from '../common';
import request from 'graphql-request';
import {
  GET_PRODUCT,
  GET_PRODUCTS,
  ProductType,
  ProductsType,
} from '../../graphql/products';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

export const useGetProduct = (id: string | undefined) =>
  useQuery<{ product: ProductType }>({
    queryKey: [QueryKeys.PRODUCTS, 'product', id],
    queryFn: async () =>
      await request({
        url: API_URL,
        document: GET_PRODUCT,
        variables: { id },
      }),
  });

export const useGetProuctsByPage = ({
  page,
  key,
  count,
}: {
  page: number;
  key?: SecondKey;
  count?: number;
}) =>
  useQuery<{ products: ProductsType; lastPageNumber: number }>({
    queryKey: [QueryKeys.PRODUCTS, key, page],
    queryFn: async () =>
      request({
        url: API_URL,
        document: GET_PRODUCTS,
        variables: { page, count },
      }),
    keepPreviousData: true,
  });

export const useGetInfiniteProducts = ({
  key,
  count,
}: {
  key?: SecondKey;
  count?: number;
}) =>
  useInfiniteQuery<{ products: ProductsType }>({
    queryKey: [QueryKeys.PRODUCTS, key],
    queryFn: async ({ pageParam = '' }) =>
      await request({
        url: API_URL,
        document: GET_PRODUCTS,
        variables: { cursor: pageParam, count },
      }),
    getNextPageParam: lastPage => lastPage.products.at(-1)?.id,
  });
