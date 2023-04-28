import { DBField, writeDB } from "../dbController";
import { Products, Resolvers } from "./types";
import { v4 as uuid } from "uuid";

const setJSON = (data: Products) => writeDB(DBField.PRODUCTS, data);

/**
 * 상품 삭제시 실제 서버에서 상품을 삭제하는 것이 아니라 createdAt만 삭제해서 삭제된 품목을 관리할 수 있도록 함.
 * client에서는 삭제된 상품을 볼 수 없도록 filter 처리를 해서 전달함.
 */
const productResolver: Resolvers = {
  Query: {
    products: (parent, { cursor = "", showDeleted = false }, { db }) => {
      const [hasCreatedAt, noCreatedAt] = [
        db.products
          .filter((product) => !!product.createdAt)
          .sort((a, b) => b.createdAt! - a.createdAt!),
        db.products.filter((product) => !product.createdAt),
      ];
      const filteredDB = showDeleted
        ? [...hasCreatedAt, ...noCreatedAt]
        : hasCreatedAt;
      const fromIndex =
        filteredDB.findIndex((product) => product.id === cursor) + 1; // cursor에 해당하는 상품의 다음 상품부터 15개를 출력해야 함.

      return filteredDB.slice(fromIndex, fromIndex + 15) || [];
    },
    product: (parent, { id }, { db }) => {
      const targetProduct = db.products.find((product) => product.id === id);

      return targetProduct || null;
    },
  },
  Mutation: {
    addProduct: (parent, { title, imageUrl, price, description }, { db }) => {
      const newProduct = {
        id: uuid(),
        title,
        imageUrl,
        price,
        description,
        createdAt: Date.now(),
      };

      db.products.push(newProduct);
      setJSON(db.products);
      return newProduct;
    },
    updateProduct: (parent, { id, ...data }, { db }) => {
      const existProductIndex = db.products.findIndex(
        (product) => product.id === id
      );

      if (existProductIndex < 0)
        throw new Error("업데이트 할 상품이 없습니다.");

      const updatedProduct = {
        ...db.products[existProductIndex],
        ...data,
      };

      db.products.splice(existProductIndex, 1, updatedProduct);
      setJSON(db.products);
      return updatedProduct;
    },
    deleteProduct: (parent, { id }, { db }) => {
      const existProductIndex = db.products.findIndex(
        (product) => product.id === id
      );

      if (existProductIndex < 0) throw new Error("삭제 할 상품이 없습니다.");

      const deletedProduct = { ...db.products[existProductIndex] };

      delete deletedProduct.createdAt;
      db.products.splice(existProductIndex, 1, deletedProduct);
      setJSON(db.products);
      return id;
    },
  },
};

export default productResolver;
