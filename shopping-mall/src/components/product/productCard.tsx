import { ReactNode } from 'react';
import { ProductType } from '../../graphql/products';

export default function ProductCard({
  data: { title, imageUrl, description, price, createdAt, amount },
  controls,
}: {
  data: Partial<ProductType> & { amount?: number };
  controls?: ReactNode;
}) {
  return (
    <>
      <h3>{title}</h3>
      <img src={imageUrl} alt="" />
      {description ? <p>{description}</p> : null}
      <p>가격: {price}</p>
      {amount ? <p>개수: {amount}</p> : null}
      {!createdAt ? <strong>품절된 상품입니다.</strong> : null}

      {controls}
    </>
  );
}
