import { useNavigate } from "react-router-dom";
import FieldSearch from "../components/unauthuser/FieldSearch";
import AddList from "../components/authuser/AddList";
import ViewLists from "../components/authuser/ViewLists";

const AuthenticatedHome =() => {
    const navigate = useNavigate();
    return (
        <div>
            <div id = "update-password">
                <p onClick={() => navigate('../updatePassword')}>Update Password</p>
            </div>
            <h1>Welcome to Superhero Database</h1>
            <h2>This is a website that allows you to view superhero information, view favorited lists of superheroes, and more!</h2>
            <p onClick={() => navigate('../')}>Return to login</p>
            <FieldSearch />
            <AddList />
            <ViewLists />
        </div>
    )
};

export default AuthenticatedHome;
