import { gql } from "graphql-tag";

export type ProductType = {
  id: string;
  title: string;
  imageUrl: string;
  price: number;
  description: string;
  createdAt: string;
};

export type ProductsType = {
  products: ProductType[];
};

export const GET_PRODUCTS = gql`
  query GET_PRODUCTS($cursor: ID) {
    products(cursor: $cursor) {
      id
      title
      imageUrl
      price
      description
      createdAt
    }
  }
`;

export const GET_PRODUCT = gql`
  query GET_PRODUCT($id: ID!) {
    product(id: $id) {
      id
      title
      imageUrl
      price
      description
      createdAt
    }
  }
`;
