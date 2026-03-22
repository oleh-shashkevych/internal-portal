const burger = document.getElementById('burger');
const closeBurger = document.getElementById('close_burger');
const sideBar = document.querySelector('.left_cp_bar');
const overlay = document.querySelector('.overlay');

// Show menu on burger click
burger.addEventListener('click', () => {
    sideBar.style.transform = 'translateX(0)';
    overlay.style.display = 'flex';
});

// Hide menu on close click
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

// Initialize on load
toggleContactsPanel(window.innerWidth);

// Listen for window resize
window.addEventListener('resize', () => {
    toggleContactsPanel(window.innerWidth);
});

// Tab switching logic with edit mode reset
document.addEventListener('DOMContentLoaded', function () {
    const tabButtons = document.querySelectorAll('.pr-tab-btn');
    const tabContents = document.querySelectorAll('.pr-tab-content');

    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {

                // --- RESET EDIT MODES ---

                // 1. Cancel Detail Tab Global Edit
                const globalEditBtn = document.getElementById('lgvDetGlobalEditBtn');
                if (globalEditBtn && globalEditBtn.classList.contains('lgv-det-edit-btn-global-active')) {
                    globalEditBtn.click();
                }

                // 2. Cancel Detail Tab Inline Edits
                const detailCancelBtns = document.querySelectorAll('.lgv-det-edit-mode .lgv-det-cancel-btn');
                detailCancelBtns.forEach(btn => {
                    const editMode = btn.closest('.lgv-det-edit-mode');
                    if (editMode && window.getComputedStyle(editMode).display !== 'none') {
                        btn.click();
                    }
                });

                // 3. Cancel Invoices Tab Edits
                const editingInvoiceRows = document.querySelectorAll('.lgv-inv-row.is-editing');
                editingInvoiceRows.forEach(row => {
                    const cancelBtn = row.querySelector('.lgv-inv-btn-cancel');
                    if (cancelBtn) {
                        cancelBtn.click();
                    } else {
                        row.classList.remove('is-editing');
                    }
                });

                // --- TAB SWITCHING LOGIC ---

                // Remove active class from all buttons and content
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));

                // Add active class to the clicked button
                button.classList.add('active');

                // Find corresponding content by data-tab and show it
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

document.addEventListener('DOMContentLoaded', function () {
    const lgvDetCard = document.getElementById('lgvDetCard');
    const lgvDetGlobalEditBtn = document.getElementById('lgvDetGlobalEditBtn');

    if (!lgvDetCard) return;

    let isLgvDetGlobalEditActive = false;

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

        if (editBtnInline) {
            e.preventDefault();
            toggleEditMode(editBtnInline.closest('.lgv-det-field'), true);
        }

        if (cancelBtn) {
            e.preventDefault();
            toggleEditMode(cancelBtn.closest('.lgv-det-field'), false);
        }

        if (saveBtn) {
            e.preventDefault();
            saveFieldData(saveBtn.closest('.lgv-det-field'));
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
                if (fieldValue === 'Active') {
                    badgeDisplay.classList.remove('inactive');
                } else {
                    badgeDisplay.classList.add('inactive');
                }
            }
        } else if (valDisplay && valDisplay.tagName === 'A') {
            valDisplay.href = `mailto:${fieldValue}`;
            valDisplay.textContent = fieldValue;
        } else if (valDisplay) {
            valDisplay.textContent = fieldValue;
        }

        const payload = {
            [fieldName]: fieldValue
        };
        console.log('Account Detail updated:', payload);

        toggleEditMode(fieldWrap, false);
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const lgvInvTableBody = document.getElementById('lgvInvTableBody');
    const lgvInvAddOverlay = document.getElementById('lgvInvAddOverlay');
    const lgvInvAddPopup = document.getElementById('lgvInvAddPopup');
    const lgvInvAddForm = document.getElementById('lgvInvAddForm');
    const lgvInvAddDetail = document.getElementById('lgvInvAddDetail');
    const lgvInvAddCount = document.getElementById('lgvInvAddCount');

    // Initialize existing Cleave.js masks in the table
    if (typeof Cleave !== 'undefined') {
        document.querySelectorAll('.lgv-inv-cleave').forEach(el => {
            new Cleave(el, { numeral: true, numeralThousandsGroupStyle: 'thousand', numeralDecimalMark: '.', numeralDecimalScale: 2 });
        });
    }

    // Character counter for textarea
    if (lgvInvAddDetail) {
        lgvInvAddDetail.addEventListener('input', () => {
            const left = 500 - lgvInvAddDetail.value.length;
            lgvInvAddCount.textContent = `${left} characters left`;
            lgvInvAddDetail.classList.remove('has-error');
        });
    }

    // Remove errors on input (in popup)
    lgvInvAddForm?.querySelectorAll('.lgv-inv-input').forEach(input => {
        input.addEventListener('input', () => input.classList.remove('has-error'));
        input.addEventListener('change', () => input.classList.remove('has-error'));
    });

    // Open / Close popup
    document.getElementById('lgvInvOpenAddBtn')?.addEventListener('click', () => {
        lgvInvAddForm.reset();
        lgvInvAddCount.textContent = '500 characters left';
        lgvInvAddForm.querySelectorAll('.has-error').forEach(el => el.classList.remove('has-error'));

        lgvInvAddOverlay.classList.add('active');
        lgvInvAddPopup.classList.add('active');
    });

    const closeAddPopup = () => {
        lgvInvAddOverlay.classList.remove('active');
        lgvInvAddPopup.classList.remove('active');
    };

    document.getElementById('lgvInvCloseAddBtn')?.addEventListener('click', closeAddPopup);

    // Add new invoice
    lgvInvAddForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        lgvInvAddForm.querySelectorAll('[required]').forEach(input => {
            if (!input.value.trim()) {
                input.classList.add('has-error');
                isValid = false;
            }
        });

        if (isValid) {
            const formData = new FormData(lgvInvAddForm);
            const name = formData.get('name');
            const detail = formData.get('detail');
            const amount = formData.get('amount');
            const price = formData.get('price');
            const status = formData.get('status');

            const badgeClass = status === 'Paid' ? 'lgv-inv-badge-paid' : 'lgv-inv-badge-pending';
            const actionBtn = status === 'Paid' ? '<button class="lgv-inv-action-btn-outline">Download PDF</button>' : '<button class="lgv-inv-action-btn-fill">Pay from balance</button>';

            const newRow = document.createElement('div');
            newRow.className = 'lgv-inv-row';
            newRow.innerHTML = `
                <div class="lgv-inv-cell" data-field="name">
                    <span class="lgv-inv-view lgv-inv-val">${name}</span>
                    <input type="text" class="lgv-inv-edit lgv-inv-input" value="${name}">
                </div>
                <div class="lgv-inv-cell" data-field="details">
                    <span class="lgv-inv-view lgv-inv-val">${detail}</span>
                    <textarea class="lgv-inv-edit lgv-inv-textarea" rows="2" maxlength="500">${detail}</textarea>
                </div>
                <div class="lgv-inv-cell" data-field="amount">
                    <span class="lgv-inv-view lgv-inv-val">$${amount}</span>
                    <input type="text" class="lgv-inv-edit lgv-inv-input lgv-inv-cleave" value="${amount.replace(/,/g, '')}">
                </div>
                <div class="lgv-inv-cell" data-field="price">
                    <span class="lgv-inv-view lgv-inv-val">$${price}</span>
                    <input type="text" class="lgv-inv-edit lgv-inv-input lgv-inv-cleave" value="${price.replace(/,/g, '')}">
                </div>
                <div class="lgv-inv-cell" data-field="status">
                    <span class="lgv-inv-view lgv-inv-badge ${badgeClass} lgv-inv-val">${status}</span>
                    <select class="lgv-inv-edit lgv-inv-input">
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

            // Apply Cleave to new inputs
            if (typeof Cleave !== 'undefined') {
                newRow.querySelectorAll('.lgv-inv-cleave').forEach(el => {
                    new Cleave(el, { numeral: true, numeralThousandsGroupStyle: 'thousand', numeralDecimalMark: '.', numeralDecimalScale: 2 });
                });
            }

            closeAddPopup();
        }
    });

    // Inline editing logic (Row click)
    if (lgvInvTableBody) {
        lgvInvTableBody.addEventListener('click', (e) => {
            const row = e.target.closest('.lgv-inv-row');
            if (!row) return;

            // Ignore if action button clicked or row already editing
            const isActionButton = e.target.closest('button') && !e.target.closest('.lgv-inv-edit-actions');
            if (isActionButton || row.classList.contains('is-editing')) {

                // Handle Save/Cancel buttons
                const cancelBtn = e.target.closest('.lgv-inv-btn-cancel');
                const saveBtn = e.target.closest('.lgv-inv-btn-save');

                if (cancelBtn) {
                    e.stopPropagation();
                    row.classList.remove('is-editing');
                }

                if (saveBtn) {
                    e.stopPropagation();
                    const cells = row.querySelectorAll('.lgv-inv-cell[data-field]');

                    cells.forEach(cell => {
                        const input = cell.querySelector('.lgv-inv-edit');
                        const view = cell.querySelector('.lgv-inv-val');

                        if (input && view) {
                            let val = input.value;

                            if (input.classList.contains('lgv-inv-cleave')) {
                                view.textContent = `$${val}`;
                            } else if (cell.getAttribute('data-field') === 'status') {
                                view.textContent = val;
                                view.className = 'lgv-inv-view lgv-inv-badge lgv-inv-val';
                                if (val === 'Paid') {
                                    view.classList.add('lgv-inv-badge-paid');
                                } else {
                                    view.classList.add('lgv-inv-badge-pending');
                                }

                                // Change action button
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

            // Open edit mode on row click
            row.classList.add('is-editing');
        });
    }
});

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