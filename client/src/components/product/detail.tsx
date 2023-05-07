import { ProductType } from "../../graphql/products";

const ProductDetail = ({
  item: { title, imageUrl, price, description },
}: {
  item: ProductType;
}) => {
  return (
    <div className="product-detail">
      <h3 className="product-detail__title">{title}</h3>
      <img src={imageUrl} className="product-detail__images" alt="" />
      <p className="product-detail__description">{description}</p>
      <p className="product-detail__price">{price}</p>
    </div>
  );
};

export default ProductDetail;
