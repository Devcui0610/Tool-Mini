// js/sidebar.js
import { initClock } from './clock.js';
import { initCalendar } from './calendar.js';
import { initTooltip } from './tooltip.js';

export function initSidebar() {
    // Gọi các hàm khởi tạo cho sidebar
    initClock();
    initCalendar();
    initTooltip();
}

// Hàm khởi tạo ẩn/hiện sidebar
export function initToggleButton() {
    const toggleBtn = document.getElementById("toggle-btn-home");
    const sidebar = document.getElementById("sidebar-home");
    const content = document.getElementById("content-home");

    if (toggleBtn) {
        toggleBtn.addEventListener("click", function () {
            if (sidebar && content) {
                sidebar.classList.toggle("hidden-home");
                content.classList.toggle("full-width");
            } else {
                console.error('Sidebar hoặc Content không tồn tại.');
            }
        });
    } else {
        console.error('Element với id "toggle-btn-home" không tìm thấy.');
    }
}

// Hàm khởi tạo Dark Mode
export function initDarkMode() {
    const toggleDarkMode = document.getElementById('toggle-dark-mode');
    if (toggleDarkMode) {
        toggleDarkMode.addEventListener('change', function () {
            if (this.checked) {
                document.documentElement.classList.add('dark-mode');
                localStorage.setItem("theme", "dark");
            } else {
                document.documentElement.classList.remove('dark-mode');
                localStorage.setItem("theme", "light");
            }
        });

        // Kiểm tra trạng thái dark theme
        const theme = localStorage.getItem("theme");
        if (theme === "dark") {
            document.documentElement.classList.add("dark-mode");
            toggleDarkMode.checked = true;
        }
    } else {
        console.error('Element với id "toggle-dark-mode" không tìm thấy.');
    }
}

// Toggle dark mode
const toggleDarkMode = document.getElementById("toggle-dark-mode");
if (toggleDarkMode) {
    toggleDarkMode.addEventListener("change", function () {
        if (this.checked) {
            document.documentElement.classList.add("dark-mode");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark-mode");
            localStorage.setItem("theme", "light");
        }
    });

    // Kiểm tra trạng thái dark theme
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
        document.documentElement.classList.add("dark-mode");
        toggleDarkMode.checked = true;
    }
}

// Hàm load sidebar
export function loadSidebar() {
    const sidebarContainer = document.getElementById("sidebar-container");
    fetch('html/sidebar.html')
        .then(response => response.text())
        .then(data => {
            sidebarContainer.innerHTML = data;
            initSidebar();
            initToggleButton(); // Gọi hàm khởi tạo sự kiện nút toggle sau khi sidebar đã được tải
            initDarkMode(); // Gọi hàm khởi tạo Dark Mode sau khi sidebar đã được tải
        })
        .catch(error => console.error('Error loading sidebar:', error));
}

// LẮNG NGHE SỰ KIỆN DOM
document.addEventListener('DOMContentLoaded', function () {
    loadSidebar();
})