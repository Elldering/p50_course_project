import React from 'react';

import CRUD from "../Component/CRUD/CRUD.jsx";
import DisplayToken from "../Component/Auth/DisplayToken.jsx";

export default function Test() {

    const isAuthenticated = !!localStorage.getItem('accessToken');
    return (
        <div>
            <DisplayToken />
        </div>

    )
}