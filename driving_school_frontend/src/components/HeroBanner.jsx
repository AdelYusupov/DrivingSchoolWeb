import React, { useState } from 'react';
import '../styles/components/hero-banner.css';

const HeroBanner = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        category: ''
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

        try {
            const botToken = '7947163456:AAF_DkDFYNSjrcHdGquyJHiYBFEr_ax-6PI';
            const chatId = '1188950273';
            const text = `📌 *Новая заявка на обучение*\n
👤 *Имя:* ${formData.name}\n
📱 *Телефон:* ${formData.phone}\n
🚗 *Категория:* ${formData.category}\n
🕒 *Время:* ${new Date().toLocaleString()}`;

            const response = await fetch(
                `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&parse_mode=Markdown&text=${encodeURIComponent(text)}`
            );

            if (response.ok) {
                alert('✅ Заявка отправлена! Мы свяжемся с вами в ближайшее время.');
                setFormData({ name: '', phone: '', category: '' });
                setShowModal(false);
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

    const openModal = (category) => {
        setSelectedCategory(category);
        setFormData(prev => ({
            ...prev,
            category: category
        }));
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedCategory('');
    };

    return (
        <div className="hero-container">
            {/* Баннер с изображением */}
            <div className="hero-banner" style={{ backgroundImage: 'url(/images/mcqueen-bg.png)' }}>
                <div className="hero-content">
                    <h1>Автошкола №1 по качеству обучения</h1>
                    <h2>McQueen</h2>
                </div>
            </div>

            {/* Блок с тремя колонками */}
            <div className="features-section" style={{ backgroundColor: '#F7F4E1' }}>
                <div className="container">
                    <div className="features-grid">
                        <div className="feature-card">
                            <h3>Обучаем управлять</h3>
                            <p>По-настоящему опытные инструкторы обучают безопасному и уверенному вождению. Индивидуальный график практических занятий для каждого студента.</p>
                        </div>

                        <div className="feature-card">
                            <h3>Выгодная оплата</h3>
                            <p>Начать обучение можно с первоначального взноса 5000 рублей. На остальную сумму можно оформить рассрочку.</p>
                        </div>

                        <div className="feature-card">
                            <h3>Все виды категорий</h3>
                            <p>Обучаем не только на базовые категории A, B, C, но и на такие уникальные, как D, BE, CE, DE. Также учим управлять снегоходами и квадроциклами. Наш автопарк насчитывает более 80 единиц техники.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="cta-banner" style={{ backgroundImage: 'url(/images/cta-bg.png)' }}>
                <div className="cta-content">
                    <h3>ПРОЙДИТЕ УСПЕШНОЕ<br/>ОБУЧЕНИЕ В АВТОШКОЛЕ</h3>
                    <a href="#free-lesson-form" className="cta-button">Записаться на бесплатный урок</a>
                </div>
            </div>
            <div className="categories-section" style={{ backgroundColor: '#F7F4E1', padding: '60px 0' }}>
                <div className="container">
                    <h2 className="categories-title">Категории обучения</h2>
                    <div className="categories-grid">
                        <div className="category-card" onClick={() => openModal('Категория A')}>
                            <img src="/images/category-a.png" alt="Категория A" className="category-image" />
                        </div>
                        <div className="category-card" onClick={() => openModal('Категория B')}>
                            <img src="/images/category-b.png" alt="Категория B" className="category-image" />
                        </div>
                        <div className="category-card" onClick={() => openModal('Категория C')}>
                            <img src="/images/category-c.png" alt="Категория C" className="category-image" />
                        </div>
                        <div className="category-card" onClick={() => openModal('Категория D')}>
                            <img src="/images/category-d.png" alt="Категория D" className="category-image" />
                        </div>
                    </div>
                </div>
            </div>
            <section className="confidence-section" style={{ backgroundColor: '#F7F4E1', padding: '60px 0' }}>
                <div className="container">
                    <h2 className="section-title">Обучим уверенному вождению</h2>
                    {/* Первый блок - текст слева, изображение справа */}
                    <div className="confidence-block">
                        <div className="confidence-text">
                            <p>
                                Обучаем уверенному вождению, чтобы получив водительское удостоверение, Вы сели за руль и не чувствовали себя неловко на улицах города и не растерялись, оказавших в условиях бездорожья. Наши курсанты водят не просто уверенно – они управляют транспортным средством аккуратно, уважая других участников дорожного движения и не подвергая опасности ни себя, ни окружающих.
                            </p>
                        </div>

                        <div className="confidence-image">
                            <img src="/images/person1.jpg" alt="Директор автошколы" />
                        </div>
                    </div>

                    {/* Второй блок - изображение слева, текст справа */}
                    <div className="confidence-block reversed">
                        <div className="confidence-text">
                            <p>
                                Мы знаем и научим – в каких ситуациях нужно действовать стремительно по заданному алгоритму, а где нужно притормозить и выждать паузу, не совершая необдуманных манёвров. Причём это касается не только легковых автомобилей. Наши инструкторы виртуозно владеют навыкам управления мотоциклами, грузовыми машинами, квадроциклами, автобусами – и передадут эти знания Вам в понятной форме. Если у Вас уже есть автомобиль и Вы решили отправиться в путешествие, купив прицеп для самых важных и необходимых в странствии вещей – мы и тут придём на помощь, обучив, как безопасно вести машину с прицепом. Наш обширный автопарк позволяет обучить Вам управлению любой мечтой. Никаких комплексов и страхов! Вы подружитесь и с нашими инструкторами, и с автомобилями!
                            </p>
                        </div>
                        <div className="confidence-image">
                            <img src="/images/person2.jpg" alt="Инструктор автошколы" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Модальное окно для заявки на обучение */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-modal" onClick={closeModal}>×</button>
                        <h3>Заявка на обучение ({selectedCategory})</h3>
                        <p>Оставьте свои контактные данные, и мы свяжемся с вами для уточнения деталей</p>

                        <form onSubmit={handleSubmit}>
                            <input type="hidden" name="category" value={selectedCategory} />
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
                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HeroBanner;