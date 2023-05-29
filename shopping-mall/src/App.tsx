import { useRoutes } from 'react-router-dom';
import { routes } from './route';
import Gnb from './components/gnb';
import { QueryClientProvider } from 'react-query';
import { queryClient } from './fetcher';
import { ProductsToPayProvider } from './context/productsToPay';

export default function App() {
  const element = useRoutes(routes);

  return (
    <QueryClientProvider client={queryClient}>
      <ProductsToPayProvider>
        <h1>Shopping Mall</h1>
        <Gnb />
        {element}
      </ProductsToPayProvider>
    </QueryClientProvider>
  );
}
