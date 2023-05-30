import request from 'graphql-request';
import { API_URL, QueryKeys, queryClient } from '../common';
import {
  ADD_PRODUCT,
  ProductType,
  UPDATE_PRODUCT,
  DELETE_PRODUCT,
  ProductOmitType,
} from '../../graphql/products';
import { useMutation } from '@tanstack/react-query';

export const useAddProduct = () =>
  useMutation({
    mutationFn: async (productInfo: ProductOmitType) =>
      await request({
        url: API_URL,
        document: ADD_PRODUCT,
        variables: { ...productInfo },
      }),
    onSuccess: () =>
      queryClient.invalidateQueries([QueryKeys.PRODUCTS], {
        exact: false,
        refetchType: 'all',
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
        refetchType: 'all',
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
        refetchType: 'all',
      }),
  });
