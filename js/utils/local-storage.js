// js/utils/local-storage.js

// Hàm lưu dữ liệu vào Local Storage
export function saveToLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

// Hàm tải dữ liệu từ Local Storage
export function loadFromLocalStorage(key) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
}

// Hàm xoá dữ liệu từ Local Storage
export function removeFromLocalStorage(key) {
    localStorage.removeItem(key);
}

// Hàm lấy tất cả các mục từ Local Storage
export function getAllFromLocalStorage() {
    const keys = Object.keys(localStorage);
    const allItems = {};
    keys.forEach((key) => {
        allItems[key] = loadFromLocalStorage(key);
    });
    return allItems;
}

// Hàm xoá tất cả các mục từ Local Storage
export function clearLocalStorage() {
    localStorage.clear();
}

// Hàm kiểm tra sự tồn tại của một mục trong Local Storage
export function existsInLocalStorage(key) {
    return localStorage.getItem(key) !== null;
}