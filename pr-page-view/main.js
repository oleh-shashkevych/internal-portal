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
    const referralBlock = document.querySelector('.pr-referral-block');
    const lpGlobalEditBtn = document.getElementById('lpGlobalEditBtn');

    if (!referralBlock) return;

    let isLpGlobalEditActive = false;

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
            } else {
                this.style.backgroundColor = '';
                this.style.color = '';
                this.style.borderColor = '';
                this.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg> Edit`;
            }
        });
    }

    referralBlock.addEventListener('click', function (e) {
        const editBtn = e.target.closest('.pr-edit-btn');
        const cancelBtn = e.target.closest('.pr-cancel-btn');
        const saveBtn = e.target.closest('.pr-save-btn');
        const copyBtn = e.target.closest('.pr-copy-btn');

        if (editBtn) {
            e.preventDefault();
            const fieldWrap = editBtn.closest('.pr-inline-field');
            toggleEditMode(fieldWrap, true);
        }

        if (cancelBtn) {
            e.preventDefault();
            const fieldWrap = cancelBtn.closest('.pr-inline-field');
            toggleEditMode(fieldWrap, false);
        }

        if (saveBtn) {
            e.preventDefault();
            const fieldWrap = saveBtn.closest('.pr-inline-field');
            saveInlineData(fieldWrap);
        }

        if (copyBtn) {
            e.preventDefault();
            const fieldWrap = copyBtn.closest('.pr-inline-field');
            copyToClipboard(fieldWrap, copyBtn);
        }
    });

    function toggleEditMode(fieldWrap, isEditing) {
        const viewMode = fieldWrap.querySelector('.pr-view-mode');
        const editMode = fieldWrap.querySelector('.pr-edit-mode');

        if (isEditing) {
            viewMode.style.display = 'none';
            editMode.style.display = 'flex';

            const input = editMode.querySelector('.pr-edit-input');
            if (input) input.focus();
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

        const fieldName = input.getAttribute('name');
        let fieldValue = input.value;

        if (input.type === 'file') {
            fieldValue = input.files[0] ? input.files[0].name : '';
        }

        if (input.hasAttribute('required') && !fieldValue.toString().trim()) {
            input.style.borderColor = '#FF496B';
            return;
        }

        const payload = {
            [fieldName]: fieldValue
        };

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
    }

    function copyToClipboard(fieldWrap, btnElement) {
        const input = fieldWrap.querySelector('.pr-edit-input');
        if (!input || !input.value) return;

        navigator.clipboard.writeText(input.value).then(() => {
            const originalHTML = btnElement.innerHTML;
            btnElement.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#159C2A" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
            btnElement.style.borderColor = '#159C2A';

            setTimeout(() => {
                btnElement.innerHTML = originalHTML;
                btnElement.style.borderColor = '';
            }, 2000);
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const tableContainer = document.querySelector('.ab-table-container');
    const tableBody = document.querySelector('.ab-table-body');
    const addAccountOverlay = document.getElementById('addAccountOverlay');
    const addAccountPopup = document.getElementById('addAccountPopup');
    const convertOverlay = document.getElementById('convertOverlay');
    const convertPopup = document.getElementById('convertPopup');
    const popupSaveBtn = document.querySelector('#addAccountPopup .btn-apply');

    let activeConvertRow = null;

    function clearAddAccountForm() {
        document.getElementById('addFirstName').value = '';
        document.getElementById('addLastName').value = '';
        document.getElementById('addPhone').value = '';
        document.getElementById('addEmail').value = '';
        document.getElementById('addPassword').value = '';
        document.getElementById('addStatus').value = '';

        const pInput = document.getElementById('addPassword');
        if (pInput) pInput.type = 'password';

        const eyeBtn = document.getElementById('togglePasswordBtn');
        if (eyeBtn) eyeBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B928C" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
    }

    document.getElementById('openAddAccountBtn')?.addEventListener('click', () => {
        addAccountOverlay.classList.add('active');
        addAccountPopup.classList.add('active');
    });

    document.getElementById('closeAddAccountBtn')?.addEventListener('click', () => {
        addAccountOverlay.classList.remove('active');
        addAccountPopup.classList.remove('active');
        clearAddAccountForm();
    });

    document.getElementById('closeConvertBtn')?.addEventListener('click', () => {
        closeConvertModal();
    });

    document.getElementById('confirmConvertBtn')?.addEventListener('click', () => {
        closeConvertModal();
    });

    if (tableContainer) {
        tableContainer.addEventListener('click', function (e) {
            const editBtn = e.target.closest('.ab-btn-edit');
            const cancelBtn = e.target.closest('.ab-btn-cancel');
            const saveBtn = e.target.closest('.ab-btn-save');
            const convertBtn = e.target.closest('.ab-btn-convert');
            const deleteBtn = e.target.closest('.ab-btn-delete');

            if (editBtn) {
                const row = editBtn.closest('.ab-row');
                row.classList.add('is-editing');
                row.classList.add('is-active-row');
            }

            if (cancelBtn) {
                const row = cancelBtn.closest('.ab-row');
                row.classList.remove('is-editing');
                row.classList.remove('is-active-row');
            }

            if (saveBtn) {
                const row = saveBtn.closest('.ab-row');
                saveRowData(row);
                row.classList.remove('is-editing');
                row.classList.remove('is-active-row');
            }

            if (convertBtn) {
                activeConvertRow = convertBtn.closest('.ab-row');
                activeConvertRow.classList.add('is-active-row');
                convertOverlay.classList.add('active');
                convertPopup.classList.add('active');
            }

            // if (deleteBtn) {
            //     if (confirm('Are you sure you want to delete this account?')) {
            //         const row = deleteBtn.closest('.ab-row');
            //         if (row) row.remove();
            //     }
            // }
        });
    }

    if (popupSaveBtn && tableBody) {
        popupSaveBtn.addEventListener('click', () => {
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

            const newRow = document.createElement('div');
            newRow.className = 'ab-row';
            newRow.innerHTML = `
                <div class="ab-cell" data-field="fullName">
                    <span class="ab-view">${fullName}</span>
                    <input type="text" class="ab-edit ab-input" value="${fullName}">
                </div>
                <div class="ab-cell" data-field="email">
                    <span class="ab-view">${email}</span>
                    <input type="email" class="ab-edit ab-input" value="${email}">
                </div>
                <div class="ab-cell" data-field="phone">
                    <span class="ab-view">${phone}</span>
                    <input type="text" class="ab-edit ab-input" value="${phone}">
                </div>
                <div class="ab-cell" data-field="status">
                    <span class="ab-view ab-badge ${badgeClass}">${displayStatus}</span>
                    <select class="ab-edit ab-input">
                        <option value="Active" ${displayStatus === 'Active' ? 'selected' : ''}>Active</option>
                        <option value="Deleted" ${displayStatus === 'Deleted' ? 'selected' : ''}>Deleted</option>
                        <option value="Not Active" ${displayStatus === 'Not Active' ? 'selected' : ''}>Not Active</option>
                        <option value="The user is blocked" ${displayStatus === 'The user is blocked' ? 'selected' : ''}>The user is blocked</option>
                        <option value="The user passes additional moderation" ${displayStatus === 'The user passes additional moderation' ? 'selected' : ''}>The user passes additional moderation</option>
                    </select>
                </div>
                <div class="ab-cell">
                    <div class="ab-view ab-actions">
                        <button class="ab-btn-convert">Convert</button>
                        <button class="ab-btn-icon ab-btn-edit">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8B928C" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button class="ab-btn-icon ab-btn-delete">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8B928C" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                    </div>
                    <div class="ab-edit ab-edit-actions">
                        <button class="ab-btn-save">Save</button>
                        <button class="ab-btn-cancel">Cancel</button>
                    </div>
                </div>
            `;

            tableBody.appendChild(newRow);

            clearAddAccountForm();

            addAccountOverlay.classList.remove('active');
            addAccountPopup.classList.remove('active');
        });
    }

    function closeConvertModal() {
        convertOverlay.classList.remove('active');
        convertPopup.classList.remove('active');
        if (activeConvertRow) {
            activeConvertRow.classList.remove('is-active-row');
            activeConvertRow = null;
        }
    }

    function saveRowData(row) {
        const cells = row.querySelectorAll('.ab-cell[data-field]');
        cells.forEach(cell => {
            const input = cell.querySelector('.ab-edit');
            const view = cell.querySelector('.ab-view');

            if (input && view) {
                const val = input.value;
                if (input.tagName === 'SELECT') {
                    view.textContent = val;
                    updateBadgeClass(view, val);
                } else {
                    view.textContent = val;
                }
            }
        });
    }

    function updateBadgeClass(badgeElement, statusText) {
        badgeElement.className = 'ab-view ab-badge';
        if (statusText === 'Active') {
            badgeElement.classList.add('ab-badge-active');
        } else if (statusText === 'The user passes additional moderation') {
            badgeElement.classList.add('ab-badge-moderation');
        } else {
            badgeElement.classList.add('ab-badge-blocked');
        }
    }

    const generateBtn = document.getElementById('generatePasswordBtn');
    const passwordInput = document.getElementById('addPassword');
    const toggleEyeBtn = document.getElementById('togglePasswordBtn');

    if (generateBtn && passwordInput) {
        generateBtn.addEventListener('click', () => {
            const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
            let pass = "";
            for (let i = 0; i < 12; i++) {
                pass += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            passwordInput.value = pass;
            passwordInput.type = 'text';

            navigator.clipboard.writeText(pass).then(() => {
                const originalText = generateBtn.textContent;
                generateBtn.textContent = 'Copied!';
                setTimeout(() => {
                    generateBtn.textContent = originalText;
                }, 2000);
            });
        });
    }

    if (toggleEyeBtn && passwordInput) {
        toggleEyeBtn.addEventListener('click', () => {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                toggleEyeBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#159C2A" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>';
            } else {
                passwordInput.type = 'password';
                toggleEyeBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B928C" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const bdCard = document.getElementById('bdCard');
    const bdGlobalEditBtn = document.getElementById('bdGlobalEditBtn');

    if (!bdCard) return;

    let isGlobalEditActive = false;

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
        } else {
            this.style.backgroundColor = '';
            this.style.color = '';
            this.style.borderColor = '';
            this.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg> Edit`;
        }
    });

    bdCard.addEventListener('click', function (e) {
        const editBtnInline = e.target.closest('.bd-edit-btn-inline');
        const cancelBtn = e.target.closest('.bd-cancel-btn');
        const saveBtn = e.target.closest('.bd-save-btn');

        if (editBtnInline) {
            e.preventDefault();
            toggleEditMode(editBtnInline.closest('.bd-field'), true);
        }

        if (cancelBtn) {
            e.preventDefault();
            toggleEditMode(cancelBtn.closest('.bd-field'), false);
        }

        if (saveBtn) {
            e.preventDefault();
            saveFieldData(saveBtn.closest('.bd-field'));
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
        }
    }

    function saveFieldData(fieldWrap) {
        const input = fieldWrap.querySelector('.bd-input');
        if (!input) return;

        const fieldName = input.getAttribute('name');
        const fieldValue = input.value;

        const payload = {
            [fieldName]: fieldValue
        };

        console.log('BD Sending data:', payload);

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
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const crTableContainer = document.querySelector('.cr-table-container');
    const crTableBody = document.getElementById('crTableBody');

    const crAddOverlay = document.getElementById('crAddOverlay');
    const crAddPopup = document.getElementById('crAddPopup');

    const crDeleteOverlay = document.getElementById('crDeleteOverlay');
    const crDeletePopup = document.getElementById('crDeletePopup');

    let activeDeleteRow = null;

    function clearCrForm() {
        document.getElementById('crFirstName').value = '';
        document.getElementById('crLastName').value = '';
        document.getElementById('crRole').value = '';
        document.getElementById('crOwnership').value = '';
        document.getElementById('crEmail').value = '';
        document.getElementById('crPhone').value = '';
        document.getElementById('crDob').value = '';
        document.getElementById('crSsn').value = '';
        document.getElementById('crAddress').value = '';
        document.getElementById('crZip').value = '';
        document.getElementById('crState').value = '';
        document.getElementById('crCity').value = '';

        document.querySelectorAll('.cr-input').forEach(inp => inp.style.borderColor = '');
    }

    function formatDOB(dateString) {
        if (!dateString) return '-';
        const [year, month, day] = dateString.split('-');
        if (year && month && day) {
            return `${month}/${day}/${year}`;
        }
        return dateString;
    }

    function closeDeletePopup() {
        crDeleteOverlay.classList.remove('active');
        crDeletePopup.classList.remove('active');
        if (activeDeleteRow) {
            activeDeleteRow.classList.remove('is-deleting-row');
            activeDeleteRow = null;
        }
    }

    document.getElementById('crOpenAddBtn')?.addEventListener('click', () => {
        crAddOverlay.classList.add('active');
        crAddPopup.classList.add('active');
    });

    document.getElementById('crCloseAddBtn')?.addEventListener('click', () => {
        crAddOverlay.classList.remove('active');
        crAddPopup.classList.remove('active');
        clearCrForm();
    });

    document.getElementById('crCloseDeleteBtn')?.addEventListener('click', closeDeletePopup);
    document.getElementById('crCancelDeleteBtn')?.addEventListener('click', closeDeletePopup);

    document.getElementById('crConfirmDeleteBtn')?.addEventListener('click', () => {
        if (activeDeleteRow) {
            activeDeleteRow.remove();
        }
        closeDeletePopup();
    });

    if (crTableContainer) {
        crTableContainer.addEventListener('click', function (e) {
            const editBtn = e.target.closest('.cr-btn-edit');
            const cancelBtn = e.target.closest('.cr-btn-cancel');
            const saveBtn = e.target.closest('.cr-btn-save');
            const deleteBtn = e.target.closest('.cr-btn-delete');

            if (editBtn) {
                const row = editBtn.closest('.cr-row');
                row.classList.add('is-editing');
                row.classList.add('is-active-row');
            }

            if (cancelBtn) {
                const row = cancelBtn.closest('.cr-row');
                row.classList.remove('is-editing');
                row.classList.remove('is-active-row');
            }

            if (saveBtn) {
                const row = saveBtn.closest('.cr-row');
                const cells = row.querySelectorAll('.cr-cell[data-field]');

                cells.forEach(cell => {
                    const input = cell.querySelector('.cr-edit');
                    const view = cell.querySelector('.cr-val');

                    if (input && view) {
                        let val = input.value || '-';
                        if (input.type === 'date' && input.value) {
                            val = formatDOB(input.value);
                        }

                        view.textContent = val;

                        if (cell.getAttribute('data-field') === 'role') {
                            if (val === 'Owner') {
                                view.classList.add('cr-text-green');
                            } else {
                                view.classList.remove('cr-text-green');
                            }
                        }
                    }
                });

                row.classList.remove('is-editing');
                row.classList.remove('is-active-row');
            }

            if (deleteBtn) {
                activeDeleteRow = deleteBtn.closest('.cr-row');
                activeDeleteRow.classList.add('is-deleting-row');
                crDeleteOverlay.classList.add('active');
                crDeletePopup.classList.add('active');
            }
        });
    }

    document.getElementById('crSaveNewBtn')?.addEventListener('click', () => {
        const fName = document.getElementById('crFirstName');
        const lName = document.getElementById('crLastName');
        const email = document.getElementById('crEmail');
        const phone = document.getElementById('crPhone');

        let hasError = false;
        [fName, lName, email, phone].forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = '#FF496B';
                hasError = true;
            } else {
                input.style.borderColor = '';
            }
        });

        if (hasError) return;

        const fullName = `${fName.value.trim()} ${lName.value.trim()}`;
        const ownership = document.getElementById('crOwnership').value.trim() || '-';
        const role = document.getElementById('crRole').value || '-';
        const ssn = document.getElementById('crSsn').value.trim() || '-';
        const dobRaw = document.getElementById('crDob').value;
        const dobFormat = formatDOB(dobRaw);

        const address = document.getElementById('crAddress').value.trim();
        const city = document.getElementById('crCity').value.trim();
        const state = document.getElementById('crState').value;
        const zip = document.getElementById('crZip').value.trim();

        let fullAddress = [address, city, state, zip].filter(Boolean).join(', ') || '-';

        const roleClass = role === 'Owner' ? 'cr-text-green' : '';

        const newRow = document.createElement('div');
        newRow.className = 'cr-row';
        newRow.innerHTML = `
            <div class="cr-cell" data-field="fullName">
                <span class="cr-view cr-val">${fullName}</span>
                <input type="text" class="cr-edit cr-input" value="${fullName}">
            </div>
            <div class="cr-cell" data-field="ownership">
                <span class="cr-view cr-val">${ownership}</span>
                <input type="text" class="cr-edit cr-input" value="${ownership}">
            </div>
            <div class="cr-cell" data-field="role">
                <span class="cr-view cr-val ${roleClass}">${role}</span>
                <select class="cr-edit cr-input">
                    <option value="Owner" ${role === 'Owner' ? 'selected' : ''}>Owner</option>
                    <option value="Manager" ${role === 'Manager' ? 'selected' : ''}>Manager</option>
                    <option value="Employee" ${role === 'Employee' ? 'selected' : ''}>Employee</option>
                </select>
            </div>
            <div class="cr-cell" data-field="phone">
                <span class="cr-view cr-val">${phone.value}</span>
                <input type="text" class="cr-edit cr-input" value="${phone.value}">
            </div>
            <div class="cr-cell" data-field="email">
                <span class="cr-view cr-val">${email.value}</span>
                <input type="email" class="cr-edit cr-input" value="${email.value}">
            </div>
            <div class="cr-cell" data-field="ssn">
                <span class="cr-view cr-val">${ssn}</span>
                <input type="text" class="cr-edit cr-input" value="${ssn}">
            </div>
            <div class="cr-cell" data-field="dob">
                <span class="cr-view cr-val">${dobFormat}</span>
                <input type="date" class="cr-edit cr-input" value="${dobRaw}">
            </div>
            <div class="cr-cell" data-field="address">
                <span class="cr-view cr-val">${fullAddress}</span>
                <input type="text" class="cr-edit cr-input" value="${fullAddress}">
            </div>
            <div class="cr-cell">
                <div class="cr-view cr-actions">
                    <button class="cr-icon-btn cr-btn-edit">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8B928C" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button class="cr-icon-btn cr-btn-delete">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8B928C" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
                <div class="cr-edit cr-edit-actions">
                    <button class="cr-btn-save">Save</button>
                    <button class="cr-btn-cancel">Cancel</button>
                </div>
            </div>
        `;

        crTableBody.appendChild(newRow);

        crAddOverlay.classList.remove('active');
        crAddPopup.classList.remove('active');
        clearCrForm();
    });
});