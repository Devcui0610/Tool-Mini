// sheet-table/eventListeners.js
import { fetchData } from './fetchData.js';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/local-storage.js';
import { displayData, parseHTMLTable } from './tableUtils.js';

const fetchDataButton1 = document.getElementById("fetchData1");
const fetchDataButton2 = document.getElementById("fetchData2");
const fetchDataButton3 = document.getElementById("fetchData3");

const rangeInput1 = document.getElementById("range1");
const rangeInput2 = document.getElementById("range2");
const rangeInput3 = document.getElementById("range3");

const dataTable = document.getElementById("dataTable");
const defaultCenteredColumns = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

document.addEventListener("DOMContentLoaded", () => {
    const apiKey = loadFromLocalStorage('apiKey');
    const spreadsheetId = loadFromLocalStorage('spreadsheetId');

    fetchDataButton1.addEventListener("click", async function () {
        const range = rangeInput1.value;
        const data = await fetchData(apiKey, spreadsheetId, range);
        if (data) {
            displayData(dataTable, data, defaultCenteredColumns);
            saveToLocalStorage("sheetTableData", { range1: rangeInput1.value, range2: rangeInput2.value, range3: rangeInput3.value, tableHTML: dataTable.innerHTML });
        }
    });

    fetchDataButton2.addEventListener("click", async function () {
        const range = rangeInput2.value;
        const data = await fetchData(apiKey, spreadsheetId, range);
        if (data) {
            displayData(dataTable, data, defaultCenteredColumns);
            saveToLocalStorage("sheetTableData", { range1: rangeInput1.value, range2: rangeInput2.value, range3: rangeInput3.value, tableHTML: dataTable.innerHTML });
        }
    });

    fetchDataButton3.addEventListener("click", async function () {
        const range = rangeInput3.value;
        const data = await fetchData(apiKey, spreadsheetId, range);
        if (data) {
            displayData(dataTable, data, defaultCenteredColumns);
            saveToLocalStorage("sheetTableData", { range1: rangeInput1.value, range2: rangeInput2.value, range3: rangeInput3.value, tableHTML: dataTable.innerHTML });
        }
    });

    // Load table data from local storage on page load
    const savedData = loadFromLocalStorage("sheetTableData");
    if (savedData) {
        rangeInput1.value = savedData.range1 || "";
        rangeInput2.value = savedData.range2 || "";
        rangeInput3.value = savedData.range3 || "";
        const tableData = parseHTMLTable(savedData.tableHTML);
        displayData(dataTable, tableData, defaultCenteredColumns);
    }
});