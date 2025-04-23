import React from 'react';
import '../styles/components/stats-section.css';

const StatsSection = () => {
    return (
        <section className="stats-section">
            <div className="container">
                <div className="stats-grid">
                    {/* Карточка 1 */}
                    <div className="stat-card">
                        <div className="stat-number">17</div>
                        <h3 className="stat-title">Филиалов по городу</h3>
                        <p className="stat-description">
                            Наши курсанты живут в разных районах города. И мы открыли 17 автошкол по всей Казани.
                            Выбираете удобный по расположению филиал, экономите время на дорогу – и обучаетесь
                            в комфортной обстановке.
                        </p>
                    </div>

                    {/* Карточка 2 */}
                    <div className="stat-card">
                        <div className="stat-number">94</div>
                        <h3 className="stat-title">Процент сдачи</h3>
                        <p className="stat-description">
                            Почти все наши курсанты сдают экзамены в ГИБДД с первого раза. Мы разработали
                            эффективную программу обучения для того, чтобы Вы были уверенными в себе.
                            Но помните: на стресс, рассеянность и усталость может повлиять только сам человек.
                        </p>
                    </div>

                    {/* Карточка 3 */}
                    <div className="stat-card">
                        <div className="stat-number">80</div>
                        <h3 className="stat-title">Преподавателей</h3>
                        <p className="stat-description">
                            Во время лекций преподаватели используют наглядные пособия и видеоматериалы.
                            Вождению на площадках обучают опытные автоинструкторы. Автомобили регулярно
                            проверяют на техосмотре в ГИБДД.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StatsSection;