import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import ProductDetail from "../../components/product/detail";
import { graphqlFetcher, QueryKeys } from "../../queryClient";
import { ProductType, GET_PRODUCT } from "../../graphql/products";

const ProductDetailPage = () => {
  const { id } = useParams();
  const { data } = useQuery<{ product: ProductType }>(
    [QueryKeys.PRODUCTS, id],
    () => graphqlFetcher(GET_PRODUCT, { id })
  );

  if (!data) return null;

  return (
    <div>
      <h2>상세페이지</h2>
      <ProductDetail item={data.product} />
    </div>
  );
};

export default ProductDetailPage;
