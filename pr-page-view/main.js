// ==========================================
// ГЛОБАЛЬНЫЕ МАСКИ И ВАЛИДАЦИЯ
// ==========================================

function applyMasks(container = document) {
    if (typeof $ === 'undefined' || typeof $.fn.inputmask === 'undefined') {
        console.warn('jQuery or jQuery Inputmask is not loaded!');
        return;
    }

    // Маска телефона: (000) 000-0000
    // Ищем по ID, name, классу или внутри родителя data-field="phone"
    $(container).find('input[id*="Phone"], input[id*="phone"], input[name*="phone"], .mask-phone, [data-field="phone"] input').each(function () {
        if (!$(this).hasClass('mask-applied')) {
            $(this).inputmask({
                mask: "(999) 999-9999",
                clearIncomplete: true, // Очищает поле, если введено не полностью
                showMaskOnHover: false
            }).addClass('mask-applied');
        }
    });

    // Маска суммы: 9,000,000.00
    $(container).find('input[id*="Amount"], .pay-edit-amount, .mask-amount').each(function () {
        if (!$(this).hasClass('mask-applied')) {
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

    // Очистка красной обводки при вводе
    $(container).find('input, select, textarea').on('input change', function () {
        this.style.borderColor = '';
    });
}

function validateFormFields(inputsArray) {
    let isValid = true;

    inputsArray.forEach(input => {
        // ДОБАВЛЕНА ЗАЩИТА: Если это не поле ввода (например, случайно попал div), игнорируем
        if (!input || typeof input.value === 'undefined') return;

        let isFieldValid = true;
        const val = input.value.trim();

        // 1. Проверка на заполненность (если required)
        if (input.hasAttribute('required') && val === '') {
            isFieldValid = false;
        }

        // 2. Строгая проверка Email
        if (val !== '' && input.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(val)) isFieldValid = false;
        }

        // 3. Строгая проверка Телефона (должно быть ровно 10 цифр под маской)
        const isPhoneField = input.id.toLowerCase().includes('phone') ||
            input.classList.contains('mask-phone') ||
            (input.closest('[data-field="phone"]') !== null);

        if (val !== '' && isPhoneField) {
            const digits = val.replace(/\D/g, '');
            if (digits.length !== 10) isFieldValid = false;
        }

        // Применяем или убираем ошибку
        if (!isFieldValid) {
            input.style.borderColor = '#FF496B';
            isValid = false;
        } else {
            input.style.borderColor = '';
        }
    });

    return isValid;
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    applyMasks(document);
});


// ==========================================
// ОСНОВНОЙ СКРИПТ (САЙДБАР, ТАБЫ И Т.Д.)
// ==========================================

const burger = document.getElementById('burger');
const closeBurger = document.getElementById('close_burger');
const sideBar = document.querySelector('.left_cp_bar');
const overlay = document.querySelector('.overlay');

burger.addEventListener('click', () => {
    sideBar.style.transform = 'translateX(0)';
    overlay.style.display = 'flex';
});

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

toggleContactsPanel(window.innerWidth);
window.addEventListener('resize', () => {
    toggleContactsPanel(window.innerWidth);
});

function initAllCustomDatePickers(container = document) {
    container.querySelectorAll('.custom-calendar').forEach(function (calendarField) {
        if (calendarField.querySelector('.visually-hidden')) return;

        const span = calendarField.querySelector('span');
        const dateValue = span.innerText.trim() === '-' ? '' : span.innerText.trim();

        const parentCell = calendarField.closest('[class*="-cell"], [class*="-field"], [class*="-form-group"]');
        let prefix = 'cr';
        let fieldName = '';

        if (parentCell) {
            const classMatch = parentCell.className.match(/([a-z]+)-(cell|field|form-group)/);
            if (classMatch) prefix = classMatch[1];
            fieldName = parentCell.getAttribute('data-field') || '';
        }

        const input = document.createElement('input');
        input.type = 'text';
        input.value = dateValue;
        input.classList.add('visually-hidden', `${prefix}-edit`, `${prefix}-input`);

        if (fieldName) {
            input.name = fieldName;
            input.id = prefix + fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
        }

        calendarField.appendChild(input);

        flatpickr(input, {
            dateFormat: 'm/d/Y',
            defaultDate: dateValue || null,
            disableMobile: true,
            positionElement: calendarField,
            monthSelectorType: 'dropdown',
            onChange: function (selectedDates, dateStr) {
                span.innerText = dateStr;
                input.value = dateStr;
            },
        });

        calendarField.addEventListener('click', function (e) {
            e.stopPropagation();
            const row = calendarField.closest('[class*="-row"]');
            const editModeWrapper = calendarField.closest('[class*="-edit-mode"]');
            const popup = calendarField.closest('.active');

            const isEditing = (row && row.classList.contains('is-editing')) ||
                (editModeWrapper && window.getComputedStyle(editModeWrapper).display !== 'none') ||
                (popup !== null);

            if (isEditing) {
                input._flatpickr.open();
            }
        });
    });
}

// --- УЛУЧШЕННАЯ ЛОГИКА ТАБОВ СО СБРОСОМ РЕДАКТИРОВАНИЯ ---
document.addEventListener('DOMContentLoaded', function () {
    const tabButtons = document.querySelectorAll('.pr-tab-btn');
    const tabContents = document.querySelectorAll('.pr-tab-content');

    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // 1. СБРОС ГЛОБАЛЬНЫХ РЕЖИМОВ
                const lpGlobalBtn = document.getElementById('lpGlobalEditBtn');
                if (lpGlobalBtn && lpGlobalBtn.classList.contains('pr-lp-edit-btn-active')) lpGlobalBtn.click();

                const bdGlobalBtn = document.getElementById('bdGlobalEditBtn');
                if (bdGlobalBtn && bdGlobalBtn.classList.contains('bd-edit-btn-global-active')) bdGlobalBtn.click();

                const rplGlobalBtn = document.getElementById('rplGlobalEditBtn');
                if (rplGlobalBtn && rplGlobalBtn.classList.contains('rpl-edit-btn-global--active')) rplGlobalBtn.click();

                // 2. СБРОС ИНЛАЙН РЕЖИМОВ
                document.querySelectorAll('.pr-edit-mode .pr-cancel-btn').forEach(btn => {
                    const wrap = btn.closest('.pr-edit-mode');
                    if (wrap && window.getComputedStyle(wrap).display !== 'none') btn.click();
                });

                document.querySelectorAll('.ab-row.is-editing .ab-btn-cancel').forEach(btn => btn.click());

                document.querySelectorAll('.bd-edit-mode .bd-cancel-btn').forEach(btn => {
                    const wrap = btn.closest('.bd-edit-mode');
                    if (wrap && window.getComputedStyle(wrap).display !== 'none') btn.click();
                });

                document.querySelectorAll('.cr-row.is-editing .cr-btn-cancel').forEach(btn => btn.click());

                document.querySelectorAll('.rpl-edit-mode .rpl-cancel-btn').forEach(btn => {
                    const wrap = btn.closest('.rpl-edit-mode');
                    if (wrap && window.getComputedStyle(wrap).display !== 'none') btn.click();
                });

                document.querySelectorAll('.pay-row.is-editing .pay-btn-cancel').forEach(btn => btn.click());

                // 3. ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));

                button.classList.add('active');

                const tabId = button.getAttribute('data-tab');
                const targetContent = document.getElementById(`tab-${tabId}`);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }
});

