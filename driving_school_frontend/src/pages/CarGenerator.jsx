import React, { useState } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import '../styles/components/car-generator.css';

const CarGenerator = () => {
    const [carParams, setCarParams] = useState({
        bodyType: 'sedan',
        color: 'red',
        style: 'sport',
        era: 'modern'
    });

    const [filteredCars, setFilteredCars] = useState([]);
    const [selectedCar, setSelectedCar] = useState(null);

    const bodyTypes = ['sedan', 'SUV', 'coupe', 'hatchback', 'pickup'];
    const colors = ['red', 'blue', 'black', 'white', 'silver', 'yellow'];
    const styles = ['sport', 'luxury', 'classic', 'cyberpunk', 'retro'];
    const eras = ['modern', 'futuristic', '1980s', 'vintage'];

    const carDatabase = [
        {
            id: 1,
            bodyType: 'sedan',
            color: 'red',
            style: 'sport',
            era: 'modern',
            model: 'BMW M5',
            image: '/images/cars/bmw-m5-red-sport-modern.jpg'
        },
        {
            id: 2,
            bodyType: 'sedan',
            color: 'white',
            style: 'luxury',
            era: 'modern',
            model: 'Mercedes S-Class',
            image: '/images/cars/mercedes-s-class-blue-luxury-modern.jpeg'
        },
    ];

    const handleParamChange = (param, value) => {
        const newParams = {
            ...carParams,
            [param]: value
        };
        setCarParams(newParams);
        filterCars(newParams);
    };

    const filterCars = (params) => {
        const result = carDatabase.filter(car =>
            car.bodyType === params.bodyType &&
            car.color === params.color &&
            car.style === params.style &&
            car.era === params.era
        );
        setFilteredCars(result);
        setSelectedCar(result.length > 0 ? result[0] : null);
    };

    return (
        <div className="car-gen" style={{ backgroundColor: '#F7F4E1' }}>
            <Header />
            <div className="car-generator-container">
                <h2>Создай свою уникальную машину</h2>
                <p className="subtitle">Выберите параметры и получите подборку автомобилей</p>

                <div className="controls-section">
                    <div className="param-group">
                        <label>Тип кузова:</label>
                        <select
                            value={carParams.bodyType}
                            onChange={(e) => handleParamChange('bodyType', e.target.value)}
                        >
                            {bodyTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    <div className="param-group">
                        <label>Цвет:</label>
                        <select
                            value={carParams.color}
                            onChange={(e) => handleParamChange('color', e.target.value)}
                        >
                            {colors.map(color => (
                                <option key={color} value={color}>{color}</option>
                            ))}
                        </select>
                    </div>

                    <div className="param-group">
                        <label>Стиль:</label>
                        <select
                            value={carParams.style}
                            onChange={(e) => handleParamChange('style', e.target.value)}
                        >
                            {styles.map(style => (
                                <option key={style} value={style}>{style}</option>
                            ))}
                        </select>
                    </div>

                    <div className="param-group">
                        <label>Эпоха:</label>
                        <select
                            value={carParams.era}
                            onChange={(e) => handleParamChange('era', e.target.value)}
                        >
                            {eras.map(era => (
                                <option key={era} value={era}>{era}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {selectedCar ? (
                    <div className="result-section">
                        <h3>{selectedCar.model}</h3>
                        <div className="image-container">
                            <img
                                src={selectedCar.image}
                                alt={`${selectedCar.model}`}
                                className="generated-image"
                            />
                        </div>
                        <div className="car-specs">
                            <p><strong>Тип:</strong> {selectedCar.bodyType}</p>
                            <p><strong>Цвет:</strong> {selectedCar.color}</p>
                            <p><strong>Стиль:</strong> {selectedCar.style}</p>
                            <p><strong>Эпоха:</strong> {selectedCar.era}</p>
                        </div>
                    </div>
                ) : (
                    <div className="placeholder">
                        <p>Нет автомобилей с выбранными параметрами</p>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default CarGenerator;