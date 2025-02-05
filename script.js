let startTime;
let updatedTime;
let difference;
let running = false;
let lapCount = 0;
let lapTimes = [];

const timeDisplay = document.getElementById('timeDisplay');
const startStopButton = document.getElementById('startStopButton');
const lapButton = document.getElementById('lapButton');
const resetButton = document.getElementById('resetButton');
const exportButton = document.getElementById('exportButton');
const lapList = document.getElementById('lapList');

startStopButton.addEventListener('click', toggleStartStop);
lapButton.addEventListener('click', recordLap);
resetButton.addEventListener('click', reset);
exportButton.addEventListener('click', exportCSV);

function toggleStartStop() {
    if (running) {
        stop();
    } else {
        start();
    }
}

function start() {
    running = true;
    startStopButton.textContent = 'Stop';
    lapButton.disabled = false;
    resetButton.disabled = false;

    startTime = new Date().getTime() - (difference || 0);
    updatedTime = setInterval(updateTime, 1);
}

function stop() {
    running = false;
    startStopButton.textContent = 'Start';
    lapButton.disabled = true;
    exportButton.disabled = false;

    clearInterval(updatedTime);
}

function updateTime() {
    difference = new Date().getTime() - startTime;
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);
    const milliseconds = Math.floor((difference / 1000 * 60) % 60);
    timeDisplay.textContent = formatTime(hours, minutes, seconds,milliseconds);
}

function formatTime(hours, minutes, seconds,milliseconds) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(milliseconds)}`;
}

function pad(number) {
    return number < 10 ? '0' + number : number;
}

function recordLap() {
    lapCount++;
    const lapTime = formatTime(
        Math.floor(difference / (1000 * 60 * 60)) % 24,
        Math.floor(difference / (1000 * 60)) % 60,
        Math.floor(difference / 1000) % 60,
        Math.floor(difference / 1000 * 60) % 60
    );

    lapTimes.push(lapTime);
    updateLapList();
}

function updateLapList() {
    lapList.innerHTML = '';
    lapTimes.forEach((lapTime, index) => {
        const li = document.createElement('li');
        li.textContent = `Lap ${index + 1}: ${lapTime}`;
        lapList.appendChild(li);
    });
}

function reset() {
    clearInterval(updatedTime);
    running = false;
    startStopButton.textContent = 'Start';
    lapButton.disabled = true;
    resetButton.disabled = true;
    exportButton.disabled = true;
    lapTimes = [];
    lapCount = 0;
    timeDisplay.textContent = '00:00:00:00';
    lapList.innerHTML = '';
}

function exportCSV() {
    const csvContent = 'Lap Number,Lap Time\n' + lapTimes.map((lapTime, index) => {
        return `${index + 1},${lapTime}`;
    }).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lap_times.csv';
    a.click();
    URL.revokeObjectURL(url);
}


function updateClock() {
    const now = new Date();
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    document.getElementById('date').textContent =
`${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
}

updateClock();
setInterval(updateClock, 1000);