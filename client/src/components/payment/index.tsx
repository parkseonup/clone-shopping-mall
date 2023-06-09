import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { EXCUTE_PAY } from "../../graphql/payment";
import { graphqlFetcher } from "../../queryClient";
import { checkedCartState } from "../../recoils/cart";
import WillPay from "../willPay";
import PaymentModal from "./modal";

type PaymentInfos = string[];

const Payment = () => {
  const navigate = useNavigate();
  const [checkedCartData, setCheckedCartData] = useRecoilState(checkedCartState);
  const [modalShow, toggleModal] = useState(false);

  // TODO: 품절 상품이 포함되어 있을 때 결제가 진행되지 않고 장바구니 페이지로 다시 돌리는 로직 구현
  const { mutate: executePay } = useMutation((ids: PaymentInfos) =>
    graphqlFetcher(EXCUTE_PAY, { ids })
  );

  const showModal = () => {
    toggleModal(true);
  };

  const proceed = () => {
    // 결제 진행
    const ids = checkedCartData.map(({ id }) => id);
    executePay(ids, {
      onSuccess: () => {
        // checkedCartState 비우기
        setCheckedCartData([]);

        alert("결제가 완료되었습니다.");

        // products 페이지로 이동
        navigate("/products", { replace: true });
      },
    });
  };

  const cancel = () => {
    toggleModal(false);
  };

  return (
    <div>
      <WillPay submitTitle="결제하기" handleSubmit={showModal} />
      <PaymentModal show={modalShow} proceed={proceed} cancel={cancel} />
    </div>
  );
};

export default Payment;
