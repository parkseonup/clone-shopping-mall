import GlobalLayout from './components/globalLayout';
import MainPage from './pages';
import AdminPage from './pages/admin';
import CartPage from './pages/cart';
import ProductsPage from './pages/product';

export const routes = [
  {
    path: '/',
    element: <GlobalLayout />,
    children: [
      {
        path: '/',
        element: <MainPage />,
      },
      {
        path: 'product',
        element: <ProductsPage />,
      },
      {
        path: 'cart',
        element: <CartPage />,
      },
      {
        path: 'admin',
        element: <AdminPage />,
      },
    ],
  },
];
