import { useRoutes } from 'react-router-dom';
import { routes } from './route';
import Gnb from './components/gnb';
import { QueryClientProvider } from 'react-query';
import { queryClient } from './fetcher';

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
