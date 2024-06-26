// js/tooltip.js
import { saveToLocalStorage, loadFromLocalStorage } from './utils/local-storage.js';

export function initTooltip() {
    function saveNotesToLocalStorage() {
        const notes = [];
        document.querySelectorAll('.note').forEach(noteElement => {
            const content = noteElement.querySelector('input[type="text"]').value;
            const category = noteElement.getAttribute('data-category');
            const completed = noteElement.classList.contains('completed');
            notes.push({ content, category, completed });
        });
        saveToLocalStorage('notes', notes);
    }

    function loadNotesFromLocalStorage() {
        const notesList = document.getElementById("notes-list");
        notesList.innerHTML = ""; // Xóa các ghi chú cũ trước khi thêm mới

        const notes = loadFromLocalStorage('notes') || [];
        notes.forEach(note => {
            createNoteElement(note.content, note.category, note.completed);
        });
    }

    const noteContent = document.getElementById("note-content");
    const noteCategory = document.getElementById("note-category");
    const addNoteButton = document.getElementById("add-note");
    const notesList = document.getElementById("notes-list");
    const searchBar = document.getElementById("search-bar");
    const filterCategory = document.getElementById("filter-category");
    const progressBars = {
        work: document.querySelector("#work-progress div"),
        personal: document.querySelector("#personal-progress div"),
        study: document.querySelector("#study-progress div"),
    };

    function loadNotes() {
        const notes = loadFromLocalStorage('notes') || [];
        notesList.innerHTML = "";
        notes.forEach((note) => {
            createNoteElement(note.content, note.category, note.completed);
        });
        updateProgress();
    }

    function saveNotes() {
        const notes = [];
        document.querySelectorAll(".note").forEach((noteElement) => {
            const content = noteElement.querySelector('input[type="text"]').value;
            const category = noteElement.getAttribute("data-category");
            const completed = noteElement.classList.contains("completed");
            notes.push({ content, category, completed });
        });
        saveToLocalStorage('notes', notes);
    }

    function updateProgress() {
        const notes = {
            work: { total: 0, completed: 0 },
            personal: { total: 0, completed: 0 },
            study: { total: 0, completed: 0 },
        };

        document.querySelectorAll(".note").forEach((noteElement) => {
            const category = noteElement.getAttribute("data-category");
            const completed = noteElement.classList.contains("completed");
            notes[category].total++;
            if (completed) {
                notes[category].completed++;
            }
        });

        Object.keys(notes).forEach((category) => {
            const progress = notes[category].total
                ? (notes[category].completed / notes[category].total) * 100
                : 0;
            progressBars[category].style.width = `${progress}%`;
            progressBars[category].textContent = `${Math.round(progress)}%`;
        });
    }

    function createNoteElement(noteText, category, completed = false) {
        const noteElement = document.createElement("div");
        noteElement.className = "note";
        noteElement.setAttribute("data-category", category);
        if (completed) noteElement.classList.add("completed");

        const noteInput = document.createElement("input");
        noteInput.type = "text";
        noteInput.value = noteText;
        noteElement.appendChild(noteInput);
        const buttonsDiv = document.createElement("div");
        buttonsDiv.className = "buttons";

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-note";
        deleteButton.innerHTML = "<i class='fas fa-trash-alt' title='Xóa'></i>";
        deleteButton.addEventListener("click", function () {
            noteElement.remove();
            saveNotes();
            updateProgress();
        });
        buttonsDiv.appendChild(deleteButton);

        const editButton = document.createElement("button");
        editButton.className = "edit-note";
        editButton.innerHTML = "<i class='fas fa-edit' title='Sửa'>";
        editButton.addEventListener("click", function () {
            noteInput.focus();
        });
        buttonsDiv.appendChild(editButton);

        const completeButton = document.createElement("button");
        completeButton.className = "complete-note";
        completeButton.innerHTML = "<i class='fas fa-check' title='Hoàn thành'></i>";
        completeButton.addEventListener("click", function () {
            noteElement.classList.toggle("completed");
            saveNotes();
            updateProgress();
        });
        buttonsDiv.appendChild(completeButton);

        noteElement.appendChild(buttonsDiv);
        notesList.appendChild(noteElement);
    }

    addNoteButton.addEventListener("click", function () {
        const noteText = noteContent.value.trim();
        const category = noteCategory.value;
        if (noteText !== "") {
            createNoteElement(noteText, category);
            noteContent.value = "";
            saveNotes();
            updateProgress();
        }
    });

    searchBar.addEventListener("input", filterNotes);
    filterCategory.addEventListener("change", filterNotes);

    function filterNotes() {
        const searchText = searchBar.value.toLowerCase();
        const category = filterCategory.value;
        document.querySelectorAll(".note").forEach((noteElement) => {
            const noteText = noteElement.querySelector('input[type="text"]').value.toLowerCase();
            const noteCategory = noteElement.getAttribute("data-category");
            if (
                (noteText.includes(searchText) || searchText === "") &&
                (noteCategory === category || category === "all")
            ) {
                noteElement.style.display = "";
            } else {
                noteElement.style.display = "none";
            }
        });
    }

    loadNotes();
    loadNotesFromLocalStorage();
    updateProgress();
}