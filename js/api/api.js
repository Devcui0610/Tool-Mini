export function saveApiKeyAndSpreadsheetId(apiKey, spreadsheetId) {
    localStorage.setItem('googleApiKey', apiKey);
    localStorage.setItem('googleSpreadsheetId', spreadsheetId);
}

export function getApiKeyAndSpreadsheetId() {
    const apiKey = localStorage.getItem('googleApiKey');
    const spreadsheetId = localStorage.getItem('googleSpreadsheetId');
    console.log('Lấy API Key và Spreadsheet ID từ Local Storage:', { apiKey, spreadsheetId });
    return { apiKey, spreadsheetId };
}

export async function fetchData(range) {
    const { apiKey, spreadsheetId } = getApiKeyAndSpreadsheetId();
    if (!apiKey || !spreadsheetId) {
        alert('Vui lòng nhập API Key và Spreadsheet ID.');
        console.log('API Key hoặc Spreadsheet ID không có sẵn.');
        return null;
    }
    console.log(`Using API Key: ${apiKey}`);
    console.log(`Using Spreadsheet ID: ${spreadsheetId}`);
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}?key=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP Lỗi! Chi tiết: ${response.status}`);
        }
        const data = await response.json();
        return data.values;
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu. Kiểm tra lại file Sheet:", error);
        return null;
    }
}