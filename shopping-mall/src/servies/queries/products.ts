import { API_URL, QueryKeys, ResponseError, SecondKey } from '../common';
import request from 'graphql-request';
import {
  GET_PRODUCT,
  GET_PRODUCTS,
  ProductType,
  ProductsType,
} from '../../graphql/products';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

export const useGetProduct = (id: string) =>
  useQuery<{ product: ProductType }, ResponseError>({
    queryKey: QueryKeys.PRODUCTS.product(id),
    queryFn: () =>
      request({
        url: API_URL,
        document: GET_PRODUCT,
        variables: { id },
      }),
  });

export const useGetProuctsByPage = ({
  page,
  category,
  count,
  isShownDeleted,
}: {
  page: number;
  category: SecondKey;
  count?: number;
  isShownDeleted?: boolean;
}) =>
  useQuery<{ products: ProductsType; lastPageNumber: number }, ResponseError>({
    queryKey: QueryKeys.PRODUCTS.productsOfPage(category, page),
    queryFn: () =>
      request({
        url: API_URL,
        document: GET_PRODUCTS,
        variables: { page, count, isShownDeleted },
      }),
    keepPreviousData: true,
    suspense: true,
    useErrorBoundary: true,
  });

export const useGetInfiniteProducts = ({
  category,
  count,
  isShownDeleted,
}: {
  category: SecondKey;
  count?: number;
  isShownDeleted?: boolean;
}) =>
  useInfiniteQuery<{ products: ProductsType }, ResponseError>({
    queryKey: QueryKeys.PRODUCTS.products(category),
    queryFn: ({ pageParam = '' }) =>
      request({
        url: API_URL,
        document: GET_PRODUCTS,
        variables: { cursor: pageParam, count, isShownDeleted },
      }),
    getNextPageParam: lastPage => lastPage.products.at(-1)?.id,
    suspense: true,
    useErrorBoundary: true,
  });
