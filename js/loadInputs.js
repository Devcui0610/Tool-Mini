// loadInputs.js
import { saveToLocalStorage, loadFromLocalStorage } from './utils/local-storage.js';
import { showSaveIcon } from './utils/ui.js';

document.addEventListener('DOMContentLoaded', function() {
    const apiKeyInput = document.getElementById('apiKeyInput');
    const spreadsheetIdInput = document.getElementById('spreadsheetIdInput');

    if (apiKeyInput) {
        apiKeyInput.addEventListener('input', () => {
            const apiKey = apiKeyInput.value;
            saveValueWithCheckmark('apiKeyInput', 'apiKeyCheckmark', 'apiKey');
            saveToLocalStorage('apiKey', apiKey);
        });
    } else {
        console.error('Element with id "apiKeyInput" not found');
    }

    if (spreadsheetIdInput) {
        spreadsheetIdInput.addEventListener('input', () => {
            const spreadsheetId = spreadsheetIdInput.value;
            saveValueWithCheckmark('spreadsheetIdInput', 'spreadsheetIdCheckmark', 'spreadsheetId');
            saveToLocalStorage('spreadsheetId', spreadsheetId);
        });
    } else {
        console.error('Element với id "spreadsheetIdInput" not found');
    }

    loadValueFromLocalStorage('apiKeyInput', 'apiKey');
    loadValueFromLocalStorage('spreadsheetIdInput', 'spreadsheetId');
});