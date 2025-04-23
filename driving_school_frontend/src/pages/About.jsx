import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/components/about-page.css';
import StatsSection from "../components/StatsSection";
import BestTeam from "../components/BestTeam";
import FreeLesson from "../components/FreeLesson";
import InviteTeam from "../components/InviteTeam";

const About = () => {
    return (
        <div className="about-page">
            <Header />
            <main className="about-main">
                <div className="about-container">
                    <div className="about-image">
                        <img src="/images/about.png" alt="Автошкола McQueen" />
                    </div>
                    <div className="about-content">
                        <h1>Об автошколе McQueen</h1>
                        <p className="about-description">
                            Научим уверенно управлять транспортом<br />
                            и не бояться дороги
                        </p>
                    </div>
                </div>
            </main>
            <StatsSection/>
            <BestTeam/>
            <InviteTeam/>
            <Footer />
        </div>
    );
};

export default About;