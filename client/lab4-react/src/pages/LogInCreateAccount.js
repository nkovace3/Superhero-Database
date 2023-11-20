import CreateAccount from "../components/auth/CreateAccount";
import LogIn from "../components/auth/LogIn";
import { useNavigate } from "react-router-dom";

const LogInCreateAccount= () => {
    const navigate = useNavigate();
    return (
        <>
            <LogIn />
            {/* <p onClick={() => navigate('updatePassword')}>Change Password</p> */}
            <CreateAccount />
            <p onClick={() => navigate('unauthenticatedHome')}>Or, proceed as unauthenticated</p>
        </>
    )
}

export default LogInCreateAccount;