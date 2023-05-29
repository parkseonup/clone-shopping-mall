import { useMutation } from 'react-query';
import AdminList from '../components/admin';
import ProductForm from '../components/admin/productForm';
import { QueryKeys, fetchData, queryClient } from '../fetcher';
import { ADD_PRODUCT, ProductType } from '../graphql/products';

export default function AdminPage() {
  const { mutate: addProduct } = useMutation(
    (addedInfo: Omit<ProductType, 'id' | 'createdAt'>) =>
      fetchData(ADD_PRODUCT, addedInfo),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([QueryKeys.PRODUCTS], {
          exact: false,
          refetchInactive: true,
        });
      },
    }
  );

  const onSubmitAddedProduct = (
    formData: Omit<ProductType, 'id' | 'createdAt'>
  ) => {
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
