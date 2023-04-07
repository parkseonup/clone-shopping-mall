import gql from "graphql-tag";

export const EXCUTE_PAY = gql`
  type PayInfo {
    id: String!
    amount: Int!
  }

  mutation EXCUTE_PAY($info: [PayInfo]) {
    payInfo(info: $info) {
      id
    }
  }
`;
