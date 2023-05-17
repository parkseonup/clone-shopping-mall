import { useRoutes } from 'react-router-dom';
import { routes } from './route';
import Gnb from './components/gnb';

function App() {
  const element = useRoutes(routes);

  return (
    <>
      <h1>Shopping Mall</h1>
      <Gnb />
      {element}
    </>
  );
}

export default App;
