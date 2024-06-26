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


export function loadHeader() {
    fetch('html/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-container').innerHTML = data;
            document.dispatchEvent(new CustomEvent('headerLoaded'));
        })
        .catch(error => console.error('Error loading header:', error));
}