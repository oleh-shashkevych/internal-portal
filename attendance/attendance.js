// At the beginning of your attendance.js, after existing const declarations:
const add_new = document.querySelector('.attendance_newBTN');
const overlay = document.querySelector('.overlay');
const close = document.getElementById('close_attendanceModal'); // 'close' is the ID of the close button in the main modal
const today = new Date();
const lastMonth = new Date();
lastMonth.setMonth(today.getMonth() - 1);

const mainModal = overlay.querySelector('.attendance_modal');
const modalTitle = mainModal.querySelector('.attendance_modal-title');
const modalSubmitButton = mainModal.querySelector('.attendance_modal-btn');

// References to form elements for resetting and validation (ensure these are correct based on your HTML)
const notesInput = document.querySelector('#notes');
const textareaLeft = document.querySelector('.textarea_left');

const absentTypeCustomSelect = document.querySelector('.absent_type-input').closest('.custom-select--attendance');
const absentTypeSelectInput = absentTypeCustomSelect.querySelector('.custom-select__input');
const absentTypeHiddenInput = absentTypeCustomSelect.querySelector('.absent_type-input');
const absentTypeErrorBlock = absentTypeCustomSelect.querySelector('.error-message') || document.createElement('p'); // Handle if not pre-existing

const paidStatusCustomSelect = document.querySelector('.paid-status-hidden-input').closest('.custom-select--attendance');
const paidStatusSelectInput = paidStatusCustomSelect.querySelector('.custom-select__input');
const paidStatusHiddenInput = paidStatusCustomSelect.querySelector('.paid-status-hidden-input');
const paidStatusErrorBlock = paidStatusCustomSelect.querySelector('.error-message') || document.createElement('p'); // Handle if not pre-existing


// Получаем блоки для дат
const startDateBlock = document.querySelector('.start_date-wrap');
const endDateBlock = document.querySelector('.end_date-wrap');
const startDateText = startDateBlock.querySelector('p');
const endDateText = endDateBlock.querySelector('p');

// Создаем элементы для отображения ошибок (if not already handled by your existing code)
let errorStartDate = startDateBlock.querySelector('.error-message');
if (!errorStartDate) {
    errorStartDate = document.createElement('p');
    errorStartDate.classList.add('error-message');
    errorStartDate.textContent = 'First Date is required';
    startDateBlock.appendChild(errorStartDate);
    errorStartDate.style.display = 'none';
}

let errorEndDate = endDateBlock.querySelector('.error-message');
if (!errorEndDate) {
    errorEndDate = document.createElement('p');
    errorEndDate.classList.add('error-message');
    errorEndDate.textContent = 'Please select a start date first.';
    endDateBlock.appendChild(errorEndDate);
    errorEndDate.style.display = 'none';
}

let errorBlockSelect = absentTypeCustomSelect.querySelector('.error-message');
if (!errorBlockSelect) {
    errorBlockSelect = document.createElement('p');
    errorBlockSelect.classList.add('error-message');
    errorBlockSelect.textContent = 'Choose option';
    absentTypeCustomSelect.appendChild(errorBlockSelect); // Append to the custom select container
    errorBlockSelect.style.display = 'none';
}


let errorBlockPaidStatus = paidStatusCustomSelect.querySelector('.error-message');
if (!errorBlockPaidStatus) {
    errorBlockPaidStatus = document.createElement('p');
    errorBlockPaidStatus.classList.add('error-message');
    errorBlockPaidStatus.textContent = 'Choose paid status';
    paidStatusCustomSelect.appendChild(errorBlockPaidStatus); // Append to the custom select container
    errorBlockPaidStatus.style.display = 'none';
}


let errorBlockNotes = notesInput.parentNode.querySelector('.error-message');
if(!errorBlockNotes) {
    errorBlockNotes = document.createElement('p');
    errorBlockNotes.classList.add('error-message');
    errorBlockNotes.textContent = 'Notes are required';
    notesInput.parentNode.appendChild(errorBlockNotes);
    errorBlockNotes.style.display = 'none';
}


