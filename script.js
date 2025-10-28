// Prevent iOS zoom on input focus
document.addEventListener('DOMContentLoaded', function () {
    const inputs = document.querySelectorAll('input[type="text"]');
    inputs.forEach(input => {
        input.addEventListener('focus', function () {
            this.style.fontSize = '16px';
        });
        input.addEventListener('blur', function () {
            this.style.fontSize = '';
        });
    });

    // Initialize button states
    document.getElementById('exportBtn').style.display = 'none';
    document.getElementById('deleteBtn').style.display = 'none';
    document.getElementById('addRowBtn').style.display = 'none';
    document.getElementById('bandFillControl').style.display = 'none';
});

// Regular expressions for parsing logs
const callSignRegex = /\b([A-Z0-9]{1,3}\/?[A-Z0-9]{1,4}\/?[A-Z0-9]{1,5}(?:\/[A-Z0-9]{1,5})?)\b/g;
const reportRegex = /\b([1-5H][1-9N][1-9N])\b/g;
const nameRegex = /\bDR\s+([A-Z]{2,})\b/;

// Check if it's a valid callsign
function isValidCallsign(call) {
    if (/^\d+$/.test(call)) return false;
    if (!/\d/.test(call)) return false;
    if (call.replace(/\//g, '').length < 3) return false;

    const parts = call.split('/');
    for (let part of parts) {
        if (/^\d+$/.test(part)) return false;
    }

    return true;
}

// Remove duplicates within 2 minutes
function removeDuplicatesWithin2Minutes(rows) {
    const seen = new Map();
    const uniqueRows = [];

    const sortedRows = [...rows].sort((a, b) => {
        const timeA = new Date(`${a.date} ${a.time}`).getTime();
        const timeB = new Date(`${b.date} ${b.time}`).getTime();
        return timeA - timeB;
    });

    for (const row of sortedRows) {
        const call = row.call;
        const currentTime = new Date(`${row.date} ${row.time}`).getTime();

        if (seen.has(call)) {
            const lastTime = seen.get(call);
            const timeDiff = (currentTime - lastTime) / (1000 * 60);

            if (timeDiff > 2) {
                uniqueRows.push(row);
                seen.set(call, currentTime);
            }
        } else {
            uniqueRows.push(row);
            seen.set(call, currentTime);
        }
    }

    return uniqueRows;
}

// Auto-format date input (YYYY-MM-DD)
function formatDate(input) {
    let value = input.value.replace(/\D/g, '');

    if (value.length >= 4) {
        value = value.substring(0, 4) + '-' + value.substring(4);
    }
    if (value.length >= 7) {
        value = value.substring(0, 7) + '-' + value.substring(7);
    }

    value = value.substring(0, 10);
    input.value = value;
}

// Auto-format time input (HH:MM)
function formatTime(input) {
    let value = input.value.replace(/\D/g, '');

    if (value.length >= 2) {
        value = value.substring(0, 2) + ':' + value.substring(2);
    }

    value = value.substring(0, 5);
    input.value = value;
}

// File loading handler
document.getElementById('fileInput').addEventListener('change', function (e) {
    const reader = new FileReader();
    reader.onload = function () {
        const lines = reader.result.split('\n');
        const rows = [];
        const myCall = document.getElementById('myCallsign').value.trim().toUpperCase();

        lines.forEach(line => {
            const dateMatch = line.match(/\[(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}):\d{2}\]/);
            if (!dateMatch) return;

            const [_, date, time] = dateMatch;

            const potentialCalls = [...line.matchAll(callSignRegex)].map(m => m[1].toUpperCase());
            const reportMatches = [...line.matchAll(reportRegex)].map(m => m[1]);
            const nameMatch = line.match(nameRegex);

            const validCalls = potentialCalls.filter(call => isValidCallsign(call));
            const foreignCall = validCalls.find(c => c !== myCall);
            const report = reportMatches.length ? reportMatches[0] : '';
            const name = nameMatch ? nameMatch[1].toUpperCase() : '';

            if (foreignCall) {
                rows.push({ date, time, call: foreignCall, name, report });
            }
        });

        const filteredRows = removeDuplicatesWithin2Minutes(rows);
        renderTable(filteredRows);
    };

    reader.readAsText(e.target.files[0], 'UTF-8');
});

// Create empty table row
function createEmptyRow() {
    const emptyRow = document.createElement('tr');

    const config = [
        {
            placeholder: 'YYYY-MM-DD',
            formatter: formatDate,
            style: { width: '100%' }
        },
        {
            placeholder: 'HH:MM',
            formatter: formatTime,
            style: { width: '100%' }
        },
        {
            placeholder: 'Callsign',
            style: { width: '100%' }
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

    config.forEach(item => {
        const td = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = item.placeholder;

        // Ustawianie klasy
        if (item.className) input.className = item.className;

        // Ustawianie stylów
        if (item.style) {
            Object.assign(input.style, item.style);
        }

        if (item.formatter) {
            input.addEventListener('input', () => item.formatter(input));
        }
        td.appendChild(input);
        emptyRow.appendChild(td);
    });

    // Checkbox cell
    const tdCheck = document.createElement('td');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'rowCheckbox';
    tdCheck.appendChild(checkbox);
    emptyRow.appendChild(tdCheck);

    return emptyRow;
}

// Render table with data
function renderTable(data) {
    const container = document.getElementById('tableContainer');
    container.innerHTML = '';
    const exportBtn = document.getElementById('exportBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const addRowBtn = document.getElementById('addRowBtn');
    const bandFillControl = document.getElementById('bandFillControl');

    const hasData = data.length > 0;
    exportBtn.style.display = hasData ? 'inline-block' : 'none';
    deleteBtn.style.display = hasData ? 'inline-block' : 'none';
    addRowBtn.style.display = hasData ? 'inline-block' : 'none';
    bandFillControl.style.display = hasData ? 'block' : 'none';

    if (!hasData) {
        container.textContent = 'No data to display.';
        return;
    }

    const table = document.createElement('table');
    table.id = 'logTable';

    const header = document.createElement('tr');
    ['DATE', 'TIME', 'CALLSIGN', 'NAME', 'REPORT SENT', 'REPORT RECEIVED', 'BAND', 'SELECT'].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        header.appendChild(th);
    });
    table.appendChild(header);

    data.forEach((row, index) => {
        const tr = document.createElement('tr');
        tr.dataset.index = index;

        const tdDate = document.createElement('td');
        tdDate.textContent = row.date;
        tr.appendChild(tdDate);

        const tdTime = document.createElement('td');
        tdTime.textContent = row.time;
        tr.appendChild(tdTime);

        const tdCall = document.createElement('td');
        tdCall.textContent = row.call;
        tr.appendChild(tdCall);

        const tdName = document.createElement('td');
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.className = 'nameInput';
        nameInput.value = row.name || '';
        tdName.appendChild(nameInput);
        tr.appendChild(tdName);

        const tdReportSent = document.createElement('td');
        const reportSentInput = document.createElement('input');
        reportSentInput.type = 'text';
        reportSentInput.className = 'reportInput';
        reportSentInput.value = row.report || '';
        reportSentInput.placeholder = 'RST';
        tdReportSent.appendChild(reportSentInput);
        tr.appendChild(tdReportSent);

        const tdReportReceived = document.createElement('td');
        const reportReceivedInput = document.createElement('input');
        reportReceivedInput.type = 'text';
        reportReceivedInput.className = 'reportReceivedInput';
        reportReceivedInput.value = row.report || '';
        reportReceivedInput.placeholder = 'RST';
        tdReportReceived.appendChild(reportReceivedInput);
        tr.appendChild(tdReportReceived);

        const tdBand = document.createElement('td');
        const bandInput = document.createElement('input');
        bandInput.type = 'text';
        bandInput.className = 'bandInput';
        bandInput.placeholder = 'XXX';
        tdBand.appendChild(bandInput);
        tr.appendChild(tdBand);

        const tdCheck = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'rowCheckbox';
        tdCheck.appendChild(checkbox);
        tr.appendChild(tdCheck);

        table.appendChild(tr);
    });

    const emptyRow = createEmptyRow();
    table.appendChild(emptyRow);

    container.appendChild(table);
}

// Add empty row
document.getElementById('addRowBtn').addEventListener('click', function () {
    const table = document.getElementById('logTable');
    const emptyRow = createEmptyRow();
    table.appendChild(emptyRow);
});

// Delete selected rows
document.getElementById('deleteBtn').addEventListener('click', function () {
    const table = document.getElementById('logTable');
    const checkboxes = table.querySelectorAll('.rowCheckbox');
    checkboxes.forEach(cb => {
        if (cb.checked) {
            cb.closest('tr').remove();
        }
    });
});

// Fill all band inputs with same value
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

// Normalize RST report (replace H with 5, N with 9)
function normalizeReport(raw) {
    const cleaned = raw.replace(/H/g, '5').replace(/N/g, '9');
    return cleaned || '599';
}

// ADIF export handler
document.getElementById('exportBtn').addEventListener('click', function () {
    const table = document.getElementById('logTable');
    const rows = table.querySelectorAll('tr');
    const operator = document.getElementById('myCallsign').value.trim().toUpperCase();

    const crlf = '\r\n';
    let adif = 'ADIF Export from MorseBOX' + crlf;
    adif += '<ADIF_VER:5>3.1.4' + crlf;
    adif += '<PROGRAMID:10>MorseBOX' + crlf;
    adif += '<PROGRAMVERSION:3>7.02' + crlf;
    adif += '<EOH>' + crlf + crlf;

    let count = 0;

    rows.forEach((tr, i) => {
        if (i === 0) return;
        const cells = tr.querySelectorAll('td');
        if (cells.length < 8) return;

        const dateInput = cells[0].querySelector('input');
        const timeInput = cells[1].querySelector('input');
        const callInput = cells[2].querySelector('input');

        const date = dateInput ? dateInput.value.trim() : cells[0].textContent.trim();
        const time = timeInput ? timeInput.value.trim() : cells[1].textContent.trim();
        const call = callInput ? callInput.value.trim() : cells[2].textContent.trim();

        const name = cells[3].querySelector('input')?.value.trim() || '';

        let reportSent = cells[4].querySelector('input')?.value.trim() || '';
        reportSent = normalizeReport(reportSent);

        let reportReceived = cells[5].querySelector('input')?.value.trim() || '';
        reportReceived = normalizeReport(reportReceived);

        const bandRaw = cells[6].querySelector('input')?.value.trim() || '';
        const band = bandRaw ? bandRaw.toUpperCase() + 'M' : '';

        if (!call || !operator || !date || !time) return;

        const adifDate = date.replace(/-/g, '');
        const adifTime = time.replace(/:/g, '').slice(0, 4);

        adif += `<OPERATOR:${operator.length}>${operator} <CALL:${call.length}>${call} <QSO_DATE:8>${adifDate} <TIME_ON:4>${adifTime} <MODE:2>CW <RST_SENT:${reportSent.length}>${reportSent} <RST_RCVD:${reportReceived.length}>${reportReceived}`;
        if (name) adif += ` <NAME:${name.length}>${name}`;
        if (band) adif += ` <BAND:${band.length}>${band}`;
        adif += ` <EOR>` + crlf;

        count++;
    });

    if (count === 0) {
        alert("No ADIF records saved. Check the data in the table.");
        return;
    }

    const blob = new Blob([adif], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'log.adi';
    link.click();
});
