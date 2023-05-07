import { db } from "../firebase";
import { Cart, Product, Resolvers } from "./types";
import {
  collection,
  getDoc,
  getDocs,
  DocumentData,
  doc,
  updateDoc,
  query,
  where,
  increment,
  addDoc,
  deleteDoc,
} from "firebase/firestore";

const cartResolver: Resolvers = {
  Query: {
    cart: async () => {
      const cart = collection(db, "cart");
      const snapshot = await getDocs(cart);
      const data: DocumentData[] = [];

      snapshot.forEach((doc) => {
        data.push({
          ...doc.data(),
          id: doc.id,
        });
      });

      return data;
    },
  },
  Mutation: {
    addCart: async (parent, { productId }) => {
      const productRef = doc(db, "products", productId);
      const productSnapshot = await getDoc(productRef);

      if (!productSnapshot.exists()) throw new Error("없는 상품입니다.");

      const cartCollection = collection(db, "cart");
      const exist = (
        await getDocs(query(cartCollection, where("product", "==", productRef)))
      ).docs[0];
      let cartRef = null;

      if (exist) {
        cartRef = doc(cartCollection, exist.id);
        await updateDoc(cartRef, { amount: increment(1) });
      } else {
        cartRef = await addDoc(cartCollection, {
          product: productRef,
          amount: 1,
        });
      }

      const snapshot = await getDoc(cartRef);

      return {
        ...snapshot.data(),
        id: snapshot.id,
      };
    },
    updateCart: async (parent, { cartId, amount }) => {
      const cartRef = doc(db, "cart", cartId);
      let snapshot = await getDoc(cartRef);

      if (!snapshot.data()) throw new Error("장바구니에 없는 상품입니다.");

      await updateDoc(cartRef, { amount });
      snapshot = await getDoc(cartRef);

      return {
        ...snapshot.data(),
        id: snapshot.id,
      };
    },
    deleteCart: async (parent, { cartId }) => {
      const cartRef = doc(db, "cart", cartId);
      const snapshot = await getDoc(cartRef);

      if (!snapshot.exists()) throw new Error("장바구니에 없는 상품입니다.");

      await deleteDoc(cartRef);
      return cartId;
    },
    executePay: (parent, { ids }) => {
      const deletedIds = ids.filter(async (id: string) => {
        const cartRef = doc(db, "cart", id);
        const cartSnapshot = await getDoc(cartRef);

        if (!cartSnapshot.exists())
          throw new Error("장바구니에 없는 상품입니다.");

        const productRef = cartSnapshot.data().product;
        const productSnapshop = await getDoc(productRef);
        const productData = productSnapshop.data() as Product;

        if (!productData.createdAt)
          throw new Error(
            `결제 목록에 품절된 상품(${id})이 포함되어 있습니다.`
          );

        await deleteDoc(cartRef);
        return true;
      });

      return deletedIds;
    },
  },
  CartItem: {
    product: async (cartItem) => {
      const product = await getDoc(cartItem.product);
      const data = product.data() as any;

      return {
        ...data,
        id: product.id,
      };
    },
  },
};

export default cartResolver;
