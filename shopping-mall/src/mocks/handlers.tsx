import { graphql } from "msw";
import {
  ADD_CART,
  CartType,
  DELETE_CART,
  GET_CART,
  UPDATE_CART,
} from "../graphql/cart";
import { GET_PRODUCT, GET_PRODUCTS } from "../graphql/products";

const mockProducts = (() =>
  Array.from({ length: 20 }).map((_, i) => ({
    id: i + 1 + "",
    title: `임시제목${i + 1}`,
    imageUrl: `https://placeimg.com/200/150/nature/${i + 1}`,
    price: 50000,
    description: `임시설명${i + 1}`,
    createdAt: new Date(1661646735501883 + i * 1000 * 60 * 60 * 24).toString(),
  })))();

let cartData: { [key: string]: CartType } = {};

export const handlers = [
  // GET: 전체 Product 목록 요청
  graphql.query(GET_PRODUCTS, (req, res, ctx) => {
    return res(
      ctx.data({
        products: mockProducts,
      })
    );
  }),
  // GET: id를 전달해서 일치하는 Product Item data 요청
  graphql.query(GET_PRODUCT, (req, res, ctx) => {
    const targetProduct = mockProducts.find(
      (product) => product.id === req.variables.id
    );

    if (!targetProduct) return res();

    return res(ctx.data(targetProduct));
  }),
  // GET: cart 전체 목록 요청
  graphql.query(GET_CART, (req, res, ctx) => {
    return res(ctx.data(cartData));
  }),
  // POST | PATCH: cart 추가 => 추가된 newItem
  graphql.mutation(ADD_CART, (req, res, ctx) => {
    const { id } = req.variables;
    const newCartData = { ...cartData };
    const targetProduct = mockProducts.find((product) => product.id === id);

    if (!targetProduct) throw new Error("없는 데이터입니다.");

    const newItem = {
      ...targetProduct,
      amount: (newCartData[id]?.amount || 0) + 1,
    };
    newCartData[id] = newItem;
    cartData = newCartData;

    return res(ctx.data(newItem));
  }),
  // PATCH: cart 개수 변경 (id, amount) => newItem
  graphql.mutation(UPDATE_CART, (req, res, ctx) => {
    const { id, amount } = req.variables;
    const newCartData = { ...cartData };
    const newItem = {
      ...newCartData[id],
      amount,
    };

    newCartData[id] = newItem;
    cartData = newCartData;

    return res(ctx.data(newItem));
  }),
  // DELETE: cart 삭제 (id) => id
  graphql.mutation(DELETE_CART, (req, res, ctx) => {
    const { id } = req.variables;
    const newCartData = { ...cartData };
    delete newCartData[id];
    cartData = newCartData;
    return res(ctx.data(id));
  }),
];
