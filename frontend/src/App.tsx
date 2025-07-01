import { BrowserRouter } from 'react-router-dom';
import MainRoutes from './config/MainRoutes';
import FloatingCursor from './Components/FloatingCursor/FloatingCursor';
import './App.scss';

function App() {
  return (
    <BrowserRouter>
      <MainRoutes />
      <FloatingCursor />
    </BrowserRouter>
  );
}

export default App;