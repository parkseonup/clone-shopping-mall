import AdminList from '../components/admin';
import ProductForm from '../components/admin/productForm';
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
        <ProductForm onSubmit={onSubmitAddedProduct} />
        <AdminList />
      </div>
    </>
  );
}
