import { SyntheticEvent } from 'react';
import { ProductType } from '../../graphql/products';
import arrayToObject from '../../utils/arrayToObject';

function ProductForm({
  title = '',
  imageUrl = '',
  price = 0,
  description = '',
  onSubmit,
  onCancel,
}: Partial<ProductType> & {
  onSubmit: (formData: Omit<ProductType, 'id' | 'createdAt'>) => void;
  onCancel?: () => void;
}) {
  const onSubmitForm = (e: SyntheticEvent) => {
    e.preventDefault();

    const formData = arrayToObject([
      ...new FormData(e.target as HTMLFormElement),
    ]);

    formData['price'] = +formData['price'];

    onSubmit(formData);
  };

  return (
    <form onSubmit={onSubmitForm}>
      <label>
        상품명: <input type="text" name="title" defaultValue={title} required />
      </label>
      <label>
        이미지Url:{' '}
        <input type="text" name="imageUrl" defaultValue={imageUrl} required />
      </label>
      <label>
        가격:{' '}
        <input
          type="number"
          name="price"
          min="1000"
          defaultValue={price}
          required
        />
      </label>
      <label>
        설명:{' '}
        <textarea name="description" defaultValue={description}></textarea>
      </label>

      <button type="submit">등록</button>
      <button type="reset" onClick={onCancel}>
        취소
      </button>
    </form>
  );
}

export default ProductForm;
