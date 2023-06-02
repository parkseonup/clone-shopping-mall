import { ProductOmitType } from '../../graphql/products';
import AdminItem from './item';
import { useEffect, useRef, useState } from 'react';
import useIntersect from '../hooks/useIntersect';
import { useGetInfiniteProducts } from '../../servies/queries/products';
import {
  useDeleteProduct,
  useUpdateProduct,
} from '../../servies/mutations/products';

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

  const onEditMode = (id: string) => () => {
    setEditingId(id);
  };

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

  const onDelete = (id: string) => {
    deleteProduct(id);
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
            <AdminItem
              product={product}
              editingId={editingId}
              onEditMode={onEditMode(product.id)}
              offEditMode={offEditMode}
              onSubmitEdit={onSubmitEdit(product.id)}
              onDelete={onDelete}
              key={product.id}
            />
          ))}
      </ul>

      <div ref={setTarget}>spinner</div>
    </>
  );
}
