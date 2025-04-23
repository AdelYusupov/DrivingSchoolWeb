import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/components/profile.css";

const Profile = () => {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("studentToken");
        const studentData = localStorage.getItem("studentData");

        if (!token || !studentData) {
            navigate("/login");
            return;
        }

        try {
            const parsedData = JSON.parse(studentData);
            setStudent(parsedData);
        } catch (err) {
            console.error("Ошибка при загрузке данных:", err);
            navigate("/login");
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("studentToken");
        localStorage.removeItem("studentData");
        navigate("/login");
    };

    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (!student) {
        return <div>Ошибка загрузки профиля</div>;
    }

    return (
        <div className="profile-page" style={{ backgroundColor: "#F7F4E1" }}>
            <Header />
            <main className="profile-container">
                <h2 className="profile-title">Личный кабинет</h2>

                <div className="profile-info">
                    <div className="info-card">
                        <h3>Основная информация</h3>
                        <p><strong>ФИО:</strong> {student.fullName}</p>
                        <p><strong>Логин:</strong> {student.login}</p>
                        <p><strong>Email:</strong> {student.email}</p>
                    </div>

                    <div className="info-card">
                        <h3>Прогресс обучения</h3>
                        <p><strong>Статус:</strong> {student.status || "Активен"}</p>
                    </div>
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