const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minsEl = document.getElementById('mins');
const secondsEl = document.getElementById('seconds');

// Твоя дата
const newYears = '28 jun 2025, 00:00:00';

function countdown() {
    const newYearsDate = new Date(newYears);
    const currentDate = new Date();

    const totalSeconds = (newYearsDate - currentDate) / 1000;

    // Если дата уже прошла, ставим нули
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

// Функция для добавления ведущего нуля (05 вместо 5)
function formatTime(time) {
    return time < 10 ? `0${time}` : time;
}

// Первичный вызов
countdown();

setInterval(countdown, 1000);
