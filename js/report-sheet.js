document.addEventListener("DOMContentLoaded", function () {
    async function fetchData(range) {
        // Lấy giá trị từ Local Storage
        const apiKey = localStorage.getItem('googleApiKey');
        const spreadsheetId = localStorage.getItem('googleSpreadsheetId');
    
        if (!apiKey || !spreadsheetId) {
            alert('API Key và Spreadsheet ID không có sẵn. Vui lòng nhập chúng ở trang chính.');
            return;
        }
    
        // Kiểm tra định dạng của range
        if (!range || range.trim() === "") {
            alert('Vui lòng nhập phạm vi dữ liệu hợp lệ.');
            return;
        }
    
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}?key=${apiKey}`;
    
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP Lỗi! Chi tiết: ${response.status}`);
            }
            const data = await response.json();
            return data.values; // Trả về dữ liệu để sử dụng ở nơi khác
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu. Kiểm tra lại file Sheet:", error);
            return null;
        }
    }

    async function fetchDataForApiRightColumn(range) {
        const data = await fetchData(range);
        if (data) {
            displayDataInApiRightColumn(data);
        }
    }

    function displayDataInApiRightColumn(data) {
        const resultApiContainer = document.getElementById("result-api");
        resultApiContainer.innerHTML = ""; // Clear previous content
    
        data.forEach((row) => {
            const p = document.createElement("p");
            const cellText = row[0] || ""; // Assuming the data you want is in the first column of the row
            p.innerHTML = cellText.replace(/\n/g, '<br>'); // Replace newlines with <br>
            resultApiContainer.appendChild(p);
        });
    
        saveReportSheetDataToLocalStorage(data); // Save data to Local Storage
    }

    function joinData(dataArray) {
        return dataArray
            .map((item, index) => {
                if (index === dataArray.length - 1) {
                    return item;
                }
                if (item.includes("-")) {
                    return item + "\n";
                }
                return item + " - ";
            })
            .join("")
            .replace(/\n/g, '<br>'); // Replace newlines with <br>
    }

    function copyToClipboard() {
        const textToCopy = resultApiContainer.innerText;
        navigator.clipboard.writeText(textToCopy).then(
            function () {
                alert("Copied to clipboard!");
            },
            function (err) {
                console.error("Could not copy text: ", err);
            }
        );
    }

    function generateInputFields(data) {
        inputContainer.innerHTML = "";
    
        data.forEach((row, index) => {
            if (row[0]) {
                const inputGroup = document.createElement("div");
                inputGroup.classList.add("input-group");
    
                const input = document.createElement("input");
                input.type = "text";
                input.value = row[0];
                input.id = `rangeInput${index + 1}`;
    
                const button = document.createElement("button");
                button.innerHTML = `<i class="fas fa-arrow-circle-down"></i>`;
                button.addEventListener("click", () => fetchDataForApiRightColumn(row[0]));
    
                inputGroup.appendChild(input);
                inputGroup.appendChild(button);
                inputContainer.appendChild(inputGroup);
            }
        });
    }

    function saveReportSheetDataToLocalStorage(data) {
        localStorage.setItem('reportSheetData', JSON.stringify(data));
    }

    const copyButtonApi = document.getElementById("copyButton-api");
    const dataContainer = document.getElementById("data-container-api");
    const resultApiContainer = document.getElementById("result-api");
    const inputContainer = document.getElementById("input-container-api");

    if (copyButtonApi) {
        copyButtonApi.addEventListener("click", copyToClipboard);
    } else {
        console.error('Element with ID "copyButton-api" not found.');
    }

    document.addEventListener('headerLoaded', function () {
        const apiKeyInput = document.getElementById('apiKeyInput');
        const spreadsheetIdInput = document.getElementById('spreadsheetIdInput');

        if (apiKeyInput) {
            apiKeyInput.addEventListener('input', () => {
                const apiKey = apiKeyInput.value;
                localStorage.setItem('googleApiKey', apiKey);
            });
        } else {
            console.error('Element with ID "apiKeyInput" not found.');
        }

        if (spreadsheetIdInput) {
            spreadsheetIdInput.addEventListener('input', () => {
                const spreadsheetId = spreadsheetIdInput.value;
                localStorage.setItem('googleSpreadsheetId', spreadsheetId);
            });
        } else {
            console.error('Element with ID "spreadsheetIdInput" not found.');
        }

        const fetchButtonApiRight = document.getElementById("fetchButtonApiRight");
        if (fetchButtonApiRight) {
            fetchButtonApiRight.addEventListener("click", function() {
                const rangeInputApiRight = document.getElementById("rangeInputApiRight").value;
                fetchDataForApiRightColumn(rangeInputApiRight);
            });
        } else {
            console.error('Element with ID "fetchButtonApiRight" not found.');
        }

        async function initialize() {
            const savedData = localStorage.getItem('reportSheetData');
            if (savedData) {
                displayDataInApiRightColumn(JSON.parse(savedData));
            }
    
            const fetchButton = document.getElementById("fetchButton");
            if (fetchButton) {
                fetchButton.addEventListener("click", async function () {
                    const rangeInput = document.getElementById("rangeInput").value;
                    const data = await fetchData(rangeInput);
                    if (data) {
                        generateInputFields(data);
                    }
                });
            } else {
                console.error('Element with ID "fetchButton" not found.');
            }
        }
    
        initialize();
    });
});