// --- MODAL OPEN/CLOSE LOGIC (Modified for Edit/Add) ---
function resetMainModalForm() {
    // Clear text/textarea inputs
    notesInput.value = '';
    const remainingChars = 500 - notesInput.value.length;
    if(textareaLeft) textareaLeft.textContent = `${remainingChars} characters left`;


    // Reset custom select for "Absent type"
    if(absentTypeSelectInput) absentTypeSelectInput.textContent = 'Select an option';
    if(absentTypeHiddenInput) absentTypeHiddenInput.value = '';
    if(absentTypeSelectInput) absentTypeSelectInput.style.border = '1px solid #d0d3d1'; // Reset border
    if(errorBlockSelect) errorBlockSelect.style.display = 'none';


    // Reset custom select for "Paid Status"
    if(paidStatusSelectInput) paidStatusSelectInput.textContent = 'Select status';
    if(paidStatusHiddenInput) paidStatusHiddenInput.value = '';
    if(paidStatusSelectInput) paidStatusSelectInput.style.border = '1px solid #d0d3d1'; // Reset border
    if(errorBlockPaidStatus) errorBlockPaidStatus.style.display = 'none';

    // Reset Flatpickr date pickers
    if(startDatePicker) startDatePicker.clear();
    if(endDatePicker) endDatePicker.clear();
    
    if(startDateText) startDateText.textContent = 'Select date';
    if(endDateText) endDateText.textContent = 'Select date';
    if(startDateBlock) startDateBlock.style.border = '1px solid #d0d3d1';
    if(endDateBlock) endDateBlock.style.border = '1px solid #d0d3d1';
    if(errorStartDate) errorStartDate.style.display = 'none';
    // errorEndDate is handled by its own logic mostly, but ensure it's reset
    if(errorEndDate) errorEndDate.style.display = 'none'; 
    
    // Reset notes validation
    if(notesInput) notesInput.style.border = '1px solid #d0d3d1';
    if(errorBlockNotes) errorBlockNotes.style.display = 'none';


    // Ensure calendars are hidden
    const startDatePickerWrapper = document.querySelector('.start-date-picker');
    const endDatePickerWrapper = document.querySelector('.end-date-picker');
    if (startDatePickerWrapper && !startDatePickerWrapper.classList.contains('hidden')) {
        startDatePickerWrapper.classList.add('hidden');
    }
    if (endDatePickerWrapper && !endDatePickerWrapper.classList.contains('hidden')) {
        endDatePickerWrapper.classList.add('hidden');
    }
}


function openMainModal(isEditMode = false, itemData = null) {
    resetMainModalForm(); 

    if (isEditMode) {
        modalTitle.textContent = 'Edit Note';
        modalSubmitButton.textContent = 'Save Changes';
        // TODO: Pre-fill logic if needed
    } else {
        modalTitle.textContent = 'Add Expense';
        modalSubmitButton.textContent = 'Add Expense';
        if(startDatePicker) startDatePicker.setDate(lastMonth, true); 
    }
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeMainModalFunc() {
    overlay.style.display = 'none';
    document.body.style.overflow = 'auto';
}

if(add_new) {
    add_new.addEventListener('click', () => {
        openMainModal(false);
    });
}

if(close) {
    close.addEventListener('click', () => {
        closeMainModalFunc();
    });
}

// --- EDIT BUTTONS ---
const editButtons = document.querySelectorAll('.attendance_item .edits .edit');
editButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        // const itemRow = event.target.closest('.attendance_item');
        // const itemData = { /* ... extract data from itemRow ... */ }; // If pre-filling
        openMainModal(true /*, itemData */);
    });
});

// --- DELETE BUTTONS & CONFIRMATION POPUP ---
let deleteConfirmOverlayElement = null;
let currentItemToDelete = null;

