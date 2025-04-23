import React, { useState } from 'react';
import '../styles/components/free-lesson-form.css';

const FreeLessonForm = () => {
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
        const lastSubmission = localStorage.getItem('lastFormSubmit');
        if (lastSubmission && Date.now() - lastSubmission < 30000) {
            alert('Пожалуйста, подождите 30 секунд перед повторной отправкой');
            setIsSubmitting(false);
            return;
        }

        try {
            const botToken = '7947163456:AAF_DkDFYNSjrcHdGquyJHiYBFEr_ax-6PI';
            const chatId = '1188950273';
            const text = `📌 *Новая заявка на работу в автошколу McQueen*\n
👤 *Имя:* ${formData.name}\n
📱 *Телефон:* ${formData.phone}\n
🕒 *Время:* ${new Date().toLocaleString()}`;

            const response = await fetch(
                `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&parse_mode=Markdown&text=${encodeURIComponent(text)}`
            );

            if (response.ok) {
                alert('✅ Заявка отправлена! Мы свяжемся с вами в ближайшее время.');
                setFormData({ name: '', phone: '' });
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

    return (
        <section  id="free-lesson-form" className="free-lesson-form">
            <div className="container-frl">
                <h2 className="form-title">Хотите стать частью нашей команды? - Напишите нам!</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Имя</label>
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
                        <label htmlFor="phone">Номер телефона</label>
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
        </section>
    );
};

export default FreeLessonForm;