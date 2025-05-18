import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/components/profile.css";
import axios from "axios";

axios.defaults.baseURL = 'http://localhost:8080';

const Profile = () => {
    const [student, setStudent] = useState(null);
    const [availableLessons, setAvailableLessons] = useState([]);
    const [mySignups, setMySignups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const navigate = useNavigate();

    const fetchStudentData = () => {
        const studentData = localStorage.getItem("studentData");
        if (!studentData) {
            throw new Error("Данные студента не найдены");
        }
        return JSON.parse(studentData);
    };

    const fetchAvailableLessons = async (groupId) => {
        try {
            const token = localStorage.getItem("studentToken");
            const response = await axios.get(`/api/lessons/practice`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data.lessons || [];
        } catch (err) {
            console.error("Ошибка при загрузке занятий:", err);
            if (err.response?.status === 401) {
                handleLogout();
            }
            throw err;
        }
    };

    const fetchMySignups = async () => {
        try {
            const token = localStorage.getItem("studentToken");
            const response = await axios.get(`/api/lessons/my-signups`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log("Ответ от /api/lessons/my-signups:", response.data); // Добавьте это
            return response.data.signups || [];
        } catch (err) {
            console.error("Ошибка при загрузке записей:", err);
            throw err;
        }
    };

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);

            const studentData = fetchStudentData();
            setStudent(studentData);

            if (studentData.group?.id) {
                const [lessons, signups] = await Promise.all([
                    fetchAvailableLessons(studentData.group.id),
                    fetchMySignups()
                ]);
                setAvailableLessons(lessons);
                setMySignups(signups);
            }
        } catch (err) {
            setError(err.response?.data?.error || err.message || "Ошибка при загрузке данных");
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async (lessonId) => {
        try {
            setError(null);
            const token = localStorage.getItem("studentToken");

            await axios.post(
                "/api/lessons/signup",
                { lessonId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setSuccessMessage("Вы успешно записаны на занятие");
            await loadData();
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            setError(err.response?.data?.error || err.message || "Ошибка при записи на занятие");
        }
    };

    const handleCancelSignup = async (signupId) => {
        try {
            setError(null);
            const token = localStorage.getItem("studentToken");

            await axios.delete(
                `/api/lessons/signups/${signupId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setSuccessMessage("Запись успешно отменена");
            await loadData();
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            setError(err.response?.data?.error || err.message || "Ошибка при отмене записи");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("studentToken");
        localStorage.removeItem("studentData");
        navigate("/login");
    };

    useEffect(() => {
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="profile-page" style={{ backgroundColor: "#F7F4E1" }}>
                <Header />
                <main className="profile-container">
                    <div className="loading">Загрузка данных...</div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!student) {
        return (
            <div className="profile-page" style={{ backgroundColor: "#F7F4E1" }}>
                <Header />
                <main className="profile-container">
                    <div className="error">{error || "Ошибка загрузки профиля"}</div>
                    <button onClick={() => navigate("/login")} className="logout-button">
                        Вернуться на страницу входа
                    </button>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="profile-page" style={{ backgroundColor: "#F7F4E1" }}>
            <Header />
            <main className="profile-container">
                <h2 className="profile-title">Личный кабинет</h2>

                {error && (
                    <div className="alert alert-danger" onClick={() => setError(null)}>
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div className="alert alert-success">
                        {successMessage}
                    </div>
                )}

                <div className="profile-info">
                    <div className="info-card">
                        <h3>Основная информация</h3>
                        <p><strong>ФИО:</strong> {student.fullName}</p>
                        <p><strong>Логин:</strong> {student.login}</p>
                        <p><strong>Email:</strong> {student.email}</p>
                        <p><strong>Телефон:</strong> {student.phone}</p>
                    </div>

                    <div className="info-card">
                        <h3>Прогресс обучения</h3>
                        <p><strong>Статус:</strong> {student.status || "Активен"}</p>

                        {student.group && (
                            <>
                                <h3 style={{ marginTop: '20px' }}>Группа</h3>
                                <p><strong>Название:</strong> {student.group.name}</p>
                                <p><strong>Курс:</strong> {student.group.course?.name} ({student.group.course?.category})</p>
                                <p><strong>Расписание:</strong> {student.group.schedule}</p>
                                <p><strong>Инструктор:</strong> {student.group.instructor?.fullName} ({student.group.instructor?.phone})</p>
                            </>
                        )}
                    </div>
                </div>

                <div className="my-signups-section">
                    <h3>Мои записи на занятия</h3>
                    {mySignups.length > 0 ? (
                        <div className="signups-list">
                            {mySignups.map(signup => (
                                <div key={signup.id} className="signup-card">
                                    <div className="signup-info">
                                        <h4>{signup.title}</h4>
                                        <p><strong>Дата и время:</strong> {signup.dateTime}</p>
                                        <p><strong>Продолжительность:</strong> {signup.duration} минут</p>
                                        <p><strong>Место:</strong> {signup.location}</p>
                                        {signup.car && (
                                            <p><strong>Автомобиль:</strong> {signup.car.model} ({signup.car.licensePlate})</p>
                                        )}
                                        <p><strong>Статус:</strong> {signup.status}</p>
                                    </div>
                                    {signup.status === "scheduled" && (
                                        <button
                                            onClick={() => handleCancelSignup(signup.id)}
                                            className="cancel-button"
                                        >
                                            Отменить запись
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="no-signups">У вас нет записей на занятия</p>
                    )}
                </div>

                <div className="available-lessons-section">
                    <h3>Доступные практические занятия</h3>
                    {availableLessons.length > 0 ? (
                        <div className="lessons-list">
                            {availableLessons.map(lesson => (
                                <div key={lesson.id} className="lesson-card">
                                    <div className="lesson-info">
                                        <h4>{lesson.title}</h4>
                                        <p><strong>Дата и время:</strong> {lesson.dateTime}</p>
                                        <p><strong>Продолжительность:</strong> {lesson.duration} минут</p>
                                        <p><strong>Место:</strong> {lesson.location}</p>
                                        {lesson.car && (
                                            <p><strong>Автомобиль:</strong> {lesson.car.model} ({lesson.car.licensePlate})</p>
                                        )}
                                        <p><strong>Описание:</strong> {lesson.description}</p>
                                    </div>
                                    <button
                                        onClick={() => handleSignUp(lesson.id)}
                                        className="signup-button"
                                        disabled={lesson.status !== "planned"}
                                    >
                                        {lesson.status === "planned" ? "Записаться" : "Занято"}
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="no-lessons">Нет доступных практических занятий</p>
                    )}
                </div>

                <div className="profile-actions">
                    <button
                        onClick={handleLogout}
                        className="logout-button"
                    >
                        Выйти из системы
                    </button>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Profile;