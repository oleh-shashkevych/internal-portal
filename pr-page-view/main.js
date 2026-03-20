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
        const cancelBtn = e.target.closest('.pr-cancel-btn');
        const saveBtn = e.target.closest('.pr-save-btn');

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
                <div class="ab-cell ab-center">
                    <div class="ab-view ab-actions">
                        <button class="ab-btn-convert">Convert</button>
                        <button class="ab-btn-icon ab-btn-edit">
                        </button>
                        <button class="ab-btn-icon ab-btn-delete">
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

            if (typeof toggleEyeBtn !== 'undefined' && toggleEyeBtn) {
                toggleEyeBtn.classList.add('is-visible');
            }

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
        if (passwordInput.getAttribute('type') === 'text') {
            toggleEyeBtn.classList.add('is-visible');
        }

        toggleEyeBtn.addEventListener('click', (e) => {
            e.preventDefault();

            const isPassword = passwordInput.getAttribute('type') === 'password';
            passwordInput.setAttribute('type', isPassword ? 'text' : 'password');

            toggleEyeBtn.classList.toggle('is-visible');
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
                    </button>
                    <button class="cr-icon-btn cr-btn-delete">
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

document.addEventListener('DOMContentLoaded', function () {
    const rplCard = document.getElementById('rplCard');
    const rplGlobalEditBtn = document.getElementById('rplGlobalEditBtn');

    if (!rplCard) return;

    let isRplGlobalEditActive = false;

    // Helper: Convert MM/DD/YYYY to YYYY-MM-DD for date inputs
    function parseDateToInputFormat(dateStr) {
        if (!dateStr || dateStr === '—') return '';
        const parts = dateStr.split('/');
        if (parts.length === 3) {
            return `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
        }
        return '';
    }

    // Helper: Convert YYYY-MM-DD back to MM/DD/YYYY for display
    function formatDateToDisplay(dateStr) {
        if (!dateStr) return '—';
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            return `${parts[1]}/${parts[2]}/${parts[0]}`;
        }
        return dateStr;
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
        const cancelBtn = e.target.closest('.rpl-cancel-btn');
        const saveBtn = e.target.closest('.rpl-save-btn');

        if (editBtnInline) {
            e.preventDefault();
            toggleEditMode(editBtnInline.closest('.rpl-field'), true);
        }

        if (cancelBtn) {
            e.preventDefault();
            toggleEditMode(cancelBtn.closest('.rpl-field'), false);
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
            // Pre-fill inputs with current text content
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
        }
    }

    function saveFieldData(fieldWrap) {
        const input = fieldWrap.querySelector('.rpl-input');
        if (!input) return;

        const fieldName = input.getAttribute('name');
        const fieldValue = input.value;
        const valDisplay = fieldWrap.querySelector('.rpl-val');

        // Handling display update based on input type
        if (input.type === 'date') {
            valDisplay.textContent = formatDateToDisplay(fieldValue);
        } else if (valDisplay.tagName === 'A') {
            // Make sure the link is clickable if it's a URL
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

        const payload = {
            [fieldName]: fieldValue
        };

        // Simulate backend call
        console.log('RPL Sending data:', payload);

        toggleEditMode(fieldWrap, false);
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const filterPopup = document.getElementById('prFilterPopup');
    const filterOverlay = document.getElementById('prFilterOverlay');
    const filterList = document.getElementById('prFilterList');
    const searchInput = document.getElementById('prFilterSearch');
    const applyBtn = document.getElementById('prFilterApplyBtn');
    const resetBtn = document.getElementById('prFilterResetBtn');

    // We only attach to buttons inside tab-pipeline to avoid conflicts
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
        const popupHeight = 300;

        let topPosition = rect.bottom + window.scrollY + 5;
        let leftPosition = rect.left + window.scrollX - 100;

        if (leftPosition < 10) leftPosition = 10;

        filterPopup.style.top = `${topPosition}px`;
        filterPopup.style.left = `${leftPosition}px`;
    }

    function populatePopupList(items, checkedItems) {
        filterList.innerHTML = '';
        items.forEach((item, index) => {
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
        const isDoc = ['doc', 'docx'].includes(extension);
        return isDoc ? 'icon-doc' : 'icon-pdf';
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

    docFileInput?.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    docDropzone?.addEventListener('dragover', (e) => {
        e.preventDefault();
        docDropzone.classList.add('dragover');
    });

    docDropzone?.addEventListener('dragleave', () => {
        docDropzone.classList.remove('dragover');
    });

    docDropzone?.addEventListener('drop', (e) => {
        e.preventDefault();
        docDropzone.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
            handleFiles(e.dataTransfer.files);
        }
    });

    function handleFiles(files) {
        Array.from(files).forEach(file => {
            selectedFiles.push(file);
        });
        renderPreview();
    }

    function renderPreview() {
        docPreviewList.innerHTML = '';
        selectedFiles.forEach((file, index) => {
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
        hr = hr % 12;
        hr = hr ? hr : 12;
        const hrStr = String(hr).padStart(2, '0');
        return `${mo}/${da}/${yr} ${hrStr}:${min} • ${ampm}`;
    }

    docSubmitBtn?.addEventListener('click', () => {
        if (selectedFiles.length === 0) return;

        selectedFiles.forEach(file => {
            const ext = file.name.split('.').pop().toLowerCase();
            const iconClass = getFileIconClass(ext); // Получаем класс
            const dateStr = formatDate();
            const sizeStr = (file.size / 1024).toFixed(1);

            const row = document.createElement('div');
            row.className = 'doc-row';

            // Вставляем полученный класс прямо в div.doc-cell-icon
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

document.addEventListener('DOMContentLoaded', function () {
    const ahTab = document.getElementById('tab-activity_history');
    if (!ahTab) return;

    ahTab.addEventListener('click', function (e) {
        const header = e.target.closest('.ah-header');
        if (header) {
            const block = header.closest('.ah-block');
            block.classList.toggle('is-expanded');
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const payTab = document.getElementById('tab-payments');
    if (!payTab) return;

    const jsonData_2025 = {
        year: '2025',
        total_due: '10,800.00',
        total_paid: '7,135.00',
        total: '10,800.00',
        data: [
            {
                itm_id: '24',
                payment_date: '05/16/2024',
                payment_amount: '28,000.00',
                payment_type: 'Ria',
                payment_details: 'This Text message 2',
                deals_paid: [
                    { name: 'Item Name Text 4882345657568', url: 'pathto?itm=877' },
                    { name: 'Item Name Text 675678356', url: 'pathto?itm=789' },
                    { name: 'Item Name Text 4356347889769', url: 'pathto?itm=565' }
                ]
            }
        ]
    };

    const jsonData_2018 = {
        year: '2018',
        total_due: '15,800.00',
        total_paid: '4,135.00',
        total: '15,800.00',
        data: [
            {
                itm_id: '26',
                payment_date: '01/12/2018',
                payment_amount: '29,000.00',
                payment_type: 'Paypal',
                payment_details: 'This Text message 311',
                deals_paid: []
            }
        ]
    };

    const dealsPaidData = [
        { id: '10', name: 'David Bechtel Photography Dba Loft Creative Group #1' },
        { id: '11', name: 'Carlie Care Kids Inc #1' },
        { id: '15', name: 'David Bechtel Photography Dba Loft Creative Group #1' },
        { id: '20', name: 'Hayes Lawncare And Landscape Services #1' },
        { id: '22', name: 'C&j Mechanical Services #1' },
        { id: '25', name: 'Low Country Fish Camp Homes Homes At Olive Shell #1' },
        { id: '30', name: 'LSSP Corporation #9' },
        { id: '31', name: 'TABA PERSONAL CARE LLC #1' },
        { id: '33', name: 'Gustavo Anthony Ponce De Leon Dba Chula Vista Fence #1' },
        { id: '40', name: "Ljl Food Management Inc Dba Tina's Cafe #1" }
    ];

    let currentYear = '2025';
    const dataByYear = { '2025': jsonData_2025, '2018': jsonData_2018 };

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

    initYearDropdown();
    renderData();
    populateAddPopupList();

    // Year Dropdown
    payYearSelector.addEventListener('click', (e) => {
        e.stopPropagation();
        payYearDropdown.classList.toggle('active');
        payYearArrow.style.transform = payYearDropdown.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
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

            let dateRaw = '';
            if (item.payment_date) {
                const parts = item.payment_date.split(/[-/]/);
                if (parts.length === 3) dateRaw = `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
            }

            // Get selected deals ID array
            const selectedDealIds = item.deals_paid ? item.deals_paid.map(dp => {
                const found = dealsPaidData.find(d => d.name === dp.name);
                return found ? found.id : null;
            }).filter(Boolean) : [];

            const listOptionsHtml = dealsPaidData.map(d => {
                const isSelected = selectedDealIds.includes(d.id);
                return `<li data-id="${d.id}" data-name="${d.name}" class="${isSelected ? 'selected' : ''}"><div class="pay-checkbox-custom"></div>${d.name}</li>`;
            }).join('');

            const tagsHtml = selectedDealIds.map(id => {
                const deal = dealsPaidData.find(d => String(d.id) === String(id));
                return deal ? `<div class="pay-tag"><span>${deal.name}</span><span class="pay-tag-remove" data-id="${deal.id}">×</span></div>` : '';
            }).join('');

            row.innerHTML = `
                <div class="pay-cell">
                    <div class="pay-view">${item.payment_date}</div>
                    <div class="pay-edit"><input type="date" class="pay-input pay-edit-date" value="${dateRaw}"></div>
                </div>
                <div class="pay-cell">
                    <div class="pay-view">$${item.payment_amount}</div>
                    <div class="pay-edit"><input type="text" class="pay-input pay-edit-amount" value="${item.payment_amount.replace(/,/g, '')}"></div>
                </div>
                <div class="pay-cell">
                    <div class="pay-view">${item.payment_type}</div>
                    <div class="pay-edit">
                        <select class="pay-input pay-edit-type" style="cursor:pointer;">
                            <option value="Payroll" ${item.payment_type === 'Payroll' ? 'selected' : ''}>Payroll</option>
                            <option value="Paypal" ${item.payment_type === 'Paypal' ? 'selected' : ''}>Paypal</option>
                            <option value="Ria" ${item.payment_type === 'Ria' ? 'selected' : ''}>Ria</option>
                            <option value="Payoneer" ${item.payment_type === 'Payoneer' ? 'selected' : ''}>Payoneer</option>
                        </select>
                    </div>
                </div>
                <div class="pay-cell">
                    <div class="pay-view">
                        <div class="pay-notes-wrapper">
                            <div>${item.payment_details}</div>
                            ${linksHtml}
                            ${btnHtml}
                        </div>
                    </div>
                    <div class="pay-edit">
                        <textarea class="pay-textarea pay-edit-details" rows="2">${item.payment_details}</textarea>
                        
                        <div class="pay-multiselect-wrapper" style="margin-top: 5px;">
                            <div class="pay-multiselect-box">
                                <input type="text" class="pay-multiselect-search" placeholder="Search options...">
                                <div class="pay-multiselect-tags">${tagsHtml}</div>
                            </div>
                            <div class="pay-multiselect-dropdown">
                                <ul class="pay-multiselect-list">${listOptionsHtml}</ul>
                            </div>
                            <input type="hidden" class="pay-edit-deals-hidden" value='${JSON.stringify(selectedDealIds)}'>
                        </div>
                    </div>
                </div>
                <div class="pay-cell pay-center">
                    <div class="pay-view pay-actions">
                        <button class="pay-icon-btn pay-icon-btn-edit">
                        </button>
                        <button class="pay-icon-btn pay-icon-btn-delete">
                        </button>
                    </div>
                    <div class="pay-edit pay-edit-actions">
                        <button class="pay-btn-save">Save</button>
                        <button class="pay-btn-cancel">Cancel</button>
                    </div>
                </div>
            `;
            payTableBody.appendChild(row);

            if (typeof Cleave !== 'undefined') {
                new Cleave(row.querySelector('.pay-edit-amount'), { numeral: true, numeralThousandsGroupStyle: 'thousand', numeralDecimalMark: '.', numeralDecimalScale: 2 });
            }
        });
    }

    payTableBody.addEventListener('click', (e) => {
        const btnMore = e.target.closest('.pay-btn-more');
        const btnEdit = e.target.closest('.pay-icon-btn-edit');
        const btnCancel = e.target.closest('.pay-btn-cancel');
        const btnSave = e.target.closest('.pay-btn-save');
        const btnDelete = e.target.closest('.pay-icon-btn-delete');

        if (btnMore) {
            btnMore.classList.toggle('is-active');
            const list = btnMore.parentElement.querySelector('.pay-notes-list');
            if (list) list.classList.toggle('is-open');
        }

        if (btnEdit) {
            const row = btnEdit.closest('.pay-row');
            row.classList.add('is-editing', 'is-active-row');
        }

        if (btnCancel) {
            const row = e.target.closest('.pay-row');
            row.classList.remove('is-editing', 'is-active-row');
            renderData();
        }

        if (btnSave) {
            saveInlineEdit(e);
        }

        if (btnDelete) {
            const row = btnDelete.closest('.pay-row');
            currentDeleteId = row.getAttribute('data-id');
            payDeleteOverlay.classList.add('active');
            payDeletePopup.classList.add('active');
        }
    });

    function saveInlineEdit(e) {
        const row = e.target.closest('.pay-row');
        const id = row.getAttribute('data-id');
        const item = dataByYear[currentYear].data.find(d => String(d.itm_id) === String(id));

        if (item) {
            const dateInput = row.querySelector('.pay-edit-date').value;
            const amountInput = row.querySelector('.pay-edit-amount').value;
            const typeInput = row.querySelector('.pay-edit-type').value;
            const detailsInput = row.querySelector('.pay-edit-details').value;
            const dealsHidden = row.querySelector('.pay-edit-deals-hidden').value;

            const selectedDealIds = JSON.parse(dealsHidden || '[]');
            const dealsObj = selectedDealIds.map(dealId => {
                const deal = dealsPaidData.find(d => String(d.id) === String(dealId));
                return { name: deal.name, url: '#' };
            });

            if (dateInput) {
                const parts = dateInput.split('-');
                item.payment_date = `${parts[1]}/${parts[2]}/${parts[0]}`;
            }

            item.payment_amount = amountInput;
            item.payment_type = typeInput;
            item.payment_details = detailsInput;
            item.deals_paid = dealsObj;

            renderData();
        }
    }

    // Modal Add Setup
    const addForm = document.getElementById('payAddForm');
    const addAmount = document.getElementById('payAddAmount');
    const addDetails = document.getElementById('payAddDetails');
    const addCharCount = document.getElementById('payAddCharCount');

    if (typeof Cleave !== 'undefined' && addAmount) {
        new Cleave(addAmount, { numeral: true, numeralThousandsGroupStyle: 'thousand', numeralDecimalMark: '.', numeralDecimalScale: 2 });
    }

    if (addDetails) {
        addDetails.addEventListener('input', () => {
            addCharCount.textContent = `${500 - addDetails.value.length} characters left`;
        });
    }

    function populateAddPopupList() {
        const list = document.querySelector('#payAddDealsWrapper .pay-multiselect-list');
        if (!list) return;
        dealsPaidData.forEach(deal => {
            const li = document.createElement('li');
            li.setAttribute('data-id', deal.id);
            li.setAttribute('data-name', deal.name);
            li.innerHTML = `<div class="pay-checkbox-custom"></div>${deal.name}`;
            list.appendChild(li);
        });
    }

    document.getElementById('payOpenAddBtn')?.addEventListener('click', () => {
        addForm.reset();
        addCharCount.textContent = '500 characters left';

        // Reset multiselect
        const tags = document.querySelector('#payAddDealsWrapper .pay-multiselect-tags');
        const list = document.querySelector('#payAddDealsWrapper .pay-multiselect-list');
        const hidden = document.getElementById('payAddDeals');
        if (tags) tags.innerHTML = '';
        if (hidden) hidden.value = '';
        if (list) list.querySelectorAll('li').forEach(li => li.classList.remove('selected'));

        payAddOverlay.classList.add('active');
        payAddPopup.classList.add('active');
    });

    document.getElementById('payCloseAddBtn')?.addEventListener('click', () => {
        payAddOverlay.classList.remove('active');
        payAddPopup.classList.remove('active');
    });

    addForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const dateInput = document.getElementById('payAddDate').value;
        const typeInput = document.getElementById('payAddType').value;
        const detailsInput = addDetails.value;
        const amountVal = addAmount.value;

        const parts = dateInput.split('-');
        const formattedDate = `${parts[1]}/${parts[2]}/${parts[0]}`;

        const dealsHiddenVal = document.getElementById('payAddDeals').value;
        const selectedDealIds = JSON.parse(dealsHiddenVal || '[]');
        const dealsObj = selectedDealIds.map(id => {
            const deal = dealsPaidData.find(d => String(d.id) === String(id));
            return { name: deal.name, url: '#' };
        });

        const newItem = {
            itm_id: Date.now().toString(),
            payment_date: formattedDate,
            payment_amount: amountVal,
            payment_type: typeInput,
            payment_details: detailsInput,
            deals_paid: dealsObj
        };

        if (!dataByYear[currentYear]) dataByYear[currentYear] = { data: [], total_due: '0.00', total_paid: '0.00', total: '0.00' };
        dataByYear[currentYear].data.unshift(newItem);

        renderData();
        payAddOverlay.classList.remove('active');
        payAddPopup.classList.remove('active');
    });

    // Global Multiselect Handlers (Works for Add Modal & Inline Rows)
    document.addEventListener('click', (e) => {
        const searchInput = e.target.closest('.pay-multiselect-search');
        if (searchInput) return; // Prevent closing when clicking search

        const box = e.target.closest('.pay-multiselect-box');
        if (box) {
            const wrapper = box.closest('.pay-multiselect-wrapper');
            const dropdown = wrapper.querySelector('.pay-multiselect-dropdown');

            document.querySelectorAll('.pay-multiselect-dropdown').forEach(d => {
                if (d !== dropdown) d.classList.remove('active');
            });
            document.querySelectorAll('.pay-multiselect-box').forEach(b => {
                if (b !== box) b.classList.remove('is-focused');
            });

            dropdown.classList.add('active');
            box.classList.add('is-focused');
            box.querySelector('.pay-multiselect-search').focus();
            e.stopPropagation();
            return;
        }

        const listItem = e.target.closest('.pay-multiselect-list li');
        if (listItem) {
            e.stopPropagation();
            listItem.classList.toggle('selected');
            updateMultiselectTags(listItem.closest('.pay-multiselect-wrapper'));
            return;
        }

        if (e.target.classList.contains('pay-tag-remove')) {
            e.stopPropagation();
            const id = e.target.getAttribute('data-id');
            const wrapper = e.target.closest('.pay-multiselect-wrapper');
            const li = wrapper.querySelector(`li[data-id="${id}"]`);
            if (li) li.classList.remove('selected');
            updateMultiselectTags(wrapper);
            return;
        }

        // Close dropdowns
        document.querySelectorAll('.pay-multiselect-dropdown').forEach(d => d.classList.remove('active'));
        document.querySelectorAll('.pay-multiselect-box').forEach(b => b.classList.remove('is-focused'));
        payYearDropdown.classList.remove('active');
        payYearArrow.style.transform = 'rotate(0deg)';
    });

    document.addEventListener('input', (e) => {
        if (e.target.classList.contains('pay-multiselect-search')) {
            const val = e.target.value.toLowerCase();
            const list = e.target.closest('.pay-multiselect-wrapper').querySelector('.pay-multiselect-list');
            list.querySelectorAll('li').forEach(li => {
                li.style.display = li.textContent.toLowerCase().includes(val) ? 'flex' : 'none';
            });
        }
    });

    function updateMultiselectTags(wrapper) {
        const tagsContainer = wrapper.querySelector('.pay-multiselect-tags');
        const hiddenInput = wrapper.querySelector('input[type="hidden"]');
        const selectedLis = wrapper.querySelectorAll('.pay-multiselect-list li.selected');

        tagsContainer.innerHTML = '';
        const ids = [];

        selectedLis.forEach(li => {
            const id = li.getAttribute('data-id');
            const name = li.getAttribute('data-name');
            ids.push(id);
            const tag = document.createElement('div');
            tag.className = 'pay-tag';
            tag.innerHTML = `<span>${name}</span><span class="pay-tag-remove" data-id="${id}">×</span>`;
            tagsContainer.appendChild(tag);
        });

        if (hiddenInput) hiddenInput.value = JSON.stringify(ids);
    }

    // Delete Modal Confirmation
    document.getElementById('payCancelDeleteBtn')?.addEventListener('click', closeDeleteModal);
    document.getElementById('payConfirmDeleteBtn')?.addEventListener('click', () => {
        if (currentDeleteId) {
            const dataArr = dataByYear[currentYear].data;
            const index = dataArr.findIndex(item => String(item.itm_id) === String(currentDeleteId));
            if (index > -1) {
                dataArr.splice(index, 1);
                renderData();
            }
            closeDeleteModal();
        }
    });

    function closeDeleteModal() {
        payDeleteOverlay.classList.remove('active');
        payDeletePopup.classList.remove('active');
        currentDeleteId = null;
    }
});