// --- БЛОК 1: LANDING PAGE ---
document.addEventListener('DOMContentLoaded', function () {
    const referralBlock = document.querySelector('.pr-referral-block');
    const lpGlobalEditBtn = document.getElementById('lpGlobalEditBtn');

    if (!referralBlock) return;

    let isLpGlobalEditActive = false;

    function checkLpGlobalState() {
        if (!lpGlobalEditBtn) return;
        const allEditModes = referralBlock.querySelectorAll('.pr-edit-mode');
        const anyOpen = Array.from(allEditModes).some(el => el.style.display !== 'none');

        if (!anyOpen && isLpGlobalEditActive) {
            isLpGlobalEditActive = false;
            lpGlobalEditBtn.style.backgroundColor = '';
            lpGlobalEditBtn.style.color = '';
            lpGlobalEditBtn.style.borderColor = '';
            lpGlobalEditBtn.innerHTML = `Edit`;
            lpGlobalEditBtn.classList.remove('pr-lp-edit-btn-active');
        }
    }

    if (lpGlobalEditBtn) {
        lpGlobalEditBtn.addEventListener('click', function (e) {
            e.preventDefault();
            isLpGlobalEditActive = !isLpGlobalEditActive;

            const allFields = referralBlock.querySelectorAll('.pr-inline-field');
            allFields.forEach(field => {
                toggleEditMode(field, isLpGlobalEditActive);
            });

            if (isLpGlobalEditActive) {
                this.style.backgroundColor = '#159C2A';
                this.style.color = '#FFFFFF';
                this.style.borderColor = '#159C2A';
                this.innerHTML = `Close Edit Mode`;
                this.classList.add('pr-lp-edit-btn-active');
            } else {
                this.style.backgroundColor = '';
                this.style.color = '';
                this.style.borderColor = '';
                this.innerHTML = `Edit`;
                this.classList.remove('pr-lp-edit-btn-active');
            }
        });
    }

    referralBlock.addEventListener('click', function (e) {
        const editBtn = e.target.closest('.pr-edit-btn');
        const valDisplay = e.target.closest('.pr-val-display');
        const cancelBtn = e.target.closest('.pr-cancel-btn');
        const saveBtn = e.target.closest('.pr-save-btn');

        if (editBtn || valDisplay) {
            e.preventDefault();
            const fieldWrap = (editBtn || valDisplay).closest('.pr-inline-field');
            toggleEditMode(fieldWrap, true);
        }

        if (cancelBtn) {
            e.preventDefault();
            const fieldWrap = cancelBtn.closest('.pr-inline-field');
            toggleEditMode(fieldWrap, false);
            checkLpGlobalState();
        }

        if (saveBtn) {
            e.preventDefault();
            const fieldWrap = saveBtn.closest('.pr-inline-field');
            saveInlineData(fieldWrap);
        }
    });

    function toggleEditMode(fieldWrap, isEditing) {
        const viewMode = fieldWrap.querySelector('.pr-view-mode');
        const editMode = fieldWrap.querySelector('.pr-edit-mode');

        if (isEditing) {
            viewMode.style.display = 'none';
            editMode.style.display = 'flex';

            const input = editMode.querySelector('.pr-edit-input');
            if (input && !input.classList.contains('visually-hidden')) {
                input.focus();
            }
        } else {
            viewMode.style.display = 'flex';
            editMode.style.display = 'none';

            const input = editMode.querySelector('.pr-edit-input');
            if (input) input.style.borderColor = '';
        }
    }

    function saveInlineData(fieldWrap) {
        const input = fieldWrap.querySelector('.pr-edit-input');
        if (!input) return;

        // ВАЛИДАЦИЯ
        if (!validateFormFields([input])) return;

        const fieldName = input.getAttribute('name');
        let fieldValue = input.value;

        if (input.type === 'file') {
            fieldValue = input.files[0] ? input.files[0].name : '';
        }

        const valueDisplay = fieldWrap.querySelector('.pr-val-display');

        if (input.tagName === 'SELECT') {
            valueDisplay.textContent = input.options[input.selectedIndex].text;
        } else if (input.type === 'file' && fieldValue) {
            valueDisplay.textContent = fieldValue;
        } else if (input.type !== 'file') {
            if (valueDisplay.tagName === 'A') {
                valueDisplay.href = fieldValue;
            } else {
                valueDisplay.textContent = fieldValue;
            }
        }

        toggleEditMode(fieldWrap, false);
        checkLpGlobalState();
    }
});

