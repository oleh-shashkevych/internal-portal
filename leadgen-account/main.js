// ==========================================
// ГЛОБАЛЬНЫЕ МАСКИ И ВАЛИДАЦИЯ (jQuery Inputmask)
// ==========================================

function applyMasks(container = document) {
    if (typeof $ === 'undefined' || typeof $.fn.inputmask === 'undefined') {
        console.warn('jQuery or jQuery Inputmask is not loaded!');
        return;
    }

    // Маска телефона: (000) 000-0000
    $(container).find('input[name*="phone" i], .mask-phone, [data-field="phone"] input').each(function () {
        if (!$(this).hasClass('mask-applied') && $(this).attr('type') !== 'hidden') {
            $(this).inputmask({
                mask: "(999) 999-9999",
                clearIncomplete: true,
                showMaskOnHover: false
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

        // 3. Строгая проверка Телефона (ровно 10 цифр)
        const isPhoneField = input.type === 'tel' ||
            (input.name && input.name.toLowerCase().includes('phone')) ||
            input.classList.contains('mask-phone');

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
// ОСНОВНОЙ СКРИПТ (САЙДБАР)
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
    initCustomDatePickers();
});


// ==========================================
// ЛОГИКА ТАБЛИЦЫ LEADGEN ACCOUNTS
// ==========================================

document.addEventListener('DOMContentLoaded', function () {
    const lgaTableBody = document.getElementById('lgaTableBody');
    const lgaOverlay = document.getElementById('lgaOverlay');
    const lgaAddPopup = document.getElementById('lgaAddPopup');
    const lgaDeletePopup = document.getElementById('lgaDeletePopup');

    let activeLgaEditRow = null; // Флаг для отслеживания редактируемой строки
    let activeDeleteRow = null;

    function formatDateToDisplay(dateStr) {
        if (!dateStr) return '';
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            return `${parts[1]}/${parts[2]}/${parts[0]}`;
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
        if (lgaOverlay) lgaOverlay.classList.remove('active');
        if (lgaAddPopup) lgaAddPopup.classList.remove('active');
        if (lgaDeletePopup) lgaDeletePopup.classList.remove('active');

        if (activeLgaEditRow) {
            activeLgaEditRow.classList.remove('is-editing'); // Снимаем выделение
            activeLgaEditRow = null;
        }

        if (activeDeleteRow) {
            activeDeleteRow.classList.remove('is-deleting-row');
            activeDeleteRow = null;
        }
    }

    // Открытие попапа на СОЗДАНИЕ
    document.getElementById('lgaOpenAddBtn')?.addEventListener('click', () => {
        activeLgaEditRow = null; // Сбрасываем флаг редактирования

        if (addFormObj) {
            addFormObj.reset();
            addFormObj.querySelectorAll('input, select, textarea').forEach(el => el.style.borderColor = '');
        }

        const countDisplay = document.getElementById('lgaAddCount');
        if (countDisplay) countDisplay.textContent = '500 characters left';

        const popupTitle = document.querySelector('#lgaAddPopup h2');
        if (popupTitle) popupTitle.textContent = "Add New Account";

        if (lgaOverlay) lgaOverlay.classList.add('active');
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

    // Обработка кликов в таблице
    if (lgaTableBody) {
        lgaTableBody.addEventListener('click', (e) => {
            const editBtn = e.target.closest('.lga-btn-edit');
            const deleteBtn = e.target.closest('.lga-btn-delete');
            const row = e.target.closest('.lga-row');

            if (!row) return;

            // КЛИК НА РЕДАКТИРОВАНИЕ (ОТКРЫВАЕТ ПОПАП)
            if (editBtn) {
                e.preventDefault();
                activeLgaEditRow = row;
                row.classList.add('is-editing'); // Добавляем подсветку строки

                // Извлекаем данные
                const fullName = row.querySelector('[data-field="fullName"] .lga-val').textContent.trim();
                const email = row.querySelector('[data-field="email"] .lga-val').textContent.trim();
                const phone = row.querySelector('[data-field="phone"] .lga-val').textContent.trim();
                const status = row.querySelector('[data-field="status"] .lga-val').textContent.trim();
                const note = row.querySelector('[data-field="note"] .lga-val').textContent.trim();

                // Разбиваем имя для инпутов формы
                const names = fullName.split(' ');
                const firstName = names[0] || '';
                const lastName = names.slice(1).join(' ') || '';

                // Заполняем форму
                const form = document.getElementById('lgaAddForm');
                if (form) {
                    form.querySelector('input[name="firstName"]').value = firstName;
                    form.querySelector('input[name="lastName"]').value = lastName;
                    form.querySelector('input[name="email"]').value = email;
                    form.querySelector('input[name="phone"]').value = phone;
                    form.querySelector('input[name="username"]').value = ''; // В таблице нет username
                    form.querySelector('input[name="password"]').value = ''; // Пароль не достаем

                    const statusSelect = form.querySelector('select[name="status"]');
                    if (statusSelect) {
                        for (let i = 0; i < statusSelect.options.length; i++) {
                            if (statusSelect.options[i].text === status) statusSelect.selectedIndex = i;
                        }
                    }

                    const noteArea = form.querySelector('textarea[name="note"]');
                    if (noteArea) {
                        noteArea.value = note;
                        const countDisplay = document.getElementById('lgaAddCount');
                        if (countDisplay) countDisplay.textContent = `${500 - note.length} characters left`;
                    }

                    // Очищаем ошибки
                    form.querySelectorAll('.lga-input, .lga-textarea').forEach(el => el.style.borderColor = '');
                }

                // Меняем заголовок
                const popupTitle = document.querySelector('#lgaAddPopup h2');
                if (popupTitle) popupTitle.textContent = "Edit Account";

                if (lgaOverlay) lgaOverlay.classList.add('active');
                if (lgaAddPopup) lgaAddPopup.classList.add('active');
            }

            if (deleteBtn) {
                e.preventDefault();
                activeDeleteRow = row;
                activeDeleteRow.classList.add('is-deleting-row');
                if (lgaOverlay) lgaOverlay.classList.add('active');
                if (lgaDeletePopup) lgaDeletePopup.classList.add('active');
            }
        });
    }

    // СОХРАНЕНИЕ ДАННЫХ ИЗ ПОПАПА (Create / Update)
    addFormObj?.addEventListener('submit', (e) => {
        e.preventDefault();

        // 1. Собираем инпуты для валидации
        const inputsToValidate = Array.from(addFormObj.querySelectorAll('input:not([type="hidden"]), select, textarea'));

        // 2. Убеждаемся что нужные поля отмечены required
        const emailInput = addFormObj.querySelector('input[name="email"]');
        const phoneInput = addFormObj.querySelector('input[name="phone"]');
        if (emailInput) emailInput.setAttribute('required', 'true');
        if (phoneInput) phoneInput.setAttribute('required', 'true');

        // 3. Валидация
        if (!validateFormFields(inputsToValidate)) return;

        // 4. Сбор данных
        const formData = new FormData(addFormObj);

        const date = new Date();
        const dateStr = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;

        const fName = formData.get('firstName') || '';
        const lName = formData.get('lastName') || '';
        const fullName = `${fName} ${lName}`.trim() || 'New User';

        const email = formData.get('email') || '';
        const phone = formData.get('phone') || '';
        const status = formData.get('status') || 'Active';
        const note = formData.get('note') || '';

        const badgeClass = status === 'Active' ? 'lga-badge-active' : 'lga-badge-inactive';

        if (activeLgaEditRow) {
            // UPDATE ROW
            activeLgaEditRow.querySelector('[data-field="fullName"] .lga-val').textContent = fullName;
            activeLgaEditRow.querySelector('[data-field="email"] .lga-val').textContent = email;
            activeLgaEditRow.querySelector('[data-field="phone"] .lga-val').textContent = phone;
            activeLgaEditRow.querySelector('[data-field="note"] .lga-val').textContent = note;

            const statusBadge = activeLgaEditRow.querySelector('[data-field="status"] .lga-val');
            if (statusBadge) {
                statusBadge.textContent = status;
                statusBadge.className = `lga-view lga-badge ${badgeClass} lga-val`;
            }

        } else {
            // CREATE NEW ROW
            const newRow = document.createElement('div');
            newRow.className = 'lga-row';

            // В HTML мы оставляем только .lga-view (т.к. редактирование теперь только в попапе)
            newRow.innerHTML = `
                <div class="lga-cell" data-field="date">
                    <span class="lga-view lga-val">${dateStr}</span>
                </div>
                <div class="lga-cell" data-field="fullName">
                    <span class="lga-view lga-val">${fullName}</span>
                </div>
                <div class="lga-cell" data-field="email">
                    <span class="lga-view lga-val">${email}</span>
                </div>
                <div class="lga-cell" data-field="phone">
                    <span class="lga-view lga-val">${phone}</span>
                </div>
                <div class="lga-cell" data-field="status">
                    <span class="lga-view lga-badge ${badgeClass} lga-val">${status}</span>
                </div>
                <div class="lga-cell" data-field="note">
                    <span class="lga-view lga-val">${note}</span>
                </div>
                <div class="lga-cell lga-center">
                    <div class="lga-view lga-actions">
                        <button class="lga-icon-btn lga-btn-edit"></button>
                        <button class="lga-icon-btn lga-btn-delete"></button>
                    </div>
                </div>
            `;

            lgaTableBody.insertBefore(newRow, lgaTableBody.firstChild);
            applyMasks(newRow); // Применяем маски, если они нужны в отображении
        }

        closeAllModals();
    });
});