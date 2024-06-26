// JS FORMAT TEXT
let lastDeletedLine = null;
let allDeletedLines = null;
let backupCounter = 0;
let currentBackupIndex = null;

function addNewLineToEnd() {
    const line = createNewLineElement();
    document.getElementById("inputContainer").appendChild(line);
    updateOutput();
}

function showAlert(message) {
    const alertBox = document.createElement('div');
    alertBox.className = 'alert-box';
    alertBox.innerText = message;
    document.body.appendChild(alertBox);

    // Thêm CSS cho alert box
    alertBox.style.position = 'fixed';
    alertBox.style.top = '110px';
    alertBox.style.right = '20px';
    alertBox.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    alertBox.style.color = '#fff';
    alertBox.style.padding = '10px';
    alertBox.style.borderRadius = '5px';
    alertBox.style.zIndex = '1000';

    // Tự động ẩn thông báo sau 2 giây
    setTimeout(() => {
        alertBox.remove();
    }, 2000);
}

function copyToClipboard() {
    const outputText = document.getElementById("outputText");
    if (outputText) {
        const range = document.createRange();
        range.selectNodeContents(outputText);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand("copy");
        showAlert("Đã Copy");  // Hiển thị thông báo

        // Loại bỏ lựa chọn văn bản
        selection.removeAllRanges();
    } else {
        console.error("Element with ID 'outputText' not found.");
    }
}

function addLineBelow(button) {
    const line = createNewLineElement();
    const currentLine = button.parentNode.parentNode;
    currentLine.parentNode.insertBefore(line, currentLine.nextSibling);
    updateOutput();
}
function createNewLineElement() {
    const line = document.createElement("div");
    line.className = "line";

    const lineButtons = document.createElement("div");
    lineButtons.className = "line-buttons";

    const buttons = [
        { class: "fas fa-bold", onclick: "boldLine(this)" },
        { class: "fas fa-italic", onclick: "italicLine(this)" },
        { class: "fas fa-asterisk", onclick: "addAsteriskLine(this)" },
        { class: "fas fa-circle", onclick: "addDisc(this)" },
        { class: "fas fa-plus", onclick: "addLineBelow(this)" },
        { class: "fas fa-trash", onclick: "deleteLine(this)" },
    ];

    buttons.forEach(({ class: className, onclick }) => {
        const button = document.createElement("button");
        button.setAttribute("onclick", onclick);

        const icon = document.createElement("i");
        icon.className = className;

        button.appendChild(icon);
        lineButtons.appendChild(button);
    });

    const lineContent = document.createElement("div");
    lineContent.className = "line-content";
    lineContent.setAttribute("contenteditable", "true");
    lineContent.setAttribute("oninput", "updateOutput()");

    line.appendChild(lineButtons);
    line.appendChild(lineContent);

    return line;
}

function getCurrentLineContent(button) {
    return button.parentNode.nextElementSibling;
}

function boldLine(button) {
    const lineContent = getCurrentLineContent(button);
    const text = lineContent.innerText;
    lineContent.innerText =
        text.startsWith("**") && text.endsWith("**") ? text.substring(2, text.length - 2) : `**${text}**`;
    updateOutput();
}

function italicLine(button) {
    const lineContent = getCurrentLineContent(button);
    const text = lineContent.innerText;
    lineContent.innerText =
        text.startsWith("_") && text.endsWith("_") ? text.substring(1, text.length - 1) : `_${text}_`;
    updateOutput();
}

function addAsteriskLine(button) {
    const lineContent = getCurrentLineContent(button);
    const text = lineContent.innerText;
    lineContent.innerText = text.startsWith("* ") ? text.substring(2) : `* ${text}`;
    updateOutput();
}

// Hàm thêm dấu disc li
function addDisc(button) {
    const lineContent = getCurrentLineContent(button);
    const text = lineContent.innerText;
    lineContent.innerText = text.startsWith("• ") ? text.substring(2) : `• ${text}`;
    updateOutput();
}

function deleteLine(button) {
    const line = button.parentNode.parentNode;
    lastDeletedLine = line.cloneNode(true);
    line.parentNode.removeChild(line);
    updateOutput();
}

function deleteAllLines() {
    const inputContainer = document.getElementById("inputContainer");
    allDeletedLines = inputContainer.cloneNode(true);
    inputContainer.innerHTML = "";
    updateOutput();
}

