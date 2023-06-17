import { SyntheticEvent } from 'react';
import { ProductOmitType, ProductType } from '../../graphql/products';
import arrayToObject from '../../utils/arrayToObject';

export default function ProductForm({
  data,
  onSubmit,
  onReset,
}: {
  data?: ProductType;
  onSubmit: (formData: ProductOmitType) => void;
  onReset?: () => void;
}) {
  const onSubmitForm = (e: SyntheticEvent) => {
    e.preventDefault();

    const formData = arrayToObject([
      ...new FormData(e.target as HTMLFormElement),
    ]);

    formData['price'] = +formData['price'];

    onSubmit(formData);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <form onSubmit={onSubmitForm}>
      <label>
        상품명:{' '}
        <input
          type="text"
          name="title"
          defaultValue={useDefaultValues('title', data)}
          required
        />
      </label>
      <label>
        이미지Url:{' '}
        <input
          type="text"
          name="imageUrl"
          defaultValue={useDefaultValues('imageUrl', data)}
          required
        />
      </label>
      <label>
        가격:{' '}
        <input
          type="number"
          name="price"
          min="1000"
          defaultValue={useDefaultValues('price', data)}
          required
        />
      </label>
      <label>
        설명:{' '}
        <textarea
          name="description"
          defaultValue={useDefaultValues('description', data)}></textarea>
      </label>

      <button type="submit">등록</button>
      <button type="reset" onClick={onReset}>
        취소
      </button>
    </form>
  );
}

const useDefaultValues = (name: string, data?: ProductType) => {
  return {
    title: data?.title || '',
    imageUrl: data?.imageUrl || '',
    price: data?.price || 0,
    description: data?.description || '',
  }[name];
};