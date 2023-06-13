import { useRoutes } from 'react-router-dom';
import { routes } from './route';
import Gnb from './components/common/gnb';
import { queryClient } from './servies/common';
import { ProductsToPayProvider } from './context/productsToPay';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';

export default function App() {
  const element = useRoutes(routes);

  return (
    <QueryClientProvider client={queryClient}>
      <ProductsToPayProvider>
        <h1>Shopping Mall</h1>
        <Gnb />
        {element}
        <Toaster />
      </ProductsToPayProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
