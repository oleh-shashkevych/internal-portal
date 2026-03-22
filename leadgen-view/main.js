// ==========================================
// ГЛОБАЛЬНЫЕ МАСКИ И ВАЛИДАЦИЯ (jQuery Inputmask)
// ==========================================

function applyMasks(container = document) {
    if (typeof $ === 'undefined' || typeof $.fn.inputmask === 'undefined') {
        console.warn('jQuery or jQuery Inputmask is not loaded!');
        return;
    }

    // Маска телефона: (000) 000-0000
    $(container).find('input[type="tel"], input[id*="Phone"], input[name*="phone"], .mask-phone, [data-field="phone"] input').each(function () {
        if (!$(this).hasClass('mask-applied') && $(this).attr('type') !== 'hidden') {
            $(this).inputmask({
                mask: "(999) 999-9999",
                clearIncomplete: true,
                showMaskOnHover: false
            }).addClass('mask-applied');
        }
    });

    // Маска суммы: 999,999,999.99 (Ищем классы, имена и ID, связанные с суммами)
    $(container).find('input[name="monthly_sales"], input[name="amount"], input[name="price"], .lgv-inv-cleave, .mask-amount').each(function () {
        if (!$(this).hasClass('mask-applied') && $(this).attr('type') !== 'hidden') {
            $(this).inputmask("currency", {
                alias: "numeric",
                groupSeparator: ",",
                autoGroup: true,
                digits: 2,
                digitsOptional: false,
                prefix: "",
                placeholder: "0",
                rightAlign: false,
                clearMaskOnLostFocus: false,
                max: "999999999.99",
                allowMinus: false
            }).addClass('mask-applied');
        }
    });

    // Сброс красной рамки при вводе
    $(container).find('input, select, textarea').on('input change', function () {
        this.style.borderColor = '';
    });
}

function validateFormFields(inputsArray) {
    let isValid = true;

    inputsArray.forEach(input => {
        if (!input || typeof input.value === 'undefined') return;

        let isFieldValid = true;
        const val = input.value.trim();

        // 1. Обязательное поле (required)
        if (input.hasAttribute('required') && val === '') {
            isFieldValid = false;
        }

        // 2. Строгая проверка Email
        if (val !== '' && input.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(val)) isFieldValid = false;
        }

        // 3. Строгая проверка Телефона (ровно 10 цифр под маской)
        const isPhoneField = input.type === 'tel' ||
            input.id.toLowerCase().includes('phone') ||
            input.classList.contains('mask-phone') ||
            (input.closest('[data-field="phone"]') !== null);

        if (val !== '' && isPhoneField) {
            const digits = val.replace(/\D/g, '');
            if (digits.length !== 10) isFieldValid = false;
        }

        // Применяем/убираем ошибку
        if (!isFieldValid) {
            input.style.borderColor = '#FF496B';
            isValid = false;
        } else {
            input.style.borderColor = '';
        }
    });

    return isValid;
}

document.addEventListener('DOMContentLoaded', () => {
    applyMasks(document);
});


// ==========================================
// ОСНОВНАЯ ЛОГИКА СТРАНИЦЫ
// ==========================================

const burger = document.getElementById('burger');
const closeBurger = document.getElementById('close_burger');
const sideBar = document.querySelector('.left_cp_bar');
const overlay = document.querySelector('.overlay');

// При клике на бургер показываем меню
burger.addEventListener('click', () => {
    sideBar.style.transform = 'translateX(0)';
    overlay.style.display = 'flex';
});

// При клике на крестик скрываем меню
closeBurger.addEventListener('click', () => {
    sideBar.style.transform = 'translateX(-120%)';
    overlay.style.display = 'none';
});

function toggleContactsPanel(width) {
    const panel = document.querySelector('.contacts_panel');
    const toggleButton = document.getElementById('open_contacts');

    if (!panel || !toggleButton) return;

    if (width <= 1920) {
        panel.classList.remove('active');
        toggleButton.classList.remove('active');
    } else {
        panel.classList.add('active');
        toggleButton.classList.add('active');
    }
}

