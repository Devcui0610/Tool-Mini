// sheet-table/fetchData.js
export async function fetchData(apiKey, spreadsheetId, range) {
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