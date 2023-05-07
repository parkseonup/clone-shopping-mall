import { SyntheticEvent } from "react";
import arrToObj from "../../utills/arrToObj";
import { useMutation } from "@tanstack/react-query";
import { QueryKeys, getClient, graphqlFetcher } from "../../queryClient";
import { ADD_PRODUCT, MutableProduct } from "../../graphql/products";

const AddForm = () => {
  const queryClient = getClient();

  const { mutate: addProduct } = useMutation(
    ({ title, imageUrl, price, description }: MutableProduct) =>
      graphqlFetcher(ADD_PRODUCT, { title, imageUrl, price, description }),
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
    addProduct(formData as MutableProduct);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        상품명: <input name="title" type="text" required />
      </label>
      <label>
        상품이미지url: <input name="imageUrl" type="text" required />
      </label>
      <label>
        가격: <input name="price" type="number" min="1000" required />
      </label>
      <label>
        상세: <textarea name="description" />
      </label>
      <button type="submit">등록</button>
    </form>
  );
};

export default AddForm;
