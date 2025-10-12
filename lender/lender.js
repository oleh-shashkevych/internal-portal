document.addEventListener('DOMContentLoaded', () => {
    const criteriaData = {
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

    const groupedIndustriesList = [
        {
            text: 'Agriculture & Forestry/Wildlife',
            children: [
                { id: 'Extermination/Pest Control', text: 'Extermination/Pest Control' },
                { id: 'Farming (Animal Production)', text: 'Farming (Animal Production)' },
                { id: 'Farming (Crop Production)', text: 'Farming (Crop Production)' },
                { id: 'Fishing/Hunting', text: 'Fishing/Hunting' },
                { id: 'Landscape Services', text: 'Landscape Services' },
                { id: 'Lawn care Services', text: 'Lawn care Services' },
                { id: 'Other (Agriculture & Forestry/Wildlife)', text: 'Other (Agriculture & Forestry/Wildlife)' }
            ]
        },
        {
            text: 'Business & Information',
            children: [
                { id: 'Consultant', text: 'Consultant' },
                { id: 'Employment Office', text: 'Employment Office' },
                { id: 'Fundraisers', text: 'Fundraisers' },
                { id: 'Going out of Business Sales', text: 'Going out of Business Sales' },
                { id: 'Marketing/Advertising', text: 'Marketing/Advertising' },
                { id: 'Non Profit Organization', text: 'Non Profit Organization' },
                { id: 'Notary Public', text: 'Notary Public' },
                { id: 'Online Business', text: 'Online Business' },
                { id: 'Other (Business & Information)', text: 'Other (Business & Information)' },
                { id: 'Publishing Services', text: 'Publishing Services' },
                { id: 'Record Business', text: 'Record Business' },
                { id: 'Retail Sales', text: 'Retail Sales' },
                { id: 'Technology Services', text: 'Technology Services' },
                { id: 'Telemarketing', text: 'Telemarketing' },
                { id: 'Travel Agency', text: 'Travel Agency' },
                { id: 'Video Production', text: 'Video Production' }
            ]
        },
        {
            text: 'Construction/Utilities/Contracting',
            children: [
                { id: 'AC & Heating', text: 'AC & Heating' },
                { id: 'Building Construction', text: 'Building Construction' },
                { id: 'Building Inspection', text: 'Building Inspection' },
                { id: 'Concrete Manufacturing', text: 'Concrete Manufacturing' },
                { id: 'Contractor', text: 'Contractor' },
                { id: 'Engineering/Drafting', text: 'Engineering/Drafting' },
                { id: 'Equipment Rental', text: 'Equipment Rental' },
                { id: 'Other (Construction/Utilities/Contracting)', text: 'Other (Construction/Utilities/Contracting)' },
                { id: 'Plumbing', text: 'Plumbing' },
                { id: 'Remodeling', text: 'Remodeling' },
                { id: 'Repair/Maintenance', text: 'Repair/Maintenance' }
            ]
        },
        {
            text: 'Education',
            children: [
                { id: 'Child Care Services', text: 'Child Care Services' },
                { id: 'College/Universities', text: 'College/Universities' },
                { id: 'Cosmetology School', text: 'Cosmetology School' },
                { id: 'Elementary & Secondary Education', text: 'Elementary & Secondary Education' },
                { id: 'GED Certification', text: 'GED Certification' },
                { id: 'Other (Education)', text: 'Other (Education)' },
                { id: 'Private School', text: 'Private School' },
                { id: 'Real Estate School', text: 'Real Estate School' },
                { id: 'Technical School', text: 'Technical School' },
                { id: 'Trade School', text: 'Trade School' },
                { id: 'Tutoring Services', text: 'Tutoring Services' },
                { id: 'Vocational School', text: 'Vocational School' }
            ]
        },
        {
            text: 'Finance & Insurance',
            children: [
                { id: 'Accountant', text: 'Accountant' },
                { id: 'Auditing', text: 'Auditing' },
                { id: 'Bank/Credit Union', text: 'Bank/Credit Union' },
                { id: 'Bookkeeping', text: 'Bookkeeping' },
                { id: 'Cash Advances', text: 'Cash Advances' },
                { id: 'Collection Agency', text: 'Collection Agency' },
                { id: 'Insurance', text: 'Insurance' },
                { id: 'Investor', text: 'Investor' },
                { id: 'Other (Finance & Insurance)', text: 'Other (Finance & Insurance)' },
                { id: 'Pawn Brokers', text: 'Pawn Brokers' },
                { id: 'Tax Preparation', text: 'Tax Preparation' }
            ]
        },
        {
            text: 'Food & Hospitality',
            children: [
                { id: 'Alcohol/Tobacco Sales', text: 'Alcohol/Tobacco Sales' },
                { id: 'Alcoholic Beverage Manufacturing', text: 'Alcoholic Beverage Manufacturing' },
                { id: 'Bakery', text: 'Bakery' },
                { id: 'Caterer', text: 'Caterer' },
                { id: 'Food/Beverage Manufacturing', text: 'Food/Beverage Manufacturing' },
                { id: 'Grocery/Convenience Store (Gas Station)', text: 'Grocery/Convenience Store (Gas Station)' },
                { id: 'Grocery/Convenience Store (No Gas Station)', text: 'Grocery/Convenience Store (No Gas Station)' },
                { id: 'Hotels/Motels (Casino)', text: 'Hotels/Motels (Casino)' },
                { id: 'Hotels/Motels (No Casino)', text: 'Hotels/Motels (No Casino)' },
                { id: 'Mobile Food Services', text: 'Mobile Food Services' },
                { id: 'Other (Food & Hospitality)', text: 'Other (Food & Hospitality)' },
                { id: 'Restaurant/Bar', text: 'Restaurant/Bar' },
                { id: 'Specialty Food (Fruit/Vegetables)', text: 'Specialty Food (Fruit/Vegetables)' },
                { id: 'Specialty Food (Meat)', text: 'Specialty Food (Meat)' },
                { id: 'Specialty Food (Seafood)', text: 'Specialty Food (Seafood)' },
                { id: 'Tobacco Product Manufacturing', text: 'Tobacco Product Manufacturing' },
                { id: 'Truck Stop', text: 'Truck Stop' },
                { id: 'Vending Machine', text: 'Vending Machine' }
            ]
        },
        {
            text: 'Gaming',
            children: [
                { id: 'Auctioneer', text: 'Auctioneer' },
                { id: 'Boxing/Wrestling', text: 'Boxing/Wrestling' },
                { id: 'Casino/Video Gaming', text: 'Casino/Video Gaming' },
                { id: 'Other (Gaming)', text: 'Other (Gaming)' },
                { id: 'Racetrack', text: 'Racetrack' },
                { id: 'Sports Agent', text: 'Sports Agent' }
            ]
        },
        {
            text: 'Health Services',
            children: [
                { id: 'Acupuncturist', text: 'Acupuncturist' },
                { id: 'Athletic Trainer', text: 'Athletic Trainer' },
                { id: 'Child/Youth Services', text: 'Child/Youth Services' },
                { id: 'Chiropractic Office', text: 'Chiropractic Office' },
                { id: 'Dentistry', text: 'Dentistry' },
                { id: 'Electrolysis', text: 'Electrolysis' },
                { id: 'Embalmer', text: 'Embalmer' },
                { id: 'Emergency Medical Services', text: 'Emergency Medical Services' },
                { id: 'Emergency Medical Transportation', text: 'Emergency Medical Transportation' },
                { id: 'Hearing Aid Dealers', text: 'Hearing Aid Dealers' },
                { id: 'Home Health Services', text: 'Home Health Services' },
                { id: 'Hospital', text: 'Hospital' },
                { id: 'Massage Therapy', text: 'Massage Therapy' },
                { id: 'Medical Office', text: 'Medical Office' },
                { id: 'Mental Health Services', text: 'Mental Health Services' },
                { id: 'Non Emergency Medical Transportation', text: 'Non Emergency Medical Transportation' },
                { id: 'Optometry', text: 'Optometry' },
                { id: 'Other (Health Services)', text: 'Other (Health Services)' },
                { id: 'Pharmacy', text: 'Pharmacy' },
                { id: 'Physical Therapy', text: 'Physical Therapy' },
                { id: 'Physicians Office', text: 'Physicians Office' },
                { id: 'Radiology', text: 'Radiology' },
                { id: 'Residential Care Facility', text: 'Residential Care Facility' },
                { id: 'Speech/Occupational Therapy', text: 'Speech/Occupational Therapy' },
                { id: 'Substance Abuse Services', text: 'Substance Abuse Services' },
                { id: 'Veterinary Medicine', text: 'Veterinary Medicine' },
                { id: 'Vocational Rehabilitation', text: 'Vocational Rehabilitation' },
                { id: 'Wholesale Drug Distribution', text: 'Wholesale Drug Distribution' }
            ]
        },
        {
            text: 'Motor Vehicle',
            children: [
                { id: 'Automotive Part Sales', text: 'Automotive Part Sales' },
                { id: 'Car Wash/Detailing', text: 'Car Wash/Detailing' },
                { id: 'Motor Vehicle Rental', text: 'Motor Vehicle Rental' },
                { id: 'Motor Vehicle Repair', text: 'Motor Vehicle Repair' },
                { id: 'New Motor Vehicle Sales', text: 'New Motor Vehicle Sales' },
                { id: 'Other (Motor Vehicle)', text: 'Other (Motor Vehicle)' },
                { id: 'Recreational Vehicle Sales', text: 'Recreational Vehicle Sales' },
                { id: 'Used Motor Vehicle Sales', text: 'Used Motor Vehicle Sales' }
            ]
        },
        {
            text: 'Natural Resources/Environmental',
            children: [
                { id: 'Conservation Organizations', text: 'Conservation Organizations' },
                { id: 'Environmental Health', text: 'Environmental Health' },
                { id: 'Land Surveying', text: 'Land Surveying' },
                { id: 'Oil & Gas Distribution', text: 'Oil & Gas Distribution' },
                { id: 'Oil & Gas Extraction/Production', text: 'Oil & Gas Extraction/Production' },
                { id: 'Other (Natural Resources/Environmental)', text: 'Other (Natural Resources/Environmental)' },
                { id: 'Pipeline', text: 'Pipeline' },
                { id: 'Water Well Drilling', text: 'Water Well Drilling' }
            ]
        },
        {
            text: 'Other',
            children: [
                { id: 'Other (Business Type Not Listed)', text: 'Other (Business Type Not Listed)' }
            ]
        },
        {
            text: 'Personal Services',
            children: [
                { id: 'Animal Boarding', text: 'Animal Boarding' },
                { id: 'Barber Shop', text: 'Barber Shop' },
                { id: 'Beauty Salon', text: 'Beauty Salon' },
                { id: 'Cemetery', text: 'Cemetery' },
                { id: 'Diet Center', text: 'Diet Center' },
                { id: 'Dry cleaning/Laundry', text: 'Dry cleaning/Laundry' },
                { id: 'Entertainment/Party Rentals', text: 'Entertainment/Party Rentals' },
                { id: 'Event Planning', text: 'Event Planning' },
                { id: 'Fitness Center', text: 'Fitness Center' },
                { id: 'Florist', text: 'Florist' },
                { id: 'Funeral Director', text: 'Funeral Director' },
                { id: 'Janitorial/Cleaning Services', text: 'Janitorial/Cleaning Services' },
                { id: 'Massage/Day Spa', text: 'Massage/Day Spa' },
                { id: 'Nail Salon', text: 'Nail Salon' },
                { id: 'Other (Personal Services)', text: 'Other (Personal Services)' },
                { id: 'Personal Assistant', text: 'Personal Assistant' },
                { id: 'Photography', text: 'Photography' },
                { id: 'Tanning Salon', text: 'Tanning Salon' }
            ]
        },
        {
            text: 'Real Estate & Housing',
            children: [
                { id: 'Home Inspection', text: 'Home Inspection' },
                { id: 'Interior Design', text: 'Interior Design' },
                { id: 'Manufactured Housing', text: 'Manufactured Housing' },
                { id: 'Mortgage Company', text: 'Mortgage Company' },
                { id: 'Other (Real Estate & Housing)', text: 'Other (Real Estate & Housing)' },
                { id: 'Property Management', text: 'Property Management' },
                { id: 'Real Estate Broker/Agent', text: 'Real Estate Broker/Agent' },
                { id: 'Warehouse/Storage', text: 'Warehouse/Storage' }
            ]
        },
        {
            text: 'Safety/Security & Legal',
            children: [
                { id: 'Attorney', text: 'Attorney' },
                { id: 'Bail Bonds', text: 'Bail Bonds' },
                { id: 'Court Reporter', text: 'Court Reporter' },
                { id: 'Drug Screening', text: 'Drug Screening' },
                { id: 'Locksmith', text: 'Locksmith' },
                { id: 'Other (Safety/Security & Legal)', text: 'Other (Safety/Security & Legal)' },
                { id: 'Private Investigator', text: 'Private Investigator' },
                { id: 'Security Guard', text: 'Security Guard' },
                { id: 'Security System Services', text: 'Security System Services' }
            ]
        },
        {
            text: 'Transportation',
            children: [
                { id: 'Air Transportation', text: 'Air Transportation' },
                { id: 'Boat Services', text: 'Boat Services' },
                { id: 'Limousine Services', text: 'Limousine Services' },
                { id: 'Other (Transportation)', text: 'Other (Transportation)' },
                { id: 'Taxi Services', text: 'Taxi Services' },
                { id: 'Towing', text: 'Towing' },
                { id: 'Truck Transportation (Fuel)', text: 'Truck Transportation (Fuel)' },
                { id: 'Truck Transportation (Non Fuel)', text: 'Truck Transportation (Non Fuel)' }
            ]
        }
    ];

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
    let currentlyEditingBlock = null;

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
                break;
            case 'select2-checkbox':
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

        // Do not allow editing of new industry blocks with this function
        if (block.classList.contains('industries-block') || block.dataset.blockName === 'industryRequirements') {
            return;
        }

        currentlyEditingBlock = block;
        const actionsContainer = block.querySelector('.info-block__actions');
        toggleActionButtons(actionsContainer, true);
        
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
                    // templateResult: formatCheckbox,
                    templateSelection: (data) => data.text
                });
            }
            if (viewElement.dataset.type === 'select-tier') {
                $(field).select2({ width: '100%', templateResult: formatTier, templateSelection: formatTier });
            }
            if (viewElement.dataset.type === 'select-icon') {
                $(field).select2({ width: '100%', templateResult: formatIcon, templateSelection: formatIcon });
            }
        });
    }

    /**
     * Switches a given info block back to its display state.
     * @param {HTMLElement} block - The .info-block element.
     * @param {boolean} shouldSave - If true, save changes; if false, discard them.
     */
    function switchToViewMode(block, shouldSave) {
        const actionsContainer = block.querySelector('.info-block__actions');
        let dataToSave = {};

        if (block.classList.contains('industries-block') || block.dataset.blockName === 'industryRequirements') {
            return;
        }

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

        toggleActionButtons(actionsContainer, false);
        currentlyEditingBlock = null;
    }

    // --- Main Event Listener for Lender Info Tab ---
    if (lenderInfoTab) {
        lenderInfoTab.querySelectorAll('.info-block:not([data-block-name="industryRequirements"]):not(.industries-block)').forEach(block => {
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

    // ==========================================================================
    // 4. PREFERRED & RESTRICTED INDUSTRIES
    // ==========================================================================

    const industriesPopup = document.getElementById('industries-popup');
    const industriesPopupOverlay = document.getElementById('industries-popup-overlay');
    const industriesPopupTitle = document.getElementById('industries-popup-title');
    const industriesSelect = document.getElementById('industries-select');
    const saveIndustriesBtn = document.getElementById('industries-popup-save-btn');
    const closeIndustriesPopupBtns = document.querySelectorAll('.js-industries-popup-close');
    const industriesBlocks = document.querySelectorAll('.industries-block');

    // --- Confirmation Popup Elements ---
    const confirmationPopup = document.getElementById('confirmationPopup');
    const confirmationPopupOverlay = document.getElementById('confirmationPopupOverlay');
    const confirmationPopupText = document.getElementById('confirmationPopupText');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const closeConfirmationBtns = document.querySelectorAll('.js-confirmation-close');

    let currentEditingIndustriesBlock = null;
    let blockToDelete = null;
    let deletionCallback = null;


    // --- Initialize Select2 for the popup ---
    $(industriesSelect).select2({
        width: '100%',
        closeOnSelect: false,
        placeholder: 'Select industries',
        data: groupedIndustriesList,
        dropdownParent: $('#industries-popup') // Fix for search in popup
    }).on('select2:open', () => {
        // --- Задача 1: Обработка выбора группы ---
        setTimeout(() => { // Timeout чтобы убедиться что дропдаун отрисован
            $('.select2-results__group').off('click.groupclick').on('click.groupclick', function (e) {
                e.preventDefault(); // Предотвратить закрытие дропдауна
                
                const $group = $(this);
                const groupText = $group.text();
                const $select = $(industriesSelect);
                const currentValues = $select.val() || [];

                // Найти все опции в этой группе
                let childIds = [];
                const groupData = groupedIndustriesList.find(g => g.text === groupText);
                if (groupData && groupData.children) {
                    childIds = groupData.children.map(child => child.id);
                }

                // Проверить, выбраны ли уже все дочерние элементы
                const allSelected = childIds.every(id => currentValues.includes(id));
                
                let newValues;
                if (allSelected) {
                    // Снять выбор со всех дочерних элементов
                    newValues = currentValues.filter(id => !childIds.includes(id));
                } else {
                    // Выбрать все дочерние элементы (избегая дубликатов)
                    newValues = [...new Set([...currentValues, ...childIds])];
                }

                $select.val(newValues).trigger('change');

                // --- ✨ ВОТ И РЕШЕНИЕ ✨ ---
                // 1. Закрываем список, чтобы сбросить его текущее визуальное состояние.
                $select.select2('close');
                // 2. Сразу же открываем его снова с небольшой задержкой.
                // Это заставит Select2 полностью перерисовать список на основе нового значения.
                setTimeout(() => {
                    $select.select2('open');
                }, 1);
                // -------------------------

            });
        }, 0);
    });

    // --- Function to update the DOM ---
    const updateIndustriesBlock = (block, selectedIndustries) => {
        const listContainer = block.querySelector('.industries-block__list');
        const actionsContainer = block.querySelector('.info-block__actions');
        const addBtn = block.querySelector('.industries-add-btn');

        listContainer.innerHTML = ''; // Очистить предыдущий список

        if (selectedIndustries && selectedIndustries.length > 0) {
            block.classList.remove('industries-block--empty');
            actionsContainer.style.display = 'flex';
            addBtn.style.display = 'none';

            selectedIndustries.forEach(industry => {
                const item = document.createElement('div');
                item.className = 'industries-block__list-item';
                item.textContent = industry;
                listContainer.appendChild(item);
            });
            block.dataset.industries = JSON.stringify(selectedIndustries);
        } else {
            block.classList.add('industries-block--empty');
            actionsContainer.style.display = 'none';
            addBtn.style.display = 'flex';
            block.dataset.industries = '[]';
        }
    };

    // --- Open/Close Popup Logic ---
    const openIndustriesPopup = (block) => {
        currentEditingIndustriesBlock = block;
        const blockType = block.dataset.type; // 'preferred' or 'restricted'
        industriesPopupTitle.textContent = `Edit ${blockType} Industries`;

        const currentIndustries = JSON.parse(block.dataset.industries || '[]');
        $(industriesSelect).val(currentIndustries).trigger('change');

        industriesPopup.classList.add('active');
        industriesPopupOverlay.classList.add('active');
    };

    const closeIndustriesPopup = () => {
        industriesPopup.classList.remove('active');
        industriesPopupOverlay.classList.remove('active');
        currentEditingIndustriesBlock = null;
    };
    
    const openConfirmationPopup = (text, callback) => {
        confirmationPopupText.textContent = text;
        deletionCallback = callback;
        confirmationPopup.classList.add('active');
        confirmationPopupOverlay.classList.add('active');
    };

    const closeConfirmationPopup = () => {
        confirmationPopup.classList.remove('active');
        confirmationPopupOverlay.classList.remove('active');
        deletionCallback = null;
    };


    // --- Event Listeners ---
    industriesBlocks.forEach(block => {
        // Проверка начального состояния
        updateIndustriesBlock(block, JSON.parse(block.dataset.industries || '[]'));
        
        const editBtn = block.querySelector('.info-block__edit-btn');
        const deleteBtn = block.querySelector('.info-block__delete-btn');
        const addBtn = block.querySelector('.industries-add-btn');

        if (editBtn) {
            editBtn.addEventListener('click', () => {
                openIndustriesPopup(block);
            });
        }
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                openConfirmationPopup('Delete all industries?', () => {
                    console.log('--- Deleting All Industries ---');
                    console.log('Block Name:', block.dataset.type);
                    console.log('Data to send:', { [block.dataset.type]: [] });
                    updateIndustriesBlock(block, []);
                });
            });
        }
        if(addBtn) {
            addBtn.addEventListener('click', () => {
                openIndustriesPopup(block);
            });
        }
    });

    closeIndustriesPopupBtns.forEach(btn => btn.addEventListener('click', closeIndustriesPopup));
    closeConfirmationBtns.forEach(btn => btn.addEventListener('click', closeConfirmationPopup));

    saveIndustriesBtn.addEventListener('click', () => {
        if (!currentEditingIndustriesBlock) return;
        
        const selectedData = $(industriesSelect).val();
        
        console.log(`Data to be sent for ${currentEditingIndustriesBlock.dataset.type} industries:`, selectedData);
        
        updateIndustriesBlock(currentEditingIndustriesBlock, selectedData);
        closeIndustriesPopup();
    });

    confirmDeleteBtn.addEventListener('click', () => {
        if (typeof deletionCallback === 'function') {
            deletionCallback();
        }
        closeConfirmationPopup();
    });


    // ==========================================================================
    // 5. INDUSTRY REQUIREMENTS - DYNAMIC POPUP & RENDERING
    // ==========================================================================
    // REPLACE a large part of section 5 with this updated version
    
    const addEditRequirementPopup = document.getElementById('addEditRequirementPopup');
    const addEditRequirementOverlay = document.getElementById('addEditRequirementOverlay');
    const showAddRequirementBtn = document.getElementById('show-add-requirement-popup');
    const addRequirementBtn = document.getElementById('addRequirementBtn');
    const popupTitle = document.getElementById('addEditRequirementPopupTitle');
    const industryTypeSelect = document.getElementById('industry-type-select');
    const criteriaGroupsContainer = document.getElementById('criteria-groups-container');
    const addCriteriaGroupBtn = document.getElementById('add-criteria-group-btn');
    const closePopupBtns = document.querySelectorAll('.js-add-edit-requirement-close');
    const industryRequirementsContainer = document.getElementById('industry-requirements-container');

    let editingRequirementGroup = null;

    const initializeCriteriaGroup = (groupElement, name = '', values = []) => {
        const nameSelect = $(groupElement).find('.criteria-name-select');
        const valuesContainer = $(groupElement).find('.criteria-values-container');
        const valuesSelect = $(groupElement).find('.criteria-values-select');
        const valuesLabel = valuesContainer.find('label');

        const criteriaOptions = Object.keys(criteriaData.criteria).map(key => ({
            id: key,
            text: criteriaData.criteria[key].name
        }));
        
        nameSelect.select2({
            placeholder: "Select a name",
            allowClear: false,
            data: [{ id: '', text: '' }, ...criteriaOptions],
            dropdownParent: $(addEditRequirementPopup)
        }).on('change', function() {
            const selectedId = $(this).val();
            const errorEl = $(this).closest('.criteria-group').find('.criteria-group__error');
            errorEl.hide();
             $(this).next('.select2-container').find('.select2-selection').removeClass('invalid');


            if (selectedId && criteriaData.criteria[selectedId]) {
                const criterion = criteriaData.criteria[selectedId];
                valuesLabel.text(criterion.name);

                valuesSelect.empty().select2({
                    placeholder: `Select ${criterion.name}`,
                    data: criterion.data.map(item => ({ id: item, text: item })),
                    multiple: true,
                    closeOnSelect: false,
                    dropdownParent: $(addEditRequirementPopup)
                });

                valuesContainer.show();
                 $(valuesSelect).next('.select2-container').find('.select2-selection--multiple').removeClass('invalid');

            } else {
                valuesContainer.hide();
                valuesSelect.empty().select2('destroy');
            }
        });

        if (name) {
            const selectedCriterionKey = Object.keys(criteriaData.criteria).find(key => criteriaData.criteria[key].name === name);
            if (selectedCriterionKey) {
                nameSelect.val(selectedCriterionKey).trigger('change');
                setTimeout(() => { // Timeout to ensure the second select2 is initialized
                    valuesSelect.val(values).trigger('change');
                }, 100);
            }
        }
    };

    const createCriteriaGroupHTML = (isFirst = false) => {
        const groupId = `group-${Date.now()}-${Math.random()}`;
        return `
            <div class="criteria-group" id="${groupId}">
                ${!isFirst ? `
                    <button type="button" class="criteria-group__delete-btn" aria-label="Delete group">
                        <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.53906 0.578125C10.3901 0.578125 11.0857 1.27307 11.0859 2.12402V4.13574H16V5.56348H14.0469V14.8408C14.0467 16.2633 12.8903 17.4189 11.4678 17.4189H3.93457C2.51202 17.4189 1.35561 16.2633 1.35547 14.8408V5.56152H0V4.13477H4.32227V2.12402C4.32249 1.27307 5.01814 0.578125 5.86914 0.578125H9.53906ZM2.78613 14.8389C2.78624 15.4734 3.30199 15.9902 3.9375 15.9902H11.4688C12.1031 15.99 12.619 15.4742 12.6191 14.8389V5.56152H2.78613V14.8389ZM6.93262 13.3564H5.50488V8.10938H6.93262V13.3564ZM10.1934 13.3564H8.76562V8.10938H10.1934V13.3564ZM5.86914 2.00586C5.80238 2.00586 5.75022 2.05732 5.75 2.12402V4.13477H9.6582V2.12402C9.65799 2.05732 9.60583 2.00586 9.53906 2.00586H5.86914Z" fill="#808080"/></svg>
                    </button>
                ` : ''}
                <div class="form-group">
                    <label>Select Name</label>
                    <select class="criteria-name-select info-block__select"></select>
                </div>
                <div class="form-group criteria-values-container" style="display: none;">
                    <label></label>
                    <select class="criteria-values-select info-block__select" multiple="multiple"></select>
                </div>
                <div class="criteria-group__error" style="display: none;">Both fields must be filled.</div>
            </div>
        `;
    };

    const openAddEditRequirementPopup = (isEditing = false, groupElement = null) => {
        criteriaGroupsContainer.innerHTML = '';
        addEditRequirementPopup.querySelectorAll('.error-message').forEach(el => el.remove());
        addEditRequirementPopup.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
        $(industryTypeSelect).next('.select2-container').find('.select2-selection').removeClass('invalid');
        $(industryTypeSelect).val(null).trigger('change');
        
        editingRequirementGroup = groupElement;

        if (isEditing && groupElement) {
            popupTitle.textContent = 'Edit Requirement';
            addRequirementBtn.textContent = 'Save';

            const industry = groupElement.dataset.industry;
            const criteria = JSON.parse(groupElement.dataset.criteria || '[]');
            
            $(industryTypeSelect).val(industry).trigger('change');
            
            criteria.forEach((item, index) => {
                const groupHtml = createCriteriaGroupHTML(index === 0);
                criteriaGroupsContainer.insertAdjacentHTML('beforeend', groupHtml);
                const newGroupEl = criteriaGroupsContainer.lastElementChild;
                initializeCriteriaGroup(newGroupEl, item.name, item.values);
            });

        } else {
            popupTitle.textContent = 'Add Requirement';
            addRequirementBtn.textContent = 'Add';
            const groupHtml = createCriteriaGroupHTML(true);
            criteriaGroupsContainer.innerHTML = groupHtml;
            initializeCriteriaGroup(criteriaGroupsContainer.firstElementChild);
        }

        addEditRequirementPopup.classList.add('active');
        addEditRequirementOverlay.classList.add('active');
    };

    const closeAddEditRequirementPopup = () => {
        addEditRequirementPopup.classList.remove('active');
        addEditRequirementOverlay.classList.remove('active');
        editingRequirementGroup = null;
        criteriaGroupsContainer.innerHTML = '';
    };

    showAddRequirementBtn.addEventListener('click', () => openAddEditRequirementPopup());
    closePopupBtns.forEach(btn => btn.addEventListener('click', closeAddEditRequirementPopup));
    addCriteriaGroupBtn.addEventListener('click', () => {
        const groupHtml = createCriteriaGroupHTML(false);
        criteriaGroupsContainer.insertAdjacentHTML('beforeend', groupHtml);
        initializeCriteriaGroup(criteriaGroupsContainer.lastElementChild);
    });

    criteriaGroupsContainer.addEventListener('click', (e) => {
        if (e.target.closest('.criteria-group__delete-btn')) {
            e.target.closest('.criteria-group').remove();
        }
    });

    addRequirementBtn.addEventListener('click', () => {
        let isValid = true;
        const dataToSend = {
            industry: '',
            criteria: []
        };
        
        // Clear previous errors
        addEditRequirementPopup.querySelectorAll('.error-message').forEach(el => el.remove());
        addEditRequirementPopup.querySelectorAll('.criteria-group__error').forEach(el => el.style.display = 'none');
        addEditRequirementPopup.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
        $(industryTypeSelect).next('.select2-container').find('.select2-selection').removeClass('invalid');

        const industry = $(industryTypeSelect).val();
        if (!industry) {
            isValid = false;
            $(industryTypeSelect).next('.select2-container').after('<span class="error-message">This field is required.</span>');
            $(industryTypeSelect).next('.select2-container').find('.select2-selection').addClass('invalid');
        } else {
            dataToSend.industry = industry;
        }

        const groups = criteriaGroupsContainer.querySelectorAll('.criteria-group');
        if (groups.length === 0) { // Ensure at least one group is added
            isValid = false; 
        }

        groups.forEach((group, index) => {
            const nameSelect = $(group).find('.criteria-name-select');
            const valuesSelect = $(group).find('.criteria-values-select');
            const errorEl = $(group).find('.criteria-group__error');

            const nameValue = nameSelect.val();
            const values = valuesSelect.val() || [];

            const nameContainer = nameSelect.next('.select2-container');
            const valuesContainer = valuesSelect.next('.select2-container');
            
            nameContainer.find('.select2-selection').removeClass('invalid');
            valuesContainer.find('.select2-selection--multiple').removeClass('invalid');

            let isGroupValid = true;
            // First group is mandatory
            if (index === 0 && (!nameValue || values.length === 0)) {
                isGroupValid = false;
                isValid = false;
                errorEl.text('Both fields must be filled.').show();
                if (!nameValue) nameContainer.find('.select2-selection').addClass('invalid');
                if (values.length === 0) valuesContainer.find('.select2-selection--multiple').addClass('invalid');
            }
            // Other groups are optional, but if one field is filled, the other must be too
            else if (index > 0 && nameValue && values.length === 0) {
                 isGroupValid = false;
                 isValid = false;
                 errorEl.text('Criterion values must be selected if a name is chosen.').show();
                 valuesContainer.find('.select2-selection--multiple').addClass('invalid');
            } else if (index > 0 && !nameValue && values.length > 0) {
                 isGroupValid = false;
                 isValid = false;
                 errorEl.text('A name must be selected if criterion values are chosen.').show();
                 nameContainer.find('.select2-selection').addClass('invalid');
            }
            
            if (isGroupValid && nameValue && values.length > 0) {
                const nameText = criteriaData.criteria[nameValue].name;
                dataToSend.criteria.push({ name: nameText, values: values });
            }
        });

        if (!isValid) return;
        
        console.log("Data to be sent for Industry Requirements:", dataToSend);
        
        // Find existing group to update or create a new one
        const existingGroup = editingRequirementGroup || document.querySelector(`.industry-requirement-group[data-industry="${dataToSend.industry}"]`);

        let criteriaHTML = '';
        dataToSend.criteria.forEach(c => {
            criteriaHTML += `
                <div class="info-block__row">
                    <span class="info-block__label">${c.name}</span>
                    <span class="info-block__value">${c.values.join(', ')}</span>
                </div>
            `;
        });
        
        if (existingGroup) {
            existingGroup.dataset.industry = dataToSend.industry;
            existingGroup.dataset.criteria = JSON.stringify(dataToSend.criteria);
            existingGroup.querySelector('.industry-requirement-group__title').textContent = dataToSend.industry;
            existingGroup.querySelector('.info-block__body').innerHTML = criteriaHTML;
        } else {
             const newGroupHTML = `
                <div class="industry-requirement-group" data-industry="${dataToSend.industry}" data-criteria='${JSON.stringify(dataToSend.criteria)}'>
                    <div class="industry-requirement-group__header">
                        <h3 class="industry-requirement-group__title">${dataToSend.industry}</h3>
                        <div class="info-block__actions">
                            <button class="info-block__edit-btn">
                                <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.486744 12.4904L2.65851 12.5C2.7904 12.5 2.91471 12.4485 3.00651 12.3565L11.8569 3.49116C12 3.14478 11.8567 2.79853 11.8567 2.79853L9.70417 0.643376C9.01281 0.643499 0.15133 9.51987 0.15133 9.51987C0.0601425 9.6112 0.00855902 9.73499 0.0081923 9.86416L2.13602e-06 11.9987C-0.00109803 12.2692 0.216848 12.4892 0.486744 12.4904ZM9.35861 1.68226L10.8196 3.1449L8.84253 5.12533L7.38182 3.66245L9.35861 1.68226ZM0.985222 10.0697L6.69033 4.35495L8.15092 5.81796L2.45902 11.5196L0.979721 11.513L0.985222 10.0697Z" fill="#808080"/></svg>Edit
                            </button>
                             <button class="info-block__delete-btn">
                                <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.53906 0.578125C10.3901 0.578125 11.0857 1.27307 11.0859 2.12402V4.13574H16V5.56348H14.0469V14.8408C14.0467 16.2633 12.8903 17.4189 11.4678 17.4189H3.93457C2.51202 17.4189 1.35561 16.2633 1.35547 14.8408V5.56152H0V4.13477H4.32227V2.12402C4.32249 1.27307 5.01814 0.578125 5.86914 0.578125H9.53906ZM2.78613 14.8389C2.78624 15.4734 3.30199 15.9902 3.9375 15.9902H11.4688C12.1031 15.99 12.619 15.4742 12.6191 14.8389V5.56152H2.78613V14.8389ZM6.93262 13.3564H5.50488V8.10938H6.93262V13.3564ZM10.1934 13.3564H8.76562V8.10938H10.1934V13.3564ZM5.86914 2.00586C5.80238 2.00586 5.75022 2.05732 5.75 2.12402V4.13477H9.6582V2.12402C9.65799 2.05732 9.60583 2.00586 9.53906 2.00586H5.86914Z" fill="#808080"/></svg>Delete
                            </button>
                        </div>
                    </div>
                    <div class="info-block__body">
                        ${criteriaHTML}
                    </div>
                </div>
            `;
            industryRequirementsContainer.insertAdjacentHTML('afterbegin', newGroupHTML);
        }
        
        closeAddEditRequirementPopup();
    });

    industryRequirementsContainer.addEventListener('click', e => {
        const editBtn = e.target.closest('.info-block__edit-btn');
        if (editBtn) {
            const groupElement = editBtn.closest('.industry-requirement-group');
            openAddEditRequirementPopup(true, groupElement);
            return;
        }

        const deleteBtn = e.target.closest('.info-block__delete-btn');
        if(deleteBtn) {
            const groupElement = deleteBtn.closest('.industry-requirement-group');
            openConfirmationPopup('Delete all industries and their criteria?', () => {
                 const industryName = groupElement.dataset.industry;
                 console.log('--- Deleting Industry Requirement Group ---');
                 console.log('Data to send:', {
                     industry: industryName,
                     block: 'industry_requirements',
                     scope: 'all'
                 });
                 groupElement.remove();
            });
        }
    });

    $(industryTypeSelect).select2({
        placeholder: "Select an industry",
        allowClear: false,
        data: groupedIndustriesList,
        dropdownParent: $('#addEditRequirementPopup') // Fix search
    });

    // ==========================================================================
    // 7. CLOSE SELECT2 ON SCROLL
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