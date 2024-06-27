import { saveApiKeyAndSpreadsheetId, getApiKeyAndSpreadsheetId, fetchData } from './api/api.js';
import { loadHeader } from './loadHeader.js';

// KHỞI TẠO BIẾN
// Biến tạo cặp input và button lấy dữ liệu từ sheet
const fetchDataButton1 = document.getElementById("fetchData1");
const fetchDataButton2 = document.getElementById("fetchData2");
const fetchDataButton3 = document.getElementById("fetchData3");

// Kiểm tra nếu phần tử tồn tại trước khi thêm sự kiện

if (fetchDataButton1) {
    fetchDataButton1.addEventListener('click', async function () {
        const range = document.getElementById('range1').value;
        const data = await fetchData(range);
        if (Array.isArray(data) && data.length > 0) {
            displayData(data);
        } else {
            console.error('Data không hợp lệ:', data);
        }
    });
}

if (fetchDataButton2) {
    fetchDataButton2.addEventListener('click', async function () {
        const range = document.getElementById('range2').value;
        const data = await fetchData(range);
        if (Array.isArray(data) && data.length > 0) {
            displayData(data);
        } else {
            console.error('Data không hợp lệ:', data);
        }
    });
}

if (fetchDataButton3) {
    fetchDataButton3.addEventListener('click', async function () {
        const range = document.getElementById('range3').value;
        const data = await fetchData(range);
        if (Array.isArray(data) && data.length > 0) {
            displayData(data);
        } else {
            console.error('Data không hợp lệ:', data);
        }
    });
}


// Biến lưu dữ liệu từ Local Storage theo khu vực
const rangeInput1 = document.getElementById("range1");
const rangeInput2 = document.getElementById("range2");
const rangeInput3 = document.getElementById("range3");

const toggleResizeButton = document.getElementById("toggleResize");

// Biến hỗ trợ chụp màn hình table
const captureButton = document.getElementById("capture");
const scaleInput = document.getElementById("scale");

const toggleBoldButton = document.getElementById("toggleBold"); // Nút mới để in đậm chữ
const defaultCenteredColumns = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]; // Chọn cột căn giữa mặc định

// Biến bộ chọn màu nền và chữ
const backgroundColorPicker = document.getElementById("backgroundColorPicker");
const textColorPicker = document.getElementById("textColorPicker");

// Hỗ trợ table
const dataTable = document.getElementById("dataTable");
const tableContainer = document.getElementById("tableContainer");
const rowControlsContainer = document.getElementById("rowControls");

const centerButtonsContainer = document.getElementById("centerButtons"); // Biến căn chỉnh text

// KHU VỰC FUNCTION
function loadFromLocalStorage() {
    const savedData = JSON.parse(localStorage.getItem("sheetTableData"));
    if (savedData) {
        console.log('Data loaded from local storage:', savedData);
        rangeInput1.value = savedData.range1 || "";
        rangeInput2.value = savedData.range2 || "";
        rangeInput3.value = savedData.range3 || "";
        const tableData = parseHTMLTable(savedData.tableHTML);
        displayData(tableData);

        attachCellListeners();
        createCenterButtons();
        createRowControls(savedData.rowColors);
        updateButtonPositions();
        updateRowControlsPosition();

        loadRowColors();
        loadColorsFromLocalStorage();
        loadColumnAlignments();
    }
}

function parseHTMLTable(html) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const table = [];
    const rows = tempDiv.querySelectorAll('tr');
    rows.forEach(row => {
        const cells = [];
        row.querySelectorAll('td, th').forEach(cell => {
            cells.push(cell.innerText);
        });
        table.push(cells);
    });
    return table;
}

function clearLocalStorage() {
    localStorage.removeItem("sheetTableData");
}

function loadColumnAlignments() {
    const savedColumnAlignments = JSON.parse(localStorage.getItem("columnAlignments")) || [];
    const headerCells = dataTable.querySelectorAll("tr:first-child th");

    headerCells.forEach((cell, index) => {
        cell.style.textAlign = savedColumnAlignments[index] || "left";
    });
    const bodyCells = dataTable.querySelectorAll("tr td");
    bodyCells.forEach((cell, index) => {
        const colIndex = index % headerCells.length;
        cell.style.textAlign = savedColumnAlignments[colIndex] || "left";
    });
}

