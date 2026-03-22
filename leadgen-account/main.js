// ==========================================
// ГЛОБАЛЬНЫЕ МАСКИ И ВАЛИДАЦИЯ (jQuery Inputmask)
// ==========================================

function applyMasks(container = document) {
    if (typeof $ === 'undefined' || typeof $.fn.inputmask === 'undefined') {
        console.warn('jQuery or jQuery Inputmask is not loaded!');
        return;
    }

    // Маска телефона: (000) 000-0000
    $(container).find('input[type="tel"], input[id*="Phone" i], input[id*="phone" i], input[name*="phone" i], .mask-phone, [data-field="phone"] input').each(function () {
        if (!$(this).hasClass('mask-applied') && $(this).attr('type') !== 'hidden') {
            $(this).inputmask({
                mask: "(999) 999-9999",
                clearIncomplete: true, // Очищает поле, если телефон введен не полностью
                showMaskOnHover: false
            }).addClass('mask-applied');
        }
    });

    // Маска суммы: 999,999,999.99 (если на этой странице тоже понадобятся суммы)
    $(container).find('input[id*="Amount" i], input[name*="amount" i], input[name*="price" i], .mask-amount, [data-field="amount"] input').each(function () {
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

        // 1. Обязательное поле
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
            (input.name && input.name.toLowerCase().includes('phone')) ||
            input.classList.contains('mask-phone') ||
            (input.closest('[data-field="phone"]') !== null);

        if (val !== '' && isPhoneField) {
            const digits = val.replace(/\D/g, '');
            if (digits.length !== 10) isFieldValid = false;
        }

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
// ОСНОВНОЙ СКРИПТ ПАНЕЛИ И ТАБОВ
// ==========================================

const burger = document.getElementById('burger');
const closeBurger = document.getElementById('close_burger');
const sideBar = document.querySelector('.left_cp_bar');
const overlay = document.querySelector('.overlay')

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

// Слушатель изменения размера окна
window.addEventListener('resize', () => {
    toggleContactsPanel(window.innerWidth);
});

// Универсальная функция инициализации календарей
function initCustomDatePickers(container = document) {
    container.querySelectorAll('.custom-calendar').forEach(function (calendarField) {
        if (calendarField.querySelector('.visually-hidden')) return;

        const span = calendarField.querySelector('span');
        const dateValue = span.innerText.trim();

        const input = document.createElement('input');
        input.type = 'text';
        input.value = dateValue;
        input.classList.add('visually-hidden', 'lga-edit', 'lga-inline-input');
        calendarField.appendChild(input);

        flatpickr(input, {
            dateFormat: 'm/d/Y',
            defaultDate: dateValue,
            disableMobile: true,
            positionElement: calendarField,
            static: false,
            monthSelectorType: 'dropdown',
            ignoredFocusElements: [calendarField],

            onChange: function (selectedDates, dateStr) {
                span.innerText = dateStr;
                input.value = dateStr;
            },
        });

        calendarField.addEventListener('click', function (e) {
            e.stopPropagation();
            input._flatpickr.open();
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    // Запускаем инициализацию при загрузке страницы
    initCustomDatePickers();

    const tabButtons = document.querySelectorAll('.pr-tab-btn');
    const tabContents = document.querySelectorAll('.pr-tab-content');

    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Убираем класс active у всех кнопок и контента
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));

                // Добавляем класс active кликнутой кнопке
                button.classList.add('active');

                // Ищем соответствующий контент по data-tab и показываем его
                const tabId = button.getAttribute('data-tab');
                const targetContent = document.getElementById(`tab-${tabId}`);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }
});

// ==========================================
// ЛОГИКА ТАБЛИЦЫ LEADGEN ACCOUNTS
// ==========================================

document.addEventListener('DOMContentLoaded', function () {
    const lgaTableBody = document.getElementById('lgaTableBody');
    const lgaOverlay = document.getElementById('lgaOverlay');
    const lgaAddPopup = document.getElementById('lgaAddPopup');
    const lgaDeletePopup = document.getElementById('lgaDeletePopup');

    let activeDeleteRow = null;

    function formatDateToDisplay(dateStr) {
        if (!dateStr) return '';
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            return `${parts[1]}/${parts[2]}/${parts[0]}`;
        }
        return dateStr;
    }

    function parseDateToInput(dateStr) {
        if (!dateStr) return '';
        const parts = dateStr.split('/');
        if (parts.length === 3) {
            return `${parts[2]}-${parts[0]}-${parts[1]}`;
        }
        return dateStr;
    }

    function setupFormLogic(formId, prefix) {
        const form = document.getElementById(formId);
        if (!form) return;

        const noteInput = document.getElementById(`${prefix}Note`);
        const countDisplay = document.getElementById(`${prefix}Count`);
        const passInput = document.getElementById(`${prefix}Password`);
        const btnEye = document.getElementById(`${prefix}Eye`);
        const btnGenerate = document.getElementById(`${prefix}Generate`);

        if (noteInput && countDisplay) {
            noteInput.addEventListener('input', () => {
                const left = 500 - noteInput.value.length;
                countDisplay.textContent = `${left} characters left`;
            });
        }

        if (btnEye && passInput) {
            if (passInput.getAttribute('type') === 'text') {
                btnEye.classList.add('is-visible');
            }

            btnEye.addEventListener('click', (e) => {
                e.preventDefault();
                const isPassword = passInput.getAttribute('type') === 'password';
                passInput.setAttribute('type', isPassword ? 'text' : 'password');
                btnEye.classList.toggle('is-visible');
            });
        }

        if (btnGenerate && passInput) {
            btnGenerate.addEventListener('click', () => {
                if (btnGenerate.disabled) return;
                btnGenerate.disabled = true;

                const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
                let pass = "";
                for (let i = 0; i < 12; i++) {
                    pass += chars.charAt(Math.floor(Math.random() * chars.length));
                }

                passInput.value = pass;
                passInput.type = 'text';

                if (btnEye) {
                    btnEye.classList.add('is-visible');
                }

                navigator.clipboard.writeText(pass).then(() => {
                    const origText = btnGenerate.textContent;
                    btnGenerate.textContent = 'Copied!';
                    setTimeout(() => {
                        btnGenerate.textContent = origText;
                        btnGenerate.disabled = false;
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy text: ', err);
                    btnGenerate.disabled = false;
                });
            });
        }

        return form;
    }

    const addFormObj = setupFormLogic('lgaAddForm', 'lgaAdd');

    function closeAllModals() {
        lgaOverlay.classList.remove('active');
        if (lgaAddPopup) lgaAddPopup.classList.remove('active');
        if (lgaDeletePopup) lgaDeletePopup.classList.remove('active');
        if (activeDeleteRow) {
            activeDeleteRow.classList.remove('is-deleting-row');
            activeDeleteRow = null;
        }
    }

    document.getElementById('lgaOpenAddBtn')?.addEventListener('click', () => {
        if (addFormObj) {
            addFormObj.reset();
            addFormObj.querySelectorAll('input, select, textarea').forEach(el => el.style.borderColor = '');
        }
        const countDisplay = document.getElementById('lgaAddCount');
        if (countDisplay) countDisplay.textContent = '500 characters left';

        lgaOverlay.classList.add('active');
        if (lgaAddPopup) lgaAddPopup.classList.add('active');
    });

    document.getElementById('lgaCloseAddBtn')?.addEventListener('click', closeAllModals);
    document.getElementById('lgaCloseDeleteBtn')?.addEventListener('click', closeAllModals);
    document.getElementById('lgaCancelDeleteBtn')?.addEventListener('click', closeAllModals);

    document.getElementById('lgaConfirmDeleteBtn')?.addEventListener('click', () => {
        if (activeDeleteRow) {
            activeDeleteRow.remove();
        }
        closeAllModals();
    });

    if (lgaTableBody) {
        lgaTableBody.addEventListener('click', (e) => {
            const editBtn = e.target.closest('.lga-btn-edit');
            const cancelBtn = e.target.closest('.lga-btn-cancel');
            const saveBtn = e.target.closest('.lga-btn-save');
            const deleteBtn = e.target.closest('.lga-btn-delete');
            const row = e.target.closest('.lga-row');

            if (!row) return;

            if (editBtn) {
                e.preventDefault();
                row.classList.add('is-editing');
            }

            if (cancelBtn) {
                e.preventDefault();
                row.classList.remove('is-editing');
                row.querySelectorAll('input, select, textarea').forEach(i => i.style.borderColor = '');
            }

            if (saveBtn) {
                e.preventDefault();

                // ВАЛИДАЦИЯ ИНЛАЙН СТРОКИ ПЕРЕД СОХРАНЕНИЕМ
                const inputsToValidate = row.querySelectorAll('input.lga-inline-input, select.lga-inline-input');
                if (!validateFormFields(Array.from(inputsToValidate))) return;

                const cells = row.querySelectorAll('.lga-cell[data-field]');

                cells.forEach(cell => {
                    const input = cell.querySelector('input.lga-inline-input, select.lga-inline-input');
                    const view = cell.querySelector('.lga-val');

                    if (input && view) {
                        let val = input.value;

                        if (input.type === 'date') {
                            val = formatDateToDisplay(val);
                        }

                        view.textContent = val;

                        if (cell.getAttribute('data-field') === 'status') {
                            view.className = 'lga-view lga-badge lga-val';
                            if (val === 'Active') {
                                view.classList.add('lga-badge-active');
                            } else {
                                view.classList.add('lga-badge-inactive');
                            }
                        }
                    }
                });

                row.classList.remove('is-editing');
            }

            if (deleteBtn) {
                e.preventDefault();
                activeDeleteRow = row;
                activeDeleteRow.classList.add('is-deleting-row');
                lgaOverlay.classList.add('active');
                if (lgaDeletePopup) lgaDeletePopup.classList.add('active');
            }
        });
    }

    addFormObj?.addEventListener('submit', (e) => {
        e.preventDefault();

        // ВАЛИДАЦИЯ ПОПАПА
        const inputs = Array.from(addFormObj.querySelectorAll('input, select, textarea'));

        // Делаем нужные поля required перед проверкой
        const emailInput = addFormObj.querySelector('input[type="email"], input[name*="email" i], input[id*="email" i]');
        const phoneInput = addFormObj.querySelector('input[type="tel"], input[name*="phone" i], input[id*="phone" i]');
        if (emailInput) emailInput.setAttribute('required', 'true');
        if (phoneInput) phoneInput.setAttribute('required', 'true');

        if (validateFormFields(inputs)) {
            const formData = new FormData(addFormObj);

            const date = new Date();
            const dateStr = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;

            const fullName = `${formData.get('firstName') || ''} ${formData.get('lastName') || ''}`.trim() || 'New User';

            // Если formData не подхватила имя, достаем через ID (если в HTML не прописаны name="")
            const fName = addFormObj.querySelector('#addFirstName') ? addFormObj.querySelector('#addFirstName').value : (formData.get('firstName') || '');
            const lName = addFormObj.querySelector('#addLastName') ? addFormObj.querySelector('#addLastName').value : (formData.get('lastName') || '');
            const finalFullName = (fName + ' ' + lName).trim() || fullName;

            // Достаем email и телефон (с маской)
            const email = (emailInput ? emailInput.value : formData.get('email')) || '';
            const phone = (phoneInput ? phoneInput.value : formData.get('phone')) || '';

            const statusSelect = addFormObj.querySelector('#addStatus');
            const status = statusSelect ? statusSelect.value : (formData.get('status') || 'Active');

            const noteInput = addFormObj.querySelector('#lgaAddNote, textarea');
            const note = noteInput ? noteInput.value : (formData.get('note') || '');

            const badgeClass = status === 'Active' ? 'lga-badge-active' : 'lga-badge-inactive';

            const newRow = document.createElement('div');
            newRow.className = 'lga-row';
            newRow.innerHTML = `
                <div class="lga-cell" data-field="date">
                    <span class="lga-view lga-val">${dateStr}</span>
                    <div class="lga-edit" style="width: 100%;"> 
                        <div class="custom-calendar">
                            <span>${dateStr}</span>
                        </div>
                    </div>
                </div>
                <div class="lga-cell" data-field="fullName">
                    <span class="lga-view lga-val">${finalFullName}</span>
                    <input type="text" class="lga-edit lga-inline-input" value="${finalFullName}" required>
                </div>
                <div class="lga-cell" data-field="email">
                    <span class="lga-view lga-val">${email}</span>
                    <input type="email" class="lga-edit lga-inline-input" value="${email}" required>
                </div>
                <div class="lga-cell" data-field="phone">
                    <span class="lga-view lga-val">${phone}</span>
                    <input type="tel" class="lga-edit lga-inline-input mask-phone" value="${phone}" required>
                </div>
                <div class="lga-cell" data-field="status">
                    <span class="lga-view lga-badge ${badgeClass} lga-val">${status}</span>
                    <select class="lga-edit lga-inline-input" required>
                        <option value="Active" ${status === 'Active' ? 'selected' : ''}>Active</option>
                        <option value="Not active" ${status === 'Not active' ? 'selected' : ''}>Not active</option>
                    </select>
                </div>
                <div class="lga-cell" data-field="note">
                    <span class="lga-view lga-val">${note}</span>
                    <input type="text" class="lga-edit lga-inline-input" value="${note}">
                </div>
                <div class="lga-cell lga-center">
                    <div class="lga-view lga-actions">
                        <button class="lga-icon-btn lga-btn-edit"></button>
                        <button class="lga-icon-btn lga-btn-delete"></button>
                    </div>
                    <div class="lga-edit lga-edit-actions">
                        <button class="lga-btn-save">Save</button>
                        <button class="lga-btn-cancel">Cancel</button>
                    </div>
                </div>
            `;

            lgaTableBody.insertBefore(newRow, lgaTableBody.firstChild);

            // Инициализируем календарь и маску для новой строки
            initCustomDatePickers(newRow);
            applyMasks(newRow);

            closeAllModals();
        }
    });
});