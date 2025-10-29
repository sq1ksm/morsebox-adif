// CREATE AN EMPTY TABLE ROW WITH INPUT FIELDS BASED ON CONFIGURATION
function createEmptyRow() {
    const emptyRow = document.createElement('tr');

    // CONFIGURATION ARRAY DEFINING EACH COLUMN'S PROPERTIES
    const config = [
        {
            placeholder: 'YYYY-MM-DD',
            formatter: formatDate
        },
        {
            placeholder: 'HH:MM',
            formatter: formatTime
        },
        {
            placeholder: 'Callsign'
        },
        {
            placeholder: 'Name',
            className: 'nameInput'
        },
        {
            placeholder: 'RST',
            className: 'reportInput',
        },
        {
            placeholder: 'RST',
            className: 'reportReceivedInput'
        },
        {
            placeholder: 'XXX',
            className: 'bandInput',
        }
    ];

    // CREATE TABLE CELLS AND INPUTS BASED ON CONFIGURATION
    config.forEach(item => {
        const td = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = item.placeholder;

        if (item.className) input.className = item.className;

        if (item.formatter) {
            input.addEventListener('input', () => item.formatter(input));
        }
        td.appendChild(input);
        emptyRow.appendChild(td);
    });

    // CHECKBOX CELL FOR ROW SELECTION
    const tdCheck = document.createElement('td');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'rowCheckbox';
    tdCheck.appendChild(checkbox);
    emptyRow.appendChild(tdCheck);

    return emptyRow;
}

// RENDER THE MAIN TABLE WITH DATA AND CONTROLS
function renderTable(data) {
    const container = document.getElementById('tableContainer');
    container.innerHTML = '';
    const exportBtn = document.getElementById('exportBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const addRowBtn = document.getElementById('addRowBtn');
    const bandFillControl = document.getElementById('bandFillControl');

    // SHOW/HIDE CONTROLS BASED ON DATA AVAILABILITY
    const hasData = data.length > 0;
    exportBtn.style.display = hasData ? 'inline-block' : 'none';
    deleteBtn.style.display = hasData ? 'inline-block' : 'none';
    addRowBtn.style.display = hasData ? 'inline-block' : 'none';
    bandFillControl.style.display = hasData ? 'block' : 'none';

    // DISPLAY MESSAGE IF NO DATA AVAILABLE
    if (!hasData) {
        container.textContent = 'No data to display.';
        return;
    }

    // CREATE MAIN TABLE ELEMENT
    const table = document.createElement('table');
    table.id = 'logTable';

    // CREATE TABLE HEADER ROW
    const header = document.createElement('tr');
    ['DATA', 'CZAS', 'ZNAK', 'IMIĘ', 'REPORT TX', 'REPORT RX', 'PASMO', 'ZAZNACZ'].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        header.appendChild(th);
    });
    table.appendChild(header);

    // POPULATE TABLE WITH DATA ROWS
    data.forEach((row, index) => {
        const tr = document.createElement('tr');
        tr.dataset.index = index;

        // DATE COLUMN
        const tdDate = document.createElement('td');
        tdDate.textContent = row.date;
        tr.appendChild(tdDate);

        // TIME COLUMN
        const tdTime = document.createElement('td');
        tdTime.textContent = row.time;
        tr.appendChild(tdTime);

        // CALLSIGN COLUMN
        const tdCall = document.createElement('td');
        tdCall.textContent = row.call;
        tr.appendChild(tdCall);

        // NAME COLUMN WITH INPUT FIELD
        const tdName = document.createElement('td');
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.className = 'nameInput';
        nameInput.placeholder = 'Name'; // ADDED PLACEHOLDER
        nameInput.value = row.name || '';
        tdName.appendChild(nameInput);
        tr.appendChild(tdName);

        // REPORT SENT COLUMN WITH INPUT FIELD
        const tdReportSent = document.createElement('td');
        const reportSentInput = document.createElement('input');
        reportSentInput.type = 'text';
        reportSentInput.className = 'reportInput';
        reportSentInput.placeholder = 'RST'; // ADDED PLACEHOLDER
        reportSentInput.value = row.report || '';
        tdReportSent.appendChild(reportSentInput);
        tr.appendChild(tdReportSent);

        // REPORT RECEIVED COLUMN WITH INPUT FIELD
        const tdReportReceived = document.createElement('td');
        const reportReceivedInput = document.createElement('input');
        reportReceivedInput.type = 'text';
        reportReceivedInput.className = 'reportReceivedInput';
        reportReceivedInput.placeholder = 'RST'; // ADDED PLACEHOLDER
        reportReceivedInput.value = row.report || '';
        tdReportReceived.appendChild(reportReceivedInput);
        tr.appendChild(tdReportReceived);

        // BAND COLUMN WITH INPUT FIELD
        const tdBand = document.createElement('td');
        const bandInput = document.createElement('input');
        bandInput.type = 'text';
        bandInput.className = 'bandInput';
        bandInput.placeholder = 'XXX'; // ADDED PLACEHOLDER
        tdBand.appendChild(bandInput);
        tr.appendChild(tdBand);

        // SELECTION CHECKBOX COLUMN
        const tdCheck = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'rowCheckbox';
        tdCheck.appendChild(checkbox);
        tr.appendChild(tdCheck);

        table.appendChild(tr);
    });

    // ADD EMPTY ROW FOR NEW DATA ENTRY
    const emptyRow = createEmptyRow();
    table.appendChild(emptyRow);

    container.appendChild(table);
}

// SET UP EVENT HANDLERS FOR TABLE CONTROL BUTTONS
function setupTableControls() {
    // ADD EMPTY ROW TO THE TABLE
    document.getElementById('addRowBtn').addEventListener('click', function () {
        const table = document.getElementById('logTable');
        const emptyRow = createEmptyRow();
        table.appendChild(emptyRow);
    });

    // DELETE SELECTED ROWS FROM THE TABLE
    document.getElementById('deleteBtn').addEventListener('click', function () {
        const table = document.getElementById('logTable');
        const checkboxes = table.querySelectorAll('.rowCheckbox');
        checkboxes.forEach(cb => {
            if (cb.checked) {
                cb.closest('tr').remove();
            }
        });
    });

    // FILL ALL BAND INPUTS WITH SAME VALUE FROM GLOBAL INPUT
    document.getElementById('fillBandBtn').addEventListener('click', function () {
        const globalBandValue = document.getElementById('globalBandInput').value.trim();
        if (!globalBandValue) {
            alert('Please enter a band value before using this function.');
            return;
        }

        const bandInputs = document.querySelectorAll('input.bandInput');
        bandInputs.forEach(input => {
            input.value = globalBandValue;
        });
    });
}