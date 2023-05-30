import request from 'graphql-request';
import { useMutation } from 'react-query';
import { API_URL } from '../common';
import { EXECUTE_PAY } from '../../graphql/payment';

export const useDeletePaidCart = (onSuccess: (...args: any) => void) =>
  useMutation({
    mutationFn: async (ids: string[]) =>
      await request({
        url: API_URL,
        document: EXECUTE_PAY,
        variables: { ids },
      }),
    onSuccess,
  });
