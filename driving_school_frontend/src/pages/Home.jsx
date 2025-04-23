import React from 'react';
import Header from '../components/Header';
import HeroBanner from '../components/HeroBanner';
import Footer from '../components/Footer';
import FreeLesson from "../components/FreeLesson";

const Home = () => {
    return (
        <div className="home-page" style={{ backgroundColor: '#F7F4E1' }}>
            <Header />
            <HeroBanner />
            <FreeLesson/>
            <Footer />
        </div>
    );
};

export default Home;