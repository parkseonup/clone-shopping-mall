import { ProductType } from '../../types';

function ProductDetail({ title, imageUrl, description, price }: ProductType) {
  return (
    <div>
      <h3>{title}</h3>
      <img src={imageUrl} alt="" />
      <p>{description}</p>
      <p>가격: {price}</p>

      <button type="button">장바구니 담기</button>
    </div>
  );
}

export default ProductDetail;
