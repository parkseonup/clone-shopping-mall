import { graphql } from "msw";
import { ADD_CART, CartType, GET_CART } from "../graphql/cart";
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
    const foundProduct = mockProducts.find(
      (product) => product.id === req.variables.id
    );

    if (!foundProduct) return res();

    return res(ctx.data(foundProduct));
  }),
  // GET: cart 목록 요청
  graphql.query(GET_CART, (req, res, ctx) => {
    return res(ctx.data(cartData));
  }),
  // POST | PATCH: cart 추가
  graphql.mutation(ADD_CART, (req, res, ctx) => {
    let newData = { ...cartData };
    const id = req.variables.id;

    if (newData[id]) {
      // newData가 있으면 amount + 1
      newData[id] = {
        ...newData[id],
        amount: (newData[id].amount || 0) + 1,
      };
    } else {
      // 없으면 id를 key로 하고 mockProducts에서 찾아서 생성
      const foundProduct = mockProducts.find((product) => product.id === id);

      newData = {
        ...newData,
        [id]: {
          ...foundProduct,
          amount: 1,
        },
      };
    }

    cartData = newData;
    return res(ctx.data(cartData));
  }),
];
