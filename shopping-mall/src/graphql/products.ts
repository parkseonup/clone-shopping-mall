import { gql } from 'graphql-tag';

export type ProductType = {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  price: number;
  createdAt: number | null;
};

export type ProductsType = ProductType[];

export const GET_PRODUCTS = gql`
  query GET_PRODUCTS($cursor: ID!) {
    products(cursor: $cursor) {
      id
      title
      imageUrl
      description
      price
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
      description
      price
      createdAt
    }
  }
`;

export const ADD_PRODUCT = gql`
  mutation ADD_PRODUCT($id: ID!) {
    addProduct(id: $id) {
      id
      title
      imageUrl
      description
      price
      createdAt
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UPDATE_PRODUCT(
    $id: ID!
    $title: String
    $imageUrl: String
    $description: String
    $price: Int
  ) {
    updateProduct(
      id: $id
      title: $title
      imageUrl: $imageUrl
      description: $description
      price: $price
    ) {
      id
      title
      imageUrl
      description
      price
      createdAt
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DELETE_PRODUCT($id: ID!) {
    deleteProduct(id: $id)
  }
`;
