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