import { ProductType } from '../../graphql/products';

function ItemData({
  title,
  imageUrl,
  price,
}: Pick<ProductType, 'title' | 'imageUrl' | 'price'>) {
  return (
    <>
      <h3>{title}</h3>
      <img src={imageUrl} alt="" />
      <p>가격: {price}</p>
    </>
  );
}

export default ItemData;
