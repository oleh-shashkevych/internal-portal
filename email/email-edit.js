document.addEventListener('DOMContentLoaded', function () {
    console.log('Edit Campaign page loaded');

    // ===========================================
    // 1. CUSTOM MULTI-SELECT LOGIC (State & Income)
    // ===========================================
    const multiselects = document.querySelectorAll('.custom-multiselect');

    multiselects.forEach(ms => {
        const box = ms.querySelector('.select-box');
        const list = ms.querySelector('.options-list');
        const checkboxes = list.querySelectorAll('input[type="checkbox"]');

        // Initial text update
        updateSelectedText(ms);

        // Toggle dropdown
        box.addEventListener('click', (e) => {
            e.stopPropagation();
            // Close others
            multiselects.forEach(other => {
                if (other !== ms) other.classList.remove('open');
            });
            ms.classList.toggle('open');
        });

        // Handle checkbox changes
        checkboxes.forEach(cb => {
            cb.addEventListener('change', () => {
                updateSelectedText(ms);
            });
        });

        // Stop clicks inside list from closing dropdown
        list.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });

    function updateSelectedText(container) {
        const checkboxes = container.querySelectorAll('input[type="checkbox"]:checked');
        const displaySpan = container.querySelector('.selected-text');

        if (checkboxes.length === 0) {
            displaySpan.textContent = "Select options";
            displaySpan.style.color = "#808080";
        } else if (checkboxes.length === 1) {
            // Get text from the parent label span
            const labelText = checkboxes[0].parentElement.querySelector('.option-label').textContent;
            displaySpan.textContent = labelText;
            displaySpan.style.color = "#232323";
        } else {
            displaySpan.textContent = `${checkboxes.length} items selected`;
            displaySpan.style.color = "#232323";
        }
    }

    // Close dropdowns when clicking outside
    document.addEventListener('click', () => {
        multiselects.forEach(ms => ms.classList.remove('open'));
    });


    // ===========================================
    // 2. CUSTOM DATE PICKER LOGIC
    // ===========================================
    const dateTrigger = document.getElementById('date-time-trigger');
    const overlay = document.getElementById('datePickerOverlay');
    const closeBtn = document.getElementById('dpClose');
    const scheduleBtn = document.getElementById('scheduleBtn');
    const previewDisplay = document.getElementById('previewDateTime');
    const timeHourInput = document.getElementById('timeHour');
    const timeAmpmSelect = document.getElementById('timeAmpm');

    let selectedDateObj = new Date(); // Stores current selection

    // Initialize Flatpickr in Inline Mode (inside the modal)
    const fp = flatpickr("#inline-calendar", {
        inline: true,
        dateFormat: "Y-m-d",
        defaultDate: "today",
        onChange: function (selectedDates, dateStr, instance) {
            if (selectedDates.length > 0) {
                selectedDateObj = selectedDates[0];
                updatePreviewText();
            }
        }
    });

    // Open Modal
    dateTrigger.addEventListener('click', () => {
        overlay.classList.add('active');
        updatePreviewText();
    });

    // Close Modal
    function closeModal() {
        overlay.classList.remove('active');
    }

    closeBtn.addEventListener('click', closeModal);

    // Close on click outside modal
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });

    // Update Preview Text (bottom of modal)
    function updatePreviewText() {
        const datePart = fp.formatDate(selectedDateObj, "M j"); // e.g. Sep 18
        const timePart = `${timeHourInput.value} ${timeAmpmSelect.value}`;
        previewDisplay.textContent = `${datePart}, ${timePart}`;
    }

    // Listen to time changes to update preview
    timeHourInput.addEventListener('input', updatePreviewText);
    timeAmpmSelect.addEventListener('change', updatePreviewText);

    // Schedule Send Button Click
    scheduleBtn.addEventListener('click', () => {
        const datePart = fp.formatDate(selectedDateObj, "m/d/Y"); // 09/18/2025
        const timePart = `${timeHourInput.value} ${timeAmpmSelect.value}`;

        // Update the main input field
        dateTrigger.value = `${datePart} ${timePart}`;

        closeModal();
    });

    // ===========================================
    // 3. SIDEBAR LOGIC (Existing)
    // ===========================================
    const burger = document.getElementById('burger');
    const closeBurger = document.getElementById('close_burger');
    const sideBar = document.querySelector('.left_cp_bar');
    const mainOverlay = document.querySelector('.overlay'); // Main page overlay

    if (burger && closeBurger && sideBar && mainOverlay) {
        burger.addEventListener('click', () => {
            sideBar.style.transform = 'translateX(0)';
            mainOverlay.style.display = 'flex';
        });

        closeBurger.addEventListener('click', () => {
            sideBar.style.transform = 'translateX(-120%)';
            mainOverlay.style.display = 'none';
        });
    }
});