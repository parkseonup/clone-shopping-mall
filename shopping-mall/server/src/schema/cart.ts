import { gql } from "graphql-tag";

const cartSchema = gql`
  type Cart {
    id: ID!
    title: String!
    imageUrl: String!
    price: Int!
    amount: Int!
  }

  extend type Query {
    cart: [Cart!]
  }

  extend type Mutation {
    addCart: Cart!
    updateCart: Cart!
    deleteCart: ID!
    excutePay: [ID!]
  }
`;

export default cartSchema;
