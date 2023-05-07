import ProductItem from "../../components/product/item";
import { ProductType } from "../../graphql/products";

const ProductList = ({
  list,
}: {
  list: {
    products: ProductType[];
  }[];
}) => (
  <ul className="products">
    {list.map((page) =>
      page.products.map((product) => (
        <ProductItem {...product} key={product.id} />
      ))
    )}
  </ul>
);

export default ProductList;
