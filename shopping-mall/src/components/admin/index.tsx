import { useInfiniteQuery, useMutation } from 'react-query';
import { QueryKeys, fetchData, queryClient } from '../../fetcher';
import {
  GET_PRODUCTS,
  ProductType,
  ProductsType,
  UPDATE_PRODUCT,
} from '../../graphql/products';
import AdminItem from './item';
import { useEffect, useRef, useState } from 'react';
import useIntersect from '../hooks/useIntersect';

// TODO: ref 속성 타입 에러 해결
function AdminList() {
  /* ------------------------------ GET_PRODUCTS ------------------------------ */
  const hasNextPageRef = useRef<boolean>();
  const isFetchingNextPageRef = useRef<boolean>();

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery<
      Promise<unknown> | { products: ProductsType },
      Error,
      { products: ProductsType }
    >(
      [QueryKeys.PRODUCTS, 'admin'],
      ({ pageParam = '' }) => fetchData(GET_PRODUCTS, { cursor: pageParam }),
      {
        getNextPageParam: lastPage => {
          if ('products' in lastPage) return lastPage.products.at(-1)?.id;
        },
      }
    );

  const executeFetchNextPage = () => {
    if (!hasNextPageRef.current || isFetchingNextPageRef.current) return;

    fetchNextPage();
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setTarget] = useIntersect(executeFetchNextPage);

  useEffect(() => {
    hasNextPageRef.current = hasNextPage;
    isFetchingNextPageRef.current = isFetchingNextPage;
  }, [hasNextPage, isFetchingNextPage]);

  /* ------------------------------ UPDATE_PRODUCT ----------------------------- */
  const [editingId, setEditingId] = useState('');

  const { mutate: updateProduct } = useMutation(
    (editInfo: Omit<ProductType, 'createdAt'>) =>
      fetchData(UPDATE_PRODUCT, editInfo),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([QueryKeys.PRODUCTS], {
          exact: false,
          refetchInactive: true, // TODO: TanStack Query v4로 마이그레이션 하면서 refecthType 옵션으로 통합됐는데 왜 에러 뜨는지 알아보기
        });
      },
    }
  );

  const onEditMode = (id: string) => () => {
    setEditingId(id);
  };

  const offEditMode = () => {
    setEditingId('');
  };

  const onSubmitEdit =
    (id: string) => (formData: Omit<ProductType, 'id' | 'createdAt'>) => {
      const editInfo = {
        id,
        ...formData,
      };

      updateProduct(editInfo);
      setEditingId('');
    };

  /* --------------------------------- return --------------------------------- */

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
              key={product.id}
            />
          ))}
      </ul>

      <div ref={setTarget}>spinner</div>
    </>
  );
}

export default AdminList;
