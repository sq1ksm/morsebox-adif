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

// AUTO-FORMAT TIME INPUT (HH:MM)
function formatTime(input) {
    let value = input.value.replace(/\D/g, '');

    if (value.length >= 2) {
        value = value.substring(0, 2) + ':' + value.substring(2);
    }

    value = value.substring(0, 5);
    input.value = value;
}

// NORMALIZE RST REPORT (REPLACE H WITH 5, N WITH 9)
function normalizeReport(raw) {
    const cleaned = raw.replace(/H/g, '5').replace(/N/g, '9');
    return cleaned || '599';
}