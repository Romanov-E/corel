const NEW_YEARS = '07 jul 2026, 06:00:00';

const CITY_LAT = 62.087929; 
const CITY_LON = 32.373319; 

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


const weatherContainer = document.getElementById('weather-container');

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
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${CITY_LAT}&longitude=${CITY_LON}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=10`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        renderWeather(data.daily);
    } catch (error) {
        console.error("Ошибка получения погоды:", error);
        weatherContainer.innerHTML = '<p>Не удалось загрузить погоду</p>';
    }
}

function renderWeather(daily) {
    weatherContainer.innerHTML = ''; 

    for (let i = 0; i < 10; i++) {
        const dateStr = daily.time[i];
        const maxTemp = Math.round(daily.temperature_2m_max[i]);
        const code = daily.weathercode[i];
        
        const date = new Date(dateStr);
        const dayName = new Intl.DateTimeFormat('ru-RU', { weekday: 'short' }).format(date);
        const dayDate = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'numeric' }).format(date);

        const icon = weatherIcons[code] || '☁️';

        const card = document.createElement('div');
        card.classList.add('weather-day');
        
        card.innerHTML = `
            <span class="weather-date">${dayName} ${dayDate}</span>
            <span class="weather-icon">${icon}</span>
            <span class="weather-temp">${maxTemp > 0 ? '+' : ''}${maxTemp}°</span>
        `;
        
        weatherContainer.appendChild(card);
    }
}

getWeather();

