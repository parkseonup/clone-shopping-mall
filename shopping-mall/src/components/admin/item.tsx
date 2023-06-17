import { ProductOmitType, ProductType } from '../../graphql/products';
import { useUpdateProduct } from '../../servies/mutations/products';
import { DeleteProductButton } from '../product/buttons';
import ProductCard from '../product/productCard';
import ProductForm from './productForm';

export default function AdminItem({
  product,
  editingId,
  changeEditingId,
}: {
  product: ProductType;
  editingId: string;
  changeEditingId: (id: string) => void;
}) {
  const { mutate: updateProduct } = useUpdateProduct();

  const handleActiveEditMode = (id: string) => () => {
    changeEditingId(id);
  };

  const handleInactiveEditMode = () => {
    changeEditingId('');
  };

  const handleSubmitEdit = (id: string) => (formData: ProductOmitType) => {
    updateProduct({
      id,
      ...formData,
    });
    changeEditingId('');
  };

  return (
    <li>
      {product.id === editingId ? (
        <ProductForm
          data={product}
          onReset={handleInactiveEditMode}
          onSubmit={handleSubmitEdit(product.id)}
        />
      ) : (
        <ProductCard
          data={product}
          controls={
            <>
              <button type="button" onClick={handleActiveEditMode(product.id)}>
                수정
              </button>
              {product.createdAt ? (
                <DeleteProductButton id={product.id} />
              ) : (
                <strong>삭제된 상품입니다.</strong>
              )}
            </>
          }
        />
      )}
    </li>
  );
}