function createDeleteConfirmationPopup() {
    if (document.getElementById('deleteConfirmOverlay')) {
        deleteConfirmOverlayElement = document.getElementById('deleteConfirmOverlay');
        return; 
    }

    deleteConfirmOverlayElement = document.createElement('div');
    deleteConfirmOverlayElement.id = 'deleteConfirmOverlay';
    // CSS will style this via its ID

    const modal = document.createElement('div');
    modal.id = 'deleteConfirmModal';

    const message = document.createElement('p');
    message.textContent = 'Delete this Note?';

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'popup-buttons';

    const confirmButton = document.createElement('button');
    confirmButton.id = 'confirmDeleteBtn';
    confirmButton.className = 'attendance_modal-btn'; 
    confirmButton.textContent = 'Yes, Delete';
    confirmButton.style.backgroundColor = '#f55'; 
    confirmButton.style.borderColor = '#f55';
    confirmButton.style.color = '#fff';


    const cancelButton = document.createElement('button');
    cancelButton.id = 'cancelDeleteBtn';
    cancelButton.className = 'attendance_modal-btn'; 
    cancelButton.textContent = 'Cancel';

    buttonContainer.appendChild(confirmButton);
    buttonContainer.appendChild(cancelButton);
    modal.appendChild(message);
    modal.appendChild(buttonContainer);
    deleteConfirmOverlayElement.appendChild(modal);
    document.body.appendChild(deleteConfirmOverlayElement);

    confirmButton.addEventListener('click', () => {
        if (currentItemToDelete) {
            console.log('Confirmed delete for item:', currentItemToDelete);
            currentItemToDelete.remove(); // Actual removal from DOM
            // currentItemToDelete.classList.remove('deleting-item');
        }
        deleteConfirmOverlayElement.style.display = 'none';
        document.body.style.overflow = 'auto';
        currentItemToDelete = null; 
    });

    cancelButton.addEventListener('click', () => {
        if (currentItemToDelete) {
            currentItemToDelete.classList.remove('deleting-item'); 
        }
        deleteConfirmOverlayElement.style.display = 'none';
        document.body.style.overflow = 'auto';
        currentItemToDelete = null; 
    });
    deleteConfirmOverlayElement.style.display = 'none'; 
}

createDeleteConfirmationPopup(); // Create on load

const deleteButtons = document.querySelectorAll('.attendance_item .edits .delete');
deleteButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        currentItemToDelete = event.target.closest('.attendance_item');
        if (currentItemToDelete) {
            currentItemToDelete.classList.add('deleting-item');
        }
        
        if (deleteConfirmOverlayElement) {
            deleteConfirmOverlayElement.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    });
});


// Инициализация flatpickr для End Date (Your existing code)
const endDatePicker = flatpickr('#attendance_endDatePicker', {
    dateFormat: 'm.d.Y',
    inline: true,
    defaultDate: null, 
    maxDate: today,
    onChange: function (selectedDates) {
        const endDate = selectedDates[0];
        if (endDate) {
            endDateText.textContent = endDatePicker.formatDate(endDate, 'm.d.Y');
            if(errorEndDate) errorEndDate.style.display = 'none'; 
            if (startDatePicker && startDatePicker.selectedDates.length > 0) {
                endDateBlock.style.border = '1px solid #159c2a'; 
            }
        } else {
            if(endDateText) endDateText.textContent = ''; 
            if(endDateBlock) endDateBlock.style.border = '1px solid #ccc'; 
        }
    },
});

// Инициализация flatpickr для Start Date (Your existing code)
const startDatePicker = flatpickr('#attendance_startDatePicker', {
    dateFormat: 'm.d.Y',
    maxDate: today,
    inline: true,
    defaultDate: lastMonth, 
    onReady: function (selectedDates, dateStr, instance) {
        if (selectedDates.length === 0) {
            instance.setDate(lastMonth, true); 
        }
    },
    onChange: function (selectedDates) {
        const startDate = selectedDates[0];
        if (startDate) {
            if(startDateText) startDateText.textContent = startDatePicker.formatDate(startDate, 'm.d.Y');
            if(errorStartDate) errorStartDate.style.display = 'none';
            if(startDateBlock) startDateBlock.style.border = '1px solid #159c2a';

            if(errorEndDate) errorEndDate.style.display = 'none';
            if(endDateBlock) endDateBlock.style.border = '1px solid #ccc'; 

            if(endDatePicker) endDatePicker.set('minDate', startDate);
        } else {
            if(startDateText) startDateText.textContent = 'Select date'; 
        }

        if(endDatePicker) {
            const endDate = endDatePicker.selectedDates[0];
            if (endDate && startDate && endDate < startDate) { // ensure startDate is also defined
                if(endDateText) endDateText.textContent = ''; 
                endDatePicker.clear(); 
            }
        }
    },
});

// Функция для инициализации с проверкой, была ли открыта дата (Your existing code)
function initStartDatePicker() {
    const startDatePickerWrapper = document.querySelector('.start-date-picker');
    if (!startDatePickerWrapper) return; // Guard clause

    const isOpen = !startDatePickerWrapper.classList.contains('hidden');

    if (!isOpen && startDatePicker) {
        startDatePicker.clear(); 
    } else if (isOpen && startDatePicker) {
        startDatePicker.setDate(lastMonth);
    }
}
initStartDatePicker();

