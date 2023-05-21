import { gql } from 'graphql-tag';
import { ProductType } from './products';

export type CartItemType = {
  id: string;
  amount: number;
  product: ProductType;
};

export type CartType = CartItemType[];

export const GET_CART = gql`
  query GET_CART {
    cart {
      id
      amount
      product {
        id
        title
        imageUrl
        description
        price
        createdAt
      }
    }
  }
`;

export const ADD_CART = gql`
  mutation ADD_CART($productId: ID!) {
    addCart(productId: $productId) {
      id
      amount
      product {
        id
        title
        imageUrl
        description
        price
        createdAt
      }
    }
  }
`;

export const UPDATE_CART = gql`
  mutation UPDATE_CART($cartId: ID!, $amount: Int!) {
    updateCart(cartId: $cartId, amount: $amount) {
      id
      amount
      product {
        id
        title
        imageUrl
        description
        price
        createdAt
      }
    }
  }
`;

export const DELETE_CART = gql`
  mutation DELETE_CART($id: ID!) {
    deleteCart(id: $id)
  }
`;
