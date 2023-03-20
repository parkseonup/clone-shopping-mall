import { useRoutes } from "react-router-dom";
import { routes } from "./routes"; // or use Vite's alias to simplify import path for nested components

const App = () => {
  const element = useRoutes(routes);
  return element;
};

export default App;
