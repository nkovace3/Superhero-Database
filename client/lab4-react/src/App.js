import './App.css';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import UpdatePasswordPage from './pages/UpdatePasswordPage';
import LogInCreateAccount from './pages/LogInCreateAccount';
import UnauthenticatedHome from './pages/UnauthenticatedHome';
import AuthenticatedHome from './pages/AuthenticatedHome';
import AdminHome from './pages/AdminHome';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index element={<LogInCreateAccount />} />
          <Route path = '/updatePassword' element={<UpdatePasswordPage />} />
          <Route path = '/unauthenticatedHome' element={<UnauthenticatedHome />} />
          <Route path = '/authenticatedHome' element={<AuthenticatedHome />} />
          <Route path = '/adminHome' element={<AdminHome />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
