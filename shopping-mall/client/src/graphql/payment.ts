import gql from "graphql-tag";

export const EXCUTE_PAY = gql`
  mutation EXCUTE_PAY($ids: [ID!]) {
    executePay(ids: $ids)
  }
`;
