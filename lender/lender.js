document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. GENERAL UI HANDLERS (SIDEBAR & TABS)
    // ==========================================================================

    const burger = document.getElementById('burger');
    const closeBurger = document.getElementById('close_burger');
    const sideBar = document.querySelector('.left_cp_bar');
    const overlay = document.querySelector('.overlay');
    const tabsContainer = document.querySelector('.lender-tabs');
    const tabButtons = document.querySelectorAll('.lender-tabs__button');
    const contentItems = document.querySelectorAll('.lender-content__item');

    // --- Mobile Sidebar (Burger Menu) ---
    if (burger && closeBurger && sideBar && overlay) {
        burger.addEventListener('click', () => {
            sideBar.style.transform = 'translateX(0)';
            overlay.style.display = 'flex';
        });

        closeBurger.addEventListener('click', () => {
            sideBar.style.transform = 'translateX(-120%)';
            overlay.style.display = 'none';
        });
    }

    // --- Tab Navigation ---
    if (tabsContainer) {
        tabsContainer.addEventListener('click', function(event) {
            const clickedButton = event.target.closest('.lender-tabs__button');
            if (!clickedButton) return;

            const clickedIndex = Array.from(tabButtons).indexOf(clickedButton);
            tabButtons.forEach(button => button.classList.remove('active'));
            clickedButton.classList.add('active');
            
            contentItems.forEach(item => item.style.display = 'none');
            if(contentItems[clickedIndex]) {
                contentItems[clickedIndex].style.display = 'block';
            }
        });
    }
    
    // ==========================================================================
    // 2. SUBMISSIONS TABLE FILTER POPUP
    // ==========================================================================
    
    const filterPopup = document.getElementById('filter-popup');
    const popupOverlay = document.getElementById('popupOverlay');
    const filterPopupList = document.getElementById('filter-popup-list');
    const searchInput = document.getElementById('filter-search-input');
    const applyBtn = document.getElementById('filter-apply-btn');
    const resetBtn = document.getElementById('filter-reset-btn');
    const filterButtons = document.querySelectorAll('.submissions-table__filter');

    let activeFilters = {};
    let currentColumnIndex = -1;
    let currentTableBody = null;

    const applyAllFilters = () => {
        const activeContent = document.querySelector('.lender-content__item[style*="block"]');
        if (!activeContent) return;
        
        const tableBody = activeContent.querySelector('.submissions-table__body');
        if (!tableBody) return;

        const rows = tableBody.querySelectorAll('.submissions-table__row');
        
        rows.forEach(row => {
            let isRowVisible = true;

            for (const colIndex in activeFilters) {
                const selectedValues = activeFilters[colIndex];
                if (selectedValues.length === 0) continue;

                const cell = row.children[colIndex];
                if (cell) {
                    const content = cell.querySelector('.submissions-table__badge') || cell;
                    const cellValue = content.textContent.trim();
                    
                    if (!selectedValues.includes(cellValue)) {
                        isRowVisible = false;
                        break; 
                    }
                }
            }
            row.style.display = isRowVisible ? 'grid' : 'none';
        });
    };

    const openPopup = () => {
        filterPopup.classList.add('active');
        popupOverlay.classList.add('active');
    };

    const closePopup = () => {
        filterPopup.classList.remove('active');
        popupOverlay.classList.remove('active');
        searchInput.value = ''; 
    };
    
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            
            const headerCell = e.currentTarget.closest('.submissions-table__cell');
            const table = e.currentTarget.closest('.submissions-table');
            currentTableBody = table.querySelector('.submissions-table__body');

            const headerCells = Array.from(headerCell.parentElement.children);
            currentColumnIndex = headerCells.indexOf(headerCell);

            const values = new Set();
            const rows = currentTableBody.querySelectorAll('.submissions-table__row');

            rows.forEach(row => {
                const cell = row.children[currentColumnIndex];
                if (cell) {
                    const content = cell.querySelector('.submissions-table__badge') || cell;
                    const value = content.textContent.trim();
                    if (value && value !== '—') {
                        values.add(value);
                    }
                }
            });
            
            const previouslyChecked = activeFilters[currentColumnIndex] || [];
            populatePopupList(Array.from(values).sort(), previouslyChecked);
            openPopup();
        });
    });

    const populatePopupList = (items, checkedItems) => {
        filterPopupList.innerHTML = '';
        items.forEach((item, index) => {
            const listItem = document.createElement('div');
            listItem.classList.add('filter-popup__item');

            const label = document.createElement('label');
            label.setAttribute('for', `filter-item-${index}`);

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `filter-item-${index}`;
            checkbox.value = item;
            if (checkedItems.includes(item)) {
                checkbox.checked = true;
            }

            const customCheckbox = document.createElement('span');
            customCheckbox.classList.add('custom-checkbox');
            customCheckbox.innerHTML = `<svg width="9" height="8" viewBox="0 0 9 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.39102 1L3.27486 5.83237L1.54826 4.20468L1 4.79568L3.33828 7L8 1.52712L7.39102 1Z" fill="white" stroke="white" stroke-width="0.3"/></svg>`;

            const labelText = document.createElement('span');
            labelText.classList.add('filter-popup__label-text');
            labelText.textContent = item;

            label.appendChild(checkbox);
            label.appendChild(customCheckbox);
            label.appendChild(labelText);
            listItem.appendChild(label);
            filterPopupList.appendChild(listItem);
        });
    };
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const items = filterPopupList.querySelectorAll('.filter-popup__item');
        items.forEach(item => {
            const label = item.querySelector('.filter-popup__label-text');
            if (label.textContent.toLowerCase().includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    });

    applyBtn.addEventListener('click', () => {
        const selectedValues = Array.from(filterPopupList.querySelectorAll('input[type="checkbox"]:checked'))
                                       .map(cb => cb.value);

        const activeContent = document.querySelector('.lender-content__item[style*="block"]');
        const filterButton = activeContent.querySelector(`.submissions-table__header .submissions-table__cell:nth-child(${currentColumnIndex + 1}) .submissions-table__filter`);

        if (selectedValues.length > 0) {
            activeFilters[currentColumnIndex] = selectedValues;
            filterButton.classList.add('filtered');
        } else {
            delete activeFilters[currentColumnIndex];
            filterButton.classList.remove('filtered');
        }
        
        applyAllFilters();
        closePopup();
    });

    resetBtn.addEventListener('click', () => {
        const activeContent = document.querySelector('.lender-content__item[style*="block"]');
        const filterButton = activeContent.querySelector(`.submissions-table__header .submissions-table__cell:nth-child(${currentColumnIndex + 1}) .submissions-table__filter`);
        
        if (activeFilters[currentColumnIndex]) {
            delete activeFilters[currentColumnIndex];
            if (filterButton) {
                 filterButton.classList.remove('filtered');
            }
        }
        
        applyAllFilters();
        closePopup();
    });

    // ==========================================================================
    // 3. LENDER INFO TAB "EDIT-IN-PLACE" FEATURE
    // ==========================================================================
    
    const lenderInfoTab = document.querySelector('.lender-content__item--lender');
    let currentlyEditingBlock = null; // State to track which info block is being edited

    // --- Helper Templates & Constants ---
    const iconTemplates = {
        yes: '<svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="6.5" cy="7" r="6.5" fill="#159C2A"/><path d="M9.39102 4.5L5.27486 9.33237L3.54826 7.70468L3 8.29568L5.33828 10.5L10 5.02712L9.39102 4.5Z" fill="white" stroke="white" stroke-width="0.3"/></svg>',
        no: '<svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="6.5" cy="7" r="6.5" fill="#DB1C10"/><path d="M9.01831 5.01831L4.43237 9.60424" stroke="white" stroke-width="1.5" stroke-linecap="round"/><path d="M4.43237 5.01831L9.01831 9.60424" stroke="white" stroke-width="1.5" stroke-linecap="round"/></svg>'
    };
    const tierClasses = { tier1: 'a', tier2: 'b', tier3: 'c', tier4: 'd', a: 'a', b: 'b', c: 'c', d: 'd' };

    // --- Utility Functions for Field Creation and Formatting ---

    /**
     * Creates a form field element based on data attributes.
     * @param {HTMLElement} element - The original element displaying the value.
     * @returns {HTMLElement} The created form field (input, select, textarea).
     */
    function createField(element) {
        const type = element.dataset.type || 'text';
        const name = element.dataset.field;
        let value = element.textContent.trim(); // Get original text
        const maxlength = element.dataset.maxlength;
        const required = element.dataset.required === 'true';
        let field;

        switch (type) {
            case 'textarea':
                field = document.createElement('textarea');
                field.className = 'info-block__textarea';
                field.textContent = element.textContent;
                break;
            case 'number':
                field = document.createElement('input');
                field.type = 'number';
                field.className = 'info-block__input';
                field.value = parseInt(value, 10) || 0;
                if (element.dataset.max) field.max = element.dataset.max;
                if (element.dataset.min) field.min = element.dataset.min || 0;

                // --- Доданий код для валідації в реальному часі ---
                field.addEventListener('input', () => {
                    const val = parseFloat(field.value);
                    const max = parseFloat(field.max);
                    const min = parseFloat(field.min);

                    if (!isNaN(val)) {
                        if (!isNaN(max) && val > max) {
                            field.value = max;
                        }
                        if (!isNaN(min) && val < min) {
                            field.value = min;
                        }
                    }
                });
                // --- Кінець доданого коду ---
                break;
            case 'select2-checkbox': // NEW and replaces old 'select2'
                field = document.createElement('select');
                field.className = 'info-block__select';
                field.multiple = true;
                const options = JSON.parse(element.dataset.options || '[]');
                const selectedValues = value.split(',').map(s => s.trim());
                options.forEach(opt => {
                    const optionEl = new Option(opt, opt, false, selectedValues.includes(opt));
                    field.add(optionEl);
                });
                break;
            case 'select-icon':
            case 'select-tier':
                field = document.createElement('select');
                field.className = `info-block__select js-${type}`;
                const selectOptions = JSON.parse(element.dataset.options || '{}');
                const currentSelectedValue = element.firstElementChild?.dataset.value;
                for(const val in selectOptions) {
                    const optionEl = new Option(selectOptions[val], val, false, val === currentSelectedValue);
                    field.add(optionEl);
                }
                break;
            default:
                field = document.createElement('input');
                field.type = 'text';
                field.className = 'info-block__input';
                // UPDATED: Handle prefix for minDepositVolume
                if (name === 'minDepositVolume') {
                    field.value = value.replace(/[$\s]/g, '');
                } else {
                    field.value = value;
                }
        }

        field.id = name;
        field.name = name;
        if (maxlength) field.maxLength = maxlength;
        if (required) field.required = true;
        return field;
    }

    /**
     * Formatter for Select2 to display tier options with colored squares.
     */
    const formatTier = (state) => {
        if (!state.id) return state.text;
        const tierClass = tierClasses[state.id.toLowerCase()] || 'a';
        return $(`<span><span class="select2-option-icon tier-${tierClass}"><div class="square"></div></span>${state.text}</span>`);
    };

    /**
     * Formatter for Select2 to display options with Yes/No icons.
     */
    const formatIcon = (state) => {
        if (!state.id) return state.text;
        const iconHTML = iconTemplates[state.id.toLowerCase()] || '';
        return $(`<span><span class="select2-option-icon">${iconHTML}</span>${state.text}</span>`);
    };

    /**
     * Toggles the action buttons between Edit, and Save/Cancel states.
     * @param {HTMLElement} actionsContainer - The container for the buttons.
     * @param {boolean} toEditMode - True to show Save/Cancel, false to show Edit.
     */
    function toggleActionButtons(actionsContainer, toEditMode) {
        actionsContainer.innerHTML = '';
        if (toEditMode) {
            actionsContainer.innerHTML = `
                <button class="info-block__cancel-btn"><svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 1.375L9.125 0.5L5 4.625L0.875 0.5L0 1.375L4.125 5.5L0 9.625L0.875 10.5L5 6.375L9.125 10.5L10 9.625L5.875 5.5L10 1.375Z" fill="#232323"/></svg>Cancel</button>
                <button class="info-block__save-btn"><svg width="13" height="9" viewBox="0 0 13 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.57687 7.22823L0.919266 3.70585L0 4.59134L4.57683 9L13 0.885489L12.0807 0L4.57687 7.22823Z" fill="white"/></svg>Save</button>
            `;
        } else {
            actionsContainer.innerHTML = `
                <button class="info-block__edit-btn"><svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.486744 12.4904L2.65851 12.5C2.65924 12.5 2.65997 12.5 2.66071 12.5C2.7904 12.5 2.91471 12.4485 3.00651 12.3565L11.8569 3.49116C11.9485 3.39933 12 3.27469 12 3.14478C12 3.01487 11.9484 2.89035 11.8567 2.79853L9.70417 0.643376C9.51324 0.452251 9.20374 0.452128 9.01281 0.643499L0.15133 9.51987C0.0601425 9.6112 0.00855902 9.73499 0.0081923 9.86416L2.13602e-06 11.9987C-0.00109803 12.2692 0.216848 12.4892 0.486744 12.4904ZM9.35861 1.68226L10.8196 3.1449L8.84253 5.12533L7.38182 3.66245L9.35861 1.68226ZM0.985222 10.0697L6.69033 4.35495L8.15092 5.81796L2.45902 11.5196L0.979721 11.513L0.985222 10.0697Z" fill="#808080"/></svg>Edit</button>
            `;
        }
    }

    // --- Core Edit/View Mode Functions ---

    /**
     * Switches a given info block to its editing state.
     * @param {HTMLElement} block - The .info-block element to edit.
     */
    function switchToEditMode(block) {
        if (currentlyEditingBlock && currentlyEditingBlock !== block) {
            switchToViewMode(currentlyEditingBlock, false); // Cancel any other ongoing edit
        }

        currentlyEditingBlock = block;
        const actionsContainer = block.querySelector('.info-block__actions');
        toggleActionButtons(actionsContainer, true);
        
        const isIndustryBlock = block.dataset.blockName === 'industryRequirements';
        
        if(isIndustryBlock) {
           // This block now has a different logic, handled separately
        } else {
            const fields = block.querySelectorAll('[data-field]');
            fields.forEach(viewElement => {
                viewElement.setAttribute('data-original-html', viewElement.innerHTML);
                const field = createField(viewElement);
                viewElement.innerHTML = '';
                viewElement.appendChild(field);

                if (viewElement.dataset.field === 'minDepositVolume') {
                    $(field).inputmask('decimal', {
                        radixPoint: ".",
                        groupSeparator: ",",
                        autoGroup: true,
                        digits: 2,
                        digitsOptional: false,
                        rightAlign: false,
                        allowMinus: false,
                        placeholder: '0'
                    });
                }
                
                if (viewElement.dataset.type === 'select2-checkbox') {
                    $(field).select2({
                        width: '100%',
                        closeOnSelect: false,
                        templateResult: formatCheckbox,
                        templateSelection: (data) => data.text
                    });
                }
                if (viewElement.dataset.type === 'select-tier') {
                    $(field).select2({ width: '100%', templateResult: formatTier, templateSelection: formatTier, minimumResultsForSearch: Infinity });
                }
                if (viewElement.dataset.type === 'select-icon') {
                    $(field).select2({ width: '100%', templateResult: formatIcon, templateSelection: formatIcon, minimumResultsForSearch: Infinity });
                }
            });
        }
    }

    /**
     * Switches a given info block back to its display state.
     * @param {HTMLElement} block - The .info-block element.
     * @param {boolean} shouldSave - If true, save changes; if false, discard them.
     */
    function switchToViewMode(block, shouldSave) {
        const actionsContainer = block.querySelector('.info-block__actions');
        let dataToSave = {};
        
        const isIndustryBlock = block.dataset.blockName === 'industryRequirements';

        if (isIndustryBlock) {
             // This block now has a different logic, handled separately
        } else {
            if (shouldSave) {
                let isValid = true;
                
                block.querySelectorAll('.error-message').forEach(el => el.remove());

                const fieldsToValidate = block.querySelectorAll('input, select, textarea');
                fieldsToValidate.forEach(field => {
                    field.classList.remove('invalid');
                    const select2Container = $(field).next('.select2-container');
                    if (select2Container.length) {
                        select2Container.find('.select2-selection').removeClass('invalid');
                    }

                    let isFieldInvalid = false;
                    if (field.required && !field.value) {
                        isFieldInvalid = true;
                    }
                    if (field.multiple && $(field).val().length === 0 && field.required) {
                        isFieldInvalid = true;
                    }

                    if (isFieldInvalid) {
                        isValid = false;
                        
                        const errorMessage = document.createElement('span');
                        errorMessage.className = 'error-message';
                        errorMessage.textContent = 'This field is required.';

                        if (select2Container.length) {
                            select2Container.find('.select2-selection').addClass('invalid');
                            select2Container.after(errorMessage);
                        } else {
                            field.classList.add('invalid');
                            field.after(errorMessage);
                        }
                    }
                });

                if (!isValid) {
                    return;
                }

                fieldsToValidate.forEach(field => {
                    if (field.multiple) {
                        dataToSave[field.name] = $(field).val();
                    } else {
                        dataToSave[field.name] = field.value;
                    }
                });
                
                console.log('Data to be sent:', dataToSave);
            } else { 
                block.querySelectorAll('.error-message').forEach(el => el.remove());
                block.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
                $(block).find('.select2-selection.invalid').removeClass('invalid');
            }

            const fields = block.querySelectorAll('[data-field]');
            fields.forEach(viewElement => {
                const select2Field = $(viewElement).find('.select2-hidden-accessible');
                if (select2Field.length) {
                    select2Field.select2('destroy');
                }

                if (shouldSave) {
                    const fieldName = viewElement.dataset.field;
                    const newValue = dataToSave[fieldName];
                    let displayHTML = '';
                    
                    const fieldType = viewElement.dataset.type;
                    if (fieldType === 'select-icon') {
                        const options = JSON.parse(viewElement.dataset.options || '{}');
                        const text = newValue ? options[newValue] : '---';
                        const iconHTML = iconTemplates[newValue] || '';
                        displayHTML = `<span class="info-block__value-radio" data-value="${newValue}">${iconHTML} ${text}</span>`;
                    } else if (fieldType === 'select-tier') {
                        const options = JSON.parse(viewElement.dataset.options || '{}');
                        const text = newValue ? options[newValue] : '---';
                        const tierClass = tierClasses[newValue] || '';
                        displayHTML = `<span class="info-block__value-check info-block__value-check--${tierClass}" data-value="${newValue}"><span class="square"></span>${text}</span>`;
                    } else if (Array.isArray(newValue)) {
                        displayHTML = newValue.join(', ');
                    } else {
                        if (fieldName === 'minDepositVolume' && newValue) {
                            displayHTML = `$ ${newValue}`;
                        } else {
                            displayHTML = newValue;
                        }
                    }
                    viewElement.innerHTML = displayHTML;
                } else {
                    viewElement.innerHTML = viewElement.getAttribute('data-original-html');
                }
                viewElement.removeAttribute('data-original-html');
            });
        }

        toggleActionButtons(actionsContainer, false);
        currentlyEditingBlock = null;
    }

    // --- Main Event Listener for Lender Info Tab ---
    if (lenderInfoTab) {
        // Initialize all blocks (except Industry Requirements) to view mode
        lenderInfoTab.querySelectorAll('.info-block:not([data-block-name="industryRequirements"])').forEach(block => {
            const actions = block.querySelector('.info-block__actions');
            if (actions) {
                toggleActionButtons(actions, false);
            }
        });

        lenderInfoTab.addEventListener('click', function(event) {
            const editBtn = event.target.closest('.info-block__edit-btn');
            if (editBtn) {
                const block = editBtn.closest('.info-block');
                switchToEditMode(block);
                return;
            }

            const cancelBtn = event.target.closest('.info-block__cancel-btn');
            if (cancelBtn) {
                const block = cancelBtn.closest('.info-block');
                switchToViewMode(block, false);
                return;
            }

            const saveBtn = event.target.closest('.info-block__save-btn');
            if (saveBtn) {
                const block = saveBtn.closest('.info-block');
                switchToViewMode(block, true);
                return;
            }
        });
    }

    /* // ==========================================================================
    // 4. (OLD) INDUSTRY REQUIREMENTS CRITERIA POPUP FEATURE - COMMENTED OUT
    // ==========================================================================
    
    // --- Popup Element Selectors ---
    const criteriaPopup = document.getElementById('criteriaPopup');
    const criteriaPopupOverlay = document.getElementById('criteriaPopupOverlay');
    const criteriaPopupTitle = document.getElementById('criteriaPopupTitle');
    const criteriaNameInput = document.getElementById('criteriaName');
    const itemsContainer = document.getElementById('criteriaItemsContainer');
    const addCriteriaItemBtn = document.getElementById('addCriteriaItem');
    const saveCriteriaBtn = document.getElementById('saveCriteria');
    const closeCriteriaPopupBtns = document.querySelectorAll('.js-criteria-popup-close');
    const criteriaListContainer = document.querySelector('.criteria-list-container');

    // --- Popup State ---
    let itemCounter = 1;
    let editingCriteriaElement = null;

    function openCriteriaPopup(criteriaBlock = null) {
        resetCriteriaPopup();
        if (criteriaBlock) {
            editingCriteriaElement = criteriaBlock;
            criteriaPopupTitle.textContent = "Edit Criteria";
            const name = criteriaBlock.dataset.criteriaName;
            const items = JSON.parse(criteriaBlock.dataset.items || '[]');
            
            criteriaNameInput.value = name;
            
            itemsContainer.innerHTML = '';
            itemCounter = 0;
            items.forEach(itemText => {
                itemCounter++;
                const isFirst = itemCounter === 1;
                const newItem = document.createElement('div');
                newItem.className = 'form-group item-group';
                newItem.innerHTML = `
                    <label for="criteriaItem${itemCounter}">Items:</label>
                    <div class="textarea-wrapper"><textarea id="criteriaItem${itemCounter}" name="criteriaItem[]" class="resizable-textarea" maxlength="500">${itemText}</textarea>
                    ${!isFirst ? '<button type="button" class="delete-item-btn" aria-label="Delete item"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="3" fill="white"/><rect width="24" height="24" rx="3" fill="#232323" fill-opacity="0.13"/><rect width="24" height="24" rx="3" fill="#F8F8F8"/><rect width="24" height="24" rx="3" fill="#8B928C" fill-opacity="0.1"/><path d="M13.251 5.16016C13.9423 5.16032 14.5067 5.72466 14.5068 6.41602V8.05078H18.5V9.20996H16.9131V16.748C16.9131 17.9038 15.974 18.8426 14.8184 18.8428H8.69629C7.54053 18.8426 6.60156 17.9038 6.60156 16.748V9.20898H5.5V8.04883H9.01172V6.41602C9.01183 5.72456 9.57707 5.16016 10.2686 5.16016H13.251ZM7.76367 16.7461C7.76367 17.2617 8.18281 17.6816 8.69922 17.6816H14.8184C15.3338 17.6814 15.7529 17.2624 15.7529 16.7461V9.20898H7.76367V16.7461ZM11.1367 15.543H9.97754V11.2793H11.1367V15.543ZM13.7939 15.543H12.6348V11.2793H13.7939V15.543ZM10.2686 6.31934C10.2143 6.31934 10.172 6.36176 10.1719 6.41602V8.04883H13.3477V6.41602C13.3475 6.36185 13.3051 6.31948 13.251 6.31934H10.2686Z" fill="#808080"/></svg></button></div>' : '</div>'}
                `;
                itemsContainer.appendChild(newItem);
            });
        } else {
            editingCriteriaElement = null;
        }

        criteriaPopup.classList.add('active');
        criteriaPopupOverlay.classList.add('active');
    }

    function closeCriteriaPopup() {
        criteriaPopup.classList.remove('active');
        criteriaPopupOverlay.classList.remove('active');
    }

    function resetCriteriaPopup() {
        criteriaPopupTitle.textContent = "New Criteria";
        criteriaNameInput.value = '';
        itemsContainer.innerHTML = `
            <div class="form-group item-group">
                <label for="criteriaItem1">Items:</label>
                <div class="textarea-wrapper"><textarea id="criteriaItem1" name="criteriaItem[]" class="resizable-textarea" maxlength="500"></textarea></div>
            </div>
        `;
        itemCounter = 1;
        editingCriteriaElement = null;
        criteriaNameInput.classList.remove('invalid');
        itemsContainer.querySelector('textarea').classList.remove('invalid');
    }
    
    function addCriteriaToDOM(data) {
        const newCriteria = document.createElement('div');
        newCriteria.className = 'info-list';
        newCriteria.dataset.criteriaName = data.name;
        newCriteria.dataset.items = JSON.stringify(data.items);

        let itemsHTML = data.items.map(item => `<span class="info-list__item">${item}</span>`).join('');

        newCriteria.innerHTML = `
            <h3 class="info-list__title">${data.name}</h3>
            <div class="info-list__items">
                ${itemsHTML}
                <button class="criteria-edit-btn" style="display:inline-block;">Edit</button>
            </div>
        `;
        criteriaListContainer.prepend(newCriteria);
    }

    function updateCriteriaInDOM(element, data) {
        element.dataset.criteriaName = data.name;
        element.dataset.items = JSON.stringify(data.items);
        
        element.querySelector('.info-list__title').textContent = data.name;

        const itemsWrapper = element.querySelector('.info-list__items');
        while(itemsWrapper.firstElementChild && itemsWrapper.firstElementChild.tagName !== 'BUTTON') {
            itemsWrapper.removeChild(itemsWrapper.firstElementChild);
        }

        let itemsHTML = data.items.map(item => `<span class="info-list__item">${item}</span>`).join('');
        itemsWrapper.insertAdjacentHTML('afterbegin', itemsHTML);
    }

    addCriteriaItemBtn.addEventListener('click', () => {
        itemCounter++;
        const newItem = document.createElement('div');
        newItem.className = 'form-group item-group';
        newItem.innerHTML = `
            <label for="criteriaItem${itemCounter}">Items:</label>
            <div class="textarea-wrapper"><textarea id="criteriaItem${itemCounter}" name="criteriaItem[]" class="resizable-textarea" maxlength="500"></textarea>
            <button type="button" class="delete-item-btn" aria-label="Delete item"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="3" fill="white"/><rect width="24" height="24" rx="3" fill="#232323" fill-opacity="0.13"/><rect width="24" height="24" rx="3" fill="#F8F8F8"/><rect width="24" height="24" rx="3" fill="#8B928C" fill-opacity="0.1"/><path d="M13.251 5.16016C13.9423 5.16032 14.5067 5.72466 14.5068 6.41602V8.05078H18.5V9.20996H16.9131V16.748C16.9131 17.9038 15.974 18.8426 14.8184 18.8428H8.69629C7.54053 18.8426 6.60156 17.9038 6.60156 16.748V9.20898H5.5V8.04883H9.01172V6.41602C9.01183 5.72456 9.57707 5.16016 10.2686 5.16016H13.251ZM7.76367 16.7461C7.76367 17.2617 8.18281 17.6816 8.69922 17.6816H14.8184C15.3338 17.6814 15.7529 17.2624 15.7529 16.7461V9.20898H7.76367V16.7461ZM11.1367 15.543H9.97754V11.2793H11.1367V15.543ZM13.7939 15.543H12.6348V11.2793H13.7939V15.543ZM10.2686 6.31934C10.2143 6.31934 10.172 6.36176 10.1719 6.41602V8.04883H13.3477V6.41602C13.3475 6.36185 13.3051 6.31948 13.251 6.31934H10.2686Z" fill="#808080"/></svg></button></div>
        `;
        itemsContainer.appendChild(newItem);
    });

    itemsContainer.addEventListener('click', (e) => {
        const deleteBtn = e.target.closest('.delete-item-btn');
        if (deleteBtn) {
            deleteBtn.closest('.item-group').remove();
        }
    });

    saveCriteriaBtn.addEventListener('click', () => {
        let isValid = true;
        const allPopupInputs = criteriaPopup.querySelectorAll('input, textarea');

        allPopupInputs.forEach(i => i.classList.remove('invalid'));
        criteriaPopup.querySelectorAll('.error-message').forEach(el => el.remove());

        const name = criteriaNameInput.value.trim();
        const itemTextareas = itemsContainer.querySelectorAll('textarea');
        
        if (name === '') {
            isValid = false;
            criteriaNameInput.classList.add('invalid');
            const errorMessage = document.createElement('span');
            errorMessage.className = 'error-message';
            errorMessage.textContent = 'This field is required.';
            criteriaNameInput.after(errorMessage);
        }

        if (itemTextareas[0] && itemTextareas[0].value.trim() === '') {
            isValid = false;
            itemTextareas[0].classList.add('invalid');
            const errorMessage = document.createElement('span');
            errorMessage.className = 'error-message';
            errorMessage.textContent = 'This field is required.';
            itemTextareas[0].closest('.textarea-wrapper').after(errorMessage);
        }

        if (!isValid) {
            return;
        }
        
        const items = [];
        itemTextareas.forEach(textarea => {
            const value = textarea.value.trim();
            if (value !== '') {
                items.push(value);
            }
        });

        const criteriaData = {
            name: name,
            items: items
        };
        
        console.log("Criteria data to be sent:", criteriaData);
        
        if (editingCriteriaElement) {
            updateCriteriaInDOM(editingCriteriaElement, criteriaData);
        } else {
            addCriteriaToDOM(criteriaData);
        }
        
        closeCriteriaPopup();
    });

    closeCriteriaPopupBtns.forEach(btn => btn.addEventListener('click', closeCriteriaPopup));
    */

    // ==========================================================================
    // 5. (NEW) INDUSTRY REQUIREMENTS - DYNAMIC POPUP & RENDERING
    // ==========================================================================

    // --- JSON Data for dropdowns ---
    const jsonData = {
        "criteria": {
            "123": {
                "name": "Time in Business",
                "data": ["1Y", "2Y", "5Y", "2M", "1M", "5M"]
            },
            "222": {
                "name": "Monthly Revenue",
                "data": [
                    "$10,000-$15,000", "$15,000-$30,000", "$30,000-$60,000",
                    "$60,000-$100,000", "$100,000-$200,000", "$200,000-$350,000",
                    "$350,000-$500,000", "$500,000+"
                ]
            }
        }
    };

    // --- Popup and container elements ---
    const addEditRequirementPopup = document.getElementById('addEditRequirementPopup');
    const addEditRequirementOverlay = document.getElementById('addEditRequirementOverlay');
    const showAddRequirementBtn = document.getElementById('show-add-requirement-popup');
    const addRequirementBtn = document.getElementById('addRequirementBtn');
    const popupTitle = document.getElementById('addEditRequirementPopupTitle');
    
    const requirementNameSelect = document.getElementById('requirementNameSelect');
    const requirementValuesContainer = document.getElementById('requirementValuesContainer');
    const requirementValuesSelect = document.getElementById('requirementValuesSelect');
    const requirementValuesLabel = requirementValuesContainer.querySelector('label');

    const newCriteriaContainer = document.getElementById('new-criteria-container');
    const closePopupBtns = document.querySelectorAll('.js-add-edit-requirement-close');

    let editingRowElement = null;

    // --- Helper function to format Select2 with checkboxes ---
    const formatCheckbox = (state) => {
        if (!state.id) return state.text;
        const checkboxHTML = `
            <span class="select2-option__checkbox">
                <svg width="9" height="8" viewBox="0 0 9 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.39102 1L3.27486 5.83237L1.54826 4.20468L1 4.79568L3.33828 7L8 1.52712L7.39102 1Z" fill="white" stroke="white" stroke-width="0.3"/>
                </svg>
            </span>
        `;
        return $(`<span>${checkboxHTML}${state.text}</span>`);
    };

    // --- Popup Functions ---
    const openAddEditPopup = (isEditing = false, data = {}) => {
        // Reset state
        $(requirementNameSelect).val(null).trigger('change');
        $(requirementValuesSelect).val(null).trigger('change');
        requirementValuesContainer.style.display = 'none';
        addEditRequirementPopup.querySelectorAll('.error-message').forEach(el => el.remove());
        addEditRequirementPopup.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
        $(addEditRequirementPopup).find('.select2-selection.invalid').removeClass('invalid');

        if (isEditing) {
            editingRowElement = data.element;
            popupTitle.textContent = 'Edit Requirements';
            addRequirementBtn.textContent = 'Save';
            
            // Pre-fill data
            $(requirementNameSelect).val(data.id).trigger('change');
            
            // We need a small delay for the second dropdown to be populated
            setTimeout(() => {
                $(requirementValuesSelect).val(data.values).trigger('change');
            }, 100);

        } else {
            editingRowElement = null;
            popupTitle.textContent = 'Add Requirements';
            addRequirementBtn.textContent = 'Add';
        }

        addEditRequirementPopup.classList.add('active');
        addEditRequirementOverlay.classList.add('active');
    };

    const closeAddEditPopup = () => {
        addEditRequirementPopup.classList.remove('active');
        addEditRequirementOverlay.classList.remove('active');
    };

    // --- Dropdown Population and Logic ---
    const populateNameSelect = () => {
        $(requirementNameSelect).empty().append(new Option('', '', true, true)); // Add a placeholder
        for (const id in jsonData.criteria) {
            const criteria = jsonData.criteria[id];
            const option = new Option(criteria.name, id);
            requirementNameSelect.add(option);
        }
    };

    $(requirementNameSelect).select2({
        width: '100%',
        placeholder: 'Select a name',
        minimumResultsForSearch: Infinity
    });

    $(requirementNameSelect).on('change', function() {
        const selectedId = $(this).val();
        
        // Clean up previous error messages if any
        $(requirementValuesSelect).next('.select2-container').next('.error-message').remove();
        $(requirementValuesSelect).next('.select2-container').find('.select2-selection').removeClass('invalid');

        if (selectedId && jsonData.criteria[selectedId]) {
            const criteria = jsonData.criteria[selectedId];
            requirementValuesLabel.textContent = criteria.name;
            
            $(requirementValuesSelect).empty();
            criteria.data.forEach(item => {
                const option = new Option(item, item);
                requirementValuesSelect.add(option);
            });

            if ($(requirementValuesSelect).data('select2')) {
                $(requirementValuesSelect).select2('destroy');
            }
            $(requirementValuesSelect).select2({
                width: '100%',
                closeOnSelect: false,
                templateResult: formatCheckbox,
                templateSelection: (data) => data.text
            });
            
            requirementValuesContainer.style.display = 'block';
        } else {
            requirementValuesContainer.style.display = 'none';
            if ($(requirementValuesSelect).data('select2')) {
                $(requirementValuesSelect).select2('destroy');
            }
            $(requirementValuesSelect).empty();
        }
    });

    // --- DOM Manipulation Functions ---
    const createRequirementRow = (id, name, values) => {
        const rowId = `criteria-row-${id}`;
        
        if (document.getElementById(rowId)) { 
            const errorSpan = document.createElement('span');
            errorSpan.className = 'error-message';
            errorSpan.textContent = `Requirement "${name}" already exists.`;

            const select2Container = $(requirementNameSelect).next('.select2-container');
            select2Container.find('.select2-selection').addClass('invalid');
            select2Container.after(errorSpan);
            
            return false; // Повертаємо false, якщо невдача
        }

        const newRow = document.createElement('div');
        newRow.className = 'new-criteria-row';
        newRow.id = rowId;
        newRow.dataset.id = id;
        newRow.dataset.values = JSON.stringify(values);

        newRow.innerHTML = `
            <span class="info-block__label">${name}</span>
            <span class="info-block__value">${values.join(', ')}</span>
            <div class="new-criteria-actions">
                <button type="button" class="edit-row-btn" aria-label="Edit item">
                    <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.486744 12.4904L2.65851 12.5C2.65924 12.5 2.65997 12.5 2.66071 12.5C2.7904 12.5 2.91471 12.4485 3.00651 12.3565L11.8569 3.49116C11.9485 3.39933 12 3.27469 12 3.14478C12 3.01487 11.9484 2.89035 11.8567 2.79853L9.70417 0.643376C9.51324 0.452251 9.20374 0.452128 9.01281 0.643499L0.15133 9.51987C0.0601425 9.6112 0.00855902 9.73499 0.0081923 9.86416L2.13602e-06 11.9987C-0.00109803 12.2692 0.216848 12.4892 0.486744 12.4904ZM9.35861 1.68226L10.8196 3.1449L8.84253 5.12533L7.38182 3.66245L9.35861 1.68226ZM0.985222 10.0697L6.69033 4.35495L8.15092 5.81796L2.45902 11.5196L0.979721 11.513L0.985222 10.0697Z" fill="#808080"/></svg>
                </button>
                <button type="button" class="delete-row-btn" aria-label="Delete item">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.251 5.16016C13.9423 5.16032 14.5067 5.72466 14.5068 6.41602V8.05078H18.5V9.20996H16.9131V16.748C16.9131 17.9038 15.974 18.8426 14.8184 18.8428H8.69629C7.54053 18.8426 6.60156 17.9038 6.60156 16.748V9.20898H5.5V8.04883H9.01172V6.41602C9.01183 5.72456 9.57707 5.16016 10.2686 5.16016H13.251ZM7.76367 16.7461C7.76367 17.2617 8.18281 17.6816 8.69922 17.6816H14.8184C15.3338 17.6814 15.7529 17.2624 15.7529 16.7461V9.20898H7.76367V16.7461ZM11.1367 15.543H9.97754V11.2793H11.1367V15.543ZM13.7939 15.543H12.6348V11.2793H13.7939V15.543ZM10.2686 6.31934C10.2143 6.31934 10.172 6.36176 10.1719 6.41602V8.04883H13.3477V6.41602C13.3475 6.36185 13.3051 6.31948 13.251 6.31934H10.2686Z" fill="#808080"/></svg>
                </button>
            </div>
        `;
        newCriteriaContainer.appendChild(newRow);
        showAddRequirementBtn.classList.remove('add-new-requirement-center-btn');
        return true; // Повертаємо true, якщо все добре
    };

    const updateRequirementRow = (element, id, name, values) => {
        element.dataset.id = id;
        element.dataset.values = JSON.stringify(values);
        element.querySelector('.info-block__label').textContent = name;
        element.querySelector('.info-block__value').textContent = values.join(', ');
    };

    // --- Event Listeners ---
    showAddRequirementBtn.addEventListener('click', () => openAddEditPopup());
    closePopupBtns.forEach(btn => btn.addEventListener('click', closeAddEditPopup));

    addRequirementBtn.addEventListener('click', () => {
        let isValid = true;
        const selectedNameId = $(requirementNameSelect).val();
        const selectedValues = $(requirementValuesSelect).val();

        // Очищення попередніх помилок
        addEditRequirementPopup.querySelectorAll('.error-message').forEach(el => el.remove());
        $(requirementNameSelect).next('.select2-container').find('.select2-selection').removeClass('invalid');
        $(requirementValuesSelect).next('.select2-container').find('.select2-selection').removeClass('invalid');

        if (!selectedNameId) {
            isValid = false;
            const errorSpan = document.createElement('span');
            errorSpan.className = 'error-message';
            errorSpan.textContent = 'This field is required.';
            $(requirementNameSelect).next('.select2-container').after(errorSpan);
            $(requirementNameSelect).next('.select2-container').find('.select2-selection').addClass('invalid');
        }

        if (!selectedValues || selectedValues.length === 0) {
            isValid = false;
            if (requirementValuesContainer.style.display === 'block') {
                const errorSpan = document.createElement('span');
                errorSpan.className = 'error-message';
                errorSpan.textContent = 'At least one value must be selected.';
                $(requirementValuesSelect).next('.select2-container').after(errorSpan);
                $(requirementValuesSelect).next('.select2-container').find('.select2-selection').addClass('invalid');
            }
        }

        if (!isValid) return;

        const selectedNameText = jsonData.criteria[selectedNameId].name;
        
        if (editingRowElement) {
            updateRequirementRow(editingRowElement, selectedNameId, selectedNameText, selectedValues);
            closeAddEditPopup(); // Закриваємо при успішному редагуванні
        } else {
            const success = createRequirementRow(selectedNameId, selectedNameText, selectedValues);
            if (success) {
                closeAddEditPopup(); // Закриваємо тільки при успішному створенні
            }
        }
    });

    newCriteriaContainer.addEventListener('click', (e) => {
        const editBtn = e.target.closest('.edit-row-btn');
        const deleteBtn = e.target.closest('.delete-row-btn');
        
        if (editBtn) {
            const row = editBtn.closest('.new-criteria-row');
            const data = {
                id: row.dataset.id,
                values: JSON.parse(row.dataset.values),
                element: row
            };
            openAddEditPopup(true, data);
        }

        if (deleteBtn) {
            const row = deleteBtn.closest('.new-criteria-row');
            const id = row.dataset.id;
            const values = JSON.parse(row.dataset.values);

            // Breakpoint for deletion process
            console.log(`--- Deleting Requirement ---`);
            console.log(`ID: ${id}`);
            console.log(`Values:`, values);
            
            row.remove();

            if (newCriteriaContainer.children.length === 0) {
                showAddRequirementBtn.classList.add('add-new-requirement-center-btn');
            }
        }
    });

    // --- Initial population ---
    populateNameSelect();

    /*
    // ==========================================================================
    // 6. (OLD) INTERACTIVE LISTS - COMMENTED OUT
    // ==========================================================================
    
    const industryLists = document.querySelectorAll('.lender-content__item--lender .info-list');

    industryLists.forEach(list => {
        const items = list.querySelectorAll('.info-list__item');

        if (items.length > 0) {
            items.forEach(item => item.classList.remove('info-list__item--active'));

            const lastItem = items[items.length - 1];
            lastItem.classList.add('info-list__item--active');
        }
    });
    */
    
    // ==========================================================================
    // 7. CLOSE SELECT2 ON SCROLL (WORKAROUND FOR JUMPING DROPDOWN)
    // ==========================================================================
    window.addEventListener('scroll', (event) => {
        
        const scrollTarget = event.target;
        if ($(scrollTarget).closest('.select2-dropdown').length > 0) {
            
            return;
        }

        
        $('.select2-hidden-accessible').each(function() {
            
            if ($(this).data('select2') && $(this).data('select2').isOpen()) {
                $(this).select2('close');
            }
        });
    }, true); 

});