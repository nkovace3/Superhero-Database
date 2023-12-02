import React from 'react';
import { auth } from '../authentication';
import '../components/css/AddList.css';
import { useNavigate } from "react-router-dom";
import AddAdmin from '../components/admin/AddAdmin';
import DisableUser from '../components/admin/DisableUser';
import FieldSearch from "../components/unauthuser/FieldSearch";
import AddList from "../components/authuser/AddList";
import ViewLists from "../components/authuser/ViewLists";
import AuthPublicLists from "../components/authuser/AuthPublicLists";
import ReviewManager from '../components/admin/ReviewManager';
import PolicyUpdate from '../components/admin/PolicyUpdate';

const AdminHome =() => {
    const navigate = useNavigate();
    return (
        <>
        <div id = "sign-out">
                <p onClick={async() => {
                    try{
                        await auth.signOut();
                        alert("Sign out successful!");
                        navigate('../');
                    }catch (error) {
                        console.error("Error signing out: ", error.message);
                    }                    
                    }}>
                        Sign Out
                </p>
            </div>
            <h1>Welcome Admin!</h1>
            <h2>This is a website that allows you to view superhero information, view favorited lists of superheroes, and more!</h2>
            <AddAdmin />
            <DisableUser />
            <ReviewManager />
            <PolicyUpdate />
            <FieldSearch />
            <AddList />
            <ViewLists />
            <AuthPublicLists/>
            <div>
                <p onClick={() => navigate('../policies')}>Policies</p>
            </div>
        </>
    )
};

export default AdminHome;
