export type ProductType = {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  price: number;
  createdAt: number;
};

export type ProductsType = ProductType[];

export type CartItemType = {
  id: string;
  amount: number;
  product: ProductType;
};

export type CartType = CartItemType[];
