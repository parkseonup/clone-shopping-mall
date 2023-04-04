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
    cart {
      id
      title
      imageUrl
      price
      description
      createdAt
      amount
    }
  }
`;

export const ADD_CART = gql`
  mutation ADD_CART($id: string) {
    cart(id: $id) {
      id
      title
      imageUrl
      price
      description
      createdAt
      amount
    }
  }
`;

export const UPDATE_CART = gql`
  mutation UPDATE_CART($id: string, $amount: number) {
    cart(id: $id, amount: $amount) {
      id
      title
      imageUrl
      price
      description
      createdAt
      amount
    }
  }
`;

export const DELETE_CART = gql`
  mutation DELETE_CART($id: string) {
    id
  }
`;
