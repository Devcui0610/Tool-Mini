// Biến
let draggedCard = null;
let currentEditCard = null;
let activityLog = JSON.parse(localStorage.getItem("activityLog")) || [];

function addCard(listElement) {
    const cardTitle = prompt("Enter card title:");
    if (cardTitle) {
        const card = createCardElement(cardTitle);
        listElement.querySelector(".cards").appendChild(card);
        addToActivityLog(`Added card: ${cardTitle}`);
        saveToLocalStorage();
    }
}

function deleteList(list) {
    const confirmation = confirm("Are you sure you want to delete this list?");
    if (confirmation) {
        addToActivityLog(`Deleted list: ${list.querySelector("h3").innerText}`);
        list.remove();
        saveToLocalStorage();
    }
}

function editCardDetails(card) {
    currentEditCard = card;
    document.getElementById("cardTitle").value = card.querySelector(".card-title").innerText;
    document.getElementById("cardDescription").value = card.getAttribute("data-description") || "";
    document.getElementById("cardDueDate").value = card.getAttribute("data-due-date") || "";
    document.getElementById("cardModal").style.display = "block";
}

function saveCardDetails() {
    currentEditCard.querySelector(".card-title").innerText = document.getElementById("cardTitle").value;
    currentEditCard.setAttribute("data-description", document.getElementById("cardDescription").value);
    currentEditCard.setAttribute("data-due-date", document.getElementById("cardDueDate").value); closeModal();
    addToActivityLog(`Edited card: ${currentEditCard.querySelector(".card-title").innerText}`);
    saveToLocalStorage();
}

function deleteCard() {
    if (currentEditCard) {
        const cardTitle = currentEditCard.querySelector(".card-title").innerText;
        currentEditCard.remove();
        addToActivityLog(`Deleted card: ${cardTitle}`);
        closeModal();
        saveToLocalStorage();
    }
}

// Hàm từ Trello
function saveToLocalStorage() {
    const board = document.getElementById("board");
    if (!board) {
        console.error("Element with ID 'board' not found.");
        return;
    }

    const lists = [];
    board.querySelectorAll(".list").forEach((list) => {
        const listTitle = list.querySelector("h3").innerText;
        const cards = [];
        list.querySelectorAll(".card").forEach((card) => {
            const cardData = {
                title: card.querySelector(".card-title").innerText,
                description: card.getAttribute("data-description") || "",
                dueDate: card.getAttribute("data-due-date") || "",
            };
            cards.push(cardData);
        });
        lists.push({ title: listTitle, cards });
    });
    localStorage.setItem("trelloData", JSON.stringify(lists));
    localStorage.setItem("activityLog", JSON.stringify(activityLog));

    const archiveCards = [];
    const archiveContainer = document.querySelector("#archive .cards");
    if (archiveContainer) {
        archiveContainer.querySelectorAll(".card").forEach((card) => {
            const cardData = {
                title: card.querySelector(".card-title").innerText,
                description: card.getAttribute("data-description") || "",
                dueDate: card.getAttribute("data-due-date") || "",
            };
            archiveCards.push(cardData);
        });
        localStorage.setItem("archivedCards", JSON.stringify(archiveCards));
    } else {
        console.error("Element with ID '#archive .cards' not found.");
    }
}

function handleDragStart(event) {
    draggedCard = event.target;
    setTimeout(() => (event.target.style.display = "none"), 0);
}

function handleDragEnd(event) {
    setTimeout(() => {
        event.target.style.display = "flex"; // Set display to flex after drag ends
    }, 0);
    draggedCard = null;
    saveToLocalStorage();
}

function closeModal() {
    document.getElementById("cardModal").style.display = "none";
}

function moveCardToArchive(card) {
    const archiveContainer = document.querySelector("#archive .cards");
    if (archiveContainer) {
        card.remove();
        archiveContainer.appendChild(card);
        addToActivityLog(`Archived card: ${card.querySelector(".card-title").innerText}`);
        saveToLocalStorage();
    } else {
        console.error("Element with ID '#archive .cards' not found.");
    }
}

function handleDragOver(event) {
    event.preventDefault();
}

function addToActivityLog(message) {
    const timestamp = new Date().toLocaleString();
    activityLog.push(`${timestamp}: ${message}`);
    updateActivityLog();
}

