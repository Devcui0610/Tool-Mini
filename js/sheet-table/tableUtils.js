// sheet-table/tableUtils.js
export function displayData(dataTable, data, defaultCenteredColumns) {
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

        // Attach cell listeners and other functions here
    }
}

export function parseHTMLTable(html) {
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