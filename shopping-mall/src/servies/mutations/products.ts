import request from 'graphql-request';
import { useMutation } from 'react-query';
import { API_URL, QueryKeys, queryClient } from '../common';
import {
  ADD_PRODUCT,
  ProductType,
  UPDATE_PRODUCT,
  DELETE_PRODUCT,
} from '../../graphql/products';

export const useAddProduct = () =>
  useMutation({
    mutationFn: async (productInfo: Omit<ProductType, 'id' | 'createdAt'>) =>
      await request({
        url: API_URL,
        document: ADD_PRODUCT,
        variables: { ...productInfo },
      }),
    onSuccess: () =>
      queryClient.invalidateQueries([QueryKeys.PRODUCTS], {
        exact: false,
        refetchInactive: true,
      }),
  });

export const useUpdateProduct = () =>
  useMutation({
    mutationFn: async (productInfo: Omit<ProductType, 'createdAt'>) =>
      await request({
        url: API_URL,
        document: UPDATE_PRODUCT,
        variables: { ...productInfo },
      }),
    onSuccess: () =>
      queryClient.invalidateQueries([QueryKeys.PRODUCTS], {
        exact: false,
        refetchInactive: true,
      }),
  });

export const useDeleteProduct = () =>
  useMutation({
    mutationFn: async (id: string) =>
      await request({
        url: API_URL,
        document: DELETE_PRODUCT,
        variables: { id },
      }),
    onSuccess: () =>
      queryClient.invalidateQueries([QueryKeys.PRODUCTS], {
        exact: false,
        refetchInactive: true,
      }),
  });
