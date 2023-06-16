import { Link } from 'react-router-dom';
import { ProductsType } from '../../graphql/products';
import ProductCard from '../product/productCard';
import ButtonToAddCart from '../cart/buttons';

export function ProductList({ products }: { products: ProductsType }) {
  return (
    <ul>
      {products.map(({ id, title, imageUrl, price }) => (
        <li key={id}>
          <Link to={`/products/${id}`}>
            <ProductCard data={{ title, imageUrl, price }} />
          </Link>

          <ButtonToAddCart id={id} />
        </li>
      ))}
    </ul>
  );
}
