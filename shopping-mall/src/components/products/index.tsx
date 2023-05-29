import { ProductsType } from '../../graphql/products';
import ProductItem from './item';

export function ProductList({ products }: { products: ProductsType }) {
  return (
    <ul>
      {products.map(product => (
        <ProductItem {...product} key={product.id} />
      ))}
    </ul>
  );
}
