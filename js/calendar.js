// js/calendar.js
import { saveToLocalStorage, loadFromLocalStorage } from './utils/local-storage.js';

export function initCalendar() {
    const monthNames = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
        "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
    const weekdays = ["CN", "Hai", "Ba", "Tư", "Năm", "Sáu", "Bảy"];

    const prev = document.querySelector(".prev");
    const next = document.querySelector(".next");
    const monthElement = document.querySelector(".month h1");
    const dateElement = document.querySelector(".month p");
    const daysElement = document.querySelector(".days");

    let currentDate = new Date();

    function renderCalendar(date) {
        const month = date.getMonth();
        const year = date.getFullYear();

        monthElement.textContent = monthNames[month];
        dateElement.textContent = `${date.getDate()} ${monthNames[month]} Năm ${year}`;

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
        const lastDayOfPreviousMonth = new Date(year, month, 0).getDate();

        daysElement.innerHTML = "";

        // Previous month's days
        for (let i = firstDayOfMonth; i > 0; i--) {
            const day = lastDayOfPreviousMonth - i + 1;
            daysElement.innerHTML += `<div class="previous-days">${day}<span class="lunar">${getLunarDate(year, month - 1, day)}</span></div>`;
        }

        // Current month's days
        for (let i = 1; i <= lastDayOfMonth; i++) {
            if (i === date.getDate() && year === new Date().getFullYear() && month === new Date().getMonth()) {
                daysElement.innerHTML += `<div class="today">${i}<span class="lunar">${getLunarDate(year, month, i)}</span></div>`;
            } else {
                daysElement.innerHTML += `<div>${i}<span class="lunar">${getLunarDate(year, month, i)}</span></div>`;
            }
        }

        // Next month's days
        const totalDays = daysElement.childElementCount;
        for (let i = 1; i <= (42 - totalDays); i++) {
            daysElement.innerHTML += `<div class="next-days">${i}<span class="lunar">${getLunarDate(year, month + 1, i)}</span></div>`;
        }
    }

    function getLunarDate(year, month, day) {
        const solarDate = moment(`${year}-${month + 1}-${day}`, "YYYY-MM-DD");
        const lunarDate = solarDate.lunar();
        return `${lunarDate.format('D')}/${lunarDate.format('M')}`;  // Format the lunar date as desired
    }

    prev.addEventListener("click", function () {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate);
    });

    next.addEventListener("click", function () {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate);
    });

    renderCalendar(currentDate);
}