import { useEffect, useRef, useState } from 'react';
import useIntersect from '../hooks/useIntersect';
import { useGetInfiniteProducts } from '../../servies/queries/products';
import AdminItem from './item';

export default function AdminList() {
  const hasNextPageRef = useRef<boolean>();
  const isFetchingNextPageRef = useRef<boolean>();
  const [editingId, setEditingId] = useState('');
  const {
    data: products,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useGetInfiniteProducts({ category: 'admin', isShownDeleted: true });

  const changeEditingId = (id: string) => {
    setEditingId(id);
  };

  const [_, setTarget] = useIntersect((entry: IntersectionObserverEntry) => {
    if (
      !fetchNextPage ||
      !hasNextPageRef.current ||
      isFetchingNextPageRef.current ||
      !entry.isIntersecting
    )
      return;

    fetchNextPage();
  });

  useEffect(() => {
    hasNextPageRef.current = hasNextPage;
    isFetchingNextPageRef.current = isFetchingNextPage;
  }, [hasNextPage, isFetchingNextPage]);

  return (
    <>
      <ul>
        {products.map(product => (
          <AdminItem
            key={product.id}
            product={product}
            editingId={editingId}
            changeEditingId={changeEditingId}
          />
        ))}
      </ul>

      {hasNextPage ? <div ref={setTarget}>spinner</div> : null}
    </>
  );
}
