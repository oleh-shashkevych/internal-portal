// Year Dropdown Start
const selectedYear = document.getElementById('year-selector-selected');
const yearDropdown = document.getElementById('year-selector-dropdown');
const yearList = document.getElementById('year-selector-list');
const yearSelect = document.getElementById('year-selector');
const arrow = document.getElementById('year-selector-arrow');

function closeDropdown() {
	yearDropdown.classList.remove('active');
	arrow.style.transform = 'rotate(0deg)';
}

function openDropdown() {
	yearDropdown.classList.add('active');
	arrow.style.transform = 'rotate(180deg)';
}

yearSelect.addEventListener('click', e => {
	if (yearDropdown.classList.contains('active')) {
		closeDropdown();
	} else {
		openDropdown();
	}
	e.stopPropagation();
});

for (let year = 2025; year >= 2018; year--) {
	const listItem = document.createElement('li');
	listItem.textContent = year;
	listItem.addEventListener('click', () => {
		selectedYear.textContent = year;
		closeDropdown();
	});

	yearList.appendChild(listItem);
}

document.addEventListener('click', e => {
	if (!e.target.closest('#payments-year_select')) {
		closeDropdown();
	}
});

yearDropdown.addEventListener('click', e => {
	e.stopPropagation();
});
// Year Dropdown End

