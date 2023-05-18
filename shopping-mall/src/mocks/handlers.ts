import { graphql } from 'msw';
import { mockProducts, mockCart } from './mockData';

export const handlers = [
  // product
  graphql.query('GET_PRODUCTS', (req, res, ctx) => {
    return res(ctx.data({ products: mockProducts }));
  }),
  graphql.query('GET_PRODUCT', ({ variables }, res, ctx) => {
    const product = mockProducts.find(product => product.id === variables.id);

    if (!product) throw new Error(`상품(${variables.id})이 존재하지 않습니다.`);

    return res(ctx.data({ product }));
  }),
  graphql.query('ADD_PRODUCT', ({ variables }, res, ctx) => {
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

    return res(ctx.data({ updateProduct: updatedProduct }));
  }),
  graphql.query('DELETE_PRODUCT', ({ variables }, res, ctx) => {
    const targetIndex = mockProducts.findIndex(
      product => product.id === variables.id
    );

    if (targetIndex < 0)
      throw new Error(`삭제할 상품(${variables.id})이 존재하지 않습니다.`);

    mockProducts.splice(targetIndex, 1);

    return res(ctx.data({ deleteProduct: variables.id }));
  }),

  // cart
  graphql.query('GET_CART', (req, res, ctx) => {
    return res(ctx.data({ cart: mockCart }));
  }),
  graphql.query('ADD_CART', ({ variables }, res, ctx) => {
    const targetProduct = mockProducts.find(
      product => product.id === variables.productId
    );

    if (!targetProduct)
      throw new Error(`상품(${variables.productId}})이 존재하지 않습니다.`);
    if (!targetProduct.createdAt)
      throw new Error(
        `장바구니에 품절된 상품(${variables.productId}})이 포함되어 있습니다.`
      );

    const targetCart = mockCart.find(cart => cart.product === targetProduct);
    let newCartItem = null;

    if (targetCart) {
      newCartItem = {
        ...targetCart,
        amount: targetCart.amount + 1,
      };
    } else {
      const id = !mockCart.at(-1) ? '1' : +mockCart.at(-1)!.id + 1 + '';
      newCartItem = {
        id,
        amount: 1,
        product: targetProduct,
      };
    }

    mockCart.push(newCartItem);

    return res(ctx.data({ addCart: newCartItem }));
  }),
  graphql.query('UPDATE_CART', ({ variables }, res, ctx) => {
    const { cartId, amount } = variables;
    const targetIndex = mockCart.findIndex(cart => cart.id === cartId);

    if (targetIndex < 0)
      throw new Error(
        `장바구니에 상품(${variables.cartId}})이 존재하지 않습니다.`
      );
    if (!mockCart[targetIndex].product.createdAt)
      throw new Error(
        `장바구니에 품절된 상품(${cartId}})이 포함되어 있습니다.`
      );

    const newCartItem = {
      ...mockCart[targetIndex],
      amount,
    };

    mockCart[targetIndex] = newCartItem;

    return res(ctx.data({ updateCart: newCartItem }));
  }),
  graphql.query('DELETE_CART', ({ variables }, res, ctx) => {
    const targetIndex = mockCart.findIndex(
      cart => cart.id === variables.cartId
    );

    mockCart.splice(targetIndex, 1);
    return res(ctx.data({ deleteCart: variables.cartId }));
  }),

  // payment
  graphql.query('EXECUTE_PAY', ({ variables }, res, ctx) => {
    const { ids } = variables; // cartId[]

    const deletedIds = ids.filter((id: string) => {
      const targetCartIndex = mockCart.findIndex(cart => cart.id === id);

      if (!mockCart[targetCartIndex].product.createdAt)
        throw new Error(
          `결제 목록에 품절된 상품(${variables.id}})이 포함되어 있습니다.`
        );

      mockCart.splice(targetCartIndex, 1);
      return true;
    });

    return res(ctx.data({ executePay: deletedIds }));
  }),
];
