// loadHeader.js
// document.addEventListener('DOMContentLoaded', function() {
//     fetch('html/header.html')
//         .then(response => response.text())
//         .then(data => {
//             document.getElementById('header-container').innerHTML = data;
//             document.dispatchEvent(new CustomEvent('headerLoaded'));
//         })
//         .catch(error => console.error('Error loading header:', error));
// });


// export function loadHeader() {
//     fetch('html/header.html')
//         .then(response => response.text())
//         .then(data => {
//             document.getElementById('header-container').innerHTML = data;
//             document.dispatchEvent(new CustomEvent('headerLoaded'));
//         })
//         .catch(error => console.error('Error loading header:', error));
// }

// document.addEventListener('DOMContentLoaded', function () {
//     loadHeader();
// });

export function loadHeader() {
    fetch('html/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-container').innerHTML = data;
            document.dispatchEvent(new CustomEvent('headerLoaded')); // Gửi sự kiện tùy chỉnh khi header đã được tải
        })
        .catch(error => console.error('Error loading header:', error));
}

document.addEventListener('DOMContentLoaded', function () {
    loadHeader();
});