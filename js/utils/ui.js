// utils/ui.js
export function showSaveIcon(iconId) {
    const icon = document.getElementById(iconId);
    if (icon) {
        icon.classList.add('show');
        setTimeout(() => {
            icon.classList.remove('show');
        }, 3000);
    }
}