// --- БЛОК 2: ACCOUNTS BROKER ---
document.addEventListener('DOMContentLoaded', function () {
    const tableContainer = document.querySelector('.ab-table-container');
    const tableBody = document.querySelector('.ab-table-body');
    const addAccountOverlay = document.getElementById('addAccountOverlay');
    const addAccountPopup = document.getElementById('addAccountPopup');
    const convertOverlay = document.getElementById('convertOverlay');
    const convertPopup = document.getElementById('convertPopup');
    const popupSaveBtn = document.querySelector('#addAccountPopup .btn-apply');

    let activeAbEditRow = null;
    let activeAbDeleteRow = null;
    let activeConvertRow = null; // Добавлено

    const abDeleteOverlay = document.getElementById('abDeleteOverlay');
    const abDeletePopup = document.getElementById('abDeletePopup');

    function clearAddAccountForm() {
        document.getElementById('addFirstName').value = '';
        document.getElementById('addLastName').value = '';
        document.getElementById('addPhone').value = '';
        document.getElementById('addEmail').value = '';
        document.getElementById('addPassword').value = '';
        document.getElementById('addStatus').value = '';

        document.querySelectorAll('#addAccountPopup input, #addAccountPopup select').forEach(i => i.style.borderColor = '');

        const pInput = document.getElementById('addPassword');
        if (pInput) pInput.type = 'password';
    }

    function closeAllModals() {
        if (addAccountOverlay) addAccountOverlay.classList.remove('active');
        if (addAccountPopup) addAccountPopup.classList.remove('active');
        if (abDeleteOverlay) abDeleteOverlay.classList.remove('active');
        if (abDeletePopup) abDeletePopup.classList.remove('active');

        if (activeAbEditRow) {
            activeAbEditRow.classList.remove('is-active-row');
            activeAbEditRow = null;
        }
        if (activeAbDeleteRow) {
            activeAbDeleteRow.classList.remove('is-deleting-row');
            activeAbDeleteRow = null;
        }
        clearAddAccountForm();
    }

    // --- ВОТ ЭТО ДОБАВЛЕНО ДЛЯ CONVERT POPUP ---
    function closeConvertModal(e) {
        if (e) e.preventDefault();
        if (convertOverlay) convertOverlay.classList.remove('active');
        if (convertPopup) convertPopup.classList.remove('active');
        if (activeConvertRow) {
            activeConvertRow.classList.remove('is-active-row');
            activeConvertRow = null;
        }
    }

    document.getElementById('closeConvertBtn')?.addEventListener('click', closeConvertModal);
    document.getElementById('confirmConvertBtn')?.addEventListener('click', closeConvertModal);
    // -------------------------------------------

    document.getElementById('openAddAccountBtn')?.addEventListener('click', () => {
        activeAbEditRow = null;
        document.querySelector('#addAccountPopup h2').textContent = "New Account Broker Portal";
        if (addAccountOverlay) addAccountOverlay.classList.add('active');
        if (addAccountPopup) addAccountPopup.classList.add('active');
    });

    document.getElementById('closeAddAccountBtn')?.addEventListener('click', closeAllModals);
    document.getElementById('abCloseDeleteBtn')?.addEventListener('click', closeAllModals);
    document.getElementById('abCancelDeleteBtn')?.addEventListener('click', closeAllModals);

    document.getElementById('abConfirmDeleteBtn')?.addEventListener('click', () => {
        if (activeAbDeleteRow) {
            activeAbDeleteRow.remove();
        }
        closeAllModals();
    });

    if (tableContainer) {
        tableContainer.addEventListener('click', function (e) {
            const editBtn = e.target.closest('.ab-btn-edit');
            const deleteBtn = e.target.closest('.ab-btn-delete');
            const convertBtn = e.target.closest('.ab-btn-convert');
            const row = e.target.closest('.ab-row');

            if (!row) return;

            if (editBtn) {
                e.preventDefault();
                activeAbEditRow = row;
                row.classList.add('is-active-row');

                const fullName = row.querySelector('[data-field="fullName"] .ab-view').textContent.trim();
                const email = row.querySelector('[data-field="email"] .ab-view').textContent.trim();
                const phone = row.querySelector('[data-field="phone"] .ab-view').textContent.trim();

                // ИСПРАВЛЕНИЕ: Удаляем лишние пробелы и переносы строк
                const status = row.querySelector('[data-field="status"] .ab-view').textContent.replace(/\s+/g, ' ').trim();

                const names = fullName.split(' ');
                document.getElementById('addFirstName').value = names[0] || '';
                document.getElementById('addLastName').value = names.slice(1).join(' ') || '';
                document.getElementById('addEmail').value = email;
                document.getElementById('addPhone').value = phone;

                const statusSelect = document.getElementById('addStatus');
                if (statusSelect) {
                    for (let i = 0; i < statusSelect.options.length; i++) {
                        // Сравниваем очищенный текст
                        if (statusSelect.options[i].text.replace(/\s+/g, ' ').trim() === status) {
                            statusSelect.selectedIndex = i;
                        }
                    }
                }

                document.querySelector('#addAccountPopup h2').textContent = "Edit Account Broker";

                if (addAccountOverlay) addAccountOverlay.classList.add('active');
                if (addAccountPopup) addAccountPopup.classList.add('active');
            }

            if (convertBtn) {
                e.preventDefault();
                activeConvertRow = row;
                activeConvertRow.classList.add('is-active-row');
                if (convertOverlay) convertOverlay.classList.add('active');
                if (convertPopup) convertPopup.classList.add('active');
            }

            if (deleteBtn) {
                e.preventDefault();
                activeAbDeleteRow = row;
                activeAbDeleteRow.classList.add('is-deleting-row');
                if (abDeleteOverlay && abDeletePopup) {
                    abDeleteOverlay.classList.add('active');
                    abDeletePopup.classList.add('active');
                }
            }
        });
    }

    if (popupSaveBtn && tableBody) {
        popupSaveBtn.addEventListener('click', () => {
            const inputsToValidate = [
                document.getElementById('addFirstName'),
                document.getElementById('addLastName'),
                document.getElementById('addPhone'),
                document.getElementById('addEmail'),
                document.getElementById('addStatus')
            ];

            inputsToValidate.forEach(el => el.setAttribute('required', 'true'));
            if (!validateFormFields(inputsToValidate)) return;

            const firstName = document.getElementById('addFirstName').value.trim();
            const lastName = document.getElementById('addLastName').value.trim();
            const phone = document.getElementById('addPhone').value.trim();
            const email = document.getElementById('addEmail').value.trim();
            const status = document.getElementById('addStatus').value;

            const fullName = `${firstName} ${lastName}`.trim() || 'New User';
            const displayStatus = status || 'Active';

            let badgeClass = 'ab-badge-blocked';
            if (displayStatus === 'Active') {
                badgeClass = 'ab-badge-active';
            } else if (displayStatus === 'The user passes additional moderation') {
                badgeClass = 'ab-badge-moderation';
            }

            if (activeAbEditRow) {
                activeAbEditRow.querySelector('[data-field="fullName"] .ab-view').textContent = fullName;
                const inputFullName = activeAbEditRow.querySelector('[data-field="fullName"] input.ab-input');
                if (inputFullName) inputFullName.value = fullName;

                activeAbEditRow.querySelector('[data-field="email"] .ab-view').textContent = email;
                const inputEmail = activeAbEditRow.querySelector('[data-field="email"] input.ab-input');
                if (inputEmail) inputEmail.value = email;

                activeAbEditRow.querySelector('[data-field="phone"] .ab-view').textContent = phone;
                const inputPhone = activeAbEditRow.querySelector('[data-field="phone"] input.ab-input');
                if (inputPhone) inputPhone.value = phone;

                const statusView = activeAbEditRow.querySelector('[data-field="status"] .ab-view');
                statusView.textContent = displayStatus;
                statusView.className = `ab-view ab-badge ${badgeClass}`;
                const inputStatus = activeAbEditRow.querySelector('[data-field="status"] select.ab-input');
                if (inputStatus) inputStatus.value = displayStatus;

            } else {
                const newRow = document.createElement('div');
                newRow.className = 'ab-row';
                newRow.innerHTML = `
                    <div class="ab-cell" data-field="fullName">
                        <span class="ab-view">${fullName}</span>
                        <input type="text" class="ab-edit ab-input" value="${fullName}" required style="display:none;">
                    </div>
                    <div class="ab-cell" data-field="email">
                        <span class="ab-view">${email}</span>
                        <input type="email" class="ab-edit ab-input" value="${email}" required style="display:none;">
                    </div>
                    <div class="ab-cell" data-field="phone">
                        <span class="ab-view">${phone}</span>
                        <input type="text" class="ab-edit ab-input mask-phone" value="${phone}" required style="display:none;">
                    </div>
                    <div class="ab-cell" data-field="status">
                        <span class="ab-view ab-badge ${badgeClass}">${displayStatus}</span>
                        <select class="ab-edit ab-input" style="display:none;">
                            <option value="Active" ${displayStatus === 'Active' ? 'selected' : ''}>Active</option>
                            <option value="Deleted" ${displayStatus === 'Deleted' ? 'selected' : ''}>Deleted</option>
                            <option value="Not Active" ${displayStatus === 'Not Active' ? 'selected' : ''}>Not Active</option>
                            <option value="The user is blocked" ${displayStatus === 'The user is blocked' ? 'selected' : ''}>The user is blocked</option>
                            <option value="The user passes additional moderation" ${displayStatus === 'The user passes additional moderation' ? 'selected' : ''}>The user passes additional moderation</option>
                        </select>
                    </div>
                    <div class="ab-cell ab-center">
                        <div class="ab-view ab-actions">
                            <button class="ab-btn-convert">Convert</button>
                            <button class="ab-btn-icon ab-btn-edit"></button>
                            <button class="ab-btn-icon ab-btn-delete"></button>
                        </div>
                    </div>
                `;
                tableBody.appendChild(newRow);
                applyMasks(newRow);
            }

            closeAllModals();
        });
    }

    const generateBtn = document.getElementById('generatePasswordBtn');
    const passwordInput = document.getElementById('addPassword');
    const toggleEyeBtn = document.getElementById('togglePasswordBtn');

    if (generateBtn && passwordInput) {
        generateBtn.addEventListener('click', () => {
            if (generateBtn.disabled) return;
            generateBtn.disabled = true;

            const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
            let pass = "";
            for (let i = 0; i < 12; i++) {
                pass += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            passwordInput.value = pass;
            passwordInput.type = 'text';

            if (toggleEyeBtn) {
                toggleEyeBtn.classList.add('is-visible');
            }

            navigator.clipboard.writeText(pass).then(() => {
                const originalText = generateBtn.textContent;
                generateBtn.textContent = 'Copied!';
                setTimeout(() => {
                    generateBtn.textContent = originalText;
                    generateBtn.disabled = false;
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
                generateBtn.disabled = false;
            });
        });
    }

    if (toggleEyeBtn && passwordInput) {
        toggleEyeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const isPassword = passwordInput.getAttribute('type') === 'password';
            passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
            toggleEyeBtn.classList.toggle('is-visible');
        });
    }
});

// --- БЛОК 3: BUSINESS DETAILS ---
document.addEventListener('DOMContentLoaded', function () {
    const bdCard = document.getElementById('bdCard');
    const bdGlobalEditBtn = document.getElementById('bdGlobalEditBtn');

    if (!bdCard) return;

    let isGlobalEditActive = false;

    function checkBdGlobalState() {
        if (!bdGlobalEditBtn) return;
        const allEditModes = bdCard.querySelectorAll('.bd-edit-mode');
        const anyOpen = Array.from(allEditModes).some(el => el.style.display !== 'none');

        if (!anyOpen && isGlobalEditActive) {
            isGlobalEditActive = false;
            bdGlobalEditBtn.style.backgroundColor = '';
            bdGlobalEditBtn.style.color = '';
            bdGlobalEditBtn.style.borderColor = '';
            bdGlobalEditBtn.innerHTML = `Edit`;
            bdGlobalEditBtn.classList.remove('bd-edit-btn-global-active');
        }
    }

    bdGlobalEditBtn?.addEventListener('click', function (e) {
        e.preventDefault();
        isGlobalEditActive = !isGlobalEditActive;

        const allFields = bdCard.querySelectorAll('.bd-field');
        allFields.forEach(field => {
            toggleEditMode(field, isGlobalEditActive);
        });

        if (isGlobalEditActive) {
            this.style.backgroundColor = '#159C2A';
            this.style.color = '#FFFFFF';
            this.style.borderColor = '#159C2A';
            this.innerHTML = `Close Edit Mode`;
            this.classList.add('bd-edit-btn-global-active');
        } else {
            this.style.backgroundColor = '';
            this.style.color = '';
            this.style.borderColor = '';
            this.innerHTML = `Edit`;
            this.classList.remove('bd-edit-btn-global-active');
        }
    });

    bdCard.addEventListener('click', function (e) {
        const editBtnInline = e.target.closest('.bd-edit-btn-inline');
        const valDisplay = e.target.closest('.bd-val');
        const cancelBtn = e.target.closest('.bd-cancel-btn');
        const saveBtn = e.target.closest('.bd-save-btn');

        if (editBtnInline || valDisplay) {
            e.preventDefault();
            const fieldWrap = (editBtnInline || valDisplay).closest('.bd-field');
            toggleEditMode(fieldWrap, true);
        }

        if (cancelBtn) {
            e.preventDefault();
            toggleEditMode(cancelBtn.closest('.bd-field'), false);
            checkBdGlobalState();
        }

        if (saveBtn) {
            e.preventDefault();
            const fieldWrap = saveBtn.closest('.bd-field');
            saveFieldData(fieldWrap);
        }
    });

    function toggleEditMode(fieldWrap, isEditing) {
        const viewMode = fieldWrap.querySelector('.bd-view-mode');
        const editMode = fieldWrap.querySelector('.bd-edit-mode');

        if (isEditing) {
            viewMode.style.display = 'none';
            editMode.style.display = 'flex';
        } else {
            viewMode.style.display = 'flex';
            editMode.style.display = 'none';
            const input = editMode.querySelector('.bd-input');
            if (input) input.style.borderColor = '';
        }
    }

    function saveFieldData(fieldWrap) {
        const input = fieldWrap.querySelector('.bd-input');
        if (!input) return;

        if (!validateFormFields([input])) return;

        const fieldName = input.getAttribute('name');
        const fieldValue = input.value;

        const valDisplay = fieldWrap.querySelector('.bd-val');
        const badgeDisplay = fieldWrap.querySelector('.bd-badge');

        if (input.tagName === 'SELECT') {
            if (badgeDisplay) {
                badgeDisplay.textContent = fieldValue;
            }
        } else if (valDisplay && valDisplay.tagName === 'A') {
            const urlVal = fieldValue.startsWith('http') ? fieldValue : `https://${fieldValue}`;
            valDisplay.href = urlVal;
            valDisplay.textContent = fieldValue;
        } else if (valDisplay) {
            valDisplay.textContent = fieldValue;
        }

        toggleEditMode(fieldWrap, false);
        checkBdGlobalState();
    }
});

// --- БЛОК 4: CONTACT ROLES ---
document.addEventListener('DOMContentLoaded', function () {
    const crTableContainer = document.querySelector('.cr-table-container');
    const crTableBody = document.getElementById('crTableBody');
    const crAddOverlay = document.getElementById('crAddOverlay');
    const crAddPopup = document.getElementById('crAddPopup');

    const crDeleteOverlay = document.getElementById('crDeleteOverlay');
    const crDeletePopup = document.getElementById('crDeletePopup');

    let activeCrEditRow = null; // Отслеживаем редактируемую строку
    let activeDeleteRow = null;

    function clearCrForm() {
        const simpleFields = [
            'crFirstName', 'crLastName', 'crRole', 'crOwnership',
            'crEmail', 'crPhone', 'crSsn', 'crAddress',
            'crZip', 'crState', 'crCity'
        ];
        simpleFields.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.value = '';
                el.style.borderColor = '';
            }
        });

        const dobGroup = document.querySelector('#crAddPopup [data-field="dob"]');
        if (dobGroup) {
            const span = dobGroup.querySelector('.custom-calendar span');
            const input = dobGroup.querySelector('input');
            if (span) span.textContent = '-';
            if (input) {
                input.value = '';
                if (input._flatpickr) input._flatpickr.clear();
            }
        }
    }

    function closeAllModals() {
        crAddOverlay.classList.remove('active');
        crAddPopup.classList.remove('active');
        crDeleteOverlay.classList.remove('active');
        crDeletePopup.classList.remove('active');

        if (activeCrEditRow) {
            activeCrEditRow.classList.remove('is-active-row');
            activeCrEditRow = null;
        }
        if (activeDeleteRow) {
            activeDeleteRow.classList.remove('is-deleting-row');
            activeDeleteRow = null;
        }
        clearCrForm();
    }

    // Открытие попапа для СОЗДАНИЯ
    document.getElementById('crOpenAddBtn')?.addEventListener('click', () => {
        activeCrEditRow = null;
        document.querySelector('#crAddPopup h2').textContent = "New Contact";
        crAddOverlay.classList.add('active');
        crAddPopup.classList.add('active');
    });

    document.getElementById('crCloseAddBtn')?.addEventListener('click', closeAllModals);
    document.getElementById('crCloseDeleteBtn')?.addEventListener('click', closeAllModals);
    document.getElementById('crCancelDeleteBtn')?.addEventListener('click', closeAllModals);

    document.getElementById('crConfirmDeleteBtn')?.addEventListener('click', () => {
        if (activeDeleteRow) {
            activeDeleteRow.remove();
        }
        closeAllModals();
    });

    if (crTableContainer) {
        crTableContainer.addEventListener('click', function (e) {
            const editBtn = e.target.closest('.cr-btn-edit');
            const deleteBtn = e.target.closest('.cr-btn-delete');
            const row = e.target.closest('.cr-row');

            if (!row) return;

            // КЛИК НА РЕДАКТИРОВАНИЕ (ОТКРЫВАЕТ ПОПАП)
            if (editBtn) {
                e.preventDefault();
                activeCrEditRow = row;
                row.classList.add('is-active-row');

                // Извлекаем данные из спанов текущей строки
                const fullName = row.querySelector('[data-field="fullName"] .cr-val').textContent.trim();
                const ownership = row.querySelector('[data-field="ownership"] .cr-val').textContent.trim();
                const role = row.querySelector('[data-field="role"] .cr-val').textContent.trim();
                const phone = row.querySelector('[data-field="phone"] .cr-val').textContent.trim();
                const email = row.querySelector('[data-field="email"] .cr-val').textContent.trim();
                const ssn = row.querySelector('[data-field="ssn"] .cr-val').textContent.trim();
                const dob = row.querySelector('[data-field="dob"] .cr-val').textContent.trim();
                const addressStr = row.querySelector('[data-field="address"] .cr-val').textContent.trim();

                // Заполняем форму
                const names = fullName.split(' ');
                document.getElementById('crFirstName').value = names[0] || '';
                document.getElementById('crLastName').value = names.slice(1).join(' ') || '';
                document.getElementById('crOwnership').value = ownership !== '-' ? ownership : '';
                document.getElementById('crRole').value = role !== '-' ? role : '';
                document.getElementById('crPhone').value = phone;
                document.getElementById('crEmail').value = email;
                document.getElementById('crSsn').value = ssn !== '-' ? ssn : '';

                // Вставляем полный адрес в строку (если нужно разбивать - нужно проставлять data-атрибуты строке)
                document.getElementById('crAddress').value = row.getAttribute('data-address') || (addressStr !== '-' ? addressStr : '');
                document.getElementById('crCity').value = row.getAttribute('data-city') || '';
                document.getElementById('crState').value = row.getAttribute('data-state') || '';
                document.getElementById('crZip').value = row.getAttribute('data-zip') || '';

                const dobGroup = document.querySelector('#crAddPopup [data-field="dob"]');
                if (dobGroup) {
                    const span = dobGroup.querySelector('.custom-calendar span');
                    const input = dobGroup.querySelector('input');
                    if (span) span.textContent = dob !== '-' ? dob : '-';
                    if (input) {
                        input.value = dob !== '-' ? dob : '';
                        if (input._flatpickr && dob !== '-') input._flatpickr.setDate(dob);
                    }
                }

                document.querySelector('#crAddPopup h2').textContent = "Edit Contact";

                crAddOverlay.classList.add('active');
                crAddPopup.classList.add('active');
            }

            // КЛИК НА УДАЛЕНИЕ (ДИНАМИЧЕСКИЙ ТЕКСТ)
            if (deleteBtn) {
                e.preventDefault();
                activeDeleteRow = row;
                row.classList.add('is-deleting-row');

                const role = row.querySelector('[data-field="role"] .cr-val').textContent.trim();
                const deleteText = document.querySelector('#crDeletePopup .form-group p');

                if (role === 'Owner') {
                    deleteText.textContent = "This contact is selected as the main one for sending emails, do you want to delete it?.";
                } else {
                    deleteText.textContent = "Are you sure you want to completely delete this entry?";
                }

                crDeleteOverlay.classList.add('active');
                crDeletePopup.classList.add('active');
            }
        });
    }

    // Сохранение из Попапа (Срабатывает и на Update, и на Create)
    document.getElementById('crSaveNewBtn')?.addEventListener('click', () => {
        const fName = document.getElementById('crFirstName');
        const lName = document.getElementById('crLastName');
        const email = document.getElementById('crEmail');
        const phone = document.getElementById('crPhone');

        fName.setAttribute('required', 'true');
        lName.setAttribute('required', 'true');
        email.setAttribute('required', 'true');
        phone.setAttribute('required', 'true');

        // ВАЛИДАЦИЯ ПОПАПА
        if (!validateFormFields([fName, lName, email, phone])) return;

        const fullName = `${fName.value.trim()} ${lName.value.trim()}`;
        const ownership = document.getElementById('crOwnership').value.trim() || '-';
        const role = document.getElementById('crRole').value || '-';
        const ssn = document.getElementById('crSsn').value.trim() || '-';
        const phoneVal = phone.value;

        const dobGroup = document.querySelector('#crAddPopup [data-field="dob"]');
        const dobInput = dobGroup ? dobGroup.querySelector('input') : null;
        const dobFormat = (dobInput && dobInput.value) ? dobInput.value : '-';

        const address = document.getElementById('crAddress').value.trim();
        const city = document.getElementById('crCity').value.trim();
        const state = document.getElementById('crState').value;
        const zip = document.getElementById('crZip').value.trim();
        let fullAddress = [address, city, state, zip].filter(Boolean).join(', ') || '-';

        const roleClass = role === 'Owner' ? 'cr-text-green' : '';

        if (activeCrEditRow) {
            // UPDATE СУЩЕСТВУЮЩЕЙ СТРОКИ
            activeCrEditRow.setAttribute('data-address', address);
            activeCrEditRow.setAttribute('data-city', city);
            activeCrEditRow.setAttribute('data-state', state);
            activeCrEditRow.setAttribute('data-zip', zip);

            activeCrEditRow.querySelector('[data-field="fullName"] .cr-val').textContent = fullName;
            const inputName = activeCrEditRow.querySelector('[data-field="fullName"] input.cr-input');
            if (inputName) inputName.value = fullName;

            activeCrEditRow.querySelector('[data-field="ownership"] .cr-val').textContent = ownership;
            const inputOwn = activeCrEditRow.querySelector('[data-field="ownership"] input.cr-input');
            if (inputOwn) inputOwn.value = ownership;

            const roleView = activeCrEditRow.querySelector('[data-field="role"] .cr-val');
            roleView.textContent = role;
            roleView.className = `cr-view cr-val ${roleClass}`;
            const inputRole = activeCrEditRow.querySelector('[data-field="role"] select.cr-input');
            if (inputRole) inputRole.value = role;

            activeCrEditRow.querySelector('[data-field="phone"] .cr-val').textContent = phoneVal;
            const inputPhone = activeCrEditRow.querySelector('[data-field="phone"] input.cr-input');
            if (inputPhone) inputPhone.value = phoneVal;

            activeCrEditRow.querySelector('[data-field="email"] .cr-val').textContent = email.value;
            const inputEmail = activeCrEditRow.querySelector('[data-field="email"] input.cr-input');
            if (inputEmail) inputEmail.value = email.value;

            activeCrEditRow.querySelector('[data-field="ssn"] .cr-val').textContent = ssn;
            const inputSsn = activeCrEditRow.querySelector('[data-field="ssn"] input.cr-input');
            if (inputSsn) inputSsn.value = ssn;

            activeCrEditRow.querySelector('[data-field="dob"] .cr-val').textContent = dobFormat;
            const dobInlineSpan = activeCrEditRow.querySelector('[data-field="dob"] .custom-calendar span');
            if (dobInlineSpan) dobInlineSpan.textContent = dobFormat;

            activeCrEditRow.querySelector('[data-field="address"] .cr-val').textContent = fullAddress;
            const inputAddress = activeCrEditRow.querySelector('[data-field="address"] input.cr-input');
            if (inputAddress) inputAddress.value = fullAddress;

        } else {
            // ДОБАВЛЕНИЕ НОВОЙ СТРОКИ
            const newRow = document.createElement('div');
            newRow.className = 'cr-row';
            newRow.setAttribute('data-address', address);
            newRow.setAttribute('data-city', city);
            newRow.setAttribute('data-state', state);
            newRow.setAttribute('data-zip', zip);

            newRow.innerHTML = `
            <div class="cr-cell" data-field="fullName">
                <span class="cr-view cr-val">${fullName}</span>
                <input type="text" class="cr-edit cr-input" value="${fullName}" required style="display:none;">
            </div>
            <div class="cr-cell" data-field="ownership">
                <span class="cr-view cr-val">${ownership}</span>
                <input type="text" class="cr-edit cr-input" value="${ownership}" style="display:none;">
            </div>
            <div class="cr-cell" data-field="role">
                <span class="cr-view cr-val ${roleClass}">${role}</span>
                <select class="cr-edit cr-input" style="display:none;">
                    <option value="Owner" ${role === 'Owner' ? 'selected' : ''}>Owner</option>
                    <option value="Manager" ${role === 'Manager' ? 'selected' : ''}>Manager</option>
                    <option value="Employee" ${role === 'Employee' ? 'selected' : ''}>Employee</option>
                </select>
            </div>
            <div class="cr-cell" data-field="phone">
                <span class="cr-view cr-val">${phoneVal}</span>
                <input type="text" class="cr-edit cr-input mask-phone" value="${phoneVal}" required style="display:none;">
            </div>
            <div class="cr-cell" data-field="email">
                <span class="cr-view cr-val">${email.value}</span>
                <input type="email" class="cr-edit cr-input" value="${email.value}" required style="display:none;">
            </div>
            <div class="cr-cell" data-field="ssn">
                <span class="cr-view cr-val">${ssn}</span>
                <input type="text" class="cr-edit cr-input" value="${ssn}" style="display:none;">
            </div>
            <div class="cr-cell" data-field="dob">
                <span class="cr-view cr-val">${dobFormat}</span>
                <div class="cr-edit" style="width: 100%; display:none;">
                    <div class="custom-calendar">
                        <span>${dobFormat}</span>
                    </div>
                </div>
            </div>
            <div class="cr-cell" data-field="address">
                <span class="cr-view cr-val">${fullAddress}</span>
                <input type="text" class="cr-edit cr-input" value="${fullAddress}" style="display:none;">
            </div>
            <div class="cr-cell cr-center">
                <div class="cr-view cr-actions">
                    <button class="cr-icon-btn cr-btn-edit"></button>
                    <button class="cr-icon-btn cr-btn-delete"></button>
                </div>
            </div>
            `;

            crTableBody.appendChild(newRow);
            initAllCustomDatePickers(newRow);
            applyMasks(newRow);
        }

        closeAllModals();
    });

    initAllCustomDatePickers();
    if (crAddPopup) {
        initAllCustomDatePickers(crAddPopup);
    }
});