// Revenue Block Start
document.addEventListener('DOMContentLoaded', function() {
    const totalRevenueRowTrigger = document.getElementById('totalRevenueRowTrigger');
    const newDealsRow = document.getElementById('newDealsRow');
    const repeatingCustomerRow = document.getElementById('repeatingCustomerRow');
    const arrowSpan = totalRevenueRowTrigger.querySelector('.revenue-arrow');

    let areSubRowsPopulated = false;

    function generateRandomAmount() {
        const amount = (Math.random() * 8000 + 1000).toFixed(2);
        return '$' + parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function populateSubRows() {
        const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec', 'total'];
        
        months.forEach(month => {
            const newDealsCell = newDealsRow.querySelector(`[data-new-deals-month="${month}"]`);
            if (newDealsCell) {
                newDealsCell.textContent = generateRandomAmount();
            }

            const repeatingCustomerCell = repeatingCustomerRow.querySelector(`[data-repeating-customer-month="${month}"]`);
            if (repeatingCustomerCell) {
                repeatingCustomerCell.textContent = generateRandomAmount();
            }
        });
        areSubRowsPopulated = true;
    }

    if (totalRevenueRowTrigger && newDealsRow && repeatingCustomerRow && arrowSpan) {
        const firstColOfTotalRevenue = totalRevenueRowTrigger.querySelector('.custom-table__col:first-child');
        
        if (firstColOfTotalRevenue) {
            firstColOfTotalRevenue.addEventListener('click', function() {
                const isExpanded = totalRevenueRowTrigger.classList.toggle('expanded');
                
                if (isExpanded) {
                    if (!areSubRowsPopulated) {
                        populateSubRows();
                    }
                    newDealsRow.style.display = 'grid';
                    repeatingCustomerRow.style.display = 'grid';
                } else {
                    newDealsRow.style.display = 'none';
                    repeatingCustomerRow.style.display = 'none';
                }
            });
        }

    }
});
// Revenue Block End

// Add Expense Start
$(document).ready(function () {
    const addExpenseBtnMain = $('#add-expense-btn-main');
    const popupOverlay = $('#popup-overlay');
    const closePopupBtn = $('#close-popup-btn');
    const expenseForm = $('#expense-form');
    const popupTitle = $('#popup-title');
    const submitExpenseBtn = $('#submit-expense-btn'); // Кнопка відправки форми

    const dobInput = $('#dob');
    const paymentCategorySelect = $('#payment-category');
    const payeeSelect = $('#payee');
    const notesTextarea = $('#notes');
    const charCounter = $('#char-counter');
    const paymentDateInput = $('#payment-date');
    const paymentAmountInput = $('#payment-amount');

    const MAX_NOTES_LENGTH = 400;
    const currentYear = new Date().getFullYear();

    let paymentDateFlatpickr;
    let nextRowDataId = 3; // Починаємо з ID 3, оскільки в HTML є 1 та 2

    // Ініціалізуємо nextRowDataId на основі існуючих рядків
    const existingRows = $('.pal__table-info .custom-table__row[data-row-id]');
    if (existingRows.length > 0) {
        let maxId = 0;
        existingRows.each(function() {
            const currentId = parseInt($(this).data('row-id'), 10);
            if (currentId > maxId) {
                maxId = currentId;
            }
        });
        nextRowDataId = maxId + 1;
    }


    function formatAmountForTableDisplay(amountNumber) {
        if (typeof amountNumber !== 'number' || isNaN(amountNumber)) {
            amountNumber = 0;
        }
        return '$' + amountNumber.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }


    function openPopup(isEditMode = false, dataToLoad = null) {
        clearAllErrors(); 
        expenseForm[0].reset(); 
        
        if (notesTextarea.length && charCounter.length) {
            charCounter.text(MAX_NOTES_LENGTH);
            charCounter.css('color', '');
        }
        if (paymentDateFlatpickr) paymentDateFlatpickr.clear();
        paymentAmountInput.val(''); // Очищуємо поле суми для плейсхолдера

        if (isEditMode && dataToLoad) {
            popupTitle.text('EDIT EXPENSE');
            submitExpenseBtn.text('Save Expense'); // Змінюємо текст кнопки
            expenseForm.attr('data-editing-row-id', dataToLoad.rowId); 

            if (dataToLoad.paymentDate && paymentDateFlatpickr) {
                paymentDateFlatpickr.setDate(dataToLoad.paymentDate, true);
            }
            paymentCategorySelect.val(dataToLoad.paymentCategory);
            
            paymentAmountInput.val(dataToLoad.paymentAmount.replace('$', '').replace(/,/g, '')); 
            paymentAmountInput.trigger('blur'); 

            payeeSelect.val(dataToLoad.payee);
            notesTextarea.val(dataToLoad.notes);
            
            const currentLength = notesTextarea.val().length;
            const remaining = MAX_NOTES_LENGTH - currentLength;
            charCounter.text(remaining);
            charCounter.css('color', remaining < 0 ? 'red' : '');

        } else {
            popupTitle.text('ADD EXPENSE');
            submitExpenseBtn.text('Add Expense'); // Змінюємо текст кнопки
            expenseForm.removeAttr('data-editing-row-id');
            // paymentAmountInput.val(''); // Вже зроблено вище
        }
        popupOverlay.css('display', 'flex');
    }

    function closePopup() {
        popupOverlay.css('display', 'none');
        clearAllErrors();
        expenseForm[0].reset(); 
        
        if (notesTextarea.length && charCounter.length) {
            charCounter.text(MAX_NOTES_LENGTH);
            charCounter.css('color', '');
        }
        if (paymentDateFlatpickr) paymentDateFlatpickr.clear();
        
        if (dobInput.length) {
            dobInput.val('');
        }
        popupTitle.text('ADD EXPENSE'); 
        submitExpenseBtn.text('Add Expense'); // Скидаємо текст кнопки
        expenseForm.removeAttr('data-editing-row-id'); 
        paymentAmountInput.val(''); // Очищуємо для плейсхолдера при наступному відкритті Add
    }

    addExpenseBtnMain.on('click', function() {
        openPopup(false); 
    });
    closePopupBtn.on('click', closePopup);

    if (dobInput.length) {
        dobInput.on('input', function(e) {
            let value = $(this).val();
            let numbers = value.replace(/\D/g, '');
            if (numbers.length > 8) numbers = numbers.substring(0, 8);
            let formattedValue = '';
            if (numbers.length > 0) formattedValue += numbers.substring(0, Math.min(2, numbers.length));
            if (numbers.length > 2) formattedValue += '/' + numbers.substring(2, Math.min(4, numbers.length));
            if (numbers.length > 4) formattedValue += '/' + numbers.substring(4, Math.min(8, numbers.length));
            if (value !== formattedValue) $(this).val(formattedValue);
            if ($(this).val().trim() !== "" && $('#dob-error').text() === 'Date of Birth is required.') clearError(this);
        });
    }

    if (notesTextarea.length && charCounter.length) {
        charCounter.text(MAX_NOTES_LENGTH);
        notesTextarea.on('input', function () {
            const currentLength = $(this).val().length;
            const remaining = MAX_NOTES_LENGTH - currentLength;
            charCounter.text(remaining);
            charCounter.css('color', remaining < 0 ? 'red' : '');
            if (remaining >= 0 && $(this).hasClass('input-error')) clearError(this);
        });
    }
    
    if (paymentAmountInput.length) {
        paymentAmountInput.on('input', function(e) {
            const input = this;
            let rawValue = input.value;
            let originalCursorPos = input.selectionStart;
            let isDecimalJustTyped = rawValue.charAt(originalCursorPos -1) === '.';

            let cleanedValue = rawValue.replace(/[^\d.]/g, '');
            const parts = cleanedValue.split('.');
            let integerPart = parts[0] || '';
            let decimalPart = parts[1];

            if (integerPart.length > 7) integerPart = integerPart.substring(0, 7); // Обмежуємо цілу частину 7-ма цифрами
            
            let formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

            let finalValue;
            if (decimalPart !== undefined) {
                decimalPart = decimalPart.substring(0, 2);
                finalValue = formattedInteger + '.' + decimalPart;
            } else {
                finalValue = formattedInteger;
                if (cleanedValue.includes('.') || isDecimalJustTyped) { 
                   if (!finalValue.endsWith('.') && finalValue !== "") finalValue += '.'; // Додаємо крапку, якщо її немає і значення не порожнє
                   else if (finalValue === "" && isDecimalJustTyped) finalValue = "0."; // Якщо починаємо з крапки
                }
            }
            
            if (input.value !== finalValue) {
                const diff = finalValue.length - rawValue.length;
                input.value = finalValue;
                
                let newCursorPos = originalCursorPos + diff;
                if (isDecimalJustTyped && finalValue.endsWith('.')){
                     newCursorPos = finalValue.length; 
                }
                newCursorPos = Math.max(0, Math.min(newCursorPos, finalValue.length));
                try {
                    input.setSelectionRange(newCursorPos, newCursorPos);
                } catch (ex) {}
            }
            if ($(this).val().trim() !== "") clearError(this);
        });

        paymentAmountInput.on('blur', function() {
            let value = $(this).val().trim();
            if (value === "" || value === "0" || value === "0." || value === ".") {
                $(this).val("0.00"); 
                // Не показуємо помилку, якщо користувач просто залишив поле порожнім, 
                // валідація при сабміті це перевірить.
                // Але якщо було "0" і стало "0.00", то помилку варто прибрати.
                if ($(this).hasClass('input-error') && getUnmaskedAmount($(this).val()) === 0) {
                     // clearError(this); // Прибираємо помилку "must be > 0" якщо це стало 0.00
                }
                return;
            }
            let cleanedValue = value.replace(/[^\d.]/g, "");
            let parts = cleanedValue.split('.');
            let integerPart = parts[0] || '0';
            let decimalPart = parts.length > 1 ? parts[1] : '00';

            if (integerPart.length > 7) integerPart = integerPart.substring(0, 7);
            integerPart = integerPart.replace(/^0+(?=\d)/, ''); 
            if (integerPart === "") integerPart = "0";

            let formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

            if (decimalPart.length === 1) decimalPart += '0';
            else decimalPart = decimalPart.substring(0, 2);
            if (decimalPart === "") decimalPart = "00";
            
            const finalFormattedValue = formattedInteger + '.' + decimalPart;
            $(this).val(finalFormattedValue);
            
            const numericValue = getUnmaskedAmount(finalFormattedValue);
            if (numericValue > 9999999.00) {
                showError(this, 'Amount exceeds the maximum limit of 9,999,999.00.');
            } else if (numericValue <= 0 && finalFormattedValue !== "0.00") { 
                showError(this, 'Amount must be greater than 0.');
            } else if ($(this).hasClass('input-error')) { // Якщо помилка була, а тепер значення коректне
                 clearError(this);
            }
        });
    }

    if (paymentDateInput.length) {
        paymentDateFlatpickr = flatpickr(paymentDateInput[0], {
            dateFormat: "m/d/Y",
            minDate: new Date(1950, 0, 1),
            maxDate: new Date(currentYear + 10, 11, 31),
            disableMobile: "true",
            monthSelectorType: 'dropdown',
            // Add the following line:
            clickOpens: false, // This will prevent Flatpickr from opening on its own default click detection
            onChange: function(selectedDates, dateStr, instance) {
                clearError(instance.element);
            }
        });

        // Add this event handler to manually open the calendar on click
        paymentDateInput.on('click', function() {
            if (paymentDateFlatpickr) {
                paymentDateFlatpickr.open();
            }
        });
    }

    function showError(inputElement, message) {
        const $inputElement = $(inputElement);
        $inputElement.addClass('input-error');
        $('#' + $inputElement.attr('id') + '-error').text(message).show();
    }

    function clearError(inputElement) {
        const $inputElement = $(inputElement);
        $inputElement.removeClass('input-error');
        $('#' + $inputElement.attr('id') + '-error').text('').hide();
    }

    function clearAllErrors() {
        expenseForm.find('input.input-error, textarea.input-error, select.input-error').each(function() {
            clearError(this);
        });
    }
    
    expenseForm.find('input, textarea, select').not(dobInput).not(paymentAmountInput).on('input change focus', function() {
        if (this.tagName === 'SELECT' && $(this).val()) {
            clearError(this);
        } else if (this.tagName !== 'SELECT' && $(this).val() && $(this).val().trim() !== "") {
             clearError(this);
        }
    });

    function getUnmaskedAmount(formattedAmount) {
        if (typeof formattedAmount !== 'string' || !formattedAmount) return 0;
        const unmasked = formattedAmount.replace(/,/g, '');
        const number = parseFloat(unmasked);
        return isNaN(number) ? 0 : number;
    }

    function validateForm() {
        let isValid = true;
        clearAllErrors(); 

        if (!paymentDateInput.val()) {
            showError(paymentDateInput, 'Payment date is required.');
            isValid = false;
        }
        if (!paymentCategorySelect.val()) {
            showError(paymentCategorySelect, 'Payment Category is required.');
            isValid = false;
        }
        
        const amountFormattedValue = paymentAmountInput.val().trim();
        const amountNumericValue = getUnmaskedAmount(amountFormattedValue);

        if (!amountFormattedValue || amountFormattedValue === "") { 
            showError(paymentAmountInput, 'Payment Amount is required.');
            isValid = false;
        } else if (amountNumericValue <= 0 && amountFormattedValue !== "0.00") { 
            showError(paymentAmountInput, 'Payment Amount must be greater than 0.');
            isValid = false;
        } else if (amountNumericValue === 0 && amountFormattedValue === "0.00") { // Якщо 0.00 не дозволено
             showError(paymentAmountInput, 'Payment Amount must be greater than 0.');
             isValid = false;
        } else if (amountNumericValue > 9999999.00) {
            showError(paymentAmountInput, 'Amount exceeds the maximum of 9,999,999.00.');
            isValid = false;
        } else if (!/^\d{1,3}(,\d{3})*(\.\d{2})$/.test(amountFormattedValue) && !/^\d+(\.\d{2})$/.test(amountFormattedValue)) {
             if(amountFormattedValue !== "0.00"){ 
                showError(paymentAmountInput, 'Invalid amount format. Use #,###.## or #.##');
                isValid = false;
             }
        }

        if (!payeeSelect.val()) {
            showError(payeeSelect, 'Payee is required.');
            isValid = false;
        }

        const notesValue = notesTextarea.val();
        if (!notesValue.trim()) {
            showError(notesTextarea, 'Notes are required.');
            isValid = false;
        } else if (notesValue.length > MAX_NOTES_LENGTH) {
            showError(notesTextarea, `Notes cannot exceed ${MAX_NOTES_LENGTH} characters.`);
            isValid = false;
            charCounter.css('color', 'red');
        }
        
        return isValid;
    }

    expenseForm.on('submit', function(event) {
        event.preventDefault();
        paymentAmountInput.trigger('blur'); // Важливо для фінального форматування суми перед валідацією

        if (validateForm()) {
            const formData = {
                paymentDate: paymentDateInput.val(),
                paymentCategory: paymentCategorySelect.val(),
                paymentAmount: getUnmaskedAmount(paymentAmountInput.val()),
                payee: payeeSelect.val(),
                notes: notesTextarea.val()
            };

            const editingRowId = expenseForm.attr('data-editing-row-id');
            if (editingRowId) {
                console.log('Updating Expense - Row ID:', editingRowId, 'Data:', formData);
                const $row = $(`.pal__table-info .custom-table__row[data-row-id="${editingRowId}"]`);
                if ($row.length) {
                    $row.find('.custom-table__col:nth-child(1) .custom-table__content').text(formData.paymentDate);
                    $row.find('.custom-table__col:nth-child(2) .custom-table__content').text(formData.paymentCategory);
                    $row.find('.custom-table__col:nth-child(3) .custom-table__content').text(formatAmountForTableDisplay(formData.paymentAmount));
                    $row.find('.custom-table__col:nth-child(4) .custom-table__content').text(formData.payee);
                    $row.find('.custom-table__col:nth-child(5) .custom-table__content').text(formData.notes);
                }
            } else {
                console.log('Adding New Expense - Data:', formData);
                const newRowHtml = `
                    <div class="custom-table__row" data-row-id="${nextRowDataId}" data-href="#">
                        <div class="custom-table__col"><span class="custom-table__content">${formData.paymentDate}</span></div>
                        <div class="custom-table__col"><span class="custom-table__content">${formData.paymentCategory}</span></div>
                        <div class="custom-table__col"><span class="custom-table__content">${formatAmountForTableDisplay(formData.paymentAmount)}</span></div>
                        <div class="custom-table__col"><span class="custom-table__content ${formData.payee === 'Ed' || formData.payee === 'Omelyanenko Team' ? '' : ''}">${formData.payee}</span></div>
                        <div class="custom-table__col"><span class="custom-table__content">${formData.notes}</span></div>
                        <div class="custom-table__col">
                            <span class="custom-table__content">
                                <button class="edit-expense" aria-label="Edit expense">
                                    <svg width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.446184 11.4912L2.43697 11.5C2.43764 11.5 2.43831 11.5 2.43898 11.5C2.55787 11.5 2.67182 11.4527 2.75597 11.3685L10.8688 3.24189C10.9528 3.15772 11 3.04346 11 2.92438C11 2.8053 10.9527 2.69116 10.8687 2.60698L8.89549 0.631427C8.72047 0.456229 8.43676 0.456116 8.26174 0.631539L0.138721 8.76821C0.0551321 8.85194 0.00784725 8.96541 0.0075111 9.08381L3.80098e-06 11.0405C-0.00100464 11.2884 0.198779 11.4901 0.446184 11.4912ZM8.57872 1.58374L9.91794 2.92449L8.10565 4.73989L6.76666 3.39891L8.57872 1.58374ZM0.903122 9.27225L6.1328 4.03371L7.47168 5.3748L2.2541 10.6013L0.898079 10.5953L0.903122 9.27225Z" fill="#6D6D6D"></path></svg>
                                </button>
                            </span>
                        </div>
                    </div>`;
                $('.pal__table-info').append(newRowHtml);
                nextRowDataId++;
            }
            closePopup();
        } else {
            console.log('Form validation failed.');
            const firstErrorField = expenseForm.find('.input-error').first();
            if (firstErrorField.length) firstErrorField.focus();
        }
    });

    $('.pal__table-info').on('click', '.edit-expense', function(event) {
        event.preventDefault(); 
        const $button = $(this);
        const $row = $button.closest('.custom-table__row');
        const rowId = $row.data('row-id'); 

        const rowData = {
            rowId: rowId, // Зберігаємо ID рядка
            paymentDate: $row.find('.custom-table__col:nth-child(1) .custom-table__content').text().trim(),
            paymentCategory: $row.find('.custom-table__col:nth-child(2) .custom-table__content').text().trim(),
            paymentAmount: $row.find('.custom-table__col:nth-child(3) .custom-table__content').text().trim(), 
            payee: $row.find('.custom-table__col:nth-child(4) .custom-table__content').text().trim(),
            notes: $row.find('.custom-table__col:nth-child(5) .custom-table__content').text().trim()
        };
        openPopup(true, rowData); 
    });
});
// Add Expense End

// Row Table attribute link Start
document.addEventListener('DOMContentLoaded', function() {
    const rows = document.querySelectorAll('.custom-table__row');

    rows.forEach(row => {
        const href = row.dataset.href;

        if (href) {
            row.style.cursor = 'pointer';

            row.addEventListener('click', function(event) {
                const interactiveElementClicked = event.target.closest('button, a, input, select, textarea');

                if (interactiveElementClicked) {
                    return;
                }
                window.location.href = href;
            });
        }
    });
});
// Row Table attribute link End 