function restoreLastDeletedLine() {
    const inputContainer = document.getElementById("inputContainer");
    if (lastDeletedLine) {
        inputContainer.appendChild(lastDeletedLine);
        lastDeletedLine = null;
        updateOutput();
    } else if (allDeletedLines) {
        inputContainer.innerHTML = "";
        inputContainer.appendChild(allDeletedLines);
        allDeletedLines = null;
        updateOutput();
    }
}

function showClearCacheModal() {
    const clearCacheModal = document.getElementById("clearCacheModal");
    clearCacheModal.style.display = "flex";
}


function updateOutput() {
    const lines = document.querySelectorAll(".line-content");
    let formattedText = "";
    lines.forEach((line) => {
        formattedText += line.innerText + "\n";
    });
    formattedText = formattedText.trim();
    document.getElementById("outputText").innerText = formattedText;
    localStorage.setItem("outputText", formattedText);
    saveInputContainer();
}

// Hàm lưu dữ liệu inputContainer vào Local Storage
function saveInputContainer() {
    const inputContainer = document.getElementById("inputContainer");
    localStorage.setItem("inputContainer", inputContainer.innerHTML);
}

// Hàm lưu dữ liệu outputText vào Local Storage
function saveOutput() {
    const outputText = document.getElementById("outputText").innerText;
    localStorage.setItem("outputText", outputText);
}

// Hàm khôi phục dữ liệu outputText từ Local Storage
function loadOutput() {
    const savedOutputText = localStorage.getItem("outputText");
    if (savedOutputText) {
        document.getElementById("outputText").innerText = savedOutputText;
    }
}

function showModalAlert(message) {
    const modal = document.createElement('div');
    modal.className = 'modal-alert';
    modal.innerHTML = `<div class="modal-alert-content"><p>${message}</p><button onclick="this.parentElement.parentElement.style.display='none'">OK</button></div>`;
    document.body.appendChild(modal);
    modal.style.display = 'flex';
}

function showBackupModal() {
    const backupModal = document.getElementById("backupModal");
    backupModal.style.display = "flex";
}

function saveBackup() {
    const backupName = document.getElementById("backupName").value;
    const backupButtonsContainer = document.getElementById("backupButtons");
    const backupButton = document.createElement("button");
    backupButton.innerHTML = `<i class="fas fa-file"></i>${backupName}`;
    const inputContent = document.getElementById("inputContainer").innerHTML;
    const outputContent = document.getElementById("outputText").innerText;
    const backupIndex = backupButtonsContainer.childElementCount;
    backupButton.onclick = function () {
        currentBackupIndex = backupIndex;
        showBackupOptionsModal();
    };
    backupButtonsContainer.appendChild(backupButton);

    const backups = JSON.parse(localStorage.getItem("backups") || "[]");
    backups.push({ name: backupName, inputContent, outputContent });
    localStorage.setItem("backups", JSON.stringify(backups));

    const backupModal = document.getElementById("backupModal");
    backupModal.style.display = "none";
}

// Hàm từ Format Text
function performClearCache() {
    const confirmation = confirm("Bạn chắc chắn xoá toàn bộ cache chứ?");
    if (!confirmation) {
        return;
    }

    if (typeof saveNotesToLocalStorage === 'function') saveNotesToLocalStorage(); // Lưu dữ liệu ghi chú (tooltip) vào Local Storage
    if (typeof saveToLocalStorage === 'function') saveToLocalStorage(); // Lưu dữ liệu Trello vào Local Storage
    if (typeof saveInputContainer === 'function') saveInputContainer(); // Lưu dữ liệu inputContainer vào Local Storage
    if (typeof saveOutput === 'function') saveOutput(); // Lưu dữ liệu outputText vào Local Storage

    const keepBackups = document.getElementById("keepBackups").checked;
    const backups = JSON.parse(localStorage.getItem("backups") || "[]");
    const notes = JSON.parse(localStorage.getItem("notes") || "[]"); // Lưu dữ liệu tooltip
    const trelloData = localStorage.getItem('trelloData');
    const archivedCards = localStorage.getItem('archivedCards');
    const activityLog = localStorage.getItem('activityLog');

    if (keepBackups) {
        localStorage.clear();
        localStorage.setItem("backups", JSON.stringify(backups));
        localStorage.setItem("notes", JSON.stringify(notes)); // Khôi phục dữ liệu tooltip
        if (trelloData) localStorage.setItem('trelloData', trelloData);
        if (archivedCards) localStorage.setItem('archivedCards', archivedCards);
        if (activityLog) localStorage.setItem('activityLog', activityLog);
    } else {
        localStorage.clear();
    }

    // Khôi phục dữ liệu từ Local Storage
    if (typeof loadFromLocalStorage === 'function') loadFromLocalStorage();
    if (typeof loadNotesFromLocalStorage === 'function') loadNotesFromLocalStorage();
    if (typeof loadInputContainer === 'function') loadInputContainer();
    if (typeof loadOutput === 'function') loadOutput();
    if (typeof loadBackups === 'function') loadBackups();

    location.reload();
}

