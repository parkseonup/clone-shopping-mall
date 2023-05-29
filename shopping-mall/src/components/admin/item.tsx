import { ProductType } from '../../graphql/products';
import ItemData from '../common/itemData';
import ProductForm from './productForm';

export default function AdminItem({
  product: { id, title, imageUrl, description, price },
  editingId,
  onEditMode,
  offEditMode,
  onSubmitEdit,
}: {
  product: ProductType;
  editingId: string;
  onEditMode: () => void;
  offEditMode: () => void;
  onSubmitEdit: (formData: Omit<ProductType, 'id' | 'createdAt'>) => void;
}) {
  if (id === editingId)
    return (
      <li>
        <ProductForm
          onCancel={offEditMode}
          onSubmit={onSubmitEdit}
          title={title}
          imageUrl={imageUrl}
          price={price}
          description={description}
        />
      </li>
    );

  return (
    <li>
      <ItemData title={title} imageUrl={imageUrl} price={price} />
      <p>{description}</p>

      <button type="button" onClick={onEditMode}>
        수정
      </button>
      <button type="button">삭제</button>
    </li>
  );
}
