import React from 'react';
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
    const navigate = useNavigate();

    const handleLogOut = () => {
        // Удаляем токены из localStorage
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');

        // Перенаправляем пользователя на страницу входа
        navigate('/login');

        // Вы можете также вызвать дополнительное обновление состояния, если нужно
        console.log('Пользователь вышел из системы');

    };

    return (
        <button onClick={handleLogOut} style={{ margin: '10px', padding: '10px', background: '#ff4d4d', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '5px' }}>
            Logout
        </button>
    );
}

export default LogoutButton;
