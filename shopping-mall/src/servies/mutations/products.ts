import request from 'graphql-request';
import { API_URL, QueryKeys } from '../common';
import {
  ADD_PRODUCT,
  ProductType,
  UPDATE_PRODUCT,
  DELETE_PRODUCT,
  ProductOmitType,
} from '../../graphql/products';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useAddProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productInfo: ProductOmitType) =>
      request({
        url: API_URL,
        document: ADD_PRODUCT,
        variables: { ...productInfo },
      }),
    onSuccess: () =>
      queryClient.invalidateQueries(QueryKeys.PRODUCTS.default, {
        exact: false,
        refetchType: 'all',
      }),
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productInfo: Omit<ProductType, 'createdAt'>) =>
      request({
        url: API_URL,
        document: UPDATE_PRODUCT,
        variables: { ...productInfo },
      }),
    onSuccess: () =>
      queryClient.invalidateQueries(QueryKeys.PRODUCTS.default, {
        exact: false,
        refetchType: 'all',
      }),
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      request({
        url: API_URL,
        document: DELETE_PRODUCT,
        variables: { id },
      }),
    onSuccess: () =>
      queryClient.invalidateQueries(QueryKeys.PRODUCTS.default, {
        exact: false,
        refetchType: 'all',
      }),
  });
};
