// src/components/Login.jsx

import React, {useState} from 'react';
import api from "./axios.js";
import "../CRUD/CRUD.css"


function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const login = async (e) => {
        e.preventDefault(); // Предотвращение перезагрузки страницы
        try {
            const response = await api.post('token/', {
                username: username,
                password: password,
            });
            localStorage.setItem('access_token', response.data.access);

            localStorage.setItem('refresh_token', response.data.refresh);


            setError(null); // Убираем ошибку, если авторизация успешна
            window.location.href = '/'; // Перенаправление после успешного входа
        } catch (err) {
            setError('Неправильный логин или пароль');
        }

    };

    const isAuthenticated = () => {
        const token = localStorage.getItem('access_token');
        return !!token; // true, если токен есть
    };


    return (
        <div>
            <div className={"crud-container"}>
                <h2>Login</h2>
                <form onSubmit={login}>
                    <div>
                        <label>Username</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
                    </div>
                    <div>
                        <label>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                    <button type="submit">Login</button>
                </form>
                {error && <p>{error}</p>}
            </div>

        </div>
    );
}

export default Login;
