// REGULAR EXPRESSIONS FOR PARSING LOGS
const callSignRegex = /\b([A-Z0-9]{1,3}\/?[A-Z0-9]{1,4}\/?[A-Z0-9]{1,5}(?:\/[A-Z0-9]{1,5})?)\b/g;
const reportRegex = /\b([1-5H][1-9N][1-9N])\b/g;
const nameRegex = /\bDR\s+([A-Z]{2,})\b/;

// CHECK IF IT'S A VALID CALLSIGN
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

// REMOVE DUPLICATES WITHIN 2 MINUTES
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