import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import "../styles/components/login.css";

const Login = () => {
    const [credentials, setCredentials] = useState({
        login: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch("http://localhost:8080/api/students/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(credentials)
            });

            if (!response.ok) {
                throw new Error("Ошибка авторизации");
            }

            const data = await response.json();

            // Сохраняем токен в localStorage
            localStorage.setItem("studentToken", data.token);
            localStorage.setItem("studentData", JSON.stringify(data.student));

            // Перенаправляем на страницу билетов
            navigate("/profile");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page" style={{ backgroundColor: "#F7F4E1" }}>
            <Header />
            <main className="login-container">
                <div className="login-form-wrapper">
                    <h2 className="login-title">Авторизация для студентов</h2>
                    <form onSubmit={handleSubmit} className="login-form">
                        {error && <div className="error-message">{error}</div>}

                        <div className="form-group">
                            <label htmlFor="login">Логин</label>
                            <input
                                type="text"
                                id="login"
                                name="login"
                                value={credentials.login}
                                onChange={handleChange}
                                required
                                autoComplete="username"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Пароль</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={credentials.password}
                                onChange={handleChange}
                                required
                                autoComplete="current-password"
                            />
                        </div>

                        <button
                            type="submit"
                            className="login-button"
                            disabled={loading}
                        >
                            {loading ? "Вход..." : "Войти"}
                        </button>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Login;