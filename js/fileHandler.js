// INITIALIZE ALL EVENT LISTENERS FOR THE APPLICATION
function initializeEventListeners() {
    // FILE LOADING HANDLER - PROCESSES UPLOADED LOG FILES
    document.getElementById('fileInput').addEventListener('change', function (e) {
        const reader = new FileReader();
        reader.onload = function () {
            const lines = reader.result.split('\n');
            const rows = [];
            const myCall = document.getElementById('myCallsign').value.trim().toUpperCase();

            // PROCESS EACH LINE OF THE LOG FILE
            lines.forEach(line => {
                const dateMatch = line.match(/\[(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}):\d{2}\]/);
                if (!dateMatch) return;

                const [_, date, time] = dateMatch;

                // EXTRACT POTENTIAL CALLSIGNS USING REGEX PATTERNS
                const potentialCalls = [...line.matchAll(callSignRegex)].map(m => m[1].toUpperCase());
                const reportMatches = [...line.matchAll(reportRegex)].map(m => m[1]);
                const nameMatch = line.match(nameRegex);

                // FILTER VALID CALLSIGNS AND IDENTIFY FOREIGN STATIONS
                const validCalls = potentialCalls.filter(call => isValidCallsign(call));
                const foreignCall = validCalls.find(c => c !== myCall);
                const report = reportMatches.length ? reportMatches[0] : '';
                const name = nameMatch ? nameMatch[1].toUpperCase() : '';

                // ADD VALID CONTACT TO ROWS ARRAY
                if (foreignCall) {
                    rows.push({ date, time, call: foreignCall, name, report });
                }
            });

            // REMOVE DUPLICATE ENTRIES WITHIN 2-MINUTE WINDOW
            const filteredRows = removeDuplicatesWithin2Minutes(rows);
            renderTable(filteredRows);
        };

        // READ THE UPLOADED FILE AS TEXT
        reader.readAsText(e.target.files[0], 'UTF-8');
    });

    // ADIF EXPORT HANDLER - GENERATES ADIF FILE FROM TABLE DATA
    document.getElementById('exportBtn').addEventListener('click', function () {
        const table = document.getElementById('logTable');
        const rows = table.querySelectorAll('tr');
        const operator = document.getElementById('myCallsign').value.trim().toUpperCase();

        // ADIF FILE HEADER SECTION
        const crlf = '\r\n';
        let adif = 'ADIF Export from MorseBOX' + crlf;
        adif += '<ADIF_VER:5>3.1.4' + crlf;
        adif += '<PROGRAMID:10>MorseBOX' + crlf;
        adif += '<PROGRAMVERSION:3>7.02' + crlf;
        adif += '<EOH>' + crlf + crlf;

        let count = 0;

        // PROCESS EACH TABLE ROW AND CONVERT TO ADIF FORMAT
        rows.forEach((tr, i) => {
            if (i === 0) return;
            const cells = tr.querySelectorAll('td');
            if (cells.length < 8) return;

            // EXTRACT DATA FROM TABLE CELLS
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

            // SKIP INCOMPLETE RECORDS
            if (!call || !operator || !date || !time) return;

            // FORMAT DATE AND TIME FOR ADIF SPECIFICATION
            const adifDate = date.replace(/-/g, '');
            const adifTime = time.replace(/:/g, '').slice(0, 4);

            // BUILD ADIF RECORD WITH ALL AVAILABLE FIELDS
            adif += `<OPERATOR:${operator.length}>${operator} <CALL:${call.length}>${call} <QSO_DATE:8>${adifDate} <TIME_ON:4>${adifTime} <MODE:2>CW <RST_SENT:${reportSent.length}>${reportSent} <RST_RCVD:${reportReceived.length}>${reportReceived}`;
            if (name) adif += ` <NAME:${name.length}>${name}`;
            if (band) adif += ` <BAND:${band.length}>${band}`;
            adif += ` <EOR>` + crlf;

            count++;
        });

        // VALIDATE THAT RECORDS WERE PROCESSED
        if (count === 0) {
            alert("No ADIF records saved. Check the data in the table.");
            return;
        }

        // CREATE AND DOWNLOAD ADIF FILE
        const blob = new Blob([adif], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'log.adi';
        link.click();
    });
}