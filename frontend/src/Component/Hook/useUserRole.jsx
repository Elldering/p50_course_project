import { useState, useEffect } from "react";
import axios from "axios";

export const useUserRole = () => {
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/get_user_role/", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`, // Убедитесь, что токен установлен
                    },
                });
                setRole(response.data.role); // Например: "admin", "manager"
            } catch (error) {
                console.error("Ошибка при получении роли пользователя:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserRole();
    }, []);

    return { role, loading };
};
