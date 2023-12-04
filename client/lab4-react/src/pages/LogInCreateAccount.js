// Import necessary modules and components
import CreateAccount from "../components/auth/CreateAccount";
import LogIn from "../components/auth/LogIn";
import { useNavigate } from "react-router-dom";
import "./css/LogInCreateAccountStyle.css";  // Importing the styles for LogInCreateAccount
import React, { useState } from "react";

// Define the functional component LogInCreateAccount
const LogInCreateAccount= () => {
    // State to track whether an account was just created
    const [justCreatedAccount, setJustCreatedAccount] = useState(false);

    // Create a navigation hook
    const navigate = useNavigate();

    // Render the UI for the LogInCreateAccount component
    return (
        <div className="login-create-account-container">
            {/* Main heading */}
            <h1 id="main-heading">Superhero Database</h1>
            <div className="login-container">
                {/* LogIn component */}
                <LogIn justCreatedAccount={justCreatedAccount} />
                {/* CreateAccount component */}
                <CreateAccount setJustCreatedAccount={setJustCreatedAccount} />
                {/* Unauthenticated option */}
                <p onClick={() => navigate('unauthenticatedHome')}>Or, proceed as unauthenticated</p>
            </div>
        </div>
    );
}

// Export the LogInCreateAccount component as the default export
export default LogInCreateAccount;
