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

document.addEventListener('DOMContentLoaded', function () {
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
            btnEye.addEventListener('click', () => {
                if (passInput.type === 'password') {
                    passInput.type = 'text';
                    btnEye.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#159C2A" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>';
                } else {
                    passInput.type = 'password';
                    btnEye.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B928C" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
                }
            });
        }

        if (btnGenerate && passInput) {
            btnGenerate.addEventListener('click', () => {
                const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
                let pass = "";
                for (let i = 0; i < 12; i++) {
                    pass += chars.charAt(Math.floor(Math.random() * chars.length));
                }
                passInput.value = pass;
                passInput.type = 'text';
                if (btnEye) {
                    btnEye.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#159C2A" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>';
                }

                navigator.clipboard.writeText(pass).then(() => {
                    const origText = btnGenerate.textContent;
                    btnGenerate.textContent = 'Copied!';
                    setTimeout(() => {
                        btnGenerate.textContent = origText;
                    }, 2000);
                });
            });
        }

        form.querySelectorAll('.lga-input').forEach(input => {
            input.addEventListener('input', () => {
                input.classList.remove('has-error');
            });
        });

        return form;
    }

    const addFormObj = setupFormLogic('lgaAddForm', 'lgaAdd');

    function validateForm(form) {
        let isValid = true;
        form.querySelectorAll('[required]').forEach(input => {
            if (!input.value.trim()) {
                input.classList.add('has-error');
                isValid = false;
            } else if (input.type === 'email') {
                const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!re.test(input.value.trim())) {
                    input.classList.add('has-error');
                    isValid = false;
                }
            }
        });
        return isValid;
    }

    function closeAllModals() {
        lgaOverlay.classList.remove('active');
        lgaAddPopup.classList.remove('active');
        lgaDeletePopup.classList.remove('active');
        if (activeDeleteRow) {
            activeDeleteRow.classList.remove('is-deleting-row');
            activeDeleteRow = null;
        }
    }

    document.getElementById('lgaOpenAddBtn')?.addEventListener('click', () => {
        addFormObj.reset();
        document.getElementById('lgaAddCount').textContent = '500 characters left';
        addFormObj.querySelectorAll('.has-error').forEach(el => el.classList.remove('has-error'));

        lgaOverlay.classList.add('active');
        lgaAddPopup.classList.add('active');
    });

    document.getElementById('lgaCloseAddBtn')?.addEventListener('click', closeAllModals);
    document.getElementById('lgaCancelDeleteBtn')?.addEventListener('click', closeAllModals);
    lgaOverlay?.addEventListener('click', closeAllModals);

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

            if (editBtn) {
                e.preventDefault();
                row.classList.add('is-editing');
            }

            if (cancelBtn) {
                e.preventDefault();
                row.classList.remove('is-editing');
            }

            if (saveBtn) {
                e.preventDefault();
                const cells = row.querySelectorAll('.lga-cell[data-field]');

                cells.forEach(cell => {
                    const input = cell.querySelector('.lga-edit');
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
                lgaDeletePopup.classList.add('active');
            }
        });
    }

    addFormObj?.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateForm(addFormObj)) {
            const formData = new FormData(addFormObj);

            const date = new Date();
            const dateStr = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;
            const dateInputFormat = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

            const fullName = `${formData.get('firstName')} ${formData.get('lastName')}`;
            const email = formData.get('email');
            const phone = formData.get('phone');
            const status = formData.get('status');
            const note = formData.get('note') || '';
            const badgeClass = status === 'Active' ? 'lga-badge-active' : 'lga-badge-inactive';

            const newRow = document.createElement('div');
            newRow.className = 'lga-row';
            newRow.innerHTML = `
                <div class="lga-cell" data-field="date">
                    <span class="lga-view lga-val">${dateStr}</span>
                    <input type="date" class="lga-edit lga-inline-input" value="${dateInputFormat}">
                </div>
                <div class="lga-cell" data-field="fullName">
                    <span class="lga-view lga-val">${fullName}</span>
                    <input type="text" class="lga-edit lga-inline-input" value="${fullName}">
                </div>
                <div class="lga-cell" data-field="email">
                    <span class="lga-view lga-val">${email}</span>
                    <input type="email" class="lga-edit lga-inline-input" value="${email}">
                </div>
                <div class="lga-cell" data-field="phone">
                    <span class="lga-view lga-val">${phone}</span>
                    <input type="text" class="lga-edit lga-inline-input" value="${phone}">
                </div>
                <div class="lga-cell" data-field="status">
                    <span class="lga-view lga-badge ${badgeClass} lga-val">${status}</span>
                    <select class="lga-edit lga-inline-input">
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
                        <button class="lga-icon-btn lga-btn-edit">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8B928C" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button class="lga-icon-btn lga-btn-delete">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8B928C" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                    </div>
                    <div class="lga-edit lga-edit-actions">
                        <button class="lga-btn-save">Save</button>
                        <button class="lga-btn-cancel">Cancel</button>
                    </div>
                </div>
            `;

            lgaTableBody.insertBefore(newRow, lgaTableBody.firstChild);
            closeAllModals();
        }
    });
});