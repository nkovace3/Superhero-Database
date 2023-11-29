import React from 'react';
import { auth } from '../authentication';
import '../components/css/AddList.css';
import { useNavigate } from "react-router-dom";
import UserList from '../components/admin/UserList';
import DisableUser from '../components/admin/DisableUser';

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
            <h1>Welcome Admin! Cheeky inshallah ewwwwwwwwwwwwwwwwwwwwwwwwwwwwww</h1>
            <UserList />
            <DisableUser />
        </>
    )
};

export default AdminHome;
