document.addEventListener('DOMContentLoaded', () => {

    // --- ОБЩАЯ ЛОГИКА СТРАНИЦЫ (БУРГЕР, ПАНЕЛИ И Т.Д.) ---
    const burger = document.getElementById('burger');
    const closeBurger = document.getElementById('close_burger');
    const sideBar = document.querySelector('.left_cp_bar');
    const overlay = document.querySelector('.overlay');

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

    const tabsContainer = document.querySelector('.lender-tabs');
    const tabButtons = document.querySelectorAll('.lender-tabs__button');
    const contentItems = document.querySelectorAll('.lender-content__item');

    if (tabsContainer) {
        tabsContainer.addEventListener('click', function(event) {
            const clickedButton = event.target.closest('.lender-tabs__button');

            if (!clickedButton) {
                return;
            }

            const clickedIndex = Array.from(tabButtons).indexOf(clickedButton);

            tabButtons.forEach(button => {
                button.classList.remove('active');
            });

            clickedButton.classList.add('active');
            
            contentItems.forEach(item => {
                item.style.display = 'none';
            });
            
            if(contentItems[clickedIndex]) {
                contentItems[clickedIndex].style.display = 'block';
            }
        });
    }


    // --- ЛОГИКА ФИЛЬТРА ТАБЛИЦЫ ---

    const filterPopup = document.getElementById('filter-popup');
    const popupOverlay = document.getElementById('popupOverlay');
    const filterPopupList = document.getElementById('filter-popup-list');
    const searchInput = document.getElementById('filter-search-input');
    const applyBtn = document.getElementById('filter-apply-btn');
    const resetBtn = document.getElementById('filter-reset-btn');
    const closeButtons = filterPopup.querySelectorAll('.js-popup-close'); // Ищем внутри попапа

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

    if (popupOverlay) {
		popupOverlay.addEventListener('click', closePopup);
	}
	
	if (closeButtons.length) {
		closeButtons.forEach(button => button.addEventListener('click', closePopup));
	}
    

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
});