import { graphql } from "msw";
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

export const handlers = [
  // 전체 Product 목록 요청
  graphql.query(GET_PRODUCTS, (req, res, ctx) => {
    return res(
      ctx.data({
        products: mockProducts,
      })
    );
  }),
  // id를 전달해서 일치하는 Product Item data 요청
  graphql.query(GET_PRODUCT, (req, res, ctx) => {
    const foundProduct = mockProducts.find(
      (product) => product.id === req.variables.id
    );

    if (!foundProduct) return res();

    return res(ctx.data(foundProduct));
  }),
];