// Инициализация при загрузке
toggleContactsPanel(window.innerWidth);

window.addEventListener('resize', () => {
    toggleContactsPanel(window.innerWidth);
});


// --- УЛУЧШЕННАЯ ЛОГИКА ТАБОВ СО СБРОСОМ РЕДАКТИРОВАНИЯ ---
document.addEventListener('DOMContentLoaded', function () {
    const tabButtons = document.querySelectorAll('.pr-tab-btn');
    const tabContents = document.querySelectorAll('.pr-tab-content');

    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {

                // 1. Сброс глобальной кнопки на вкладке Detail
                const globalEditBtn = document.getElementById('lgvDetGlobalEditBtn');
                if (globalEditBtn && globalEditBtn.classList.contains('lgv-det-edit-btn-global-active')) {
                    globalEditBtn.click();
                }

                // 2. Сброс инлайн-полей на вкладке Detail
                const detailCancelBtns = document.querySelectorAll('.lgv-det-edit-mode .lgv-det-cancel-btn');
                detailCancelBtns.forEach(btn => {
                    const editMode = btn.closest('.lgv-det-edit-mode');
                    if (editMode && window.getComputedStyle(editMode).display !== 'none') {
                        btn.click();
                    }
                });

                // 3. Сброс инлайн-редактирования в таблице Invoices
                const editingInvoiceRows = document.querySelectorAll('.lgv-inv-row.is-editing');
                editingInvoiceRows.forEach(row => {
                    const cancelBtn = row.querySelector('.lgv-inv-btn-cancel');
                    if (cancelBtn) {
                        cancelBtn.click();
                    } else {
                        row.classList.remove('is-editing');
                    }
                });

                // Убираем активные классы
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));

                // Добавляем активный класс
                button.classList.add('active');

                // Показываем контент
                const tabId = button.getAttribute('data-tab');
                const targetContent = document.getElementById(`tab-${tabId}`);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }
});


