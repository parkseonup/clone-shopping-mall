import { gql } from "graphql-tag";

const productSchema = gql`
  type Product {
    id: ID!
    title: String!
    imageUrl: String!
    price: Int!
    description: String!
    createdAt: String!
  }

  extend type Query {
    products: [Product!]
    product(id: ID!): Product!
  }
`;

export default productSchema;
