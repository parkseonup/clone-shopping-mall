import request from 'graphql-request';

const BASE_URL = import.meta.env.BASE_URL;

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