// --- БЛОК 5: RP LEADS DETAILS ---
document.addEventListener('DOMContentLoaded', function () {
    const rplCard = document.getElementById('rplCard');
    const rplGlobalEditBtn = document.getElementById('rplGlobalEditBtn');

    if (!rplCard) return;

    let isRplGlobalEditActive = false;

    function checkRplGlobalState() {
        if (!rplGlobalEditBtn) return;
        const allEditModes = rplCard.querySelectorAll('.rpl-edit-mode');
        const anyOpen = Array.from(allEditModes).some(el => el.style.display !== 'none');

        if (!anyOpen && isRplGlobalEditActive) {
            isRplGlobalEditActive = false;
            rplGlobalEditBtn.style.backgroundColor = '';
            rplGlobalEditBtn.style.color = '';
            rplGlobalEditBtn.style.borderColor = '';
            rplGlobalEditBtn.innerHTML = `Edit`;
            rplGlobalEditBtn.classList.remove('rpl-edit-btn-global--active');
        }
    }

    function parseDateToInputFormat(dateStr) {
        if (!dateStr || dateStr === '—') return '';
        const parts = dateStr.split('/');
        if (parts.length === 3) {
            return `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
        }
        return '';
    }

    if (rplGlobalEditBtn) {
        rplGlobalEditBtn.addEventListener('click', function (e) {
            e.preventDefault();
            isRplGlobalEditActive = !isRplGlobalEditActive;

            const allFields = rplCard.querySelectorAll('.rpl-field');
            allFields.forEach(field => {
                toggleEditMode(field, isRplGlobalEditActive);
            });

            if (isRplGlobalEditActive) {
                this.style.backgroundColor = '#159C2A';
                this.style.color = '#FFFFFF';
                this.style.borderColor = '#159C2A';
                this.innerHTML = `Close Edit Mode`;
                this.classList.add('rpl-edit-btn-global--active');
            } else {
                this.style.backgroundColor = '';
                this.style.color = '';
                this.style.borderColor = '';
                this.innerHTML = `Edit`;
                this.classList.remove('rpl-edit-btn-global--active');
            }
        });
    }

    rplCard.addEventListener('click', function (e) {
        const editBtnInline = e.target.closest('.rpl-edit-btn-inline');
        const valDisplay = e.target.closest('.rpl-val');
        const cancelBtn = e.target.closest('.rpl-cancel-btn');
        const saveBtn = e.target.closest('.rpl-save-btn');

        if (editBtnInline || valDisplay) {
            e.preventDefault();
            const fieldWrap = (editBtnInline || valDisplay).closest('.rpl-field');
            toggleEditMode(fieldWrap, true);
        }

        if (cancelBtn) {
            e.preventDefault();
            toggleEditMode(cancelBtn.closest('.rpl-field'), false);
            checkRplGlobalState();
        }

        if (saveBtn) {
            e.preventDefault();
            saveFieldData(saveBtn.closest('.rpl-field'));
        }
    });

    function toggleEditMode(fieldWrap, isEditing) {
        const viewMode = fieldWrap.querySelector('.rpl-view-mode');
        const editMode = fieldWrap.querySelector('.rpl-edit-mode');
        const valDisplay = fieldWrap.querySelector('.rpl-val');
        const input = fieldWrap.querySelector('.rpl-input');

        if (isEditing) {
            if (input && input.type === 'date' && valDisplay) {
                input.value = parseDateToInputFormat(valDisplay.textContent.trim());
            } else if (input && valDisplay) {
                const currentVal = valDisplay.textContent.trim();
                input.value = currentVal === '—' ? '' : currentVal;
            }

            viewMode.style.display = 'none';
            editMode.style.display = 'flex';
        } else {
            viewMode.style.display = 'flex';
            editMode.style.display = 'none';
            if (input) input.style.borderColor = '';
        }
    }

    function saveFieldData(fieldWrap) {
        const input = fieldWrap.querySelector('.rpl-input');
        if (!input) return;

        if (!validateFormFields([input])) return;

        const fieldName = input.getAttribute('name');
        const fieldValue = input.value;
        const valDisplay = fieldWrap.querySelector('.rpl-val');
        const isDatePicker = fieldWrap.getAttribute('data-field').includes('date') || input.closest('.custom-calendar');

        if (isDatePicker) {
            valDisplay.textContent = fieldValue || '—';
        } else if (valDisplay.tagName === 'A') {
            if (fieldValue) {
                const urlVal = fieldValue.startsWith('http') ? fieldValue : `https://${fieldValue}`;
                valDisplay.href = urlVal;
                valDisplay.textContent = fieldValue;
            } else {
                valDisplay.removeAttribute('href');
                valDisplay.textContent = '—';
            }
        } else {
            valDisplay.textContent = fieldValue || '—';
        }

        toggleEditMode(fieldWrap, false);
        checkRplGlobalState();
    }
});

