import React from 'react';

import CRUD from "../Component/CRUD/CRUD.jsx";

export default function Task() {

    const isAuthenticated = !!localStorage.getItem('accessToken');
    return (
        <div>
            <CRUD modelName="task" endpoint="http://127.0.0.1:8000/tasks/" />
        </div>

    )
}