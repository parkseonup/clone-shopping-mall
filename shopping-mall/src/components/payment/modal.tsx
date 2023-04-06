import { ReactChild } from "react";
import { createPortal } from "react-dom";

const ModalPotal = ({ children }: { children: ReactChild }) => {
  return createPortal(children, document.getElementById("modal")!);
};

const PaymentModal = ({
  show,
  proceed,
  cancel,
}: {
  show: boolean;
  proceed: () => void;
  cancel: () => void;
}) => {
  return (
    <ModalPotal>
      <div className={`modal ${show ? "show" : ""}`}>
        <div className="modal__inner">
          <p>정말 결제하시겠습니까?</p>
          <div>
            <button type="button" onClick={proceed}>
              예
            </button>
            <button type="button" onClick={cancel}>
              아니오
            </button>
          </div>
        </div>
      </div>
    </ModalPotal>
  );
};

export default PaymentModal;
