// loadSidebar.js
// import { initSidebar, initToggleButton } from './sidebar.js';

// loadSidebar.js
document.addEventListener('DOMContentLoaded', function() {
    fetch('html/sidebar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('sidebar-container').innerHTML = data;
            document.dispatchEvent(new CustomEvent('sidebarLoaded'));
        })
        .catch(error => console.error('Error loading sidebar:', error));
});


// export function loadSidebar() {
//     fetch('html/header.html')
//         .then(response => response.text())
//         .then(data => {
//             document.getElementById('header-container').innerHTML = data;
//             // document.dispatchEvent(new CustomEvent('headerLoaded')); // Gửi sự kiện tùy chỉnh khi header đã được tải
//         })
//         .catch(error => console.error('Error loading header:', error));
// }

// document.addEventListener('DOMContentLoaded', function () {
//     loadSidebar();
// });