//Cần check lại
function loadBackups() {
    const backups = JSON.parse(localStorage.getItem("backups") || "[]");
    const backupButtonsContainer = document.getElementById("backupButtons");
    
    // Kiểm tra sự tồn tại của phần tử backupButtonsContainer
    if (!backupButtonsContainer) {
        console.error("Element with ID 'backupButtons' not found.");
        return;
    }
    
    backups.forEach((backup, index) => {
        const backupButton = document.createElement("button");
        backupButton.innerHTML = `<i class="fas fa-file"></i>${backup.name}`;
        backupButton.onclick = function () {
            currentBackupIndex = index;
            showBackupOptionsModal();
        };
        backupButtonsContainer.appendChild(backupButton);
    });
}

function showBackupOptionsModal() {
    const backupOptionsModal = document.getElementById("backupOptionsModal");
    backupOptionsModal.style.display = "flex";
}

function boldSelection() {
    wrapSelection("**");
}

function italicSelection() {
    wrapSelection("_");
}

//Hàm ẩn hiển B I khi click vào button ctr top
function wrapSelection(wrapper) {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const selectedText = range.toString();    // Kiểm tra xem văn bản đã được bao quanh bởi wrapper hay chưa
        if (selectedText.startsWith(wrapper) && selectedText.endsWith(wrapper)) {
            // Loại bỏ wrapper nếu đã có
            const newText = selectedText.slice(wrapper.length, -wrapper.length);
            const newNode = document.createTextNode(newText);
            range.deleteContents();
            range.insertNode(newNode);
        } else {
            // Thêm wrapper nếu chưa có
            const newText = wrapper + selectedText + wrapper;
            const newNode = document.createTextNode(newText);
            range.deleteContents();
            range.insertNode(newNode);
        }

        // Cập nhật selection để giữ nguyên vị trí con trỏ
        selection.removeAllRanges();
        selection.addRange(range);
        updateOutput();
    }

}

function hideModals(event) {
    if (event.target.classList.contains("modal")) {
        event.target.style.display = "none";
    }
}

// Lắng nghe sự Kiện Dom
document.addEventListener('DOMContentLoaded', function () {
    // File JS Xử lý Format Text
    document.getElementById("openBackupButton").onclick = function () {
        const backups = JSON.parse(localStorage.getItem("backups") || "[]");
        const backup = backups[currentBackupIndex];
        document.getElementById("inputContainer").innerHTML = backup.inputContent;
        document.getElementById("outputText").innerText = backup.outputContent;
        const lineContents = document.querySelectorAll(".line-content");
        lineContents.forEach((lineContent) => {
            lineContent.addEventListener("input", updateOutput);
        });
        document.getElementById("backupOptionsModal").style.display = "none";
    };

    // Gắn hàm `closeModalCache` vào sự kiện click của các nút
    // document.querySelector('.close').addEventListener('click', closeModalCache);
    // document.querySelector('button[onclick="closeModalCache()"]').addEventListener('click', closeModalCache);

    document.getElementById("deleteBackupButton").onclick = function () {
        let backups = JSON.parse(localStorage.getItem("backups") || "[]");
        backups.splice(currentBackupIndex, 1);
        localStorage.setItem("backups", JSON.stringify(backups));
        document.getElementById("backupButtons").children[currentBackupIndex].remove();
        document.getElementById("backupOptionsModal").style.display = "none";
    };
});



