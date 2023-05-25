import { useRoutes } from 'react-router-dom';
import { routes } from './route';
import Gnb from './components/gnb';
import { QueryClientProvider } from 'react-query';
import { queryClient } from './fetcher';
import { RecoilRoot } from 'recoil';

function App() {
  const element = useRoutes(routes);

  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <h1>Shopping Mall</h1>
        <Gnb />
        {element}
      </RecoilRoot>
    </QueryClientProvider>
  );
}

export default App;
