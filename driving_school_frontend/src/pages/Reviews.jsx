import React from 'react';
import '../styles/components/reviews.css';
import Header from "../components/Header";
import Footer from "../components/Footer";

const Reviews = () => {
    const reviews = [
        {
            id: 1,
            author: "Городская Легенда",
            date: "Октябрь 2024",
            rating: 5,
            text: "Наконец-то эта школа открылась у нас в Казани. Много рекламы видел в других городах. Уже не терпится пройти обучение здесь и сесть за руль! Инструкторы очень профессиональные, объясняют все доступно. Особенно понравился индивидуальный подход к каждому ученику.",
            shortText: "Наконец-то эта школа открылась у нас в Казани. Много рекламы видел в других городах. Уже не терпится пройти обучение здесь и есть за руль!"
        },
        {
            id: 2,
            author: "Игорь Лапшин",
            date: "29 ноября 2024",
            rating: 4,
            text: "Хорошая автошкола, отзывчивые менеджеры. Все рассказали, все показали, записали в ближайшую группу. Очень удобно, что есть возможность заниматься по гибкому графику. Единственное - хотелось бы больше практических занятий в городе.",
            shortText: "Хорошая автошкола, отзывчивые менеджеры. Все рассказали, все показали, записали в ближайшую группу. Очень удобно, что есть..."
        },
        {
            id: 3,
            author: "Ледяной Кристалл",
            date: "8 января 2025",
            rating: 5,
            text: "Хорошая автошкола, все понятно и качественно объясняют. Менеджеры всегда на связи, всем советую! Особенно понравилось, что теорию преподают не сухо, а с примерами из реальной жизни. Практические занятия проходят на новых автомобилях.",
            shortText: "Хорошая автошкола, все понятно и качественно объясняют. Менеджеры всегда на связи, всем советуют!"
        },
        {
            id: 4,
            author: "Татьяна М",
            date: "Декабрь 2024",
            rating: 5,
            text: "Очень рада, что в нашем городе открылась автошкола McQueen! Увидела рекламу и подумала записаться на вождение, как раз появилось свободное время. Осталась очень довольна - сдала экзамен с первого раза! Особенно хочу поблагодарить инструктора Александра за терпение и профессионализм.",
            shortText: "Очень рада, что в нашем городе открылась автошкола! Увидела рекламу и подумала записаться на вождение, как раз появилось..."
        },
        {
            id: 5,
            author: "Сергей Ветров",
            date: "15 февраля 2025",
            rating: 4,
            text: "Прошел обучение на категорию B. В целом все понравилось, особенно подход к практическим занятиям. Теорию преподают интересно, не занудно. Минус - немного далеко расположен автодром от центра города, но это мелочи.",
            shortText: "Прошел обучение на категорию B. В целом все понравилось, особенно подход к практическим занятиям. Теорию преподают интересно..."
        },
        {
            id: 6,
            author: "Анна К.",
            date: "3 марта 2025",
            rating: 5,
            text: "Лучшая автошкола в городе! Прошла обучение за 2 месяца, сдала экзамены без проблем. Отдельное спасибо инструктору Марине - очень спокойный и профессиональный человек, научила не бояться дороги. Рекомендую всем своим знакомым!",
            shortText: "Лучшая автошкола в городе! Прошла обучение за 2 месяца, сдала экзамены без проблем. Отдельное спасибо инструктору Марине..."
        }
    ];

    const [expandedReview, setExpandedReview] = React.useState(null);

    const toggleReview = (id) => {
        setExpandedReview(expandedReview === id ? null : id);
    };

    return (
        <div className='rewiews'>
            <Header/>
        <div className="reviews-page" style={{ backgroundColor: '#F7F4E1' }}>
            <div className="reviews-container">
                <h1 className="reviews-title">Отзывы</h1>
                <p className="reviews-subtitle">Наши ученики о нас</p>

                <div className="rating-section">
                    <div className="rating-value">4,9</div>
                    <div className="rating-stars">
                        {[...Array(5)].map((_, i) => (
                            <span key={i} className="star">★</span>
                        ))}
                    </div>
                    <button className="leave-review-btn">Оставить отзыв</button>
                </div>

                <div className="reviews-list">
                    {reviews.map(review => (
                        <div key={review.id} className="review-card">
                            <div className="review-header">
                                <h2 className="review-author">{review.id}. {review.author}</h2>
                                <span className="review-date">{review.date}</span>
                            </div>
                            <div className="review-rating">
                                {[...Array(5)].map((_, i) => (
                                    <span
                                        key={i}
                                        className={`star ${i < review.rating ? 'filled' : ''}`}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                            <div className="review-text">
                                {expandedReview === review.id ? review.text : review.shortText}
                            </div>
                            <button
                                className="read-more-btn"
                                onClick={() => toggleReview(review.id)}
                            >
                                {expandedReview === review.id ? 'Свернуть' : 'Читать целиком'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

        </div>
            <Footer/>
        </div>
    );
};

export default Reviews;