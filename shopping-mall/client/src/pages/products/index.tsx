import { useQuery } from "@tanstack/react-query";
import { graphqlFetcher, QueryKeys } from "../../queryClient";
import { GET_PRODUCTS, ProductsType } from "../../graphql/products";
import ProductList from "../../components/product/list";

const ProductListPage = () => {
  const { data } = useQuery<ProductsType>([QueryKeys.PRODUCTS], () =>
    graphqlFetcher(GET_PRODUCTS)
  );

  if (!data) return <p>상품이 없습니다.</p>;

  return (
    <div>
      <h2>상품목록</h2>
      <ProductList list={data?.products || []} />
    </div>
  );
};

export default ProductListPage;
