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
  query GET_PRODUCTS {
    id
    title
    imageUrl
    price
    description
    createdAt
  }
`;

export const GET_PRODUCT = gql`
  query GET_PRODUCT($id: string) {
    id
    title
    imageUrl
    price
    description
    createdAt
  }
`;