function showTabContent(tabId) {
    // Ẩn tất cả các tab content
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.style.display = 'none';
    });

    // Hiển thị nội dung tab được chọn
    const activeTabContent = document.getElementById(tabId);
    if (activeTabContent) {
        activeTabContent.style.display = 'block';
    } else {
        console.error(`Tab content với ID '${tabId}' không tìm thấy.`);
    }

    // Đặt trạng thái active cho tab được chọn
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    const activeTab = document.querySelector(`.tab[data-tab="${tabId}"]`);
    if (activeTab) {
        activeTab.classList.add('active');
    } else {
        console.error(`Tab với data-tab='${tabId}' không tìm thấy.`);
    }
}

function loadRowColors() {
    const savedRowColors = JSON.parse(localStorage.getItem("rowColors")) || [];
    const rows = dataTable.querySelectorAll("tr");

    savedRowColors.forEach((colors, index) => {
        const row = rows[index];
        if (row) {
            if (colors.textColor) {
                row.querySelectorAll("td, th").forEach((cell) => {
                    cell.style.color = colors.textColor;
                });
            }
            if (colors.bgColor) {
                row.querySelectorAll("td, th").forEach((cell) => {
                    cell.style.backgroundColor = colors.bgColor;
                });
            }
            if (colors.fontWeight) {
                row.querySelectorAll("td, th").forEach((cell) => {
                    cell.style.fontWeight = colors.fontWeight;
                });
            }
        }
    });
}

function saveTableToLocalStorage() {
    localStorage.setItem("tableHTML", dataTable.innerHTML);
}

function attachCellListeners() {
    const cells = dataTable.querySelectorAll("td, th");
    cells.forEach((cell) => {
        cell.contentEditable = true;
        cell.addEventListener("input", () => {
            saveTableToLocalStorage();
            saveCache(); // Gọi thêm saveCache để lưu các thay đổi khác nếu có
        });
    });

    const resizableCells = dataTable.querySelectorAll(".resizable");
    resizableCells.forEach((cell) => {
        cell.addEventListener("mouseup", () => {
            saveTableToLocalStorage();
            updateButtonPositions();
        });
    });
}

function loadTableFromLocalStorage() {
    const savedTableHTML = localStorage.getItem("tableHTML");
    if (savedTableHTML) {
        dataTable.innerHTML = savedTableHTML;
        attachCellListeners();
        updateCenterButtonsWidth();
    }
}

function toggleResize() {
    const resizableCells = dataTable.querySelectorAll(".resizable");

    resizableCells.forEach((cell) => {
        if (cell.style.resize === "both") {
            cell.style.resize = "none";
        } else {
            cell.style.resize = "both";
        }
    });
}

