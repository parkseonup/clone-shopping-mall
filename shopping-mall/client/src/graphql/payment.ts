import gql from "graphql-tag";

export const EXCUTE_PAY = gql`
  mutation EXCUTE_PAY($info: [String!]) {
    payInfo(info: $info) {
      id
    }
  }
`;
