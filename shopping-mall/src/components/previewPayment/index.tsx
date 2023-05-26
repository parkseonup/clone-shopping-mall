import ItemData from '../itemData';
import { styled } from 'styled-components';
import { CartType } from '../../graphql/cart';

const PreviewWrapper = styled.div`
  margin: 10px;
  padding: 10px;
  border: 1px solid #000;
`;

function PreviewPayment({
  products,
  onClick,
  buttonText,
}: {
  products: CartType;
  onClick: () => void;
  buttonText: string;
}) {
  if (products.length < 1) return null;

  const totalAmount = products.reduce(
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
        {products.map(
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

      <button type="button" onClick={onClick}>
        {buttonText}
      </button>
    </PreviewWrapper>
  );
}

export default PreviewPayment;
