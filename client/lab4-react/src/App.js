import logo from './logo.svg';
import './App.css';
import LogIn from './components/auth/LogIn';
import CreateAccount from './components/auth/CreateAccount';

function App() {
  return (
    <div className="App">
      <LogIn />
      <CreateAccount />
    </div>
  );
}

export default App;
