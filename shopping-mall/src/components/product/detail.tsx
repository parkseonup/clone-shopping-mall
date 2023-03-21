import { Product } from "../../types";

const ProductDetail = ({
  item: { title, images, category, description, price },
}: {
  item: Product;
}) => (
  <div className="product-detail">
    <h3 className="product-detail__title">{title}</h3>
    <div className="product-detail__images">
      {images.map((image) => (
        <img src={image} key={image} alt="" />
      ))}
    </div>
    <p className="product-detail__category">{category.name}</p>
    <p className="product-detail__description">{description}</p>
    <p className="product-detail__price">{price}</p>
  </div>
);

export default ProductDetail;
