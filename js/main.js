import { loadHeader } from './loadHeader.js';


// Khôi phục dữ liệu inputContainer từ Local Storage
function loadInputContainer() {
    const savedInputContainer = localStorage.getItem("inputContainer");
    if (savedInputContainer) {
        const inputContainer = document.getElementById("inputContainer");
        if (inputContainer) {
            inputContainer.innerHTML = savedInputContainer;
            const lineContents = document.querySelectorAll(".line-content");
            lineContents.forEach((lineContent) => {
                lineContent.addEventListener("input", updateOutput);
            });
        } else {
            console.error("Element with ID 'inputContainer' not found.");
        }
    }
}

// END Hàm từ Format Text

// LẮNG NGHE SỰ KIỆN DOM
document.addEventListener('DOMContentLoaded', function () {
    loadHeader();
    
    // Lắng nghe button để xử lý chuyển đổi theme sáng tối
    const toggleDarkMode = document.getElementById('toggle-dark-mode');
    if (toggleDarkMode) {
        toggleDarkMode.addEventListener('change', function () {
            if (this.checked) {
                console.log('Dark mode enabled');
                document.documentElement.classList.add('dark-mode');
                localStorage.setItem("theme", "dark");
            } else {
                console.log('Dark mode disabled');
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
    }

    // Hàm xác nhận trước khi xóa cache
    const clearCacheButton = document.getElementById('clear-cache-button'); // ID giả định cho nút xóa cache
    if (clearCacheButton) {
        clearCacheButton.addEventListener('click', confirmClearCache);
    }

    // Khôi phục dữ liệu từ Local Storage
    if (document.getElementById("board") && document.querySelector("#archive .cards")) {
        if (typeof loadFromLocalStorage === 'function') loadFromLocalStorage();
    }
    if (typeof loadNotesFromLocalStorage === 'function') loadNotesFromLocalStorage();
    if (typeof loadInputContainer === 'function') loadInputContainer();
    if (typeof loadOutput === 'function') loadOutput();
    if (typeof loadBackups === 'function') loadBackups();
});