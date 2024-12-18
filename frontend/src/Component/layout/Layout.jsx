import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";

import "./Layout.css";
import {useAuth} from "../Auth/AuthContext.jsx";
import LogoutButton from "../Auth/LogoutButton.jsx";
import api from "../Auth/axios.js";

export default function Layout({children}) {
    const [userRole, setUserRole] = useState(null);


    useEffect(() => {
        fetchStage();
        const role = localStorage.getItem('role');
        setUserRole(role);
    }, []);
    const fetchStage = async () => {
        try {
            const response = await api.get('http://127.0.0.1:8000/get_user_role/'); // Запрос на API
            if (response.data && response.data.role) { // Проверяем наличие поля role
                setUserRole(response.data.role); // Устанавливаем роль пользователя
                console.log('Роль пользователя:', response.data.role); // Логируем роль
            } else {
                console.error('Некорректный формат ответа:', response.data);
                setUserRole(null); // Устанавливаем null, если роль не найдена
            }
        } catch (error) {
            console.error('Ошибка при загрузке роли пользователя:', error);
            setUserRole(null); // Устанавливаем null при ошибке
        }
    };


    const renderLinks = () => {
        switch (userRole) {
            case 'Администратор':
                return (
                    <>
                        <a href="/user">Пользователи</a>
                        <a href="/roles">Роли</a>
                        <a href="/actionlog">Журнал действий</a>
                    </>
                );
            case 'Руководитель этапа':
                return (
                    <>
                        <div class="group">

                            <a href="/project">Проекты</a>
                            <a href="/stage">Этапы</a>
                            <a href="/finance">Управление финансами</a>
                        </div>

                        <div class="group">
                            <a href="/resouse">Ресурсы</a>
                            <a href="/resoursetypes">Типы ресурсов</a>
                            <a href="/materialdistribution">Распределение материаллов</a>
                        </div>
                        <div class="group">
                            <a href="/task">Задачи</a>
                        </div>


                    </>
                );
            case 'Рабочий':
                return (
                    <>
                        <div className="group">
                            <a href="/profile">Профиль</a>
                        </div>
                        <div className="group">
                            <a href="/task">Задачи</a>
                            <a href="/taskreport">Отчёты по задачам</a>


                        </div>
                    </>
                );
            default:
                return <a href="/">Главная</a>;
        }
    };

    return (
        <div>
            <header className="top">
                <div className="inheader">
                    <a href="/login">Вход</a>
                    <LogoutButton/>
                </div>
            </header>

            <input type="checkbox" id="toggle-sidebar"/>
            <div className="sidebar">
                <div className="header">Навигация</div>
                {renderLinks()}
            </div>

            <main className="mane1">{children}</main>
        </div>
    );
}
