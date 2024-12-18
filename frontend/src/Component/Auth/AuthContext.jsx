import React, { createContext, useContext, useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import api from "./axios.js";
import api2 from "./axios.js";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Проверяем наличие токенов и загружаем пользователя
    useEffect(() => {
        const accessToken = localStorage.getItem("access_token");
        if (accessToken) {
            loadUser();
        } else {
            setLoading(false);
        }
    }, []);

    // Загружает данные пользователя
    const loadUser = async () => {
        try {
            const response = await api.get("user"); // Предполагается, что эндпоинт возвращает данные пользователя
            setUser(response.data);
        } catch (error) {
            console.error("Error fetching user:", error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    // Вход пользователя
    const login = async (username, password) => {
        try {
            const response = await api.post("/token/", { username, password });
            localStorage.setItem("access_token", response.data.access);
            localStorage.setItem("refresh_token", response.data.refresh);
            await loadUser();
            navigate("/dashboard"); // Перенаправляем на защищенный маршрут
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    // Выход пользователя
    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setUser(null);
        navigate("/login");
    };

    // Автоматическое обновление токена
    const refreshAccessToken = async () => {
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
            try {
                const response = await api.post("/token/refresh/", { refresh: refreshToken });
                localStorage.setItem("access_token", response.data.access);
            } catch (error) {
                console.error("Token refresh failed:", error);
                logout();
            }
        }
    };

    return (
        <div>
            <AuthContext.Provider value={{ user, login, logout, refreshAccessToken, loading }}>
                {children}
            </AuthContext.Provider>
        </div>

    );
};
