import GlobalLayout from './components/globalLayout';
import MainPage from './pages';
import AdminPage from './pages/admin';
import CartPage from './pages/cart';
import PaymentPage from './pages/payment';
import ProductsPage from './pages/products';
import ProductDetailPage from './pages/products/[id]';

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
        path: '/products',
        element: <ProductsPage />,
      },
      {
        path: '/products/:id',
        element: <ProductDetailPage />,
      },
      {
        path: '/cart',
        element: <CartPage />,
      },
      {
        path: '/payment',
        element: <PaymentPage />,
      },
      {
        path: '/admin',
        element: <AdminPage />,
      },
    ],
  },
];
