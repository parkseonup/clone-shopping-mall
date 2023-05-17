import { graphql } from 'msw';
import { mockProducts } from './mockData';

export const handlers = [
  // product
  graphql.query('GET_PRODUCTS', (req, res, ctx) => {
    return res(ctx.data(mockProducts));
  }),
  graphql.query('GET_PRODUCT', ({ variables }, res, ctx) => {
    const product = mockProducts.find(product => product.id === variables.id);

    if (!product) throw new Error(`상품(${variables.id})이 존재하지 않습니다.`);

    return res(ctx.data(product));
  }),
  graphql.query('ADD_PRODUCT', ({ variables }, res, ctx) => {
    const { title, imageUrl, description, price } = variables;
    const id = +mockProducts.at(-1)!.id + 1 + '';
    const newProduct = {
      id,
      title,
      imageUrl,
      description,
      price,
      createdAt: Date.now(),
    };

    mockProducts.push(newProduct);

    return res(ctx.data(newProduct));
  }),
  graphql.query('UPDATE_PRODUCT', ({ variables }, res, ctx) => {
    const targetProduct = mockProducts.find(
      product => product.id === variables.id
    );

    if (!targetProduct)
      throw new Error(`업데이트할 상품(${variables.id})이 존재하지 않습니다.`);

    const updatedProduct = {
      ...targetProduct,
      ...variables,
    };

    return res(ctx.data(updatedProduct));
  }),
  graphql.query('DELETE_PRODUCT', ({ variables }, res, ctx) => {
    const targetIndex = mockProducts.findIndex(
      product => product.id === variables.id
    );

    if (targetIndex < 0)
      throw new Error(`삭제할 상품(${variables.id})이 존재하지 않습니다.`);

    mockProducts.splice(targetIndex, 1);

    return res(ctx.data(variables.id));
  }),

  // cart
  graphql.query('GET_CART', (req, res, ctx) => {
    // return res(ctx.data("..."));
  }),
  graphql.query('ADD_CART', (req, res, ctx) => {
    // return res(ctx.data("..."));
  }),
  graphql.query('UPDATE_CART', (req, res, ctx) => {
    // return res(ctx.data("..."));
  }),
  graphql.query('DELETE_CART', (req, res, ctx) => {
    // return res(ctx.data("..."));
  }),

  // payment
  graphql.query('EXECUTE_PAY', (req, res, ctx) => {
    // return res(ctx.data("..."));
  }),
];
