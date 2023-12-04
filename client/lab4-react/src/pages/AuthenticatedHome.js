// Import necessary modules and components
import { useNavigate } from "react-router-dom";
import FieldSearch from "../components/unauthuser/FieldSearch";
import AddList from "../components/authuser/AddList";
import ViewLists from "../components/authuser/ViewLists";
import React from 'react';
import { auth } from '../authentication';
import AuthPublicLists from "../components/authuser/AuthPublicLists";

// Define the functional component AuthenticatedHome
const AuthenticatedHome =() => {
    // Create a navigation hook
    const navigate = useNavigate();

    // Render the UI for the AuthenticatedHome component
    return (
        <div>
            {/* Update Password link */}
            <div id="update-password">
                <p onClick={() => navigate('../updatePassword')}>Update Password</p>
            </div>
            {/* Sign Out button */}
            <div id="sign-out">
                <p onClick={async() => {
                    try {
                        // Sign out the user using Firebase auth
                        await auth.signOut();
                        // Display a sign-out success message
                        alert("Sign out successful!");
                        // Navigate to the home page
                        navigate('../');
                    } catch (error) {
                        console.error("Error signing out: ", error.message);
                    }                    
                }}>
                    Sign Out
                </p>
            </div>
            {/* Welcome message */}
            <h1>Welcome to Superhero Database</h1>
            <h2>This is a website that allows you to view superhero information, view favorited lists of superheroes, and more!</h2>
            {/* User functionalities */}
            <FieldSearch />
            <AddList />
            <ViewLists />
            <AuthPublicLists/>
            {/* Policies link */}
            <div>
                <p onClick={() => navigate('../policies')}>Policies</p>
            </div>
        </div>
    );
};

// Export the AuthenticatedHome component as the default export
export default AuthenticatedHome;
