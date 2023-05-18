import { useRoutes } from 'react-router-dom';
import { routes } from './route';
import Gnb from './components/gnb';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      cacheTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

function App() {
  const element = useRoutes(routes);

  return (
    <QueryClientProvider client={queryClient}>
      <h1>Shopping Mall</h1>
      <Gnb />
      {element}
    </QueryClientProvider>
  );
}

export default App;
