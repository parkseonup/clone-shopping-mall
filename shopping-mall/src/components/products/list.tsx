import { ProductsType } from '../../types';
import ProductItem from './item';

function ProductList({ list }: { list: ProductsType }) {
  return (
    <ul>
      {list.map(item => (
        <ProductItem {...item} key={item.id} />
      ))}
    </ul>
  );
}

export default ProductList;
