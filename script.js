/* --- НАСТРОЙКИ --- */
const NEW_YEARS = '28 jun 2025, 00:00:00';

// Координаты города (сейчас Сортавала, Карелия)
// Можно взять из Google Maps (клик правой кнопкой -> "Что здесь?")
const CITY_LAT = 61.70; 
const CITY_LON = 30.69; 

/* --- ТАЙМЕР --- */
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minsEl = document.getElementById('mins');
const secondsEl = document.getElementById('seconds');

function countdown() {
    const newYearsDate = new Date(NEW_YEARS);
    const currentDate = new Date();
    const totalSeconds = (newYearsDate - currentDate) / 1000;

    if (totalSeconds < 0) {
        daysEl.innerHTML = "00";
        hoursEl.innerHTML = "00";
        minsEl.innerHTML = "00";
        secondsEl.innerHTML = "00";
        return;
    }

    const days = Math.floor(totalSeconds / 3600 / 24);
    const hours = Math.floor(totalSeconds / 3600) % 24;
    const mins = Math.floor(totalSeconds / 60) % 60;
    const seconds = Math.floor(totalSeconds) % 60;

    daysEl.innerHTML = formatTime(days);
    hoursEl.innerHTML = formatTime(hours);
    minsEl.innerHTML = formatTime(mins);
    secondsEl.innerHTML = formatTime(seconds);
}

function formatTime(time) {
    return time < 10 ? `0${time}` : time;
}

countdown();
setInterval(countdown, 1000);


/* --- ПОГОДА (Open-Meteo API) --- */
const weatherContainer = document.getElementById('weather-container');

// Коды погоды WMO в эмодзи
const weatherIcons = {
    0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️', 
    45: '🌫️', 48: '🌫️', 
    51: '🌦️', 53: '🌦️', 55: '🌧️', 
    61: '🌧️', 63: '🌧️', 65: '🌧️', 
    71: '❄️', 73: '❄️', 75: '❄️', 
    80: '🌦️', 81: '🌧️', 82: '⛈️',
    95: '⛈️', 96: '⛈️', 99: '⛈️'
};

async function getWeather() {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${CITY_LAT}&longitude=${CITY_LON}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        renderWeather(data.daily);
    } catch (error) {
        console.error("Ошибка получения погоды:", error);
        weatherContainer.innerHTML = '<p>Не удалось загрузить погоду :(</p>';
    }
}

function renderWeather(daily) {
    weatherContainer.innerHTML = ''; // Очищаем "Загрузка..."

    // API возвращает массивы данных, проходим по 7 дням
    for (let i = 0; i < 7; i++) {
        const dateStr = daily.time[i];
        const maxTemp = Math.round(daily.temperature_2m_max[i]);
        const minTemp = Math.round(daily.temperature_2m_min[i]);
        const code = daily.weathercode[i];
        
        // Получаем день недели
        const date = new Date(dateStr);
        const dayName = new Intl.DateTimeFormat('ru-RU', { weekday: 'short' }).format(date);
        const dayDate = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'numeric' }).format(date);

        // Иконка (или облачко по умолчанию)
        const icon = weatherIcons[code] || '☁️';

        const card = document.createElement('div');
        card.classList.add('weather-day');
        
        card.innerHTML = `
            <span class="weather-date">${dayName} ${dayDate}</span>
            <span class="weather-icon">${icon}</span>
            <span class="weather-temp">${maxTemp > 0 ? '+' : ''}${maxTemp}°</span>
            <span style="font-size: 0.8em; opacity: 0.7;">${minTemp > 0 ? '+' : ''}${minTemp}°</span>
        `;
        
        weatherContainer.appendChild(card);
    }
}

// Запускаем получение погоды
getWeather();
