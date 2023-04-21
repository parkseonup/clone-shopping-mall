import gql from "graphql-tag";
import { ProductType } from "./products";

export type CartType = {
  id: string;
  amount: number;
  product: ProductType;
};

export const GET_CART = gql`
  query GET_CART {
    cart {
      id
      amount
      product {
        id
        title
        imageUrl
        price
        description
        createdAt
      }
    }
  }
`;

export const ADD_CART = gql`
  mutation ADD_CART($id: ID!) {
    addCart(id: $id) {
      id
      amount
      product {
        id
        title
        imageUrl
        price
        description
        createdAt
      }
    }
  }
`;

export const UPDATE_CART = gql`
  mutation UPDATE_CART($id: ID!, $amount: Int!) {
    updateCart(id: $id, amount: $amount) {
      id
      amount
      product {
        id
        title
        imageUrl
        price
        description
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
