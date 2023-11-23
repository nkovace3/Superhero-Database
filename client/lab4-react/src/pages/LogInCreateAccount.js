import CreateAccount from "../components/auth/CreateAccount";
import LogIn from "../components/auth/LogIn";
import { useNavigate } from "react-router-dom";
import "./css/LogInCreateAccountStyle.css";

const LogInCreateAccount= () => {
    const navigate = useNavigate();
    return (
        <div className="login-create-account-container">
        <h1 id="main-heading">Superhero Database</h1>
        <div className = "login-container">
            <LogIn />
            <CreateAccount />
            <p onClick={() => navigate('unauthenticatedHome')}>Or, proceed as unauthenticated</p>
        </div>
        </div>
    )
}

export default LogInCreateAccount;