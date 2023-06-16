import { useDeleteProduct } from '../../servies/mutations/products';

export function DeleteProductButton({ id }: { id: string }) {
  const { mutate: deleteProduct } = useDeleteProduct();

  const handleDeleteProduct = (id: string) => () => {
    deleteProduct(id);
  };

  return (
    <button type="button" onClick={handleDeleteProduct(id)}>
      삭제
    </button>
  );
}
