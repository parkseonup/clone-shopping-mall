import { SyntheticEvent } from "react";
import { useRecoilValue } from "recoil";
import { checkedCartState } from "../../recoils/cart";
import ItemData from "../cart/itemData";

const WillPay = ({
  submitTitle,
  handleSubmit,
}: {
  submitTitle: string;
  handleSubmit: (e: SyntheticEvent) => void;
}) => {
  const checkedItems = useRecoilValue(checkedCartState);
  const totalPrice = checkedItems.reduce((res, { price, amount }) => {
    res += price * amount;
    return res;
  }, 0);

  return (
    <div className="cart-willpay">
      <ul>
        {checkedItems.map(({ id, title, imageUrl, price, amount }) => (
          <li key={id}>
            <ItemData title={title} imageUrl={imageUrl} price={price} />
            <p>수량: {amount}</p>
            <p>금액: {price}</p>
          </li>
        ))}
      </ul>
      <p>총 예상 결제 금액: {totalPrice}</p>
      <button onClick={handleSubmit}>{submitTitle}</button>
    </div>
  );
};

export default WillPay;
