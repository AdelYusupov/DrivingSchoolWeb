import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/header.css';
import '../styles/components/free-lesson-form.css'; // Стили для формы

const Header = () => {
    const [showCallbackModal, setShowCallbackModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        const lastSubmission = localStorage.getItem('lastCallbackSubmit');
        if (lastSubmission && Date.now() - lastSubmission < 30000) {
            alert('Пожалуйста, подождите 30 секунд перед повторной отправкой');
            setIsSubmitting(false);
            return;
        }

        try {
            const botToken = '7947163456:AAF_DkDFYNSjrcHdGquyJHiYBFEr_ax-6PI';
            const chatId = '1188950273';
            const text = `📌 *Запрос обратного звонка*\n
👤 *Имя:* ${formData.name}\n
📱 *Телефон:* ${formData.phone}\n
🕒 *Время:* ${new Date().toLocaleString()}`;

            const response = await fetch(
                `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&parse_mode=Markdown&text=${encodeURIComponent(text)}`
            );

            if (response.ok) {
                alert('✅ Заявка отправлена! Мы свяжемся с вами в ближайшее время.');
                setFormData({ name: '', phone: '' });
                setShowCallbackModal(false);
                localStorage.setItem('lastCallbackSubmit', Date.now());
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

    const openCallbackModal = (e) => {
        e.preventDefault(); // Предотвращаем переход по ссылке
        setShowCallbackModal(true);
    };

    const closeCallbackModal = () => {
        setShowCallbackModal(false);
    };

    return (
        <>
            <header className="main-header">
                <div className="logo">Автошкола McQueen</div>
                <nav className="main-nav">
                    <Link to="/">Главная</Link>
                    <Link to="/about">Об автошколе</Link>
                    <Link to="/team">Команда</Link>
                    <Link to="/reviews">Отзывы</Link>
                    <a href="#callback" onClick={openCallbackModal}>Перезвоните мне</a>
                    <button className="account-btn"><Link to="/login">Аккаунт студента</Link></button>
                </nav>

            </header>

            {/* Модальное окно обратного звонка */}
            {showCallbackModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-modal" onClick={closeCallbackModal}>×</button>
                        <h3>Мы вам перезвоним</h3>
                        <p>Оставьте свои контактные данные, и мы свяжемся с вами в ближайшее время</p>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="callback-name">Ваше имя</label>
                                <input
                                    type="text"
                                    id="callback-name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    minLength="2"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="callback-phone">Ваш телефон</label>
                                <input
                                    type="tel"
                                    id="callback-phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    pattern="[\d\+]{7,15}"
                                    title="Номер телефона должен содержать от 7 до 15 цифр"
                                />
                            </div>
                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <span>Отправка...</span>
                                ) : (
                                    <span>Заказать звонок</span>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;