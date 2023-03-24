import { useQuery } from "@tanstack/react-query";
import ProductItem from "../../components/product/item";
import { graphqlFetcher, QueryKeys } from "../../queryClient";
import { GET_PRODUCTS, ProductsType } from "../../graphql/products";

// TODO: msw가 연결되기 전에 왜 컴포넌트 마운트가 일어나는지, 또 msw가 연결되고 난 뒤 어떻게 리마운트가 발생되는지 알아볼 것
const ProductList = () => {
  const { data } = useQuery<Promise<unknown>, Error, ProductsType>(
    [QueryKeys.PRODUCTS],
    () => graphqlFetcher(GET_PRODUCTS)
  );

  if (!data) return <p>상품이 없습니다.</p>;

  return (
    <div>
      <h2>상품목록</h2>
      <ul className="products">
        {data?.products?.map((product) => (
          <ProductItem {...product} key={product.id} />
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
