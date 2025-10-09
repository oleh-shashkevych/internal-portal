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
             const blockName = actionsContainer.closest('.info-block').dataset.blockName;
             if (blockName === 'industryRequirements') {
                actionsContainer.innerHTML = `
                    <button class="add-new-criteria-btn"><svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.6239 4.8761V0.5H4.3761V4.8761H0V6.1239H4.3761V10.5H5.6239V6.1239H10V4.8761H5.6239Z" fill="white"/></svg>Add New Criteria</button>
                    <button class="info-block__cancel-btn"><svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 1.375L9.125 0.5L5 4.625L0.875 0.5L0 1.375L4.125 5.5L0 9.625L0.875 10.5L5 6.375L9.125 10.5L10 9.625L5.875 5.5L10 1.375Z" fill="#232323"/></svg>Cancel</button>
                    <button class="info-block__save-btn"><svg width="13" height="9" viewBox="0 0 13 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.57687 7.22823L0.919266 3.70585L0 4.59134L4.57683 9L13 0.885489L12.0807 0L4.57687 7.22823Z" fill="white"/></svg>Save</button>
                `;
             } else {
                actionsContainer.innerHTML = `
                    <button class="info-block__cancel-btn"><svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 1.375L9.125 0.5L5 4.625L0.875 0.5L0 1.375L4.125 5.5L0 9.625L0.875 10.5L5 6.375L9.125 10.5L10 9.625L5.875 5.5L10 1.375Z" fill="#232323"/></svg>Cancel</button>
                    <button class="info-block__save-btn"><svg width="13" height="9" viewBox="0 0 13 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.57687 7.22823L0.919266 3.70585L0 4.59134L4.57683 9L13 0.885489L12.0807 0L4.57687 7.22823Z" fill="white"/></svg>Save</button>
                `;
             }
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
            block.classList.add('is-editing');
            block.querySelectorAll('.criteria-edit-btn').forEach(btn => btn.style.display = 'inline-block');
        } else {
            const fields = block.querySelectorAll('[data-field]');
            fields.forEach(viewElement => {
                viewElement.setAttribute('data-original-html', viewElement.innerHTML);
                const field = createField(viewElement);
                viewElement.innerHTML = '';
                viewElement.appendChild(field);

                // NEW: Input Mask for minDepositVolume
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

                // UPDATED: Initialize Select2 for specific field types
                if (viewElement.dataset.type === 'select2-checkbox') {
                    $(field).select2({
                        width: '100%',
                        closeOnSelect: false, // Prevents dropdown from closing
                        templateResult: formatCheckbox,
                        templateSelection: (data) => data.text // Display only text in the selection area
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
            block.classList.remove('is-editing');
            block.querySelectorAll('.criteria-edit-btn').forEach(btn => btn.style.display = 'none');
            if (shouldSave) {
                console.log("Saving Industry Requirements block (if needed).");
            }
        } else {
            if (shouldSave) {
                let isValid = true;
                
                // --- ЗМІНА 1: Очищуємо попередні повідомлення про помилки ---
                block.querySelectorAll('.error-message').forEach(el => el.remove());

                const fieldsToValidate = block.querySelectorAll('input, select, textarea');
                fieldsToValidate.forEach(field => {
                    // Спочатку скидаємо стилі помилок
                    field.classList.remove('invalid');
                    const select2Container = $(field).next('.select2-container');
                    if (select2Container.length) {
                        select2Container.find('.select2-selection').removeClass('invalid');
                    }

                    let isFieldInvalid = false;
                    // Перевірка, чи поле є обов'язковим і порожнім
                    if (field.required && !field.value) {
                        isFieldInvalid = true;
                    }
                    // Окрема перевірка для select2 multiple
                    if (field.multiple && $(field).val().length === 0 && field.required) {
                        isFieldInvalid = true;
                    }

                    // --- ЗМІНА 2: Якщо поле не валідне, показуємо повідомлення під ним ---
                    if (isFieldInvalid) {
                        isValid = false;
                        
                        const errorMessage = document.createElement('span');
                        errorMessage.className = 'error-message';
                        errorMessage.textContent = 'This field is required.';

                        if (select2Container.length) {
                            // Для Select2 додаємо клас помилки до контейнера і повідомлення після нього
                            select2Container.find('.select2-selection').addClass('invalid');
                            select2Container.after(errorMessage);
                        } else {
                            // Для звичайних полів додаємо клас до самого поля і повідомлення після нього
                            field.classList.add('invalid');
                            field.after(errorMessage);
                        }
                    }
                });

                // --- ЗМІНА 3: Видаляємо alert і просто зупиняємо збереження ---
                if (!isValid) {
                    // alert('Please fill in all required fields.'); // ВИДАЛЕНО
                    return; // Зупиняємо функцію, якщо є помилки
                }

                fieldsToValidate.forEach(field => {
                    if (field.multiple) {
                        dataToSave[field.name] = $(field).val();
                    } else {
                        dataToSave[field.name] = field.value;
                    }
                });
                
                console.log('Data to be sent:', dataToSave);
            } else { // Це гілка для кнопки "Cancel"
                // Очищуємо будь-які повідомлення про помилки та класи при скасуванні
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
                        // MODIFIED: Add dollar sign prefix for specific field
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
        // Initialize all blocks to view mode
        lenderInfoTab.querySelectorAll('.info-block').forEach(block => {
            const actions = block.querySelector('.info-block__actions');
            if (actions && block.dataset.blockName !== 'industryRequirements') {
                toggleActionButtons(actions, false);
            }
        });

        lenderInfoTab.addEventListener('click', function(event) {
            const editBtn = event.target.closest('.info-block__edit-btn');
            if (editBtn) {
                const block = editBtn.closest('.info-block');
                 if (block.dataset.blockName === 'industryRequirements') {
                    return;
                }
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

            const addNewBtn = event.target.closest('.add-new-criteria-btn');
            if(addNewBtn) {
                openCriteriaPopup();
                return;
            }

            const editCriteriaBtn = event.target.closest('.criteria-edit-btn');
            if (editCriteriaBtn) {
                const criteriaBlock = editCriteriaBtn.closest('.info-list');
                openCriteriaPopup(criteriaBlock);
                return;
            }
        });
    }

    // ==========================================================================
    // 4. NEW INDUSTRY REQUIREMENTS FEATURE
    // ==========================================================================
    const requirementData = {
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

    const addRequirementBtn = document.querySelector('.add-requirement-btn');
    const addRequirementPopup = document.getElementById('addRequirementPopup');
    const requirementNameDropdown = document.getElementById('requirementName');
    const dependentRequirementContainer = document.getElementById('dependentRequirementContainer');
    const dependentRequirementLabel = document.getElementById('dependentRequirementLabel');
    let dependentRequirementDropdown = document.getElementById('dependentRequirement');

    window.openAddRequirementPopup = () => {
        populateRequirementNameDropdown();
        addRequirementPopup.classList.add('active');
        popupOverlay.classList.add('active');
    };

    const closeAddRequirementPopup = () => {
        addRequirementPopup.classList.remove('active');
        popupOverlay.classList.remove('active');
        // Reset fields
        requirementNameDropdown.innerHTML = '<option value=""></option>';
        dependentRequirementContainer.style.display = 'none';
        $('#dependentRequirement').select2('destroy').html('');
    };

    const populateRequirementNameDropdown = () => {
        requirementNameDropdown.innerHTML = '<option value="" selected disabled>Select an option</option>';
        for (const id in requirementData.criteria) {
            const option = document.createElement('option');
            option.value = id;
            option.textContent = requirementData.criteria[id].name;
            requirementNameDropdown.appendChild(option);
        }
    };

    window.updateDependentDropdown = (selectedId) => {
        const selectedData = requirementData.criteria[selectedId];
        if (!selectedData) {
            dependentRequirementContainer.style.display = 'none';
            return;
        }

        dependentRequirementLabel.textContent = selectedData.name;

        // Destroy previous select2 instance if it exists
        if ($('#dependentRequirement').data('select2')) {
            $('#dependentRequirement').select2('destroy');
        }

        dependentRequirementDropdown.innerHTML = '';
        selectedData.data.forEach(item => {
            const option = new Option(item, item, false, false);
            dependentRequirementDropdown.appendChild(option);
        });

        dependentRequirementContainer.style.display = 'block';

        $(dependentRequirementDropdown).select2({
            width: '100%',
            closeOnSelect: false,
            templateResult: formatCheckbox,
        });
    };

    if (addRequirementBtn) {
        addRequirementBtn.addEventListener('click', openAddRequirementPopup);
    }

    requirementNameDropdown.addEventListener('change', (e) => {
        updateDependentDropdown(e.target.value);
    });

    document.getElementById('closeAddRequirementPopup').addEventListener('click', closeAddRequirementPopup);
    document.getElementById('cancelAddRequirementBtn').addEventListener('click', closeAddRequirementPopup);
    document.getElementById('addRequirementBtn').addEventListener('click', () => {
        const nameDropdown = document.getElementById('requirementName');
        const valueDropdown = document.getElementById('dependentRequirement');
        const selectedGroupId = nameDropdown.value;
        const selectedValues = $(valueDropdown).val();

        // Clear previous errors
        const existingError = addRequirementPopup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        $(valueDropdown).next('.select2-container').find('.select2-selection').removeClass('invalid');

        // Validation
        if (selectedGroupId && (!selectedValues || selectedValues.length === 0)) {
            const error = document.createElement('span');
            error.className = 'error-message';
            error.textContent = 'At least one option must be selected.';
            $(valueDropdown).next('.select2-container').after(error);
            $(valueDropdown).next('.select2-container').find('.select2-selection').addClass('invalid');
            return;
        }

        // On success
        const groupName = requirementData.criteria[selectedGroupId].name;

        renderRequirementRow({
            groupId: selectedGroupId,
            groupName: groupName,
            values: selectedValues
        });

        closeAddRequirementPopup();
    });

    const renderRequirementRow = (data) => {
        const industryBlockBody = document.querySelector('[data-block-name="industryRequirements"] .info-block__body');

        // Remove the empty state button if it exists
        const addButton = industryBlockBody.querySelector('.add-requirement-btn');
        if (addButton) {
            addButton.parentElement.classList.remove('info-block__body--empty');
            addButton.remove();
        }

        const row = document.createElement('div');
        row.className = 'info-block__row';
        row.dataset.groupId = data.groupId;
        row.innerHTML = `
            <span class="info-block__label">${data.groupName}</span>
            <span class="info-block__value">${data.values.join(', ')}</span>
            <div class="info-block__row-actions">
                <button class="info-block__row-btn info-block__row-btn--edit">
                    <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.486744 12.4904L2.65851 12.5C2.65924 12.5 2.65997 12.5 2.66071 12.5C2.7904 12.5 2.91471 12.4485 3.00651 12.3565L11.8569 3.49116C11.9485 3.39933 12 3.27469 12 3.14478C12 3.01487 11.9484 2.89035 11.8567 2.79853L9.70417 0.643376C9.51324 0.452251 9.20374 0.452128 9.01281 0.643499L0.15133 9.51987C0.0601425 9.6112 0.00855902 9.73499 0.0081923 9.86416L2.13602e-06 11.9987C-0.00109803 12.2692 0.216848 12.4892 0.486744 12.4904ZM9.35861 1.68226L10.8196 3.1449L8.84253 5.12533L7.38182 3.66245L9.35861 1.68226ZM0.985222 10.0697L6.69033 4.35495L8.15092 5.81796L2.45902 11.5196L0.979721 11.513L0.985222 10.0697Z" fill="#808080"/></svg>
                </button>
                <button class="info-block__row-btn info-block__row-btn--delete">
                    <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.082 3.5H1.91797V2.33333H10.082V3.5ZM9.5 12.8333H2.5V4.66667H9.5V12.8333ZM11.25 4.66667H10.666V12.8333C10.666 13.4722 10.1389 14 9.5 14H2.5C1.86111 14 1.33398 13.4722 1.33398 12.8333V4.66667H0.75V3.5H3.08398V1.75C3.08398 1.425 3.35903 1.16667 3.66602 1.16667H8.33398C8.64097 1.16667 8.91602 1.425 8.91602 1.75V3.5H11.25V4.66667Z" fill="#808080"/></svg>
                </button>
            </div>
        `;
        industryBlockBody.appendChild(row);
    };

    let editingRowElement = null; // To keep track of the row being edited

    const openAddRequirementPopup = (data = null) => {
        populateRequirementNameDropdown();

        if (data) { // Pre-populate for editing
            editingRowElement = data.rowElement;
            document.getElementById('addRequirementBtn').textContent = 'Save';

            const nameDropdown = document.getElementById('requirementName');
            nameDropdown.value = data.groupId;

            // Manually trigger the dependent dropdown creation and population
            updateDependentDropdown(data.groupId);

            // Set the selected values in the multi-select dropdown
            $(dependentRequirementDropdown).val(data.values).trigger('change');

        } else { // Reset for adding
            editingRowElement = null;
            document.getElementById('addRequirementBtn').textContent = 'Add';
        }

        addRequirementPopup.classList.add('active');
        popupOverlay.classList.add('active');
    };

    document.getElementById('addRequirementBtn').addEventListener('click', () => {
        const nameDropdown = document.getElementById('requirementName');
        const valueDropdown = document.getElementById('dependentRequirement');
        const selectedGroupId = nameDropdown.value;
        const selectedValues = $(valueDropdown).val();

        // Clear previous errors
        const existingError = addRequirementPopup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        $(valueDropdown).next('.select2-container').find('.select2-selection').removeClass('invalid');

        // Validation
        if (selectedGroupId && (!selectedValues || selectedValues.length === 0)) {
            const error = document.createElement('span');
            error.className = 'error-message';
            error.textContent = 'At least one option must be selected.';
            $(valueDropdown).next('.select2-container').after(error);
            $(valueDropdown).next('.select2-container').find('.select2-selection').addClass('invalid');
            return;
        }

        // On success
        const groupName = requirementData.criteria[selectedGroupId].name;
        const data = {
            groupId: selectedGroupId,
            groupName: groupName,
            values: selectedValues
        };

        if (editingRowElement) {
            // Update existing row
            editingRowElement.dataset.groupId = data.groupId;
            editingRowElement.querySelector('.info-block__label').textContent = data.groupName;
            editingRowElement.querySelector('.info-block__value').textContent = data.values.join(', ');
        } else {
            // Render new row
            renderRequirementRow(data);
        }

        closeAddRequirementPopup();
    });

    document.querySelector('[data-block-name="industryRequirements"]').addEventListener('click', function(e) {
        const deleteBtn = e.target.closest('.info-block__row-btn--delete');
        const editBtn = e.target.closest('.info-block__row-btn--edit');

        if (deleteBtn) {
            debugger;
            const row = deleteBtn.closest('.info-block__row');
            const groupId = row.dataset.groupId;
            const values = row.querySelector('.info-block__value').textContent.split(', ');

            console.log("Deleting requirement:", {
                groupId: groupId,
                values: values
            });

            row.remove();
        }

        if (editBtn) {
            const row = editBtn.closest('.info-block__row');
            const groupId = row.dataset.groupId;
            const groupName = row.querySelector('.info-block__label').textContent;
            const values = row.querySelector('.info-block__value').textContent.split(', ');

            openAddRequirementPopup({
                rowElement: row,
                groupId,
                groupName,
                values
            });
        }
    });


    // ==========================================================================
    // 5. OLD INDUSTRY REQUIREMENTS CRITERIA POPUP FEATURE (to be deprecated)
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

    /**
     * Opens the criteria popup for either adding new or editing existing criteria.
     * @param {HTMLElement|null} criteriaBlock - The .info-list element to edit, or null for new.
     */
    function openCriteriaPopup(criteriaBlock = null) {
        resetCriteriaPopup();
        if (criteriaBlock) {
            // Editing existing criteria
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
            // Adding a new criteria
            editingCriteriaElement = null;
        }

        criteriaPopup.classList.add('active');
        criteriaPopupOverlay.classList.add('active');
    }

    /**
     * Closes the criteria popup.
     */
    function closeCriteriaPopup() {
        criteriaPopup.classList.remove('active');
        criteriaPopupOverlay.classList.remove('active');
    }

    /**
     * Resets the criteria popup form to its default state.
     */
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
    
    /**
     * Adds a new criteria block to the DOM.
     * @param {object} data - The criteria data {name, items}.
     */
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

    /**
     * Updates an existing criteria block in the DOM.
     * @param {HTMLElement} element - The .info-list element to update.
     * @param {object} data - The new criteria data {name, items}.
     */
    function updateCriteriaInDOM(element, data) {
        element.dataset.criteriaName = data.name;
        element.dataset.items = JSON.stringify(data.items);
        
        element.querySelector('.info-list__title').textContent = data.name;

        const itemsWrapper = element.querySelector('.info-list__items');
        // Remove old items, but keep the Edit button
        while(itemsWrapper.firstElementChild && itemsWrapper.firstElementChild.tagName !== 'BUTTON') {
            itemsWrapper.removeChild(itemsWrapper.firstElementChild);
        }

        let itemsHTML = data.items.map(item => `<span class="info-list__item">${item}</span>`).join('');
        // Insert new items before the Edit button
        itemsWrapper.insertAdjacentHTML('afterbegin', itemsHTML);
    }

    // --- Criteria Popup Event Listeners ---
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

    // ==========================================================================
    // 5. INTERACTIVE LISTS (for Industry Requirements)
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

    // ==========================================================================
    // 6. CLOSE SELECT2 ON SCROLL (WORKAROUND FOR JUMPING DROPDOWN)
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

    /**
     * Formatter for Select2 to display options with checkboxes.
     */
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
});