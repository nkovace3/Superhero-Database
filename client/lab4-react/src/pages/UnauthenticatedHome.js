// Import the useNavigate hook from 'react-router-dom'
import { useNavigate } from "react-router-dom";

// Import the FieldSearch and UnauthFieldSearch components
import FieldSearch from "../components/unauthuser/FieldSearch";
import UnauthFieldSearch from "../components/unauthuser/UnauthPublicLists";

// Define the functional component UnauthenticatedHome
const UnauthenticatedHome = () => {
    // Use the useNavigate hook to get the navigate function
    const navigate = useNavigate();

    // Render the UI for the UnauthenticatedHome component
    return (
        <div>
            {/* Main heading */}
            <h1>Welcome to Superhero Database</h1>
            
            {/* Subheading with a brief description of the website */}
            <h2>This is a website that allows you to view superhero information, view favorited lists of superheroes, and more!</h2>
            
            {/* Link to return to the login page */}
            <p onClick={() => navigate('../')}>Return to login</p>
            
            {/* FieldSearch component for searching and displaying superhero information */}
            <FieldSearch />
            
            {/* UnauthFieldSearch component for displaying recent public superhero lists */}
            <UnauthFieldSearch/>
            
            {/* Link to navigate to the 'policies' page */}
            <div>
                <p onClick={() => navigate('../policies')}>Policies</p>
            </div>
        </div>
    );
};

// Export the UnauthenticatedHome component as the default export
export default UnauthenticatedHome;
