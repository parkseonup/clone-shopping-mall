import { useContext } from 'react';
import { ProductsToPayContext } from '../../context/productsToPay';
import ItemData from '../itemData';
import { styled } from 'styled-components';

export default function PreviewPayment({
  onClick,
  buttonText,
}: {
  onClick: (ids?: string[]) => void;
  buttonText: string;
}) {
  const paymentList = useContext(ProductsToPayContext);

  if (!paymentList) throw new Error('Cannot find ProductsToPayContext');
  if (paymentList.length < 1) return null;

  const ids = paymentList.map(paymentItem => paymentItem.id);

  const totalAmount = paymentList.reduce(
    (result, { amount, product: { price, createdAt } }) => {
      if (createdAt) result += amount * price;
      return result;
    },
    0
  );

  return (
    <PreviewWrapper>
      <h3>결제 목록</h3>
      <ul>
        {paymentList.map(
          ({ id, amount, product: { title, imageUrl, price, createdAt } }) => (
            <li key={id}>
              <ItemData title={title} imageUrl={imageUrl} price={price} />

              {createdAt ? (
                <>
                  <p>개수: {amount}</p>
                  <p>금액: {amount * price}원</p>
                </>
              ) : (
                <strong>품절된 상품입니다.</strong>
              )}
            </li>
          )
        )}
      </ul>

      <p>총 금액: {totalAmount}원</p>

      <button type="button" onClick={() => onClick(ids)}>
        {buttonText}
      </button>
    </PreviewWrapper>
  );
}

const PreviewWrapper = styled.div`
  margin: 10px;
  padding: 10px;
  border: 1px solid #000;
`;
