import { ProductOmitType } from '../../graphql/products';
import { useEffect, useRef, useState } from 'react';
import useIntersect from '../hooks/useIntersect';
import { useGetInfiniteProducts } from '../../servies/queries/products';
import {
  useDeleteProduct,
  useUpdateProduct,
} from '../../servies/mutations/products';
import ProductCard from '../product/productCard';
import ProductForm from './productForm';

// TODO: ref 속성 타입 에러 해결
export default function AdminList() {
  const hasNextPageRef = useRef<boolean>();
  const isFetchingNextPageRef = useRef<boolean>();
  const [editingId, setEditingId] = useState('');

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useGetInfiniteProducts({ category: 'admin', isShownDeleted: true });
  const { mutate: updateProduct } = useUpdateProduct();
  const { mutate: deleteProduct } = useDeleteProduct();

  const executeFetchNextPage = () => {
    if (!hasNextPageRef.current || isFetchingNextPageRef.current) return;

    fetchNextPage();
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setTarget] = useIntersect(executeFetchNextPage);

  const offEditMode = () => {
    setEditingId('');
  };

  const onSubmitEdit = (id: string) => (formData: ProductOmitType) => {
    updateProduct({
      id,
      ...formData,
    });
    setEditingId('');
  };

  useEffect(() => {
    hasNextPageRef.current = hasNextPage;
    isFetchingNextPageRef.current = isFetchingNextPage;
  }, [hasNextPage, isFetchingNextPage]);

  if (!data) return null;

  return (
    <>
      <ul>
        {data.pages
          .flatMap(page => page.products)
          .map(product => (
            <li key={product.id}>
              {product.id === editingId ? (
                <ProductForm
                  data={product}
                  onCancel={offEditMode}
                  onSubmit={onSubmitEdit(product.id)}
                />
              ) : (
                <ProductCard
                  data={product}
                  controls={
                    <>
                      <button
                        type="button"
                        onClick={() => setEditingId(product.id)}>
                        수정
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteProduct(product.id)}>
                        삭제
                      </button>
                    </>
                  }
                />
              )}
            </li>
          ))}
      </ul>

      <div ref={setTarget}>spinner</div>
    </>
  );
}
