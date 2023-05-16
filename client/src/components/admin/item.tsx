import { Link } from "react-router-dom";
import { MutableProduct, ProductType, UPDATE_PRODUCT } from "../../graphql/products";
import { QueryKeys, getClient, graphqlFetcher } from "../../queryClient";
import { useMutation } from "@tanstack/react-query";
import { SyntheticEvent } from "react";
import arrToObj from "../../utills/arrToObj";
import { DELETE_PRODUCT } from "../../graphql/products";

const AdminItem = ({
  id,
  title,
  imageUrl,
  price,
  description,
  isEditing,
  startEdit,
  doneEdit,
}: ProductType & {
  isEditing: boolean;
  startEdit: () => void;
  doneEdit: () => void;
}) => {
  const queryClient = getClient();

  const { mutate: updateProduct } = useMutation(
    ({ title, imageUrl, price, description }: MutableProduct) =>
      graphqlFetcher(UPDATE_PRODUCT, { id, title, imageUrl, price, description }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([QueryKeys.PRODUCTS], {
          exact: false,
          refetchType: "all",
        });
      },
    }
  );

  const { mutate: deleteProduct } = useMutation(
    ({ id }: { id: string }) => graphqlFetcher(DELETE_PRODUCT, { id }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([QueryKeys.PRODUCTS], {
          exact: false,
          refetchType: "all",
        });
      },
    }
  );

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const formData = arrToObj([...new FormData(e.target as HTMLFormElement)]);
    formData.price = +formData.price;
    updateProduct(formData as MutableProduct);
    doneEdit();
  };

  const deleteItem = () => {
    deleteProduct({ id });
  };

  if (isEditing)
    return (
      <li className="product-item">
        <form onSubmit={handleSubmit}>
          <label>
            상품명: <input name="title" type="text" defaultValue={title} required />
          </label>
          <label>
            상품이미지url:{" "}
            <input name="imageUrl" type="text" defaultValue={imageUrl} required />
          </label>
          <label>
            가격:{" "}
            <input name="price" type="number" min="1000" defaultValue={price} required />
          </label>
          <label>
            상세: <textarea name="description" defaultValue={description} />
          </label>
          <button type="submit">등록</button>
        </form>
      </li>
    );

  return (
    <li className="product-item">
      <Link to={`/products/${id}`}>
        <h3 className="product-item__title">{title}</h3>
        <img src={imageUrl} className="product-item__image" alt="" />
        <p className="product-item__price">{price}</p>
      </Link>
      <button type="button" className="product-item__add-cart" onClick={startEdit}>
        수정
      </button>
      <button type="button" className="product-item__delete-cart" onClick={deleteItem}>
        삭제
      </button>
    </li>
  );
};

export default AdminItem;
