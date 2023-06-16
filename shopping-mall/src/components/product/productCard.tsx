import { ReactNode } from 'react';
import { ProductType } from '../../graphql/products';

export default function ProductCard({
  data: { title, imageUrl, description, price },
  controls,
}: {
  data: Partial<ProductType>;
  controls?: ReactNode;
}) {
  return (
    <>
      <h3>{title}</h3>
      <img src={imageUrl} alt="" />
      {description ? <p>{description}</p> : null}
      <p>가격: {price}</p>

      {controls}
    </>
  );
}
