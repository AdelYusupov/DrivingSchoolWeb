import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import "../styles/components/team.css";
import "../styles/components/free-lesson-form.css";

const Team = () => {
    const [instructors, setInstructors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedInstructor, setSelectedInstructor] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        instructor: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchInstructors = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/instructors", {
                    headers: {
                        Accept: "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setInstructors(data);
            } catch (err) {
                console.error("Ошибка при загрузке инструкторов:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchInstructors();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Проверка номера телефона
        if (!/^[\d\+]{7,15}$/.test(formData.phone)) {
            alert('Пожалуйста, введите корректный номер телефона');
            setIsSubmitting(false);
            return;
        }

        // Проверка на частые отправки
        const lastSubmission = localStorage.getItem('lastFormSubmit');
        if (lastSubmission && Date.now() - lastSubmission < 30000) {
            alert('Пожалуйста, подождите 30 секунд перед повторной отправкой');
            setIsSubmitting(false);
            return;
        }

        try {
            const botToken = '7947163456:AAF_DkDFYNSjrcHdGquyJHiYBFEr_ax-6PI';
            const chatId = '1188950273';
            const text = `📌 *Новая заявка на занятие в автошколу McQueen*\n
👤 *Имя:* ${formData.name}\n
📱 *Телефон:* ${formData.phone}\n
👨‍🏫 *Инструктор:* ${formData.instructor}\n
🕒 *Время:* ${new Date().toLocaleString()}`;

            const response = await fetch(
                `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&parse_mode=Markdown&text=${encodeURIComponent(text)}`
            );

            if (response.ok) {
                alert('✅ Заявка отправлена! Мы свяжемся с вами в ближайшее время.');
                setFormData({ name: '', phone: '', instructor: '' });
                setShowModal(false);
                localStorage.setItem('lastFormSubmit', Date.now());
            } else {
                throw new Error('Ошибка при отправке');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('❌ Произошла ошибка при отправке. Пожалуйста, попробуйте позже.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const openModal = (instructor) => {
        setSelectedInstructor(instructor);
        setFormData(prev => ({
            ...prev,
            instructor: instructor.FullName
        }));
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedInstructor(null);
    };

    return (
        <div className="team-page" style={{ backgroundColor: "#F7F4E1" }}>
            <Header />
            <main className="team-container">
                <h2 className="team-title">Наши инструкторы</h2>

                {loading && <div className="loading-message">Загрузка данных...</div>}

                {error && (
                    <div className="error-message">
                        <p>Ошибка при загрузке данных</p>
                        <p>{error}</p>
                        <p>Пожалуйста, проверьте консоль для подробностей</p>
                    </div>
                )}

                {!loading && !error && (
                    <div className="instructors-grid">
                        {instructors.length > 0 ? (
                            instructors.map((instructor) => (
                                <div key={instructor.ID} className="instructor-card">
                                    <div className="instructor-photo">
                                        <img
                                            src={instructor.photoURL || "/images/default-instructor.jpg"}
                                            alt={instructor.FullName}
                                        />
                                    </div>
                                    <div className="instructor-info">
                                        <h3>{instructor.FullName}</h3>
                                        <p className="experience">
                                            <strong>Стаж:</strong> {instructor.ExperienceYears} лет
                                        </p>
                                        <p className="contact">
                                            <strong>Контакты:</strong> {instructor.Phone}, {instructor.Email}
                                        </p>
                                        <button
                                            className="signup-button"
                                            onClick={() => openModal(instructor)}
                                        >
                                            Записаться на занятие
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>Нет данных об инструкторах</p>
                        )}
                    </div>
                )}

                {/* Модальное окно записи на занятие */}
                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <button className="close-modal" onClick={closeModal}>×</button>
                            <h3>Запись на занятие с {selectedInstructor?.FullName}</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="name">Ваше имя</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        minLength="2"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phone">Ваш телефон</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        pattern="[\d\+]{7,15}"
                                        title="Номер телефона должен содержать от 7 до 15 цифр"
                                    />
                                </div>
                                <input
                                    type="hidden"
                                    name="instructor"
                                    value={formData.instructor}
                                />
                                <button
                                    type="submit"
                                    className="submit-btn"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <span>Отправка...</span>
                                    ) : (
                                        <span>Отправить заявку</span>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default Team;