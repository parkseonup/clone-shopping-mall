import AdminList from '../components/admin';
import ProductForm from '../components/admin/productForm';
import ErrorBoundaryWrapper from '../components/common/errorBoundaryWrapper';
import ErrorFallback from '../components/common/errorFallback';
import { ProductOmitType } from '../graphql/products';
import { useAddProduct } from '../servies/mutations/products';

export default function AdminPage() {
  const { mutate: addProduct } = useAddProduct();

  const onSubmitAddedProduct = (formData: ProductOmitType) => {
    addProduct(formData);
  };

  return (
    <>
      <h2>관리자 페이지</h2>

      <div>
        <ErrorBoundaryWrapper fallbackComponent={ErrorFallback}>
          <ProductForm onSubmit={onSubmitAddedProduct} />
          <AdminList />
        </ErrorBoundaryWrapper>
      </div>
    </>
  );
}
