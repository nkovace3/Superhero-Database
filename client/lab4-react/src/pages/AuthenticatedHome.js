import { useNavigate } from "react-router-dom";

const AuthenticatedHome =() => {
    const navigate = useNavigate();
    return (
        <div>
            <h1>Welcome to Superhero Database</h1>
            <h2>This is a website that allows you to view superhero information, view favorited lists of superheroes, and more!</h2>
            <p onClick={() => navigate('../')}>Return to login</p>
        </div>
    )
};

export default AuthenticatedHome;
