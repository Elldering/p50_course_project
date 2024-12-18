import React, {useState, useEffect} from 'react';
import './CRUD.css';
import api from '../Auth/axios.js';
import {jwtDecode} from "jwt-decode";
import DatePicker from 'react-datepicker';
import axios from "axios";


export default function CRUD({modelName, endpoint}) {
    const [fields, setFields] = useState([]);
    const [records, setRecords] = useState([]);
    const [formData, setFormData] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [pagination, setPagination] = useState({next: null, previous: null});


    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState('');
    const [filterField, setFilterField] = useState('');
    const [filterValue, setFilterValue] = useState('');
    const [users, setUsers] = useState([]);
    const [stages, setStage] = useState([]);
    const [projects, setProjects] = useState([]);
    const [resource_types, setResource_type] = useState([]);
    const [roles, setRoles] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [logs, setLogs] = useState([]);
    const [resources, setResources] = useState([]);

    const [userRole, setUserRole] = useState(null);


    const fieldTranslations = {
        username: "Имя пользователя",
        user: "Пользователь",
        age: "Возраст",
        Actions: "Действия",
        completed: "Выполнен",
        report: "Описание отчёта",
        name: "Название",
        description: "Описание",
        client: "Клиент",
        transaction_date: "Дата транзации",
        amount: "Сумма транзакции",
        resource_type: "Тип ресурса",
        quantity: "Количество",
        distribution_date: "Дата добавления",
        transaction_type: "Тип транзакции",
        password: "Пароль",
        email: "Электронная почта",
        is_staff: "Сотрудник",
        is_active: "Активен",
        status: "Статус",
        resource: "Ресурс",
        task: "Задача",
        assigned_to: "Назначить",
        budget: "Бюджет",
        stage: "Этап",
        cost: "Цена",
        action: "Действие",
        role: "Роль",
        project: "Проект",
        submitted_by: "Отправлено пользователем",
        id: "Идентификатор", action_date: "Дата", first_name: "Имя", last_name: "Фамилия",
        // Добавьте остальные переводы здесь
    };
    const translateField = (field) => {
        return fieldTranslations[field] || field;
    };


    useEffect(() => {
        fetchModelFields();
        fetchRecords();
        fetchUsers();
        fetchProjects();
        fetchRoles();
        fetchStage();
        fetchRoles();
        fetchResource_type();
        fetchTasks();
        fetchResources();
        fetchStageRole();
        fetchLogs();
        fetchStats();
        const role = localStorage.getItem('role');
        console.log(role)
        setUserRole(role);
    }, [modelName]);

    const [roleChart, setRoleChart] = useState('');
    const [statistics, setStatistics] = useState({});

    const [monthlyChart, setMonthlyChart] = useState('');

    const fetchStageRole = async () => {
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

    const fetchStats = async () => {
        axios.get('http://127.0.0.1:8000/api/user-statistics/')
            .then(response => {
                setRoleChart(`data:image/png;base64,${response.data.role_chart}`);
                setMonthlyChart(`data:image/png;base64,${response.data.monthly_chart}`);
                setStatistics(response.data.statistics)
            })
            .catch(error => console.error('Ошибка при загрузке графиков:', error));
    };


    const fetchLogs = async () => {
        try {
            const response = await api.get('http://127.0.0.1:8000/api/logs/');

            if (response.data && Array.isArray(response.data.logs)) {
                const recentLogs = response.data.logs.slice(-10); // Берем последние 10 логов
                setLogs(recentLogs);
            } else {
                console.error('Ожидался массив логов в поле logs, получено:', response.data);
                setLogs([]);
            }
        } catch (error) {
            console.error('Ошибка при загрузке логов:', error);
            setLogs([]);
        }
    };


    const fetchResource_type = async () => {
        try {
            const response = await api.get('http://127.0.0.1:8000/resource_types/');
            if (Array.isArray(response.data.results)) {
                setResource_type(response.data.results); // Используем только массив результатов
            } else {
                console.error('Ожидался массив пользователей в поле results, получено:', response.data);
                setResource_type([]); // Устанавливаем пустой массив для предотвращения ошибок
            }
        } catch (error) {
            console.error('Ошибка при загрузке пользователей:', error);
            setResource_type([]); // Устанавливаем пустой массив при ошибке
        }
    };
    const fetchResources = async () => {
        try {
            const response = await api.get('http://127.0.0.1:8000/resources/');
            if (Array.isArray(response.data.results)) {
                setResources(response.data.results); // Используем только массив результатов
            } else {
                console.error('Ожидался массив пользователей в поле results, получено:', response.data);
                setResources([]); // Устанавливаем пустой массив для предотвращения ошибок
            }
        } catch (error) {
            console.error('Ошибка при загрузке пользователей:', error);
            setResources([]); // Устанавливаем пустой массив при ошибке
        }
    };
    const fetchTasks = async () => {
        try {
            const response = await api.get('http://127.0.0.1:8000/tasks/');
            if (Array.isArray(response.data.results)) {
                setTasks(response.data.results); // Используем только массив результатов
            } else {
                console.error('Ожидался массив пользователей в поле results, получено:', response.data);
                setTasks([]); // Устанавливаем пустой массив для предотвращения ошибок
            }
        } catch (error) {
            console.error('Ошибка при загрузке пользователей:', error);
            setTasks([]); // Устанавливаем пустой массив при ошибке
        }
    };
    const fetchStage = async () => {
        try {
            const response = await api.get('http://127.0.0.1:8000/stages/');
            if (Array.isArray(response.data.results)) {
                setStage(response.data.results); // Используем только массив результатов
            } else {
                console.error('Ожидался массив пользователей в поле results, получено:', response.data);
                setStage([]); // Устанавливаем пустой массив для предотвращения ошибок
            }
        } catch (error) {
            console.error('Ошибка при загрузке пользователей:', error);
            setStage([]); // Устанавливаем пустой массив при ошибке
        }
    };
    const fetchUsers = async () => {
        try {
            const response = await api.get('http://127.0.0.1:8000/users/');
            if (Array.isArray(response.data.results)) {
                setUsers(response.data.results); // Используем только массив результатов
            } else {
                console.error('Ожидался массив пользователей в поле results, получено:', response.data);
                setUsers([]); // Устанавливаем пустой массив для предотвращения ошибок
            }
        } catch (error) {
            console.error('Ошибка при загрузке пользователей:', error);
            setUsers([]); // Устанавливаем пустой массив при ошибке
        }
    };
    const fetchProjects = async () => {
        try {
            const response = await api.get('http://127.0.0.1:8000/projects/');
            if (Array.isArray(response.data.results)) {
                setProjects(response.data.results); // Используем только массив результатов
            } else {
                console.error('Ожидался массив пользователей в поле results, получено:', response.data);
                setProjects([]); // Устанавливаем пустой массив для предотвращения ошибок
            }
        } catch (error) {
            console.error('Ошибка при загрузке пользователей:', error);
            setProjects([]); // Устанавливаем пустой массив при ошибке
        }
    };
    const fetchRoles = async () => {
        try {
            const response = await api.get('http://127.0.0.1:8000/roles/');
            if (Array.isArray(response.data.results)) {
                setRoles(response.data.results); // Используем только массив результатов
            } else {
                console.error('Ожидался массив пользователей в поле results, получено:', response.data);
                setRoles([]);
            }
        } catch (error) {
            console.error('Ошибка при загрузке пользователей:', error);
            setRoles([]);
        }
    };


    const fetchModelFields = async () => {
        try {
            const response = await api.get(`http://127.0.0.1:8000/api/model-fields/${modelName}/`);
            setFields(response.data.fields);
        } catch (error) {
            console.error('Ошибка при получении полей модели:', error);
        }
    };

    const fetchRecords = async (url = endpoint) => {
        try {
            const params = new URLSearchParams();

            if (searchQuery) params.append('search', searchQuery);
            if (sortField) params.append('ordering', sortField);
            if (filterField && filterValue) params.append(filterField, filterValue);

            const response = await api.get(url, {params});
            const data = response.data;

            setRecords(data.results || []);
            setPagination({next: data.next, previous: data.previous});
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            // Добавляем текущего пользователя в поля submitted_by и user, если это необходимо
            const dataToSubmit = {
                ...formData,
                ...(fields.includes('submitted_by') && {submitted_by: currentUser.user_id}),
                ...(modelName === 'ActionLog' && fields.includes('user') && {user: currentUser.user_id}),
            };

            if (modelName === 'user' && !editMode) {
                // Если создаём пользователя, делаем запрос на URL регистрации
                await api.post('http://127.0.0.1:8000/api/register/', dataToSubmit);
            } else if (editMode) {
                // Логика для редактирования записи
                await api.put(`${endpoint}${editId}/`, dataToSubmit);
            } else {
                // Логика для добавления записи в другие модели
                await api.post(endpoint, dataToSubmit);
            }

            fetchRecords(); // Обновляем записи после сохранения
            setFormData({}); // Сбрасываем форму
            setEditMode(false);
            setEditId(null);
        } catch (error) {
            console.error('Ошибка сохранения данных:', error);
        }
    };


    const handleDelete = async (id) => {
        try {
            await api.delete(`${endpoint}${id}/`);
            fetchRecords();
        } catch (error) {
            console.error('Ошибка удаления данных:', error);
        }
    };

    const handleEdit = (record) => {
        setFormData(record);
        setEditMode(true);
        setEditId(record.id);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData, [e.target.name]: e.target.value,
        });
    };

    const handleSearch = () => {
        fetchRecords();
    };

    const handleFilter = () => {
        fetchRecords();
    };

    const handleSort = () => {
        fetchRecords();
    };

    const getDisplayValue = (id, list) => {
        const entity = list.find(item => item.id === id);
        return entity ? entity.name || entity.username : 'Не указано';
    };


    const getCurrentUser = () => {
        const token = localStorage.getItem("access_token");
        if (!token) return null;

        try {
            const decodedToken = jwtDecode(token);
            console.log(decodedToken)
            return decodedToken; // Здесь могут быть такие данные, как user_id, username

        } catch (error) {
            console.error("Invalid token", error);
            return null;
        }
    };
    document.addEventListener("DOMContentLoaded", () => {
        const background = document.querySelector(".background");
        const button = document.getElementById("toggle-animation");

        // Проверяем сохранённое состояние
        const isAnimationStopped = localStorage.getItem("animationStopped") === "true";

        // Устанавливаем начальное состояние
        if (isAnimationStopped) {
            background.style.animation = "none";
            button.textContent = "Запустить анимацию";
        }

        // Обработчик клика по кнопке
        button.addEventListener("click", () => {
            const isStopped = background.style.animation === "none";

            if (isStopped) {
                // Включаем анимацию
                background.style.animation = "gradientAnimation 10s ease infinite";
                button.textContent = "Остановить анимацию";
                localStorage.setItem("animationStopped", "false");
            } else {
                // Останавливаем анимацию
                background.style.animation = "none";
                button.textContent = "Запустить анимацию";
                localStorage.setItem("animationStopped", "true");
            }
        });
    });

    const currentUser = getCurrentUser(); // вызов функции
    const excludedFields = new Set(['date_joined', 'is_staff', 'is_active', 'email', 'is_superuser', 'last_login', 'id']);
    const fieldMapping = {
        password: () => "********",
        completed: (value) => value ? "Задача выполнена" : "Задача не выполнена",
        assigned_to: (value) => getDisplayValue(value, users),
        submitted_by: (value) => getDisplayValue(value, users),
        user: (value) => getDisplayValue(value, users),
        resource: (value) => getDisplayValue(value, resources),
        stage: (value) => getDisplayValue(value, stages),
        resource_type: (value) => getDisplayValue(value, resource_types),
        task: (value) => getDisplayValue(value, tasks.filter((task) => task.assigned_to === currentUser.user_id)),
        project: (value) => getDisplayValue(value, projects),
        role: (value) => getDisplayValue(value, roles),
    };
    //form
    const fieldComponents = {
        completed: (field) => (
            <div key={field} className="form-group">
                <label>{translateField(field)}</label>
                <input
                    type="checkbox"
                    name={field}
                    checked={!!formData[field]}
                    onChange={(e) =>
                        setFormData({...formData, [field]: e.target.checked})
                    }
                    className="crud-checkbox"
                />
            </div>
        ),
        assigned_to: (field) => renderSelect(field, users, "username", "Выберите пользователя"),
        task: (field) => renderSelect(
            field,
            tasks.filter((task) => String(task.assigned_to) === String(currentUser.user_id)),
            "name",
            "Выберите Задачу"
        ),

        stage: (field) => renderSelect(field, stages, "name", "Выберите этап"),
        resource: (field) => renderSelect(field, resources, "name", "Выберите ресурс"),
        resource_type: (field) => renderSelect(field, resource_types, "name", "Выберите тип ресурса"),
        project: (field) => renderSelect(field, projects, "name", "Выберите проект"),
        role: (field) => renderSelect(field, roles, "name", "Выберите роль"),
        user: (field) => renderSelect(field, users, "username", "Выберите пользователя"),
        status: (field) => renderSelect(field, ['Выполнен', 'Не выполнен', 'Остановлен', 'В процессе'], null, "Выберите статус"),
        distribution_date: renderDatePicker,
        transaction_date: renderDatePicker,

    };

    const excludedFields2 = new Set(['id', 'submitted_by', 'date_joined', 'is_staff', 'is_active', 'email', 'is_superuser', 'last_login', ...(modelName === 'users' ? ['password', 'username'] : []), ...(modelName === 'ActionLog' ? ['user'] : [])]);

    function renderSelect(field, entities, displayField, placeholder) {
        const isWorker = userRole === 'Рабочий';
        const filteredEntities = isWorker
            ? entities.filter((entity) => entity.id === currentUser.user_id)
            : entities;

        return (
            <div key={field} className="form-group">
                <label>{translateField(field)}</label>
                <select
                    name={field}
                    value={formData[field] || ''}
                    onChange={handleChange}
                    className="crud-select"
                >
                    <option value="">{placeholder}</option>
                    {Array.isArray(entities) &&
                        entities.map((entity) => (
                            <option key={entity.id || entity} value={entity.id || entity}>
                                {displayField ? entity[displayField] : entity}
                            </option>
                        ))}
                </select>
            </div>
        );
    }

    function renderDatePicker(field) {
        return (
            <div key={field} className="form-group">
                <label>{translateField(field)}</label>
                <DatePicker
                    selected={formData[field] || null}
                    onChange={(date) =>
                        handleChange({target: {name: field, value: date}})
                    }
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Выберите дату"
                    className="crud-datepicker"
                />
            </div>
        );
    }

    //Группы вывода


    return (

        <div className={"Main-container"}>


            <div className="crud-container">
                <h2 className="crud-title"> {translateField(modelName)}</h2>
                {/* Search, Filter, and Sort Controls */}
                {modelName !== 'ActionLog' && (
                    <div className="crud-controls">
                        <input
                            type="text"
                            placeholder="Поиск..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="crud-input"
                        />
                        <select
                            onChange={(e) => setSortField(e.target.value)}
                            value={sortField}
                            className="crud-select"
                        >
                            <option value="">Сортировать по</option>
                            {fields.map((field) => (<option key={field} value={field}>
                                {field}
                            </option>))}
                        </select>
                        <select
                            onChange={(e) => setFilterField(e.target.value)}
                            value={filterField}
                            className="crud-select"
                        >
                            <option value="">Фильтровать по</option>
                            {fields.map((field) => (<option key={field} value={field}>
                                {field}
                            </option>))}
                        </select>
                        <input
                            type="text"
                            placeholder="Значение фильтра"
                            value={filterValue}
                            onChange={(e) => setFilterValue(e.target.value)}
                            className="crud-input"
                        />

                        <button onClick={handleSearch} className="crud-button">
                            Применить
                        </button>
                    </div>
                )}


                {/* Table */}
                {modelName !== 'ActionLog' && (
                    <table className="crud-table">

                        <div className="crud-cards">
                            {records.map((record) => (
                                <div key={record.id} className="card"
                                     style={modelName === "profile" ? {minWidth: "100%"} : {width: "fit-content"}}>
                                    <div className="card-header">
                                        <h3>{`Запись ${record.id}`}</h3>
                                    </div>
                                    <div className="card-body">
                                        {fields.map((field) => {
                                            if (excludedFields.has(field)) return null;

                                            const fieldValue = fieldMapping[field]
                                                ? fieldMapping[field](record[field])
                                                : record[field];

                                            return (
                                                <p key={field}
                                                   style={modelName === "profile" ? {minWidth: "100%"} : null}>
                                                    <strong>{translateField(field)}:</strong> {fieldValue}
                                                </p>
                                            );
                                        })}
                                        <div className="card-actions">
                                            <button
                                                className="crud-action-button"
                                                onClick={() => handleEdit(record)}
                                            >
                                                Измнить
                                            </button>
                                            <button
                                                className="crud-action-button"
                                                onClick={() => handleDelete(record.id)}
                                            >
                                                Удалить
                                            </button>
                                        </div>
                                    </div>

                                </div>

                            ))}
                        </div>


                    </table>
                )}
                {modelName === 'ActionLog' && (

                    <div className="log-container">

                        <div className="log-list">
                            {logs.map((log, index) => (
                                <div key={index} className="log-entry">
                                    {log}
                                </div>
                            ))}
                        </div>
                    </div>
                )}


                {/* Пагинация */}
                <div className="pagination">
                    {pagination.previous && (<button
                        className="pagination-button"
                        onClick={() => fetchRecords(pagination.previous)}
                    >
                        Назад
                    </button>)}
                    {pagination.next && (<button
                        className="pagination-button"
                        onClick={() => fetchRecords(pagination.next)}
                    >
                        Вперёд
                    </button>)}
                </div>
                {/* Графики и статистика*/}
                <div className="crud-containerd">
                    {modelName === 'ActionLog' && (

                        <div className="log-container">
                            <h2>Статистика пользователей</h2>
                            <div style={{marginTop: '30px'}}>
                                <h3>Общая статистика</h3>
                                {statistics ? (
                                    <div>
                                        <p>Общее количество пользователей: {statistics.total_users}</p>
                                        <p>Новые пользователи за год: {statistics.total_new_users}</p>
                                        <h4>Соотношение ролей:</h4>
                                        <ul>
                                            {statistics?.role_distribution?.length > 0 ? (
                                                statistics.role_distribution.map((role, index) => (
                                                    <li key={index}>
                                                        {role.role}: {role.percentage}%
                                                    </li>
                                                ))
                                            ) : (
                                                <li>Данные не загружены</li>
                                            )}
                                        </ul>


                                    </div>
                                ) : (
                                    <p>Загрузка статистики...</p>
                                )}
                            </div>


                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '20px',
                                marginTop: '20px'
                            }}>
                                {/* График 1: Статистика по ролям */}
                                <div style={{
                                    backgroundColor: '#f9f9f9',
                                    borderRadius: '10px',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                    padding: '20px',
                                    width: '90%',
                                    color: 'white',
                                    maxWidth: '700px',
                                    display: 'contents',
                                    textAlign: 'center',
                                }}>
                                    <h3 style={{
                                        fontFamily: 'Arial, sans-serif',
                                        fontSize: '1.5rem',
                                        color: '#333',
                                        marginBottom: '15px',
                                    }}>
                                        Пользователи по ролям
                                    </h3>
                                    <img
                                        src={roleChart}
                                        alt="График пользователей по ролям"
                                        style={{
                                            width: '100%',
                                            maxWidth: '600px',
                                            borderRadius: '8px',
                                            border: '1px solid #ddd',
                                        }}
                                    />
                                </div>

                                {/* График 2: Статистика по месяцам */}
                                <div style={{
                                    backgroundColor: '#f9f9f9',
                                    borderRadius: '10px',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                    padding: '20px',
                                    width: '90%',
                                    maxWidth: '700px',
                                    color: 'white',
                                    display: 'contents',
                                    textAlign: 'center',
                                }}>
                                    <h3 style={{
                                        fontFamily: 'Arial, sans-serif',
                                        fontSize: '1.5rem',
                                        color: '#333',
                                        marginBottom: '15px',
                                    }}>
                                        Новые пользователи по месяцам
                                    </h3>
                                    <img
                                        src={monthlyChart}
                                        alt="График новых пользователей по месяцам"
                                        style={{
                                            width: '100%',
                                            maxWidth: '600px',
                                            borderRadius: '8px',
                                            border: '1px solid #ddd',
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="input-panel">
                <form onSubmit={handleSave} className="crud-form">
                    {fields
                        .filter((field) => shouldRenderField(field)) // Используем метод для проверки условий
                        .map((field) => {
                            const renderField = fieldComponents[field] || ((field) => (
                                <div key={field} className="form-group">
                                    <label>{translateField(field)}</label>
                                    <input
                                        type="text"
                                        name={field}
                                        value={formData[field] || ''}
                                        onChange={handleChange}
                                    />
                                </div>
                            ));

                            return renderField(field);
                        })}
                    {shouldRenderField() && (
                        <button type="submit" className="crud-button">
                            {editMode ? 'Обновить' : 'Добавить'}
                        </button>
                    )}
                </form>
            </div>
        </div>
    );

    function shouldRenderField(field) {


        if (excludedFields2.has(field)) return false; // Поле исключено
        if (modelName === 'ActionLog') return false; // Для ActionLog форма не отображается
        if (modelName === 'task' && userRole === 'Рабочий') return false; // Для рабочих не отображается форма задачи

        return true; // Все остальные условия проходят
    }


}
