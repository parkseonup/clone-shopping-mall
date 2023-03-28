import gql from "graphql-tag";

export type CartType = {
  id: string;
  title: string;
  imageUrl: string;
  price: number;
  description: string;
  createdAt: string;
  amount: number;
};

export const GET_CART = gql`
  query GET_CART {
    id
    title
    imageUrl
    price
    description
    createdAt
    amount
  }
`;

export const ADD_CART = gql`
  mutation ADD_CART($id: string) {
    id
    title
    imageUrl
    price
    description
    createdAt
    amount
  }
`;
