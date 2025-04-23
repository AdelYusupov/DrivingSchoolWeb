import React from 'react';
import '../styles/components/best-team.css';

const BestTeam = () => {
    return (
        <section className="best-team-section">
            <div className="container">
                <div className="best-team-content">
                    {/* Левая часть с текстом */}
                    <div className="best-team-text">
                        <h2 className="section-title">Команда лучших</h2>
                        <p className="section-description">
                            Почти все наши курсанты сдают экзамены в ГИБДД с первого раза. Мы разработали
                            эффективную программу обучения для того, чтобы Вы были уверенными в себе.
                            Но помните: на стресс, рассеянность и усталость может повлиять только сам человек.
                        </p>
                    </div>

                    {/* Правая часть с кнопкой */}
                    <div className="best-team-action">
                        <a href="/team" className="team-button">
                            Перейти к инструкторам
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BestTeam;