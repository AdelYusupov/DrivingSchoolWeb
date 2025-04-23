import React from 'react';
import '../styles/components/footer.css';

const Footer = () => {

    return (
        <footer className="main-footer">
            <div className="footer-container">
                {/* Логотип */}
                <div className="footer-logo">
                    <img src="/images/logo.png" alt="Автошкола McQueen" />
                </div>

                {/* Колонка "Об автошколе" */}
                <div className="footer-column">
                    <h3 className="footer-title">Об автошколе</h3>
                    <ul className="footer-links">
                        <li><a href="/about">Автошкола</a></li>
                        <li><a href="/instructors">Наши инструкторы</a></li>
                        <li><a href="/reviews">Отзывы</a></li>
                    </ul>
                </div>

                {/* Колонка "Категории прав" с двумя подколонками */}
                <div className="footer-column">
                    <h3 className="footer-title">Категории прав</h3>
                    <div className="categories-columns">
                        <ul className="footer-links">
                            <li><a href="/category-a">Категория A</a></li>
                            <li><a href="/category-b">Категория B</a></li>
                        </ul>
                        <ul className="footer-links">
                            <li><a href="/category-c">Категория C</a></li>
                            <li><a href="/category-d">Категория D</a></li>
                        </ul>
                    </div>
                </div>

                {/* Колонка контактов */}
                <div className="footer-column">
                    <h3 className="footer-title">Контакты</h3>
                    <div className="contact-info">
                        <p className="phone">8 (911) 749-26-39</p>
                        <a href="#callback" className="callback-link">Заказать обратный звонок</a>
                        <div className="social-contact">
                            <a href="https://t.me/mcqueen_driving" className="telegram-link">
                                <img src="/images/telegram.png" alt="Telegram" />
                                <span>Написать</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Колонка службы заботы */}
                <div className="footer-column">
                    <h3 className="footer-title">Служба заботы</h3>
                    <div className="care-service">
                        <p className="phone">8 (911) 749-26-39</p>
                        <p>Служба заботы для действующих клиентов</p>
                    </div>
                </div>
            </div>

            <div className="copyright">
                &copy; {new Date().getFullYear()} Автошкола McQueen
            </div>
        </footer>
    );
};

export default Footer;