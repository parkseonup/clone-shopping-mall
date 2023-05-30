import request from 'graphql-request';
import { useMutation } from 'react-query';
import { API_URL, QueryKeys, queryClient } from '../common';
import { ADD_CART, DELETE_CART, UPDATE_CART } from '../../graphql/cart';

export const useAddCart = () =>
  useMutation({
    mutationFn: async (id: string) =>
      await request({
        url: API_URL,
        document: ADD_CART,
        variables: { productId: id },
      }),
  });

export const useUpdateCart = () =>
  useMutation({
    mutationFn: async ({ id, amount }: { id: string; amount: number }) =>
      await request({
        url: API_URL,
        document: UPDATE_CART,
        variables: { cartId: id, amount },
      }),
    onSuccess: () => queryClient.invalidateQueries([QueryKeys.CART]),
  });

export const useDeleteCart = () =>
  useMutation({
    mutationFn: async (id: string) =>
      await request({
        url: API_URL,
        document: DELETE_CART,
        variables: { cartId: id },
      }),
    onSuccess: () => queryClient.invalidateQueries([QueryKeys.CART]),
  });