// Валидация Start Date (Your existing code)
const startDateInput = document.querySelector('#attendance_startDatePicker');
if(startDateInput && startDatePicker && errorStartDate && startDateBlock) {
    startDateInput.addEventListener('change', () => {
        if (!startDatePicker.selectedDates.length) {
            errorStartDate.style.display = 'block';
            startDateBlock.style.border = '1px solid red';
        } else {
            errorStartDate.style.display = 'none';
            startDateBlock.style.border = '1px solid #159c2a';
        }
    });
}

// Показ календаря для Start Date (Your existing code)
if(startDateBlock) {
    startDateBlock.addEventListener('click', () => {
        const startDatePickerWrapper = document.querySelector('.start-date-picker');
        if(startDatePickerWrapper) startDatePickerWrapper.classList.toggle('hidden');
    });
}

// Показ календаря для End Date (Your existing code)
if(endDateBlock && startDatePicker && errorEndDate) {
    endDateBlock.addEventListener('click', () => {
        if (startDatePicker.selectedDates.length === 0) {
            errorEndDate.style.display = 'block';
            endDateBlock.style.border = '1px solid red'; 
            return; 
        } else {
            errorEndDate.style.display = 'none';
            endDateBlock.style.border = '1px solid #ccc'; 
        }

        const endDatePickerWrapper = document.querySelector('.end-date-picker');
        if(endDatePickerWrapper) endDatePickerWrapper.classList.toggle('hidden'); 
    });
}

// Валидация End Date (Your existing code)
const endDateInput = document.querySelector('#attendance_endDatePicker');
if(endDateInput && endDatePicker && errorEndDate && endDateBlock) {
    endDateInput.addEventListener('change', () => {
        if (!endDatePicker.selectedDates.length) {
            errorEndDate.style.display = 'block';
            endDateBlock.style.border = '1px solid red';
        } else {
            errorEndDate.style.display = 'none';
            // No border change to green here, only on successful selection via onChange
        }
    });
}

// onChange handlers for closing calendars (Your existing code)
if(startDatePicker) {
    startDatePicker.config.onChange.push(function (selectedDates) {
        if (selectedDates.length > 0) {
            const startDatePickerWrapper = document.querySelector('.start-date-picker');
            if(startDatePickerWrapper) startDatePickerWrapper.classList.add('hidden');
        }
    });
}

if(endDatePicker) {
    endDatePicker.config.onChange.push(function (selectedDates) {
        if (selectedDates.length > 0) {
            const startDatePickerWrapper = document.querySelector('.start-date-picker');
            const endDatePickerWrapper = document.querySelector('.end-date-picker');
            if(startDatePickerWrapper) startDatePickerWrapper.classList.add('hidden');
            if(endDatePickerWrapper) endDatePickerWrapper.classList.add('hidden');
        }
    });
}


// Валидация поля Select (Your existing code - using absentType related vars now)
const mainAbsentTypeSelectInput = document.querySelector('.absent_type-input').closest('.custom-select--attendance').querySelector('.custom-select__input');
const mainAbsentTypeDropdown = document.querySelector('.absent_type-input').closest('.custom-select--attendance').querySelector('.custom-select__dropdown');
const mainAbsentTypeHiddenInput = document.querySelector('.absent_type-input');
// errorBlockSelect is already defined and appended globally

if(mainAbsentTypeSelectInput && mainAbsentTypeDropdown && mainAbsentTypeHiddenInput && errorBlockSelect) {
    mainAbsentTypeSelectInput.addEventListener('click', () => {
        mainAbsentTypeDropdown.classList.toggle('hidden');
    });

    mainAbsentTypeDropdown.addEventListener('click', e => {
        if (e.target.tagName === 'LI') {
            const value = e.target.getAttribute('data-value'); 
            if (!value) {
                console.error('data-value не найдено для выбранного элемента');
                return;
            }
            mainAbsentTypeSelectInput.textContent = e.target.textContent;
            mainAbsentTypeHiddenInput.value = value;
            mainAbsentTypeDropdown.classList.add('hidden'); 
            mainAbsentTypeSelectInput.style.border = '1px solid #159c2a';
            errorBlockSelect.style.display = 'none';
        }
    });
}

