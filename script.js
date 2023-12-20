const modal = document.getElementById("work");
const btn = document.getElementById("myBtn");
const span = document.getElementsByClassName("close")[0];
const info_text = document.getElementById("info-text");
const table = document.getElementById("records-table");

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function play() {
    modal.style.display = "block";
}

span.onclick = function () {
    fetchData();
    modal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == modal) {
        fetchData();
        modal.style.display = "none";
    }
}

let canvas = document.querySelector('.modal-body');
let ball = document.getElementById('ball');
let anim = document.getElementById('anim');
let startStopButton = document.getElementById('startStopButton');
let reloadButton = document.getElementById('reloadButton');
let animationId;
let isStop = false;

let record_id = 0;

const getCurrentTimestamp = () => {
    const currentDate = new Date();

    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
    const milliseconds = String(currentDate.getMilliseconds()).padStart(3, '0');

    return `${hours}:${minutes}:${seconds}.${milliseconds}`;
}

const make_record = (text) => {
    timestamp = getCurrentTimestamp();
    info_text.innerText = timestamp + ' ' + text;

    const existingRecords = JSON.parse(localStorage.getItem('records')) || [];
    const record = {
        id: record_id,
        content: text,
        timestamp: timestamp
    };

    existingRecords.push(record);
    const updatedRecordsString = JSON.stringify(existingRecords);
    localStorage.setItem('records', updatedRecordsString);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'save_record.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send('id=' + record_id + '&content=' + text + '&timestamp=' + timestamp);

    record_id++;
};

startStopButton.addEventListener('click', () => {
    if (startStopButton.classList.contains('active')) {
        startStopButton.classList.toggle('active');
        stop();
        startStopButton.innerText = 'Start';
        make_record("Stopped!");
        return;
    }
    startStopButton.classList.toggle('active');
    start();
    startStopButton.innerText = 'Stop'
});

function start() {
    isStop = false;
    reloadButton.disabled = true;
    startStopButton.disabled = false;
    make_record("Started!");
    animateBall();
    reloadButton.disabled = true;
}

function stop() {
    isStop = true;
}

function reload() {
    ball.style.display = 'block';
    reloadButton.disabled = true;
    startStopButton.disabled = false;
    isStop = true;
    make_record("Reloaded!");
    setTimeout(() => start(), 100);
}

function move(x, y, radius, speedX, speedY) {
    const tempFn = () => move(x, y, radius, speedX, speedY);
    if (isStop) {
        cancelAnimationFrame(tempFn);
        return;
    }

    make_record(`Moved ${x}, ${y}`);

    x += speedX;
    y += speedY;

    if (x + radius > canvas.clientWidth) {
        reloadButton.disabled = false;
        startStopButton.disabled = true;

        ball.style.left = x + 'px';
        ball.style.top = y + 'px';

        ball.style.display = 'none';

        make_record("Out of canvas!");

        return;
    }

    if (x < 0) {
        speedX = -speedX;
        make_record("Hit left wall!");
    }

    if (y < 0 || y + radius > canvas.clientHeight) {
        speedY = -speedY;
        make_record("Hit upper or lower wall!");
    }

    ball.style.left = x + 'px';
    ball.style.top = y + 'px';

    animationId = requestAnimationFrame(tempFn);
}

function animateBall() {
    let x = 0;
    let y = 0;
    let radius = 10;
    let speedX = getRandomInt(5);
    let speedY = getRandomInt(5);
    reloadButton.disabled = true;
    startStopButton.disabled = false;

    move(x, y, radius, speedX, speedY);
}

function addRowToTable(data) {
    const tbody = table.getElementsByTagName("tbody")[0];
    const newRow = tbody.insertRow();
    const cell1 = newRow.insertCell(0);
    const cell2 = newRow.insertCell(1);
    const cell3 = newRow.insertCell(2);
    const cell4 = newRow.insertCell(3);

    cell1.innerHTML = data.id;
    cell2.innerHTML = data.timestamp;
    cell3.innerHTML = data.server_timestamp;
    cell4.innerHTML = data.content;
}

function deleteAllRows() {
    const tbody = table.getElementsByTagName("tbody")[0];

    while (tbody.hasChildNodes()) {
        tbody.removeChild(tbody.firstChild);
    }
}

function fetchData() {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            deleteAllRows();
            const jsonData = JSON.parse(xhr.responseText);
            if (jsonData) {
                jsonData.forEach(function (section) {
                    addRowToTable(section);
                });
            }
        }
    };
    xhr.open('GET', 'get_data.php', true);
    xhr.send();
}

function deleteData() {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            if (response.status === 'success') {
                localStorage.clear();
                deleteAllRows();
            } else {
                alert(response.message);
            }
        }
    };
    xhr.open('GET', 'delete_data.php', true);
    xhr.send();
}

fetchData();
