import { Products, Resolvers } from "./types";
import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  where,
  startAfter,
  QueryStartAtConstraint,
  QueryOrderByConstraint,
  QueryFieldFilterConstraint,
  serverTimestamp,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const PAGE_SIZE = 15;

/**
 * 상품 삭제시 실제 서버에서 상품을 삭제하는 것이 아니라 createdAt만 삭제해서 삭제된 품목을 관리할 수 있도록 함.
 * client에서는 삭제된 상품을 볼 수 없도록 filter 처리를 해서 전달함.
 */
const productResolver: Resolvers = {
  Query: {
    products: async (parent, { cursor = "", showDeleted = false }) => {
      const products = collection(db, "products"); // CollectionReference {}
      const queryOptions: (
        | QueryStartAtConstraint
        | QueryOrderByConstraint
        | QueryFieldFilterConstraint
      )[] = [orderBy("createdAt", "desc")];

      if (cursor) {
        const snapshot = await getDoc(doc(db, "products", cursor));
        queryOptions.push(startAfter(snapshot));
      }
      if (!showDeleted) queryOptions.unshift(where("createdAt", "!=", null));

      const q = query(products, ...queryOptions, limit(PAGE_SIZE));
      const snapshot = await getDocs(q); // QuerySnapshot {}
      const data: DocumentData[] = []; // Products[]

      snapshot.forEach((doc) => {
        data.push({
          ...doc.data(),
          id: doc.id,
        });
      });

      return data;
    },
    product: async (parent, { id }) => {
      const product = await getDoc(doc(db, "products", id));
      return {
        ...product.data(),
        id: product.id,
      };
    },
  },
  Mutation: {
    addProduct: async (parent, { title, imageUrl, price, description }) => {
      const newProduct = {
        title,
        imageUrl,
        price,
        description,
        createdAt: serverTimestamp(),
      };

      const result = await addDoc(collection(db, "products"), newProduct);
      const snapshot = await getDoc(result);

      return {
        ...snapshot.data(),
        id: snapshot.id,
      };
    },
    updateProduct: async (parent, { id, ...data }) => {
      const productRef = doc(db, "products", id);
      let snapshot = await getDoc(productRef);

      if (!snapshot.exists()) throw new Error("해당하는 상품이 없습니다.");

      await updateDoc(productRef, data);

      snapshot = await getDoc(productRef);

      return {
        ...snapshot.data(),
        id: snapshot.id,
        createdAt: serverTimestamp(),
      };
    },
    deleteProduct: async (parent, { id }) => {
      const productRef = doc(db, "products", id);
      const snapshot = await getDoc(productRef);

      if (!snapshot.exists()) throw new Error("해당하는 상품이 없습니다.");

      await updateDoc(productRef, { createdAt: null });

      return id;
    },
  },
};

export default productResolver;
