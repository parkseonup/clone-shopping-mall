import { graphql } from 'msw';

export const handlers = [
  // product
  graphql.query('GET_PRODUCTS', (req, res, ctx) => {
    // return res(ctx.data("..."));
  }),
  graphql.query('GET_PRODUCT', (req, res, ctx) => {
    // return res(ctx.data("..."));
  }),
  graphql.query('ADD_PRODUCT', (req, res, ctx) => {
    // return res(ctx.data("..."));
  }),
  graphql.query('UPDATE_PRODUCT', (req, res, ctx) => {
    // return res(ctx.data("..."));
  }),
  graphql.query('DELETE_PRODUCT', (req, res, ctx) => {
    // return res(ctx.data("..."));
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