function captureTable() {
    const scale = parseFloat(scaleInput.value) || 2; // Default to 2 if invalid
    const dataTable = document.getElementById("dataTable"); // Chọn đúng phần tử bảng
    const wrapBodyTable = document.querySelector(".wrap-body-table");

    // Ẩn các phần tử không cần chụp
    document.getElementById("centerButtons").style.display = "none";
    document.getElementById("rowControls").style.display = "none";
    const colorControls = document.querySelectorAll(".color-control");
    colorControls.forEach((control) => (control.style.display = "none"));

    // Lưu chiều rộng ban đầu của wrapBodyTable
    const originalWidth = wrapBodyTable.style.width;

    // Thiết lập chiều rộng của wrapBodyTable vừa với nội dung
    wrapBodyTable.style.width = `${dataTable.offsetWidth}px`;

    html2canvas(dataTable, {
        scale: scale,
        useCORS: true,
        allowTaint: true,
    }).then((canvas) => {
        // Hiển thị lại các phần tử sau khi chụp
        document.getElementById("centerButtons").style.display = "flex";
        document.getElementById("rowControls").style.display = "flex";
        colorControls.forEach((control) => (control.style.display = "block"));

        // Khôi phục chiều rộng ban đầu của wrapBodyTable
        wrapBodyTable.style.width = originalWidth;

        const link = document.createElement("a");
        link.download = "table.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
}

function createCenterButtons() {
    centerButtonsContainer.innerHTML = "";
    const columns = dataTable.querySelectorAll("tr:first-child th").length;

    for (let i = 0; i < columns; i++) {
        const button = document.createElement("button");
        button.innerText = "⫷𒁂⫸";
        button.addEventListener("click", () => toggleAlignmentColumn(i));
        centerButtonsContainer.appendChild(button);
    }
    updateButtonPositions();
}
function createRowControls(savedRowColors) {
    rowControlsContainer.innerHTML = "";
    const rows = dataTable.querySelectorAll("tr").length; for (let i = 0; i < rows; i++) { // Bắt đầu từ 0 để bao gồm hàng đầu tiên
        const rowControl = document.createElement("div");
        rowControl.classList.add("row-control");

        const textColorLabel = document.createElement("label");
        textColorLabel.innerText = ``;
        const textColorInput = document.createElement("input");
        textColorInput.type = "color";
        textColorInput.value = savedRowColors[i]?.textColor || "#000";
        textColorInput.addEventListener("input", () =>
            changeRowTextColor(i, textColorInput.value, true)
        );

        const bgColorLabel = document.createElement("label");
        bgColorLabel.innerText = '';
        const bgColorInput = document.createElement("input");
        bgColorInput.type = "color";
        bgColorInput.value = savedRowColors[i]?.bgColor || "#fff";
        bgColorInput.addEventListener("input", () => changeRowBgColor(i, bgColorInput.value, true));

        rowControl.appendChild(textColorLabel);
        rowControl.appendChild(textColorInput);
        rowControl.appendChild(bgColorLabel);
        rowControl.appendChild(bgColorInput);
        rowControlsContainer.appendChild(rowControl);
    }
    updateRowControlsPosition();
}

function updateButtonPositions() {
    const headerCells = dataTable.querySelectorAll("tr:first-child th");
    const buttons = centerButtonsContainer.querySelectorAll("button");
    buttons.forEach((button, index) => {
        if (headerCells[index]) {
            button.style.width = `${headerCells[index].offsetWidth}px`;
            button.style.position = "absolute";
            button.style.left = `${headerCells[index].offsetLeft}px`;
        }
    });
}

function updateRowControlsPosition() {
    const rows = dataTable.querySelectorAll("tr");
    const rowControls = rowControlsContainer.querySelectorAll(".row-control");
    rowControls.forEach((control, index) => {
        if (rows[index]) {
            control.style.height = `${rows[index].offsetHeight}px`;
        }
    });

}

function toggleAlignmentColumn(colIndex) {
    const cells = dataTable.querySelectorAll(
        `tr td:nth-child(${colIndex + 1}), tr th:nth-child(${colIndex + 1})`
    );

    cells.forEach((cell) => {
        if (cell.style.textAlign === "" || cell.style.textAlign === "left") {
            cell.style.textAlign = "center";
        } else if (cell.style.textAlign === "center") {
            cell.style.textAlign = "right";
        } else {
            cell.style.textAlign = "left";
        }
    });

    // Lưu lại trạng thái căn text
    saveColumnAlignments();
}

function changeRowTextColor(rowIndex, color, save = true) {
    const row = dataTable.querySelectorAll("tr")[rowIndex];
    if (row) {
        row.querySelectorAll("td, th").forEach((cell) => {
            cell.style.color = color;
        });
    }
    if (save) saveCache();
}

function changeRowBgColor(rowIndex, color, save = true) {
    const row = dataTable.querySelectorAll("tr")[rowIndex];
    if (row) {
        row.querySelectorAll("td, th").forEach((cell) => {
            cell.style.backgroundColor = color;
        });
    }
    if (save) saveCache();
}

fetchDataButton1.addEventListener("click", function () {
    const range = rangeInput1.value;
    fetchData(range);
    saveToLocalStorage();
});

fetchDataButton2.addEventListener("click", function () {
    const range = rangeInput2.value;
    fetchData(range);
    saveToLocalStorage();
});

fetchDataButton3.addEventListener("click", function () {
    const range = rangeInput3.value;
    fetchData(range);
    saveToLocalStorage();
});

toggleResizeButton.addEventListener("click", toggleResize);
captureButton.addEventListener("click", captureTable);

// Hàm thiết lập màu sắc cho cột (chỉ đổi màu từ hàng 2)
function changeFirstColumnStyle(backgroundColor, textColor) {
    const firstColumnCells = dataTable.querySelectorAll("tr:nth-child(n+2) td:first-child");
    firstColumnCells.forEach((cell) => {
        cell.style.backgroundColor = backgroundColor;
        cell.style.color = textColor;
    });
}

// Hàm thêm thuộc tính in đậm cho cột đầu tiên
function toggleBoldFirstColumn() {
    const firstColumnCells = dataTable.querySelectorAll("tr:nth-child(n+2) td:first-child");
    firstColumnCells.forEach((cell) => {
        if (cell.style.fontWeight === "bold") {
            cell.style.fontWeight = "normal";
        } else {
            cell.style.fontWeight = "bold";
        }
    });
}

const table = document.getElementById("dataTable");
const centerButtons = document.getElementById("centerButtons");

const resizeObserver = new ResizeObserver((entries) => {
    for (let entry of entries) {
        updateCenterButtonsWidth();
    }
});

const columns = table.querySelectorAll("th, td");
columns.forEach((column) => resizeObserver.observe(column));

// Hàm cập nhật độ rộng tất cả các cột trong bảng
function getTableColumnsWidth() {
    const columns = table.querySelectorAll("tr:first-child th");
    let totalWidth = 0;
    columns.forEach((column) => {
        totalWidth += column.offsetWidth;
    });
    return totalWidth;
}

function updateCenterButtonsWidth() {
    const totalWidth = getTableColumnsWidth();
    centerButtons.style.width = `${totalWidth}px`;
}

// Hàm lưu màu sắc vào localStorage
function saveColorsToLocalStorage(backgroundColor, textColor) {
    localStorage.setItem("backgroundColor", backgroundColor);
    localStorage.setItem("textColor", textColor);
}

// Hàm tải màu sắc từ localStorage và áp dụng
function loadColorsFromLocalStorage() {
    let savedBackgroundColor = localStorage.getItem("backgroundColor");
    let savedTextColor = localStorage.getItem("textColor");

    // Kiểm tra và gán giá trị mặc định nếu giá trị không hợp lệ
    if (!savedBackgroundColor || !/^#[0-9A-F]{6}$/i.test(savedBackgroundColor)) {
        savedBackgroundColor = "#16a085"; // Màu nền mặc định
    }
    if (!savedTextColor || !/^#[0-9A-F]{6}$/i.test(savedTextColor)) {
        savedTextColor = "#ffffff"; // Màu chữ mặc định
    }

    backgroundColorPicker.value = savedBackgroundColor;
    textColorPicker.value = savedTextColor;
    changeFirstColumnStyle(savedBackgroundColor, savedTextColor);
}

// Lắng nghe sự kiện thay đổi màu nền
backgroundColorPicker.addEventListener("input", function () {
    const backgroundColor = backgroundColorPicker.value;
    const textColor = textColorPicker.value;
    changeFirstColumnStyle(backgroundColor, textColor);
    saveColorsToLocalStorage(backgroundColor, textColor);
});

// Lắng nghe sự kiện thay đổi màu chữ
textColorPicker.addEventListener("input", function () {
    const backgroundColor = backgroundColorPicker.value;
    const textColor = textColorPicker.value;
    changeFirstColumnStyle(backgroundColor, textColor);
    saveColorsToLocalStorage(backgroundColor, textColor);
});

// Lắng nghe sự kiện click của nút toggleBold
toggleBoldButton.addEventListener("click", toggleBoldFirstColumn);

// Gọi hàm loadColorsFromLocalStorage khi tải trang
loadColorsFromLocalStorage();

function displayData(data) {
    if (!Array.isArray(data) || data.length === 0) {
        console.error('Data không hợp lệ hoặc trống:', data);
        return;
    }

    dataTable.innerHTML = "";

    if (data.length > 0) {
        const maxColumns = data.reduce((max, row) => Math.max(max, row.length), 0);

        const headerRow = document.createElement("tr");
        for (let i = 0; i < maxColumns; i++) {
            const headerText = data[0][i] || "";
            const headerCell = document.createElement("th");
            headerCell.innerText = headerText;
            headerCell.classList.add("resizable");
            headerCell.style.resize = "none";
            headerCell.style.fontWeight = "bold"; // In đậm tiêu đề table

            if (defaultCenteredColumns.includes(i + 1)) {
                headerCell.style.textAlign = "center";
            }

            // Add vertical alignment for header cells
            headerCell.style.verticalAlign = "middle";

            headerRow.appendChild(headerCell);
        }
        dataTable.appendChild(headerRow);

        for (let i = 1; i < data.length; i++) {
            const row = document.createElement("tr");
            for (let j = 0; j < maxColumns; j++) {
                let cellText = data[i][j] || "";
                const cell = document.createElement("td");

                if (cellText === "TRUE") {
                    cell.innerHTML = "✔";
                    cell.style.color = "#16a085";
                } else if (cellText === "FALSE") {
                    cell.innerHTML = "✖";
                    cell.style.color = "#95cbc0";
                } else {
                    cell.innerText = cellText;
                }

                if (cellText === "NIGHT") {
                    cell.style.textAlign = "left";
                } else if (cellText === "GOKU") {
                    cell.style.textAlign = "right";
                } else if (defaultCenteredColumns.includes(j + 1)) {
                    cell.style.textAlign = "center";
                }

                cell.contentEditable = true;
                cell.classList.add("editable");
                if (j === 0) {
                    cell.classList.add("resizable");
                    cell.style.resize = "none";
                }

                // Căn giữa nội dung text trong table theo chiều dọc
                cell.style.verticalAlign = "middle";

                row.appendChild(cell);
            }

            dataTable.appendChild(row);
        }

        const firstRowCells = dataTable.querySelectorAll("tr:first-child th");
        firstRowCells.forEach((cell) => {
            cell.classList.add("resizable");
            cell.style.resize = "none";
        });

        const firstColumnCells = dataTable.querySelectorAll("tr td:first-child");
        firstColumnCells.forEach((cell) => {
            cell.classList.add("resizable");
            cell.style.resize = "none";
        });

        attachCellListeners();
        createCenterButtons();
        createRowControls(JSON.parse(localStorage.getItem("rowColors")) || []);
        updateButtonPositions();
        updateRowControlsPosition();
        loadColorsFromLocalStorage();
    }
}

function clearCache() {
    localStorage.removeItem("sheetTableData");
    dataTable.innerHTML = "";
    centerButtonsContainer.innerHTML = "";
    rowControlsContainer.innerHTML = "";
}

function saveToLocalStorage() {
    const data = {
        range1: rangeInput1.value,
        range2: rangeInput2.value,
        range3: rangeInput3.value,
        tableHTML: dataTable.innerHTML,
        rowColors: JSON.parse(localStorage.getItem("rowColors")) || [],
        columnAlignments: JSON.parse(localStorage.getItem("columnAlignments")) || [],
    };
    console.log('Data saved to local storage:', data);
    localStorage.setItem("sheetTableData", JSON.stringify(data));
}

function saveRowColors() {
    const rowColors = [];
    const rows = dataTable.querySelectorAll("tr");

    rows.forEach((row) => {
        const textColor = row.querySelector("td, th")?.style.color || "";
        const bgColor = row.querySelector("td, th")?.style.backgroundColor || "";
        const fontWeight = row.querySelector("td, th")?.style.fontWeight || "normal";
        rowColors.push({ textColor, bgColor, fontWeight });
    }); localStorage.setItem("rowColors", JSON.stringify(rowColors));
}
// Hàm lưu giá trị căn chỉnh text
function saveColumnAlignments() {
    const columnAlignments = [];
    const headerCells = dataTable.querySelectorAll("tr:first-child th"); headerCells.forEach((cell, index) => {
        columnAlignments[index] = cell.style.textAlign || "left";
    });

    localStorage.setItem("columnAlignments", JSON.stringify(columnAlignments));
}

// Lắng nghe sự kiện của trang HOME trong việc xử lý cache và tải lại trang
document.addEventListener("DOMContentLoaded", () => {
    loadHeader();

    document.addEventListener('headerLoaded', () => {
        const apiKeyInput = document.getElementById('apiKeyInput');
        const spreadsheetIdInput = document.getElementById('spreadsheetIdInput');
        const saveButton = document.getElementById('saveApiKeyAndId');
        const clearButton = document.getElementById('clearApiKeyAndId');

        const toggleDarkMode = document.getElementById('toggle-dark-mode');
        const toggleSidebarButton = document.getElementById('toggle-btn-home');
        const sidebar = document.getElementById('sidebar');

        const { apiKey, spreadsheetId } = getApiKeyAndSpreadsheetId();

        if (apiKeyInput && spreadsheetIdInput) {
            apiKeyInput.value = apiKey || '';
            spreadsheetIdInput.value = spreadsheetId || '';

            apiKeyInput.addEventListener('input', () => {
                const apiKey = apiKeyInput.value;
                localStorage.setItem('googleApiKey', apiKey);
            });

            spreadsheetIdInput.addEventListener('input', () => {
                const spreadsheetId = spreadsheetIdInput.value;
                localStorage.setItem('googleSpreadsheetId', spreadsheetId);
            });
        } else {
            console.error('Không tìm thấy phần tử input API Key hoặc Spreadsheet ID.');
        }

        if (saveButton) {
            saveButton.addEventListener('click', () => {
                const apiKey = apiKeyInput ? apiKeyInput.value : '';
                const spreadsheetId = spreadsheetIdInput ? spreadsheetIdInput.value : '';
                saveApiKeyAndSpreadsheetId(apiKey, spreadsheetId);
                alert('API Key và Spreadsheet ID đã được lưu.');
            });
        } else {
            console.error('Không tìm thấy nút lưu API Key và Spreadsheet ID.');
        }

        if (clearButton) {
            clearButton.addEventListener('click', () => {
                localStorage.removeItem('googleApiKey');
                localStorage.removeItem('googleSpreadsheetId');
                if (apiKeyInput) apiKeyInput.value = '';
                if (spreadsheetIdInput) spreadsheetIdInput.value = '';
                alert('API Key và Spreadsheet ID đã được xóa.');
            });
        } else {
            console.error('Không tìm thấy nút xóa API Key và Spreadsheet ID.');
        }

       

        if (toggleDarkMode) {
            toggleDarkMode.addEventListener('change', () => {
                document.body.classList.toggle('dark-mode');
            });
        } else {
            console.error('Không tìm thấy phần tử toggle-dark-mode.');
        }

        if (toggleSidebarButton && sidebar) {
            toggleSidebarButton.addEventListener('click', () => {
                sidebar.classList.toggle('active');
            });
        } else {
            console.error('Không tìm thấy phần tử toggle-btn-home hoặc sidebar.');
        }

        // loadHeader();

    });

    // console.log('DOMContentLoaded event triggered');

    //Hàm tải dữ liệu từ Local Storage
    function loadCache() {
        const savedRange1 = localStorage.getItem("range1");
        const savedRange2 = localStorage.getItem("range2");
        const savedRange3 = localStorage.getItem("range3");
        const savedTable = localStorage.getItem("tableHTML");
        const savedRowColors = JSON.parse(localStorage.getItem("rowColors")) || [];
        const savedColumnAlignments = JSON.parse(localStorage.getItem("columnAlignments")) || [];

        if (savedRange1) {
            rangeInput1.value = savedRange1;
        }

        if (savedRange2) {
            rangeInput2.value = savedRange2;
        }

        if (savedRange3) {
            rangeInput3.value = savedRange3;
        }

        if (savedTable) {
            dataTable.innerHTML = savedTable;
            attachCellListeners();
            createCenterButtons();
            createRowControls(savedRowColors);
            updateButtonPositions();
            updateRowControlsPosition();

            // Áp dụng màu sắc đã lưu
            savedRowColors.forEach((colors, index) => {
                if (colors.textColor) {
                    changeRowTextColor(index, colors.textColor, false);
                }
                if (colors.bgColor) {
                    changeRowBgColor(index, colors.bgColor, false);
                }
            });

            // Áp dụng trạng thái căn giữa đã lưu
            const headerCells = dataTable.querySelectorAll("tr:first-child th");
            headerCells.forEach((cell, index) => {
                cell.style.textAlign = savedColumnAlignments[index] || "left";
            });
            const bodyCells = dataTable.querySelectorAll("tr td");
            bodyCells.forEach((cell, index) => {
                const colIndex = index % headerCells.length;
                cell.style.textAlign = savedColumnAlignments[colIndex] || "left";
            });

            // Áp dụng màu sắc đã lưu cho cột đầu tiên
            loadColorsFromLocalStorage();
        }
    }

    // Hàm lưu dữ liệu vào Storage
    function saveCache() {
        const data = {
            range1: rangeInput1.value,
            range2: rangeInput2.value,
            range3: rangeInput3.value,
            tableHTML: dataTable.innerHTML,
            rowColors: JSON.parse(localStorage.getItem("rowColors")) || [],
            columnAlignments: JSON.parse(localStorage.getItem("columnAlignments")) || []
        };
        localStorage.setItem("sheetTableData", JSON.stringify(data));
        console.log('Data saved to local storage:', data);
    }

    // API TABLE
    if (document.querySelector(".fa-camera")) {
        console.log("Font Awesome loaded correctly.");
    } else {
        console.error("Font Awesome did not load.");
    }

    updateCenterButtonsWidth();
    loadCache();
    // END TABLE

    // KHU VỰC GỌI HÀM CHUNG
    attachCellListeners();
    createCenterButtons();
    createRowControls(JSON.parse(localStorage.getItem("rowColors")) || []);
    saveCache();

    updateButtonPositions();
    updateRowControlsPosition(); // Cập nhật vị trí của row controls

    // Áp dụng màu đã lưu
    loadColorsFromLocalStorage();

    loadFromLocalStorage();
});