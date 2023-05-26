import { useMutation, useQuery } from 'react-query';
import { QueryKeys, fetchData, queryClient } from '../../fetcher';
import {
  GET_PRODUCTS,
  ProductType,
  ProductsType,
} from '../../graphql/products';
import AdminItem from './item';
import { UPDATE_CART } from '../../graphql/cart';
import { useState } from 'react';

function AdminList() {
  const [editingId, setEditingId] = useState('');
  const { data } = useQuery<
    Promise<unknown>,
    Error,
    { products: ProductsType }
  >([QueryKeys.PRODUCTS, 'admin'], () => fetchData(GET_PRODUCTS));
  const { mutate: updateProduct } = useMutation(
    (editInfo: Omit<ProductType, 'createdAt'>) =>
      fetchData(UPDATE_CART, editInfo),
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

  const onSubmitEdit =
    (id: string) => (formData: Omit<ProductType, 'id' | 'createdAt'>) => {
      const editInfo = {
        id,
        ...formData,
      };

      updateProduct(editInfo);
      setEditingId('');
    };

  if (!data) return null;

  return (
    <ul>
      {data.products.map(product => (
        <AdminItem
          product={product}
          editingId={editingId}
          onEditMode={onEditMode(product.id)}
          onSubmitEdit={onSubmitEdit(product.id)}
          key={product.id}
        />
      ))}
    </ul>
  );
}

export default AdminList;
