export type Resolvers = {
  [key: string]: {
    [key: string]: (
      parent: any,
      args: { [key: string]: any },
      context: {
        db: {
          products: Products;
          cart: Cart;
        };
      },
      info: any
    ) => any;
  };
};

export type Product = {
  id: string;
  title: string;
  imageUrl: string;
  price: number;
  description: string;
  createdAt: string;
};

export type Products = Product[];

export type CartItem = {
  id: string;
  amount: number;
};

export type Cart = CartItem[];