// Логика для нового кастомного селекта "Paid Status" (Your existing code - using paidStatus related vars now)
const mainPaidStatusSelectInput = document.querySelector('.paid-status-hidden-input').closest('.custom-select--attendance').querySelector('.custom-select__input');
const mainPaidStatusDropdown = document.querySelector('.paid-status-hidden-input').closest('.custom-select--attendance').querySelector('.custom-select__dropdown');
const mainPaidStatusHiddenInput = document.querySelector('.paid-status-hidden-input');
// errorBlockPaidStatus is already defined and appended globally

if(mainPaidStatusSelectInput && mainPaidStatusDropdown && mainPaidStatusHiddenInput && errorBlockPaidStatus) {
    mainPaidStatusSelectInput.addEventListener('click', () => {
        mainPaidStatusDropdown.classList.toggle('hidden');
    });

    mainPaidStatusDropdown.addEventListener('click', e => {
        if (e.target.tagName === 'LI') {
            const value = e.target.getAttribute('data-value'); 
            if (!value) {
                console.error('data-value не найдено для выбранного элемента');
                return;
            }
            mainPaidStatusSelectInput.textContent = e.target.textContent;
            mainPaidStatusHiddenInput.value = value;
            mainPaidStatusDropdown.classList.add('hidden'); 
            mainPaidStatusSelectInput.style.border = '1px solid #159c2a';
            errorBlockPaidStatus.style.display = 'none';
        }
    });
}


// Валидация поля Notes (Your existing code)
if(notesInput && textareaLeft && errorBlockNotes) {
    notesInput.addEventListener('input', () => {
        const remainingChars = 500 - notesInput.value.length;
        textareaLeft.textContent = `${remainingChars} characters left`;

        if (notesInput.value.trim().length > 0) {
            notesInput.style.border = '1px solid #159c2a';
            errorBlockNotes.style.display = 'none';
        } else {
            notesInput.style.border = '1px solid red';
            errorBlockNotes.style.display = 'block';
        }
    });
}

// Проверка перед отправкой формы (Your existing code)
const mainAttendanceModalBtn = document.querySelector('.attendance_modal .attendance_modal-btn'); // Specific to the main modal
if (mainAttendanceModalBtn && startDatePicker && notesInput && mainAbsentTypeHiddenInput && mainPaidStatusHiddenInput && errorStartDate && startDateBlock && errorBlockSelect && mainAbsentTypeSelectInput && errorBlockPaidStatus && mainPaidStatusSelectInput && errorBlockNotes) {
    mainAttendanceModalBtn.addEventListener('click', event => {
        const startDate = startDatePicker.selectedDates?.[0] || null;
        const notesValue = notesInput.value.trim();
        const selectedValue = mainAbsentTypeHiddenInput ? mainAbsentTypeHiddenInput.value : '';
        const paidStatusValue = mainPaidStatusHiddenInput
            ? mainPaidStatusHiddenInput.value
            : '';

        // console.logs for debugging (can be removed in production)
        // console.log('Start Date:', startDate ? startDatePicker.formatDate(startDate, 'm.d.Y') : 'Not selected');
        // console.log('End Date:', endDatePicker.selectedDates.length > 0 ? endDatePicker.formatDate(endDatePicker.selectedDates[0], 'm.d.Y') : 'Not selected');
        // console.log('Selected Option:', selectedValue);
        // console.log('Paid Status:', paidStatusValue);
        // console.log('Notes:', notesValue);

        let isValid = true;

        if (!startDate) {
            isValid = false;
            errorStartDate.style.display = 'block';
            startDateBlock.style.border = '1px solid red';
        } else {
            errorStartDate.style.display = 'none';
            startDateBlock.style.border = '1px solid #159c2a';
        }

        if (!selectedValue) {
            isValid = false;
            errorBlockSelect.style.display = 'block';
            mainAbsentTypeSelectInput.style.border = '1px solid red';
        } else {
            // errorBlockSelect is hidden on successful selection in its own handler
        }

        if (!paidStatusValue) {
            isValid = false;
            errorBlockPaidStatus.style.display = 'block';
            mainPaidStatusSelectInput.style.border = '1px solid red';
        } else {
             // errorBlockPaidStatus is hidden on successful selection in its own handler
        }

        if (notesValue.length === 0) {
            isValid = false;
            notesInput.style.border = '1px solid red';
            errorBlockNotes.style.display = 'block';
        } else {
            // errorBlockNotes is hidden on successful input in its own handler
        }

        if (!isValid) {
            event.preventDefault();
        }
    });
}