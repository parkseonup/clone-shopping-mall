import { gql } from "graphql-tag";

const productSchema = gql`
  type Product {
    id: ID!
    title: String!
    imageUrl: String!
    price: Int!
    description: String!
    createdAt: Float
  }

  extend type Query {
    products(cursor: ID, showDeleted: Boolean): [Product!]
    product(id: ID!): Product!
  }

  extend type Mutation {
    addProduct(
      title: String!
      imageUrl: String!
      price: Int!
      description: String!
    ): Product!
    updateProduct(
      id: ID!
      title: String
      imageUrl: String
      price: Int
      description: String
    ): Product!
    deleteProduct(id: ID!): ID!
  }
`;

export default productSchema;
