import './App.css';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import UpdatePasswordPage from './pages/UpdatePasswordPage';
import LogInCreateAccount from './pages/LogInCreateAccount';
import UnauthenticatedHome from './pages/UnauthenticatedHome';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index element={<LogInCreateAccount />} />
          <Route path = '/updatePassword' element={<UpdatePasswordPage />} />
          <Route path = '/unauthenticatedHome' element={<UnauthenticatedHome />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
