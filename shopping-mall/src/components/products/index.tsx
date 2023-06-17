import { Link } from 'react-router-dom';
import { ProductsType } from '../../graphql/products';
import ProductCard from '../product/productCard';
import { ButtonToAddCart } from '../cart/actions';

export function ProductList({ products }: { products: ProductsType }) {
  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          <Link to={`/products/${product.id}`}>
            <ProductCard data={product} />
          </Link>

          <ButtonToAddCart id={product.id} />
        </li>
      ))}
    </ul>
  );
}
