import { graphql } from 'msw';
import { mockProducts, mockCart } from './mockData';
import { ProductsType } from '../graphql/products';

const getNotFoundError = (
  id: string,
  message = '존재하지 않는 상품입니다.'
) => {
  return {
    message,
    extensions: {
      code: 'NOT_FOUND',
      metadata: {
        id,
      },
    },
  };
};

const getGoneError = (id: string, message = '존재하지 않는 상품입니다.') => {
  return {
    message,
    extensions: {
      code: 'GONE',
      metadata: {
        id,
      },
    },
  };
};

export const handlers = [
  // product
  graphql.query(
    'GET_PRODUCTS',
    (
      { variables: { count = 15, cursor, page, isShownDeleted = false } },
      res,
      ctx
    ) => {
      const [existentProducts, deletedProducts] = mockProducts.reduce<
        ProductsType[]
      >(
        (result, current) => {
          result = current.createdAt
            ? [[...result[0], current], result[1]]
            : [result[0], [...result[1], current]];
          return result;
        },
        [[], []]
      );
      const filteredProducts = isShownDeleted
        ? [...existentProducts, ...deletedProducts]
        : existentProducts;
      let startIndex = 0;
      let responseData;

      if (cursor !== undefined) {
        // 무한 스크롤인 경우
        startIndex =
          filteredProducts.findIndex(product => product.id === cursor) + 1;
        responseData = {
          products: filteredProducts.slice(startIndex, startIndex + count),
        };
      }

      if (page) {
        // 페이지네이션인 경우
        startIndex = Math.ceil(filteredProducts.length / count) * (page - 1);
        responseData = {
          products: filteredProducts.slice(startIndex, startIndex + count),
          totalPage: Math.ceil(filteredProducts.length / count),
        };
      }

      if (!responseData)
        return res(
          ctx.status(400),
          ctx.errors([
            {
              message: '잘못된 요청입니다.',
              extensions: {
                code: 'BAD_REQUEST',
              },
            },
          ])
        );

      return res(ctx.data(responseData!));
    }
  ),
  graphql.query('GET_PRODUCT', ({ variables }, res, ctx) => {
    const product = mockProducts.find(product => product.id === variables.id);

    if (!product)
      return res(ctx.status(404), ctx.errors([getNotFoundError(variables.id)]));

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
      return res(ctx.status(404), ctx.errors([getNotFoundError(variables.id)]));

    const updatedProduct = {
      ...mockProducts[targetIndex],
      ...variables,
    };
    updatedProduct.createdAt = Date.now();
    mockProducts.splice(targetIndex, 1, updatedProduct);

    return res(ctx.data({ updateProduct: updatedProduct }));
  }),
  graphql.mutation('DELETE_PRODUCT', ({ variables }, res, ctx) => {
    const { id } = variables;
    const targetIndex = mockProducts.findIndex(product => product.id === id);

    if (targetIndex < 0)
      return res(ctx.status(410), ctx.errors([getGoneError(id)]));

    mockProducts[targetIndex].createdAt = null;
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
      return res(ctx.status(410), ctx.errors([getGoneError(productId)]));
    if (!targetProduct.createdAt)
      return res(
        ctx.status(404),
        ctx.errors([getNotFoundError(productId, '품절된 상품입니다.')])
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
      return res(
        ctx.status(410),
        ctx.errors([getGoneError(cartId, '장바구니에 없는 상품입니다.')])
      );
    if (!mockCart[targetIndex].product.createdAt)
      return res(
        ctx.status(404),
        ctx.errors([getNotFoundError(cartId, '품절된 상품입니다.')])
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

      if (targetCartIndex < 0)
        return res(
          ctx.status(410),
          ctx.errors([
            getGoneError(
              id,
              '결제 목록에 장바구니에 없는 상품이 포함되어 있습니다.'
            ),
          ])
        );
      if (!mockCart[targetCartIndex].product.createdAt)
        return res(
          ctx.status(404),
          ctx.errors([
            getNotFoundError(
              id,
              '결제 목록에 품절된 상품이 포함되어 있습니다.'
            ),
          ])
        );

      mockCart.splice(targetCartIndex, 1);
      return true;
    });

    return res(ctx.data({ executePay: deletedIds }));
  }),
];
