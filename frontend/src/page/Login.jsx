import React from 'react';
import LogoutButton from "../Component/Auth/LogoutButton.jsx";
import Login from "../Component/Auth/Login.jsx";

export default function Login() {

    const isAuthenticated = !!localStorage.getItem('accessToken');
    return (
        <div>
            {isAuthenticated ? <LogoutButton/> : <Login/>}
        </div>

    )
}