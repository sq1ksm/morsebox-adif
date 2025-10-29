// INITIALIZE APPLICATION WHEN DOM IS FULLY LOADED
document.addEventListener('DOMContentLoaded', function () {
    // PREVENT iOS ZOOM ON INPUT FOCUS - FIX FOR MOBILE BROWSERS
    const inputs = document.querySelectorAll('input[type="text"]');
    inputs.forEach(input => {
        input.addEventListener('focus', function () {
            this.style.fontSize = '16px';
        });
        input.addEventListener('blur', function () {
            this.style.fontSize = '';
        });
    });

    // INITIALIZE BUTTON STATES - HIDE ALL CONTROLS INITIALLY
    document.getElementById('exportBtn').style.display = 'none';
    document.getElementById('deleteBtn').style.display = 'none';
    document.getElementById('addRowBtn').style.display = 'none';
    document.getElementById('bandFillControl').style.display = 'none';

    // SETUP ALL APPLICATION EVENT LISTENERS AND CONTROLS
    initializeEventListeners();
    setupTableControls();
});