function handleDrop(event) {
    event.preventDefault();
    const list = event.target.closest(".list");
    const cardsContainer = list.querySelector(".cards");
    if (cardsContainer) {
        cardsContainer.appendChild(draggedCard);
    }
    draggedCard.style.display = "flex"; // Ensure display is flex after drop
    addToActivityLog(`Moved card to ${list.querySelector("h3").innerText}`);
    saveToLocalStorage();
}

function updateActivityLog() {
    const activityLogList = document.getElementById("activityLogList");
    if (!activityLogList) {
        console.error("Element with ID 'activityLogList' not found.");
        return;
    }
    activityLogList.innerHTML = "";
    activityLog.forEach((log) => {
        const logItem = document.createElement('li');
        logItem.innerText = log;
        activityLogList.appendChild(logItem);
    });
}

function createListElement(listTitle) {
    const list = document.createElement("div");
    list.className = "list";
    list.addEventListener("dragover", handleDragOver);
    list.addEventListener("drop", handleDrop);
    // Thêm sự kiện dblclick cho list
    list.addEventListener("dblclick", (event) => {
        // Kiểm tra nếu nhấp đúp không phải là trên thẻ thì thêm thẻ
        if (event.target.classList.contains("list")) {
            addCard(list);
        }
    });

    const title = document.createElement("h3");
    title.contentEditable = true;
    title.innerText = listTitle;
    title.addEventListener("input", saveToLocalStorage);
    title.addEventListener("dblclick", () => deleteList(list));

    list.appendChild(title);

    const cardsContainer = document.createElement("div");
    cardsContainer.className = "cards";
    list.appendChild(cardsContainer);

    return list;


}

// Hàm Click Tạo List Trello
function addList() {
    const listTitle = prompt("Enter list title:");
    if (listTitle) {
        const list = createListElement(listTitle);
        document.getElementById("board").appendChild(list);
        addToActivityLog(`Added list: ${listTitle}`);
        saveToLocalStorage();
    }
}

function createCardElement(cardTitle, cardDescription = "", cardDueDate = "") {
    const card = document.createElement("div");
    card.className = "card";
    card.setAttribute("data-description", cardDescription);
    card.setAttribute("data-due-date", cardDueDate);
    card.draggable = true;
    card.style.display = "flex"; // Set initial display to flex
    const cardTitleElement = document.createElement("div");
    cardTitleElement.className = "card-title";
    cardTitleElement.innerText = cardTitle;
    card.appendChild(cardTitleElement);

    const completeButton = document.createElement("button");
    completeButton.className = "complete-btn";
    completeButton.innerHTML = "<i class='fas fa-check'></i>";
    completeButton.addEventListener("click", () => moveCardToArchive(card));
    card.appendChild(completeButton);

    card.addEventListener("dragstart", handleDragStart);
    card.addEventListener("dragend", handleDragEnd);
    card.addEventListener("dblclick", () => editCardDetails(card));

    return card;

}

//Tải dữ liệu từ Local Storage
function loadFromLocalStorage() {
    const board = document.getElementById("board");
    const archiveContainer = document.querySelector("#archive .cards");

    if (!board || !archiveContainer) {
        console.error("Element with ID 'board' or '#archive .cards' not found.");
        return;
    }

    // Xóa nội dung hiện có của board và archiveContainer
    board.innerHTML = '';
    archiveContainer.innerHTML = '';

    const savedLists = JSON.parse(localStorage.getItem("trelloData"));
    if (savedLists) {
        savedLists.forEach((listData) => {
            const list = createListElement(listData.title);
            listData.cards.forEach((cardData) => {
                const card = createCardElement(cardData.title, cardData.description, cardData.dueDate);
                list.querySelector(".cards").appendChild(card);
            });
            board.appendChild(list);
        });
    }

    const savedArchivedCards = JSON.parse(localStorage.getItem("archivedCards"));
    if (savedArchivedCards) {
        savedArchivedCards.forEach((cardData) => {
            const card = createCardElement(cardData.title, cardData.description, cardData.dueDate);
            archiveContainer.appendChild(card);
        });
    }

    activityLog = JSON.parse(localStorage.getItem("activityLog")) || [];
    updateActivityLog();

}

// LẮNG NGHE SỰ KIỆN DOM
document.addEventListener('DOMContentLoaded', function () {
    loadFromLocalStorage();
    const deleteCardButton = document.getElementById("deleteCardButton");
    if (deleteCardButton) {
        deleteCardButton.addEventListener("click", deleteCard);
    } else {
        console.error("Element with ID 'deleteCardButton' not found.");
    }
});