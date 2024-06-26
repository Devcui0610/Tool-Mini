// js/clock.js
import { saveToLocalStorage, loadFromLocalStorage } from './utils/local-storage.js';

// Hàm khởi tạo đồng hồ
export function initClock() {
    function clock() {
        const hours = document.querySelector(".hours");
        const minutes = document.querySelector(".minutes");
        const seconds = document.querySelector(".seconds");

        hours.innerHTML = new Date().getHours();
        minutes.innerHTML = new Date().getMinutes();
        seconds.innerHTML = new Date().getSeconds();

        if (minutes.innerHTML.toString().length == 1) {
            minutes.innerHTML = "0" + minutes.innerHTML;
        }

        if (seconds.innerHTML.toString().length == 1) {
            seconds.innerHTML = "0" + seconds.innerHTML;
        }

        if (hours.innerHTML.toString().length == 1) {
            hours.innerHTML = "0" + hours.innerHTML;
        }
    }
    setInterval(clock, 1000);
}

// Hàm lưu dữ liệu đồng hồ vào Local Storage (ví dụ: lưu thời gian hiện tại)
export function saveClockToLocalStorage() {
    const currentTime = new Date().toLocaleTimeString();
    saveToLocalStorage('currentTime', currentTime);
}

// Hàm tải dữ liệu đồng hồ từ Local Storage (ví dụ: lấy thời gian đã lưu)
export function loadClockFromLocalStorage() {
    const savedTime = loadFromLocalStorage('currentTime');
    console.log('Loaded time from Local Storage:', savedTime);
}