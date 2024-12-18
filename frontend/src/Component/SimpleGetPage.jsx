import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function SimpleGetPage() {
    const [data, setData] = useState(null);
    const [jsonData, setJsonData] = useState(null);

    // URL для GET-запроса
    const apiUrl = "http://127.0.0.1:8000/tasks/"; // пример URL

    // Выполняем GET-запрос при загрузке компонента
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(apiUrl);
            setData(response.data); // Сохранить данные для форматированного вывода
            setJsonData(JSON.stringify(response.data, null, 2)); // Сохранить данные в JSON формате
        } catch (error) {
            console.error("Ошибка при выполнении GET-запроса:", error);
        }
    };

    return (
        <div>
            <h2>Полученные данные</h2>

            {/* Форматированный вывод данных */}
            <div>
                <h3>Форматированный вывод:</h3>
                {data ? (
                    Array.isArray(data) && data.length > 0 ? (
                        <ul>
                            {data.map((item) => (
                                <li key={item.id}>
                                    <strong>ID:</strong> {item.id}
                                    <br />
                                    <strong>Количество:</strong> {item.quantity}
                                    <br />
                                    <strong>Дата распределения:</strong> {item.distribution_date}
                                    <br />
                                    <strong>Стоимость:</strong> {item.cost}
                                    <br />
                                    <strong>Ресурс:</strong> {item.resource}
                                    <br />
                                    <strong>Стадия:</strong> {item.stage}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Нет данных для отображения.</p>
                    )
                ) : (
                    <p>Загрузка...</p>
                )}
            </div>

            {/* Сырой вывод данных в JSON формате */}
            <div>
                <h3>JSON формат:</h3>
                <pre>{jsonData || "Загрузка..."}</pre>
                <ul>
                    <li>

                    </li>
                </ul>
            </div>
        </div>
    );
}