// --- БЛОК 6: PIPELINE FILTER ---
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
            if (checkedItems.includes(item)) checkbox.checked = true;

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
        const selectedValues = Array.from(filterList.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);

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
            if (currentFilterButton) currentFilterButton.classList.remove('filtered');
        }

        applyAllFilters();
        closePopup();
    });
});

// --- БЛОК 7: DOCUMENTS ---
document.addEventListener('DOMContentLoaded', function () {
    const docOpenAddBtn = document.getElementById('docOpenAddBtn');
    const docClosePopupBtn = document.getElementById('docClosePopupBtn');
    const docOverlay = document.getElementById('docOverlay');
    const docPopup = document.getElementById('docPopup');

    const docDropzone = document.getElementById('docDropzone');
    const docFileInput = document.getElementById('docFileInput');
    const docBrowseBtn = document.getElementById('docBrowseBtn');
    const docPreviewList = document.getElementById('docPreviewList');
    const docSubmitBtn = document.getElementById('docSubmitBtn');
    const docListBody = document.getElementById('docListBody');

    let selectedFiles = [];

    function getFileIconClass(extension) {
        return ['doc', 'docx'].includes(extension) ? 'icon-doc' : 'icon-pdf';
    }

    function openDocPopup() {
        docOverlay.classList.add('active');
        docPopup.classList.add('active');
    }

    function closeDocPopup() {
        docOverlay.classList.remove('active');
        docPopup.classList.remove('active');
        selectedFiles = [];
        docFileInput.value = '';
        renderPreview();
    }

    docOpenAddBtn?.addEventListener('click', openDocPopup);
    docClosePopupBtn?.addEventListener('click', closeDocPopup);
    docOverlay?.addEventListener('click', closeDocPopup);

    docBrowseBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        docFileInput.click();
    });

    docFileInput?.addEventListener('change', (e) => handleFiles(e.target.files));

    docDropzone?.addEventListener('dragover', (e) => {
        e.preventDefault();
        docDropzone.classList.add('dragover');
    });

    docDropzone?.addEventListener('dragleave', () => docDropzone.classList.remove('dragover'));

    docDropzone?.addEventListener('drop', (e) => {
        e.preventDefault();
        docDropzone.classList.remove('dragover');
        if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
    });

    function handleFiles(files) {
        Array.from(files).forEach(file => selectedFiles.push(file));
        renderPreview();
    }

    function renderPreview() {
        docPreviewList.innerHTML = '';
        selectedFiles.forEach(file => {
            const item = document.createElement('div');
            item.className = 'doc-preview-item';
            item.textContent = `${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
            docPreviewList.appendChild(item);
        });
    }

    function formatDate() {
        const d = new Date();
        const mo = String(d.getMonth() + 1).padStart(2, '0');
        const da = String(d.getDate()).padStart(2, '0');
        const yr = d.getFullYear();
        let hr = d.getHours();
        const min = String(d.getMinutes()).padStart(2, '0');
        const ampm = hr >= 12 ? 'PM' : 'AM';
        hr = hr % 12 || 12;
        return `${mo}/${da}/${yr} ${String(hr).padStart(2, '0')}:${min} • ${ampm}`;
    }

    docSubmitBtn?.addEventListener('click', () => {
        if (selectedFiles.length === 0) return;

        selectedFiles.forEach(file => {
            const ext = file.name.split('.').pop().toLowerCase();
            const iconClass = getFileIconClass(ext);
            const dateStr = formatDate();
            const sizeStr = (file.size / 1024).toFixed(1);

            const row = document.createElement('div');
            row.className = 'doc-row';

            row.innerHTML = `
                <div class="doc-cell-icon ${iconClass}"></div>
                <div class="doc-cell-info">
                    <div class="doc-name">${file.name}</div>
                    <div class="doc-meta">${dateStr} Uploaded By: Current User</div>
                </div>
                <div class="doc-cell-size">File size: ${sizeStr} KB</div>
                <div class="doc-cell-type">File type: ${ext.toUpperCase()}</div>
            `;
            docListBody.insertBefore(row, docListBody.firstChild);
        });
        closeDocPopup();
    });
});

// --- БЛОК 8: ACTIVITY HISTORY ---
document.addEventListener('DOMContentLoaded', function () {
    const ahTab = document.getElementById('tab-activity_history');
    if (!ahTab) return;

    ahTab.addEventListener('click', function (e) {
        const header = e.target.closest('.ah-header');
        if (header) header.closest('.ah-block').classList.toggle('is-expanded');
    });
});

// --- БЛОК 9: PAYMENTS ---
document.addEventListener('DOMContentLoaded', function () {
    const payTab = document.getElementById('tab-payments');
    if (!payTab) return;

    const jsonData_2025 = {
        year: '2025', total_due: '10,800.00', total_paid: '7,135.00', total: '10,800.00',
        data: [{ itm_id: '24', payment_date: '05/16/2024', payment_amount: '28,000.00', payment_type: 'Ria', payment_details: 'This Text message 2', deals_paid: [{ name: 'Item Name Text 4882345657568', url: 'pathto?itm=877' }] }]
    };

    const dealsPaidData = [
        { id: '10', name: 'Item Name Text 4882345657568' },
        { id: '11', name: 'Item Name Text 675678356' },
        { id: '12', name: 'Item Name Text 4356347889769' },
        { id: '13', name: 'Item Name Text 789789' }
    ];

    let currentYear = '2025';
    const dataByYear = { '2025': jsonData_2025 };

    const payTableBody = document.getElementById('payTableBody');
    const payYearSelector = document.getElementById('payYearSelector');
    const payYearDropdown = document.getElementById('payYearDropdown');
    const payYearList = document.getElementById('payYearList');
    const paySelectedYear = document.getElementById('paySelectedYear');
    const payYearArrow = document.getElementById('payYearArrow');

    const payAddOverlay = document.getElementById('payAddOverlay');
    const payAddPopup = document.getElementById('payAddPopup');
    const payDeleteOverlay = document.getElementById('payDeleteOverlay');
    const payDeletePopup = document.getElementById('payDeletePopup');

    let currentDeleteId = null;
    let activePayEditRow = null; // Флаг для режима редактирования

    initYearDropdown();
    renderData();
    populateAddPopupList();

    payYearSelector.addEventListener('click', (e) => {
        e.stopPropagation();
        payYearDropdown.classList.toggle('active');
        if (payYearArrow) payYearArrow.style.transform = payYearDropdown.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
    });

    payYearList.addEventListener('click', (e) => {
        if (e.target.tagName === 'LI') {
            currentYear = e.target.textContent;
            paySelectedYear.textContent = currentYear;
            renderData();
        }
    });

    function initYearDropdown() {
        payYearList.innerHTML = '';
        Object.keys(dataByYear).sort((a, b) => b - a).forEach(yr => {
            const li = document.createElement('li');
            li.textContent = yr;
            payYearList.appendChild(li);
        });
    }

    function calculateTotals() {
        const dataArr = dataByYear[currentYear].data;
        const totalAmount = dataArr.reduce((sum, item) => sum + parseFloat(item.payment_amount.replace(/,/g, '')), 0);
        const formatted = totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        dataByYear[currentYear].total = formatted;
        dataByYear[currentYear].total_due = formatted;
        dataByYear[currentYear].total_paid = formatted;
    }

    function renderData() {
        calculateTotals();
        const dataObj = dataByYear[currentYear];

        document.getElementById('payTotalDue').textContent = `$${dataObj.total_due}`;
        document.getElementById('payTotalPaid').textContent = `$${dataObj.total_paid}`;
        document.getElementById('payTotal').textContent = `$${dataObj.total}`;

        payTableBody.innerHTML = '';
        dataObj.data.forEach(item => {
            const row = document.createElement('div');
            row.className = 'pay-row';
            row.setAttribute('data-id', item.itm_id);

            let linksHtml = '';
            let btnHtml = '';
            if (item.deals_paid && item.deals_paid.length > 0) {
                const links = item.deals_paid.map(deal => `<li><a href="${deal.url || '#'}" target="_blank">${deal.name}</a></li>`).join('');
                linksHtml = `<ul class="pay-notes-list">${links}</ul>`;
                btnHtml = `<button class="pay-btn-more"></button>`;
            }

            const selectedDealIds = item.deals_paid ? item.deals_paid.map(dp => {
                const found = dealsPaidData.find(d => d.name === dp.name);
                return found ? found.id : null;
            }).filter(Boolean) : [];

            // Убрали инлайн инпуты, оставили только отображение (pay-view)
            row.innerHTML = `
                <div class="pay-cell" data-field="payment_date">
                    <div class="pay-view pay-val">${item.payment_date}</div>
                </div>
                <div class="pay-cell" data-field="payment_amount">
                    <div class="pay-view pay-val">$${item.payment_amount}</div>
                </div>
                <div class="pay-cell" data-field="payment_type">
                    <div class="pay-view pay-val">${item.payment_type}</div>
                </div>
                <div class="pay-cell" data-field="payment_details">
                    <div class="pay-view">
                        <div class="pay-notes-wrapper">
                            <div class="pay-val">${item.payment_details}</div>
                            ${linksHtml}
                            ${btnHtml}
                            <input type="hidden" class="pay-deals-hidden" value='${JSON.stringify(selectedDealIds)}'>
                        </div>
                    </div>
                </div>
                <div class="pay-cell pay-center">
                    <div class="pay-view pay-actions">
                        <button class="pay-icon-btn pay-icon-btn-edit"></button>
                        <button class="pay-icon-btn pay-icon-btn-delete"></button>
                    </div>
                </div>
            `;
            payTableBody.appendChild(row);
        });
    }

    // Обработка кликов в таблице (Открытие попапа на Edit)
    payTableBody.addEventListener('click', (e) => {
        const btnMore = e.target.closest('.pay-btn-more');
        const btnEdit = e.target.closest('.pay-icon-btn-edit');
        const btnDelete = e.target.closest('.pay-icon-btn-delete');
        const row = e.target.closest('.pay-row');

        if (btnMore) {
            btnMore.classList.toggle('is-active');
            const list = btnMore.parentElement.querySelector('.pay-notes-list');
            if (list) list.classList.toggle('is-open');
        }

        if (btnEdit) {
            e.preventDefault();
            activePayEditRow = row;
            row.classList.add('is-active-row'); // Подсвечиваем строку

            const date = row.querySelector('[data-field="payment_date"] .pay-val').textContent.trim();
            const amount = row.querySelector('[data-field="payment_amount"] .pay-val').textContent.replace('$', '').trim();
            const type = row.querySelector('[data-field="payment_type"] .pay-val').textContent.trim();
            const details = row.querySelector('[data-field="payment_details"] .pay-val').textContent.trim();
            const dealsHidden = row.querySelector('.pay-deals-hidden').value;

            // Заполняем форму
            const calendarSpan = document.querySelector('#payAddForm .custom-calendar span');
            if (calendarSpan) calendarSpan.textContent = date;
            const hiddenDateInput = document.querySelector('#payAddForm [data-field="addDate"] input');
            if (hiddenDateInput) {
                hiddenDateInput.value = date;
                if (hiddenDateInput._flatpickr) hiddenDateInput._flatpickr.setDate(date);
            }

            document.getElementById('payAddAmount').value = amount;
            document.getElementById('payAddType').value = type;
            document.getElementById('payAddDetails').value = details;

            const countDisplay = document.getElementById('payAddCharCount');
            if (countDisplay) countDisplay.textContent = `${500 - details.length} characters left`;

            // Обновляем выбранные Deals
            let selectedDeals = [];
            try { selectedDeals = JSON.parse(dealsHidden); } catch (err) { }

            const list = document.querySelector('#payAddDealsWrapper .options-listPay');
            list.querySelectorAll('li .checkbox').forEach(cb => cb.classList.remove('active'));

            selectedDeals.forEach(id => {
                const li = list.querySelector(`li[data-id="${id}"]`);
                if (li) li.querySelector('.checkbox').classList.add('active');
            });
            updateMultiselectTags(document.getElementById('payAddDealsWrapper'));

            document.getElementById('payPopupTitle').textContent = "EDIT PAYMENT";

            payAddOverlay.classList.add('active');
            payAddPopup.classList.add('active');
        }

        if (btnDelete) {
            e.preventDefault();
            currentDeleteId = row.getAttribute('data-id');
            activePayEditRow = row;
            row.classList.add('is-deleting-row');

            payDeleteOverlay.classList.add('active');
            payDeletePopup.classList.add('active');
        }
    });


    /* ФОРМА И ПОПАПЫ */
    const addForm = document.getElementById('payAddForm');
    const addAmount = document.getElementById('payAddAmount');
    const addDetails = document.getElementById('payAddDetails');
    const addCharCount = document.getElementById('payAddCharCount');

    if (addDetails) {
        addDetails.addEventListener('input', () => {
            addCharCount.textContent = `${500 - addDetails.value.length} characters left`;
        });
    }

    function populateAddPopupList() {
        const list = document.querySelector('#payAddDealsWrapper .options-listPay');
        if (!list) return;
        dealsPaidData.forEach(deal => {
            const li = document.createElement('li');
            li.setAttribute('data-id', deal.id);
            li.setAttribute('data-name', deal.name);
            // НОВЫЙ ДИЗАЙН ЧЕКБОКСОВ:
            li.innerHTML = `<div class="checkbox"></div>${deal.name}`;
            list.appendChild(li);
        });
    }

    function resetPayForm() {
        if (addForm) {
            addForm.reset();
            addForm.querySelectorAll('input, select, textarea').forEach(i => i.style.borderColor = '');
        }
        if (addCharCount) addCharCount.textContent = '500 characters left';

        const tags = document.querySelector('#payAddDealsWrapper .select-input');
        const list = document.querySelector('#payAddDealsWrapper .options-listPay');
        const hidden = document.getElementById('payAddDeals');

        if (tags) {
            tags.querySelectorAll('.selected-item').forEach(el => el.remove());
        }
        if (hidden) hidden.value = '';
        if (list) list.querySelectorAll('.checkbox').forEach(cb => cb.classList.remove('active'));

        const calendarSpan = document.querySelector('#payAddForm .custom-calendar span');
        if (calendarSpan) calendarSpan.textContent = '-';
        const hiddenDateInput = document.querySelector('#payAddForm [data-field="addDate"] input');
        if (hiddenDateInput && hiddenDateInput._flatpickr) hiddenDateInput._flatpickr.clear();
    }

    function closePayModals() {
        payAddOverlay.classList.remove('active');
        payAddPopup.classList.remove('active');
        payDeleteOverlay.classList.remove('active');
        payDeletePopup.classList.remove('active');

        if (activePayEditRow) {
            activePayEditRow.classList.remove('is-active-row', 'is-deleting-row');
            activePayEditRow = null;
        }
        currentDeleteId = null;
        resetPayForm();
    }

    document.getElementById('payOpenAddBtn')?.addEventListener('click', () => {
        activePayEditRow = null;
        resetPayForm();
        document.getElementById('payPopupTitle').textContent = "ADD NEW";
        payAddOverlay.classList.add('active');
        payAddPopup.classList.add('active');
    });

    document.getElementById('payCloseAddBtn')?.addEventListener('click', closePayModals);

    // Сохранение (Срабатывает и на Add New, и на Edit)
    addForm?.addEventListener('submit', (e) => {
        e.preventDefault();

        let dateInput = document.querySelector('#payAddForm [data-field="addDate"] input');
        const typeInput = document.getElementById('payAddType');
        const detailsInput = addDetails;

        addAmount.classList.add('mask-amount');

        // ВАЛИДАЦИЯ
        if (!validateFormFields([addAmount, typeInput, detailsInput])) return;

        const calendarBox = addForm.querySelector('.custom-calendar');
        if (!dateInput || !dateInput.value || dateInput.value === '-') {
            if (calendarBox) calendarBox.style.borderColor = '#FF496B';
            return;
        } else {
            if (calendarBox) calendarBox.style.borderColor = '#159C2A';
        }

        const dealsHiddenVal = document.getElementById('payAddDeals')?.value || "";
        let selectedDealIds = [];
        if (dealsHiddenVal) {
            try { selectedDealIds = JSON.parse(dealsHiddenVal); } catch (e) { selectedDealIds = []; }
        }

        const dealsObj = selectedDealIds.map(id => {
            const deal = dealsPaidData.find(d => String(d.id) === String(id));
            return { name: deal ? deal.name : 'Unknown', url: '#' };
        });

        if (activePayEditRow) {
            // UPDATE ROW
            const id = activePayEditRow.getAttribute('data-id');
            const item = dataByYear[currentYear].data.find(d => String(d.itm_id) === String(id));

            if (item) {
                item.payment_date = dateInput.value;
                item.payment_amount = addAmount.value;
                item.payment_type = typeInput.value;
                item.payment_details = detailsInput.value;
                item.deals_paid = dealsObj;
            }
        } else {
            // CREATE ROW
            const newItem = {
                itm_id: Date.now().toString(),
                payment_date: dateInput.value,
                payment_amount: addAmount.value,
                payment_type: typeInput.value,
                payment_details: detailsInput.value,
                deals_paid: dealsObj
            };
            if (!dataByYear[currentYear]) dataByYear[currentYear] = { data: [] };
            dataByYear[currentYear].data.unshift(newItem);
        }

        renderData();
        closePayModals();
    });


    // --- ЛОГИКА НОВОГО МУЛЬТИСЕЛЕКТА ---
    document.addEventListener('click', (e) => {
        // 1. Обработка удаления тега (клик по крестику)
        // Выносим эту проверку наверх, чтобы она срабатывала первой
        if (e.target.classList.contains('pay-tag-remove')) {
            e.stopPropagation();
            const id = e.target.getAttribute('data-id');
            const wrapper = e.target.closest('.pay-multiselect-wrapper');

            if (wrapper) {
                // Находим нужный li по data-id и снимаем класс .active с чекбокса
                const li = wrapper.querySelector(`.options-listPay li[data-id="${id}"]`);
                if (li) {
                    const checkbox = li.querySelector('.checkbox');
                    if (checkbox) checkbox.classList.remove('active');
                }
                // Перерисовываем теги без удаленного
                updateMultiselectTags(wrapper);
            }
            return;
        }

        const wrapper = e.target.closest('.pay-multiselect-wrapper');
        const dropdowns = document.querySelectorAll('.options-listPay');

        // 2. Закрытие списка при клике вне элемента
        if (!wrapper) {
            dropdowns.forEach(d => d.classList.remove('show'));
            return;
        }

        const dropdown = wrapper.querySelector('.options-listPay');
        const searchInput = wrapper.querySelector('.search-box');

        // 3. Открытие по клику на поле ввода (.select-input)
        if (e.target.closest('.select-input')) {
            dropdown.classList.add('show');
            if (searchInput && e.target !== searchInput) searchInput.focus();
            return;
        }

        // 4. Обработка клика по опции списка (ставим/снимаем галочку)
        const listItem = e.target.closest('.options-listPay li');
        if (listItem) {
            e.stopPropagation();
            const checkbox = listItem.querySelector('.checkbox');
            if (checkbox) checkbox.classList.toggle('active');
            updateMultiselectTags(wrapper);
            // Не закрываем дропдаун для возможности множественного выбора
            return;
        }
    });

    // Живой поиск
    document.addEventListener('input', (e) => {
        if (e.target.classList.contains('search-box')) {
            const val = e.target.value.toLowerCase();
            const list = e.target.closest('.pay-multiselect-wrapper').querySelector('.options-listPay');
            list.querySelectorAll('li').forEach(li => {
                const text = li.getAttribute('data-name').toLowerCase();
                li.style.display = text.includes(val) ? 'flex' : 'none';
            });
        }
    });

    // Функция обновления визуальных тегов
    function updateMultiselectTags(wrapper) {
        const tagsContainer = wrapper.querySelector('.select-input');
        const hiddenInput = wrapper.querySelector('input[type="hidden"]');
        const activeCheckboxes = wrapper.querySelectorAll('.options-listPay li .checkbox.active');

        // Remove old tags to prevent duplicates
        tagsContainer.querySelectorAll('.selected-item').forEach(el => el.remove());

        const ids = [];

        activeCheckboxes.forEach(checkbox => {
            const li = checkbox.closest('li');
            const id = li.getAttribute('data-id');
            const name = li.getAttribute('data-name');
            ids.push(id);

            const tag = document.createElement('div');
            tag.className = 'selected-item';
            tag.innerHTML = `${name} <span class="pay-tag-remove" data-id="${id}">&#10005;</span>`;

            // Append tag to the end of the container (AFTER the search input)
            tagsContainer.appendChild(tag);
        });

        if (hiddenInput) hiddenInput.value = JSON.stringify(ids);
    }

    // --- УДАЛЕНИЕ ИНВОЙСА ---
    document.getElementById('payCancelDeleteBtn')?.addEventListener('click', closePayModals);
    document.getElementById('payCloseDeleteBtn')?.addEventListener('click', closePayModals);

    document.getElementById('payConfirmDeleteBtn')?.addEventListener('click', () => {
        if (currentDeleteId) {
            const dataArr = dataByYear[currentYear].data;
            const index = dataArr.findIndex(item => String(item.itm_id) === String(currentDeleteId));
            if (index > -1) {
                dataArr.splice(index, 1);
                renderData();
            }
            closePayModals();
        }
    });

});