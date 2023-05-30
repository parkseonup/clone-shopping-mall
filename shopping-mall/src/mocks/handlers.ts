import { graphql } from 'msw';
import { mockProducts, mockCart } from './mockData';

export const handlers = [
  // product
  graphql.query(
    'GET_PRODUCTS',
    ({ variables: { count = 15, cursor, page } }, res, ctx) => {
      let startIndex = 0;
      let responseData;

      if (cursor !== undefined) {
        // 무한 스크롤인 경우
        startIndex =
          mockProducts.findIndex(product => product.id === cursor) + 1;
        responseData = {
          products: mockProducts.slice(startIndex, startIndex + count),
        };
      }

      if (page) {
        // 페이지네이션인 경우
        startIndex = Math.ceil(mockProducts.length / count) * (page - 1);
        responseData = {
          products: mockProducts.slice(startIndex, startIndex + count),
          lastPageNumber: Math.ceil(mockProducts.length / count),
        };
      }

      if (!responseData) throw new Error('잘못된 접근입니다.');

      return res(ctx.data(responseData));
    }
  ),
  graphql.query('GET_PRODUCT', ({ variables }, res, ctx) => {
    const product = mockProducts.find(product => product.id === variables.id);

    if (!product) throw new Error(`상품(${variables.id})이 존재하지 않습니다.`);

    return res(ctx.data({ product }));
  }),
  graphql.mutation('ADD_PRODUCT', ({ variables }, res, ctx) => {
    const { title, imageUrl, description, price } = variables;
    const id = !mockProducts.at(-1) ? '1' : +mockProducts.at(-1)!.id + 1 + '';
    const newProduct = {
      id,
      title,
      imageUrl,
      description,
      price,
      createdAt: Date.now(),
    };

    mockProducts.push(newProduct);

    return res(ctx.data({ addProduct: newProduct }));
  }),
  graphql.mutation('UPDATE_PRODUCT', ({ variables }, res, ctx) => {
    const targetIndex = mockProducts.findIndex(
      product => product.id === variables.id
    );

    if (targetIndex < 0)
      throw new Error(`업데이트할 상품(${variables.id})이 존재하지 않습니다.`);

    const updatedProduct = {
      ...mockProducts[targetIndex],
      ...variables,
    };
    mockProducts.splice(targetIndex, 1, updatedProduct);

    return res(ctx.data({ updateProduct: updatedProduct }));
  }),
  graphql.mutation('DELETE_PRODUCT', ({ variables }, res, ctx) => {
    const { id } = variables;
    const targetIndex = mockProducts.findIndex(product => product.id === id);

    if (targetIndex < 0)
      throw new Error(`삭제할 상품(${id})이 존재하지 않습니다.`);

    mockProducts.splice(targetIndex, 1);

    return res(ctx.data({ deleteProduct: id }));
  }),

  // cart
  graphql.query('GET_CART', (req, res, ctx) => {
    return res(ctx.data({ cart: mockCart }));
  }),
  graphql.mutation('ADD_CART', ({ variables }, res, ctx) => {
    const { productId } = variables;
    const targetProduct = mockProducts.find(
      product => product.id === productId
    );

    if (!targetProduct)
      throw new Error(`상품(${productId}})이 존재하지 않습니다.`);
    if (!targetProduct.createdAt)
      throw new Error(
        `장바구니에 품절된 상품(${productId}})이 포함되어 있습니다.`
      );

    const targetCartIndex = mockCart.findIndex(
      cart => cart.product.id === targetProduct.id
    );
    let newCartItem = null;

    if (targetCartIndex > -1) {
      newCartItem = {
        ...mockCart[targetCartIndex],
        amount: mockCart[targetCartIndex].amount + 1,
      };
      mockCart.splice(targetCartIndex, 1, newCartItem);
    } else {
      const id = !mockCart.at(-1) ? '1' : +mockCart.at(-1)!.id + 1 + '';
      newCartItem = {
        id,
        amount: 1,
        product: targetProduct,
      };
      mockCart.push(newCartItem);
    }

    return res(ctx.data({ addCart: newCartItem }));
  }),
  graphql.mutation('UPDATE_CART', ({ variables }, res, ctx) => {
    const { cartId, amount } = variables;
    const targetIndex = mockCart.findIndex(cart => cart.id === cartId);

    if (targetIndex < 0)
      throw new Error(`장바구니에 상품(${cartId})이 존재하지 않습니다.`);
    if (!mockCart[targetIndex].product.createdAt)
      throw new Error(
        `장바구니에 품절된 상품(${cartId}})이 포함되어 있습니다.`
      );

    const newCartItem = {
      ...mockCart[targetIndex],
      amount,
    };

    mockCart.splice(targetIndex, 1, newCartItem);

    return res(ctx.data({ updateCart: newCartItem }));
  }),
  graphql.mutation('DELETE_CART', ({ variables }, res, ctx) => {
    const targetIndex = mockCart.findIndex(
      cart => cart.id === variables.cartId
    );

    mockCart.splice(targetIndex, 1);
    return res(ctx.data({ deleteCart: variables.cartId }));
  }),

  // payment
  graphql.mutation('EXECUTE_PAY', ({ variables }, res, ctx) => {
    const deletedIds = variables.ids.filter((id: string) => {
      const targetCartIndex = mockCart.findIndex(cart => cart.id === id);

      if (!mockCart[targetCartIndex].product.createdAt)
        throw new Error(`결제 목록에 품절된 상품(${id}})이 포함되어 있습니다.`);

      if (targetCartIndex < 0)
        throw new Error(`장바구니에 존재하지 않는 상품(${id}})입니다.`);

      mockCart.splice(targetCartIndex, 1);
      return true;
    });

    return res(ctx.data({ executePay: deletedIds }));
  }),
];