// --- БЛОК БАЛАНСА ---
document.addEventListener('DOMContentLoaded', function () {
    const balanceData = {
        maxAmount: 5000.00,
        currentAmount: 1350.00,
        availableLeads: 30
    };

    function formatCurrency(amount) {
        return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    const elCurrent = document.getElementById('lgvCurrentBalance');
    const elMax = document.getElementById('lgvMaxBalance');
    const elLeads = document.getElementById('lgvAvailableLeads');
    const elFill = document.getElementById('lgvProgressFill');

    if (elCurrent && elMax && elLeads && elFill) {
        elCurrent.textContent = formatCurrency(balanceData.currentAmount);
        elMax.textContent = formatCurrency(balanceData.maxAmount);
        elLeads.textContent = balanceData.availableLeads;

        const percent = (balanceData.currentAmount / balanceData.maxAmount) * 100;

        setTimeout(() => {
            elFill.style.width = `${Math.min(Math.max(percent, 0), 100)}%`;
        }, 300);
    }
});


// --- БЛОК 1: ACCOUNT DETAILS ---
document.addEventListener('DOMContentLoaded', function () {
    const lgvDetCard = document.getElementById('lgvDetCard');
    const lgvDetGlobalEditBtn = document.getElementById('lgvDetGlobalEditBtn');

    if (!lgvDetCard) return;

    let isLgvDetGlobalEditActive = false;

    function checkLgvDetGlobalState() {
        if (!lgvDetGlobalEditBtn) return;
        const allEditModes = lgvDetCard.querySelectorAll('.lgv-det-edit-mode');
        const anyOpen = Array.from(allEditModes).some(el => el.style.display !== 'none');

        if (!anyOpen && isLgvDetGlobalEditActive) {
            isLgvDetGlobalEditActive = false;
            lgvDetGlobalEditBtn.style.backgroundColor = '';
            lgvDetGlobalEditBtn.style.color = '';
            lgvDetGlobalEditBtn.style.borderColor = '';
            lgvDetGlobalEditBtn.innerHTML = `Edit`;
            lgvDetGlobalEditBtn.classList.remove('lgv-det-edit-btn-global-active');
        }
    }

    if (lgvDetGlobalEditBtn) {
        lgvDetGlobalEditBtn.addEventListener('click', function (e) {
            e.preventDefault();
            isLgvDetGlobalEditActive = !isLgvDetGlobalEditActive;

            const allFields = lgvDetCard.querySelectorAll('.lgv-det-field');
            allFields.forEach(field => {
                toggleEditMode(field, isLgvDetGlobalEditActive);
            });

            if (isLgvDetGlobalEditActive) {
                this.style.backgroundColor = '#159C2A';
                this.style.color = '#FFFFFF';
                this.style.borderColor = '#159C2A';
                this.innerHTML = `Close Edit Mode`;
                this.classList.add('lgv-det-edit-btn-global-active');
            } else {
                this.style.backgroundColor = '';
                this.style.color = '';
                this.style.borderColor = '';
                this.innerHTML = `Edit`;
                this.classList.remove('lgv-det-edit-btn-global-active');
            }
        });
    }

    lgvDetCard.addEventListener('click', function (e) {
        const editBtnInline = e.target.closest('.lgv-det-edit-btn-inline');
        const cancelBtn = e.target.closest('.lgv-det-cancel-btn');
        const saveBtn = e.target.closest('.lgv-det-save-btn');
        const valDisplay = e.target.closest('.lgv-det-val');

        if (editBtnInline || valDisplay) {
            e.preventDefault();
            const field = (editBtnInline || valDisplay).closest('.lgv-det-field');
            toggleEditMode(field, true);
        }

        if (cancelBtn) {
            e.preventDefault();
            toggleEditMode(cancelBtn.closest('.lgv-det-field'), false);
            checkLgvDetGlobalState();
        }

        if (saveBtn) {
            e.preventDefault();
            const fieldWrap = saveBtn.closest('.lgv-det-field');

            // ВАЛИДАЦИЯ ИНЛАЙН (Detail)
            const input = fieldWrap.querySelector('.lgv-det-input');
            if (!validateFormFields([input])) return;

            saveFieldData(fieldWrap);
            checkLgvDetGlobalState();
        }
    });

    function toggleEditMode(fieldWrap, isEditing) {
        const viewMode = fieldWrap.querySelector('.lgv-det-view-mode');
        const editMode = fieldWrap.querySelector('.lgv-det-edit-mode');

        if (isEditing) {
            viewMode.style.display = 'none';
            editMode.style.display = 'flex';
        } else {
            viewMode.style.display = 'flex';
            editMode.style.display = 'none';
            const input = editMode.querySelector('.lgv-det-input');
            if (input) input.style.borderColor = '';
        }
    }

    function saveFieldData(fieldWrap) {
        const input = fieldWrap.querySelector('.lgv-det-input');
        if (!input) return;

        const fieldName = input.getAttribute('name');
        const fieldValue = input.value;

        const valDisplay = fieldWrap.querySelector('.lgv-det-val');
        const badgeDisplay = fieldWrap.querySelector('.lgv-det-badge');

        if (input.tagName === 'SELECT') {
            if (badgeDisplay) {
                badgeDisplay.textContent = fieldValue;
                if (fieldValue === 'ON BOARD') {
                    badgeDisplay.classList.remove('inactive');
                } else {
                    badgeDisplay.classList.add('inactive');
                }
            }
        } else if (valDisplay && valDisplay.tagName === 'A') {
            valDisplay.href = `mailto:${fieldValue}`;
            valDisplay.textContent = fieldValue;
        } else if (valDisplay) {
            if (fieldName === 'monthly_sales') {
                valDisplay.textContent = fieldValue ? `$${fieldValue}` : 'Not Publicly Available';
            } else {
                valDisplay.textContent = fieldValue;
            }
        }

        toggleEditMode(fieldWrap, false);
    }
});


// --- БЛОК 2: INVOICES ---
document.addEventListener('DOMContentLoaded', function () {
    const lgvInvTableBody = document.getElementById('lgvInvTableBody');
    const lgvInvAddOverlay = document.getElementById('lgvInvAddOverlay');
    const lgvInvAddPopup = document.getElementById('lgvInvAddPopup');
    const lgvInvAddForm = document.getElementById('lgvInvAddForm');
    const lgvInvAddDetail = document.getElementById('lgvInvAddDetail');
    const lgvInvAddCount = document.getElementById('lgvInvAddCount');

    if (lgvInvAddDetail) {
        lgvInvAddDetail.addEventListener('input', () => {
            const left = 500 - lgvInvAddDetail.value.length;
            lgvInvAddCount.textContent = `${left} characters left`;
        });
    }

    // Open Add Popup
    document.getElementById('lgvInvOpenAddBtn')?.addEventListener('click', () => {
        lgvInvAddForm.reset();
        lgvInvAddCount.textContent = '500 characters left';
        lgvInvAddForm.querySelectorAll('input, textarea, select').forEach(el => el.style.borderColor = '');

        lgvInvAddOverlay.classList.add('active');
        lgvInvAddPopup.classList.add('active');
    });

    const closeAddPopup = () => {
        lgvInvAddOverlay.classList.remove('active');
        lgvInvAddPopup.classList.remove('active');
    };

    document.getElementById('lgvInvCloseAddBtn')?.addEventListener('click', closeAddPopup);

    // Добавление инвойса
    lgvInvAddForm?.addEventListener('submit', (e) => {
        e.preventDefault();

        // ВАЛИДАЦИЯ ДОБАВЛЕНИЯ
        const inputs = Array.from(lgvInvAddForm.querySelectorAll('input, select, textarea'));
        if (!validateFormFields(inputs)) return;

        const formData = new FormData(lgvInvAddForm);
        const name = formData.get('name');
        const detail = formData.get('detail');
        const amount = formData.get('amount'); // УЖЕ с маской от inputmask
        const price = formData.get('price');   // УЖЕ с маской от inputmask
        const status = formData.get('status');

        const badgeClass = status === 'Paid' ? 'lgv-inv-badge-paid' : 'lgv-inv-badge-pending';
        const actionBtn = status === 'Paid' ? '<button class="lgv-inv-action-btn-outline">Download PDF</button>' : '<button class="lgv-inv-action-btn-fill">Pay from balance</button>';

        const newRow = document.createElement('div');
        newRow.className = 'lgv-inv-row';
        newRow.innerHTML = `
            <div class="lgv-inv-cell" data-field="name">
                <span class="lgv-inv-view lgv-inv-val">${name}</span>
                <input type="text" class="lgv-inv-edit lgv-inv-input" value="${name}" required>
            </div>
            <div class="lgv-inv-cell" data-field="details">
                <span class="lgv-inv-view lgv-inv-val">${detail}</span>
                <textarea class="lgv-inv-edit lgv-inv-textarea" rows="2" maxlength="500" required>${detail}</textarea>
            </div>
            <div class="lgv-inv-cell" data-field="amount">
                <span class="lgv-inv-view lgv-inv-val">$${amount}</span>
                <input type="text" name="amount" class="lgv-inv-edit lgv-inv-input lgv-inv-cleave mask-amount" value="${amount}" required>
            </div>
            <div class="lgv-inv-cell" data-field="price">
                <span class="lgv-inv-view lgv-inv-val">$${price}</span>
                <input type="text" name="price" class="lgv-inv-edit lgv-inv-input lgv-inv-cleave mask-amount" value="${price}" required>
            </div>
            <div class="lgv-inv-cell" data-field="status">
                <span class="lgv-inv-view lgv-inv-badge ${badgeClass} lgv-inv-val">${status}</span>
                <select class="lgv-inv-edit lgv-inv-input" required>
                    <option value="Paid" ${status === 'Paid' ? 'selected' : ''}>Paid</option>
                    <option value="Pending" ${status === 'Pending' ? 'selected' : ''}>Pending</option>
                </select>
            </div>
            <div class="lgv-inv-cell lgv-inv-right">
                <div class="lgv-inv-view lgv-inv-actions-wrapper">
                    ${actionBtn}
                </div>
                <div class="lgv-inv-edit lgv-inv-edit-actions">
                    <button class="lgv-inv-btn-save">Save</button>
                    <button class="lgv-inv-btn-cancel">Cancel</button>
                </div>
            </div>
        `;

        lgvInvTableBody.insertBefore(newRow, lgvInvTableBody.firstChild);

        // Применяем маску к созданной строке
        applyMasks(newRow);

        closeAddPopup();
    });

    // Инлайн редактирование (Invoices)
    if (lgvInvTableBody) {
        lgvInvTableBody.addEventListener('click', (e) => {
            const row = e.target.closest('.lgv-inv-row');
            if (!row) return;

            const isActionButton = e.target.closest('button') && !e.target.closest('.lgv-inv-edit-actions');
            if (isActionButton || row.classList.contains('is-editing')) {

                const cancelBtn = e.target.closest('.lgv-inv-btn-cancel');
                const saveBtn = e.target.closest('.lgv-inv-btn-save');

                if (cancelBtn) {
                    e.stopPropagation();
                    row.classList.remove('is-editing');
                    row.querySelectorAll('.lgv-inv-edit').forEach(i => i.style.borderColor = '');
                }

                if (saveBtn) {
                    e.stopPropagation();

                    // ВАЛИДАЦИЯ ИНЛАЙН СТРОКИ
                    const inputsToValidate = row.querySelectorAll('input.lgv-inv-edit, select.lgv-inv-edit, textarea.lgv-inv-edit');
                    if (!validateFormFields(Array.from(inputsToValidate))) return;

                    const cells = row.querySelectorAll('.lgv-inv-cell[data-field]');
                    cells.forEach(cell => {
                        const input = cell.querySelector('.lgv-inv-edit');
                        const view = cell.querySelector('.lgv-inv-val');

                        if (input && view) {
                            let val = input.value;

                            if (input.classList.contains('lgv-inv-cleave') || input.classList.contains('mask-amount')) {
                                view.textContent = `$${val}`;
                            } else if (cell.getAttribute('data-field') === 'status') {
                                view.textContent = val;
                                view.className = 'lgv-inv-view lgv-inv-badge lgv-inv-val';
                                if (val === 'Paid') {
                                    view.classList.add('lgv-inv-badge-paid');
                                } else {
                                    view.classList.add('lgv-inv-badge-pending');
                                }

                                const actionWrapper = row.querySelector('.lgv-inv-actions-wrapper');
                                if (actionWrapper) {
                                    if (val === 'Paid') {
                                        actionWrapper.innerHTML = '<button class="lgv-inv-action-btn-outline">Download PDF</button>';
                                    } else {
                                        actionWrapper.innerHTML = '<button class="lgv-inv-action-btn-fill">Pay from balance</button>';
                                    }
                                }
                            } else {
                                view.textContent = val;
                            }
                        }
                    });

                    row.classList.remove('is-editing');
                }
                return;
            }

            row.classList.add('is-editing');
        });
    }
});


// --- БЛОК 3: PIPELINE FILTER ---
document.addEventListener('DOMContentLoaded', function () {
    const filterPopup = document.getElementById('prFilterPopup');
    const filterOverlay = document.getElementById('prFilterOverlay');
    const filterList = document.getElementById('prFilterList');
    const searchInput = document.getElementById('prFilterSearch');
    const applyBtn = document.getElementById('prFilterApplyBtn');
    const resetBtn = document.getElementById('prFilterResetBtn');

    const pipeTab = document.getElementById('tab-pipeline');
    if (!pipeTab) return;

    let activeFilters = {};
    let currentColumnIndex = -1;
    let currentFilterButton = null;

    pipeTab.addEventListener('click', function (e) {
        const filterBtn = e.target.closest('.pr-pipe-table__filter');
        if (filterBtn) {
            e.stopPropagation();

            const headerCell = filterBtn.closest('.pr-pipe-table__cell');
            const headerRow = headerCell.parentElement;
            currentColumnIndex = Array.from(headerRow.children).indexOf(headerCell);
            currentFilterButton = filterBtn;

            const tableBody = pipeTab.querySelector('.pr-pipe-table__body');
            const rows = tableBody.querySelectorAll('.pr-pipe-table__row');
            const uniqueValues = new Set();

            rows.forEach(row => {
                const cell = row.children[currentColumnIndex];
                if (cell) {
                    const badge = cell.querySelector('.pr-pipe-table__badge');
                    const textContent = badge ? badge.textContent.trim() : cell.textContent.trim();
                    if (textContent && textContent !== '—') {
                        uniqueValues.add(textContent);
                    }
                }
            });

            const previouslyChecked = activeFilters[currentColumnIndex] || [];
            populatePopupList(Array.from(uniqueValues).sort(), previouslyChecked);

            positionPopup(filterBtn);
            openPopup();
        }
    });

    function positionPopup(buttonElement) {
        const rect = buttonElement.getBoundingClientRect();
        let topPosition = rect.bottom + window.scrollY + 5;
        let leftPosition = rect.left + window.scrollX - 100;

        if (leftPosition < 10) leftPosition = 10;

        filterPopup.style.top = `${topPosition}px`;
        filterPopup.style.left = `${leftPosition}px`;
    }

    function populatePopupList(items, checkedItems) {
        filterList.innerHTML = '';
        items.forEach((item) => {
            const label = document.createElement('label');
            label.className = 'pr-filter-popup__item';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = item;
            if (checkedItems.includes(item)) {
                checkbox.checked = true;
            }

            const textNode = document.createTextNode(item);

            label.appendChild(checkbox);
            label.appendChild(textNode);
            filterList.appendChild(label);
        });
    }

    function applyAllFilters() {
        const tableBody = pipeTab.querySelector('.pr-pipe-table__body');
        if (!tableBody) return;

        const rows = tableBody.querySelectorAll('.pr-pipe-table__row');

        rows.forEach(row => {
            let isRowVisible = true;

            for (const colIndex in activeFilters) {
                const selectedValues = activeFilters[colIndex];
                if (selectedValues.length === 0) continue;

                const cell = row.children[colIndex];
                if (cell) {
                    const badge = cell.querySelector('.pr-pipe-table__badge');
                    const cellValue = badge ? badge.textContent.trim() : cell.textContent.trim();

                    if (!selectedValues.includes(cellValue)) {
                        isRowVisible = false;
                        break;
                    }
                }
            }
            row.style.display = isRowVisible ? 'grid' : 'none';
        });
    }

    function openPopup() {
        filterPopup.classList.add('active');
        filterOverlay.classList.add('active');
    }

    function closePopup() {
        filterPopup.classList.remove('active');
        filterOverlay.classList.remove('active');
        searchInput.value = '';
    }

    filterOverlay?.addEventListener('click', closePopup);

    searchInput?.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const items = filterList.querySelectorAll('.pr-filter-popup__item');
        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(searchTerm) ? 'flex' : 'none';
        });
    });

    applyBtn?.addEventListener('click', () => {
        const selectedValues = Array.from(filterList.querySelectorAll('input[type="checkbox"]:checked'))
            .map(cb => cb.value);

        if (selectedValues.length > 0) {
            activeFilters[currentColumnIndex] = selectedValues;
            if (currentFilterButton) currentFilterButton.classList.add('filtered');
        } else {
            delete activeFilters[currentColumnIndex];
            if (currentFilterButton) currentFilterButton.classList.remove('filtered');
        }

        applyAllFilters();
        closePopup();
    });

    resetBtn?.addEventListener('click', () => {
        if (activeFilters[currentColumnIndex]) {
            delete activeFilters[currentColumnIndex];
            if (currentFilterButton) {
                currentFilterButton.classList.remove('filtered');
            }
        }
        applyAllFilters();
        closePopup();
    });
});