document.addEventListener('DOMContentLoaded', function () {
    // Table Dropdown
    const triggers = document.querySelectorAll('.table-dropdown-wrapper .table-dropdown_button');

    triggers.forEach(trigger => {
        const dropdown = trigger.nextElementSibling;

        if (dropdown && dropdown.classList.contains('table-dropdown')) {
            trigger.addEventListener('click', function (e) {
                e.stopPropagation();

                document.querySelectorAll('.table-dropdown.active').forEach(activeDropdown => {
                    if (activeDropdown !== dropdown) {
                        activeDropdown.classList.remove('active');
                    }
                });

                dropdown.classList.toggle('active');
            });
        }
    });

    document.addEventListener('click', function (e) {
        document.querySelectorAll('.table-dropdown.active').forEach(dropdown => {
            const wrapper = dropdown.closest('.table-dropdown-wrapper');
            const trigger = wrapper?.querySelector('.table-dropdown_button');

            if (trigger && !trigger.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    });

    // Notification Dropdown
    const notificationButton = document.getElementById('notification-button');
    const notificationDropdown = document.getElementById('notification-list');

    function toggleDropdown() {
        notificationDropdown.classList.toggle('active');
    }

    function closeDropdown() {
        notificationDropdown.classList.remove('active');
    }

    notificationButton?.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleDropdown();
        // Блок с удалением классов quote/chat/external/internal — удалён
    });

    document.addEventListener('click', function (e) {
        if (!notificationDropdown.contains(e.target) && !notificationButton.contains(e.target)) {
            closeDropdown();
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeDropdown();

            document.querySelectorAll('.table-dropdown.active').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });

    // Representative List
    const container = document.getElementById("representative_list");
    if (!container) return;

    const ul = container.querySelector("ul.table-dropdown_users");
    const searchInput = container.querySelector("input[type='text']");
    const acceptBtn = container.querySelector("#table-dropdown_accept");
    const cleanBtn = container.querySelector("#table-dropdown_clean");

    const liItems = Array.from(ul.children);
    const sortOldToNew = liItems[0];
    const sortNewToOld = liItems[1];
    const allUserLis = liItems.slice(2);

    const originalUserLis = [...allUserLis];

    // Поиск
    if (searchInput) {
        // Создаём элемент "no user found"
        const noUsersLi = document.createElement("li");
        noUsersLi.className = "no-users-found";
        noUsersLi.textContent = "no user found";
        noUsersLi.style.display = "none";
        ul.appendChild(noUsersLi);
    
        searchInput.addEventListener("input", function () {
            const query = this.value.toLowerCase();
            let visibleCount = 0;
    
            allUserLis.forEach((li) => {
                const name = li.textContent.toLowerCase();
                const visible = name.includes(query);
                li.style.display = visible ? "" : "none";
                if (visible) visibleCount++;
            });
    
            // Показываем/скрываем сортировку
            const displaySort = visibleCount > 0 ? "" : "none";
            sortOldToNew.style.display = displaySort;
            sortNewToOld.style.display = displaySort;
    
            // Показываем/скрываем "no user found"
            noUsersLi.style.display = visibleCount === 0 ? "" : "none";
        });
    }

    // Сортировка
    function sortUsers(compareFn) {
        const users = Array.from(ul.querySelectorAll("li")).slice(2);
        users.sort(compareFn);
        users.forEach((li) => li.remove());
        ul.append(...[sortOldToNew, sortNewToOld, ...users]);
    }

    sortOldToNew.addEventListener("click", () => {
        sortUsers((a, b) => a.textContent.localeCompare(b.textContent));
    });

    sortNewToOld.addEventListener("click", () => {
        sortUsers((a, b) => b.textContent.localeCompare(a.textContent));
    });

    // Выбор представителя (чекбоксы), кроме клика по иконке
    allUserLis.forEach((li) => {
        li.addEventListener("click", function (e) {
            e.stopPropagation();

            // Если клик был по .table-dropdown_icons — ничего не делать
            if (e.target.closest(".table-dropdown_icons")) return;

            const checkbox = li.querySelector(".table-dropdown_checkbox");
            if (checkbox) {
                checkbox.classList.toggle("checked");
            }
        });
    });

    // Accept — оставить только выбранных
    // acceptBtn?.addEventListener("click", () => {
    //     allUserLis.forEach((li) => {
    //         const checkbox = li.querySelector(".table-dropdown_checkbox");
    //         if (!checkbox?.classList.contains("checked")) {
    //             li.style.display = "none";
    //         }
    //     });
    // });

    // Clean — снять все отметки и показать всех
    // cleanBtn?.addEventListener("click", () => {
    //     searchInput.value = "";
    //     allUserLis.forEach((li) => {
    //         const checkbox = li.querySelector(".table-dropdown_checkbox");
    //         checkbox?.classList.remove("checked");
    //         li.style.display = "";
    //     });

    //     ul.innerHTML = "";
    //     ul.append(sortOldToNew, sortNewToOld, ...originalUserLis);
    // });
});

document.addEventListener('DOMContentLoaded', () => {
    const openPopupBtn = document.getElementById('add_new');
    const closePopupBtn = document.getElementById('closePopupBtn');
    const popupOverlay = document.getElementById('popupOverlay');
    const followUpPopup = document.getElementById('followUpPopup');
    const followUpForm = document.getElementById('followUpForm');
    const borrowerSelect = document.getElementById('borrower');
    const outreachTypeSelect = document.getElementById('outreachType');
    const noteTextarea = document.getElementById('note');
    const noteCharCounter = document.getElementById('noteCharCounter');

    let noteMaxLength = 0;  // Инициализируем переменную значением по умолчанию

    if (noteTextarea) {
        noteMaxLength = noteTextarea.getAttribute('maxlength');
    }

    function updateNoteCounter() {
        const currentLength = noteTextarea.value.length;
        const remaining = noteMaxLength - currentLength;
        noteCharCounter.textContent = `${remaining} characters left`;
    }

    function openPopup() {
        populateBorrowerOptions(5);
        popupOverlay.classList.add('active');
        followUpPopup.classList.add('active');
        updateNoteCounter();
    }

    function closePopup() {
        popupOverlay.classList.remove('active');
        followUpPopup.classList.remove('active');
        setTimeout(resetForm, 300);
    }

    function resetForm() {
        followUpForm.reset();
        clearValidationErrors();
        borrowerSelect.innerHTML = '<option value="" disabled selected>Select borrower...</option>';
        updateNoteCounter();
    }

    function populateBorrowerOptions(count) {
        borrowerSelect.innerHTML = '<option value="" disabled selected>Select borrower...</option>';
        for (let i = 1; i <= count; i++) {
            const option = document.createElement('option');
            const randomId = Math.floor(Math.random() * 10000);
            option.value = `borrower_${randomId}`;
            option.textContent = `Borrower ${randomId}`;
            borrowerSelect.appendChild(option);
        }
    }

    function validateForm() {
        let isValid = true;
        clearValidationErrors();

        if (!outreachTypeSelect.value) {
            showValidationError(outreachTypeSelect);
            isValid = false;
        }

        if (!borrowerSelect.value) {
            showValidationError(borrowerSelect);
            isValid = false;
        }

        const noteValue = noteTextarea.value.trim();
        const noteRegex = /^[a-zA-Z0-9а-яА-ЯіїєґІЇЄҐ\s.,;:!?()-]*$/;

        if (noteValue === '') {
            showValidationError(noteTextarea);
            isValid = false;
        } else if (!noteRegex.test(noteValue)) {
            showValidationError(noteTextarea);
            isValid = false;
        }

        return isValid;
    }

    function showValidationError(field) {
        const formGroup = field.closest('.form-group');
        if (formGroup) {
            formGroup.classList.add('invalid');
        }
    }

    function clearValidationError(field) {
        const formGroup = field.closest('.form-group');
         if (formGroup) {
            formGroup.classList.remove('invalid');
        }
    }

    function clearValidationErrors() {
        followUpPopup.querySelectorAll('.form-group.invalid').forEach(group => {
            group.classList.remove('invalid');
        });
    }

    if(openPopupBtn) {
        openPopupBtn.addEventListener('click', openPopup);
    }
    if(closePopupBtn) {
        closePopupBtn.addEventListener('click', closePopup);
    }

    if(followUpForm) {
        followUpForm.addEventListener('submit', (event) => {
            event.preventDefault();
            if (validateForm()) {
                console.log('Form is valid! Data can be sent.');
                // alert('Form submitted successfully (simulation)!');
                closePopup();
            } else {
                console.log('Form validation failed.');
            }
        });
    }

    if(outreachTypeSelect) {
        outreachTypeSelect.addEventListener('change', () => clearValidationError(outreachTypeSelect));
    }

    if(borrowerSelect) {
        borrowerSelect.addEventListener('change', () => clearValidationError(borrowerSelect));
    }

    if(noteTextarea) {
        noteTextarea.addEventListener('input', () => {
            clearValidationError(noteTextarea);
            updateNoteCounter();
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Получаем необходимые элементы для работы с документами
    const documentsList = document.querySelector('.documents-inner__list');
    if (!documentsList) return;

    // Получаем элементы для попапа удаления
    const deletePopup = document.getElementById('delete-confirm-popup');
    const overlay = document.getElementById('delete-confirm-overlay');
    const closeDeleteBtn = document.getElementById('close-delete-popup-btn');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');

    let itemToDelete = null;

    // Список категорий для выпадающего списка
    const categories = [
        "Applications",
        "Bank Statements",
        "EIDL Files",
        "Financials",
        "Funding Contracts",
        "Other",
        "Recorded Calls",
        "Salesforce"
    ];

    // --- Логика редактирования ---
    const handleEditClick = (item) => {
        if (item.classList.contains('active')) return; 
        item.classList.add('active');

        const infoContainer = item.querySelector('.documents-inner__item-info');
        const p_element = infoContainer.querySelector('p');
        const ul_element = infoContainer.querySelector('ul');

        p_element.style.display = 'none';
        
        const currentName = p_element.textContent.trim();
        const currentCategory = ul_element.querySelector('li:nth-child(3)').textContent.trim();

        const editWrapper = document.createElement('div');
        editWrapper.className = 'edit-fields-wrapper';

        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.className = 'edit-input';
        nameInput.value = currentName;
        nameInput.maxLength = 250;
        
        const categorySelect = document.createElement('select');
        categorySelect.className = 'edit-select';
        
        let isCategorySet = false;
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            if (cat === currentCategory) {
                option.selected = true;
                isCategorySet = true;
            }
            categorySelect.appendChild(option);
        });

        if (!isCategorySet) {
             categorySelect.value = "Other";
        }

        editWrapper.appendChild(nameInput);
        editWrapper.appendChild(categorySelect);

        infoContainer.insertBefore(editWrapper, ul_element);
        
        $(categorySelect).select2({
            width: '100%',
            minimumResultsForSearch: Infinity,
            dropdownParent: $(infoContainer) 
        });
    };
    
    // --- Логика сохранения ---
    const handleSaveClick = (item) => {
        const infoContainer = item.querySelector('.documents-inner__item-info');
        const editWrapper = infoContainer.querySelector('.edit-fields-wrapper');
        const nameInput = editWrapper.querySelector('.edit-input');
        const $categorySelect = $(editWrapper.querySelector('.edit-select'));

        let isValid = true;

        if (!nameInput.value.trim()) {
            nameInput.classList.add('invalid');
            isValid = false;
        } else {
            nameInput.classList.remove('invalid');
        }

        if (!$categorySelect.val()) {
            $categorySelect.next('.select2-container').addClass('invalid');
            isValid = false;
        } else {
            $categorySelect.next('.select2-container').removeClass('invalid');
        }

        if (!isValid) {
            return;
        }
        
        // Обновляем только название
        const p_element = infoContainer.querySelector('p');
        p_element.textContent = nameInput.value;
        p_element.style.display = 'block';

        // Строка, обновляющая категорию в списке, УДАЛЕНА
        
        $categorySelect.select2('destroy');
        editWrapper.remove();
        
        item.classList.remove('active');
        
    };

    // --- Логика удаления ---
    const handleDeleteClick = (item) => {
        itemToDelete = item;
        item.classList.add('deleting');
        overlay.classList.add('active');
        deletePopup.classList.add('active');
    };

    const closeDeletePopup = () => {
        if (itemToDelete) {
            itemToDelete.classList.remove('deleting');
            itemToDelete = null;
        }
        overlay.classList.remove('active');
        deletePopup.classList.remove('active');
    };

    const confirmDeletion = () => {
        if (itemToDelete) {
            itemToDelete.remove();
        }
        closeDeletePopup();
    };

    // --- Главный обработчик событий ---
    documentsList.addEventListener('click', (e) => {
        const button = e.target.closest('.documents-inner__item-button');
        if (!button) return;

        const item = e.target.closest('.documents-inner__item');
        if (!item) return;

        e.preventDefault();

        if (button.classList.contains('edit')) {
            handleEditClick(item);
        } else if (button.classList.contains('save')) {
            handleSaveClick(item);
        } else if (button.classList.contains('delete')) {
            handleDeleteClick(item);
        }
    });
    
    // Обработчики для попапа удаления
    if (closeDeleteBtn) closeDeleteBtn.addEventListener('click', closeDeletePopup);
    if (confirmDeleteBtn) confirmDeleteBtn.addEventListener('click', confirmDeletion);
});

document.addEventListener('DOMContentLoaded', () => {
    const uploadPopup = document.getElementById('upload-popup');
    const uploadOverlay = document.getElementById('upload-popup-overlay');
    const closeUploadBtn = document.getElementById('closeUploadPopupBtn');
    const addFileBtn1 = document.getElementById('addDocumentFile');
    const addFileBtn2 = document.getElementById('addDocumentFile2');
    const emptyView = document.getElementById('empty-upload-view');
    const filesView = document.getElementById('files-selected-view');
    const fileGrid = document.getElementById('file-grid-container');
    const fileInput = document.getElementById('file-input-trigger');
    const dragDropArea = document.getElementById('drag-drop-area');
    const browseBtn = document.getElementById('browse-files-btn');
    const addMoreBtn = document.getElementById('add-more-files-btn');

    const categories = [
        "Applications", "Bank Statements", "EIDL Files", "Financials",
        "Funding Contracts", "Other", "Recorded Calls", "Salesforce"
    ];

    // --- НОВА ФУНКЦІЯ для створення динамічної SVG іконки ---
    const createFileIconSVG = (fileType = 'default') => {
        const type = fileType.toUpperCase();
        const colors = {
            'PDF': '#D62E2E',
            'DOC': '#0461A0',
            'DOCX': '#0461A0',
            'JPG': '#E8B800',
            'JPEG': '#E8B800',
            'PNG': '#159C2A',
            'DEFAULT': '#808080'
        };
        const fillColor = colors[type] || colors['DEFAULT'];

        // Використовуємо тег <text> для динамічного тексту
        return `
            <svg width="100%" height="100%" viewBox="0 0 96 109" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M26.9533 0.663436L28.6429 0H93.4107C94.7264 0 95.7994 1.01359 95.7994 2.26677V106.435C95.7994 107.684 94.7313 108.702 93.4107 108.702L10.0909 108.697C8.77517 108.697 7.70215 107.684 7.70215 106.431L7.80896 19.1931L7.9886 18.7876L26.9533 0.663436ZM12.475 22.1328V104.164H91.0219V4.52847H31.0257V19.8707C31.0257 21.1192 29.9576 22.1374 28.6369 22.1374L12.475 22.1328ZM26.2541 17.604V7.73077L15.8494 17.604H26.2541Z" fill="#D0D3D1"/>
                <rect x="0.8" y="57.89" width="65.88" height="36.56" rx="1.83" fill="${fillColor}"/>
                <text x="33.74" y="78" text-anchor="middle" dominant-baseline="middle" fill="white" font-size="28" font-family="Urbanist, sans-serif" font-weight="700">${type}</text>
            </svg>
        `;
    };

    const createCategorySelect = () => {
        let options = categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
        return `<select class="file-type-select">${options}</select>`;
    };

    const renderDemoFiles = () => {
        fileGrid.innerHTML = '';
        const demoFiles = [
            { name: 'Application.PDF', type: 'pdf', size: '2.1 MB' },
            { name: 'Photo_01.JPEG', type: 'jpeg', size: '3.4 MB' },
            { name: 'Scan.PNG', type: 'png', size: '1.8 MB' },
            { name: 'Contract.DOC', type: 'doc', size: '0.8 MB' },
            { name: 'BankStatement.PDF', type: 'pdf', size: '1.2 MB' },
            { name: 'logo_new.PNG', type: 'png', size: '0.5 MB' },
            { name: 'image_id.JPG', type: 'jpg', size: '4.1 MB' },
        ];
        demoFiles.forEach(file => {
            // ОНОВЛЕНО: Використовуємо нову функцію
            const fileCardHTML = `
                <div class="file-card">
                    <p class="file-name">${file.name}</p>
                    <div class="file-icon">${createFileIconSVG(file.type)}</div>
                    <p class="file-size">${file.size}</p>
                    <button class="remove-file-btn"><svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.7998 0.701172C8.06502 0.701172 8.3193 0.806604 8.50684 0.994141C8.69437 1.18168 8.7998 1.43596 8.7998 1.70117H12.2998C12.565 1.70117 12.8193 1.8066 13.0068 1.99414C13.1944 2.18168 13.2998 2.43596 13.2998 2.70117V3.70117C13.2998 3.96639 13.1944 4.22067 13.0068 4.4082C12.8193 4.59574 12.565 4.70117 12.2998 4.70117H11.7998V13.7012C11.7998 14.2316 11.5889 14.7402 11.2139 15.1152C10.8388 15.4903 10.3302 15.7012 9.7998 15.7012H3.7998C3.26937 15.7012 2.76081 15.4903 2.38574 15.1152C2.01067 14.7402 1.7998 14.2316 1.7998 13.7012V4.70117H1.2998C1.03459 4.70117 0.78031 4.59574 0.592773 4.4082C0.405237 4.22067 0.299805 3.96639 0.299805 3.70117V2.70117C0.299805 2.43596 0.405237 2.18168 0.592773 1.99414C0.78031 1.8066 1.03459 1.70117 1.2998 1.70117H4.7998C4.7998 1.43596 4.90524 1.18168 5.09277 0.994141C5.28031 0.806604 5.53459 0.701172 5.7998 0.701172H7.7998ZM2.7998 4.75977V13.7012C2.7998 13.9664 2.90524 14.2207 3.09277 14.4082C3.28031 14.5957 3.53459 14.7012 3.7998 14.7012H9.7998C10.065 14.7012 10.3193 14.5957 10.5068 14.4082C10.6944 14.2207 10.7998 13.9664 10.7998 13.7012V4.75977L10.6816 4.70117H2.91797L2.7998 4.75977ZM4.2998 6.20117C4.43241 6.20117 4.55955 6.25389 4.65332 6.34766C4.74709 6.44142 4.7998 6.56856 4.7998 6.70117V12.7012C4.7998 12.8338 4.74709 12.9609 4.65332 13.0547C4.55955 13.1485 4.43241 13.2012 4.2998 13.2012C4.1672 13.2012 4.04006 13.1485 3.94629 13.0547C3.85252 12.9609 3.7998 12.8338 3.7998 12.7012V6.70117C3.7998 6.56856 3.85252 6.44142 3.94629 6.34766C4.04006 6.25389 4.1672 6.20117 4.2998 6.20117ZM6.7998 6.20117C6.93241 6.20117 7.05955 6.25389 7.15332 6.34766C7.24709 6.44142 7.2998 6.56856 7.2998 6.70117V12.7012C7.2998 12.8338 7.24709 12.9609 7.15332 13.0547C7.05955 13.1485 6.93241 13.2012 6.7998 13.2012C6.6672 13.2012 6.54006 13.1485 6.44629 13.0547C6.35252 12.9609 6.2998 12.8338 6.2998 12.7012V6.70117C6.2998 6.56856 6.35252 6.44142 6.44629 6.34766C6.54006 6.25389 6.6672 6.20117 6.7998 6.20117ZM9.2998 6.20117C9.43241 6.20117 9.55955 6.25389 9.65332 6.34766C9.74709 6.44142 9.7998 6.56856 9.7998 6.70117V12.7012C9.7998 12.8338 9.74709 12.9609 9.65332 13.0547C9.55955 13.1485 9.43241 13.2012 9.2998 13.2012C9.1672 13.2012 9.04006 13.1485 8.94629 13.0547C8.85252 12.9609 8.7998 12.8338 8.7998 12.7012V6.70117C8.7998 6.56856 8.85252 6.44142 8.94629 6.34766C9.04006 6.25389 9.1672 6.20117 9.2998 6.20117ZM1.2998 3.70117H12.2998V2.70117H1.2998V3.70117Z" fill="#808080"/></svg>Remove file</button>
                    <div class="category-wrapper">
                    <p>File Type</p>
                    ${createCategorySelect()}
                    </div>
                </div>
            `;
            fileGrid.insertAdjacentHTML('beforeend', fileCardHTML);
        });
        $(fileGrid).find('.file-type-select').select2({ minimumResultsForSearch: Infinity });
    };

    const handleFileSelection = (selectedFiles) => {
        if (selectedFiles.length === 0) return;

        if (getComputedStyle(emptyView).display !== 'none') {
            emptyView.style.display = 'none';
            filesView.style.display = 'block';
            fileGrid.innerHTML = '';
        }

        Array.from(selectedFiles).forEach(file => {
            const fileName = file.name;
            const fileSize = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
            const fileExtension = fileName.split('.').pop().toLowerCase();
            
            // ОНОВЛЕНО: Використовуємо нову функцію
            const fileCardHTML = `
                <div class="file-card">
                    <p class="file-name">${fileName}</p>
                    <div class="file-icon">${createFileIconSVG(fileExtension)}</div>
                    <p class="file-size">${fileSize}</p>
                    <button class="remove-file-btn"><svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.7998 0.701172C8.06502 0.701172 8.3193 0.806604 8.50684 0.994141C8.69437 1.18168 8.7998 1.43596 8.7998 1.70117H12.2998C12.565 1.70117 12.8193 1.8066 13.0068 1.99414C13.1944 2.18168 13.2998 2.43596 13.2998 2.70117V3.70117C13.2998 3.96639 13.1944 4.22067 13.0068 4.4082C12.8193 4.59574 12.565 4.70117 12.2998 4.70117H11.7998V13.7012C11.7998 14.2316 11.5889 14.7402 11.2139 15.1152C10.8388 15.4903 10.3302 15.7012 9.7998 15.7012H3.7998C3.26937 15.7012 2.76081 15.4903 2.38574 15.1152C2.01067 14.7402 1.7998 14.2316 1.7998 13.7012V4.70117H1.2998C1.03459 4.70117 0.78031 4.59574 0.592773 4.4082C0.405237 4.22067 0.299805 3.96639 0.299805 3.70117V2.70117C0.299805 2.43596 0.405237 2.18168 0.592773 1.99414C0.78031 1.8066 1.03459 1.70117 1.2998 1.70117H4.7998C4.7998 1.43596 4.90524 1.18168 5.09277 0.994141C5.28031 0.806604 5.53459 0.701172 5.7998 0.701172H7.7998ZM2.7998 4.75977V13.7012C2.7998 13.9664 2.90524 14.2207 3.09277 14.4082C3.28031 14.5957 3.53459 14.7012 3.7998 14.7012H9.7998C10.065 14.7012 10.3193 14.5957 10.5068 14.4082C10.6944 14.2207 10.7998 13.9664 10.7998 13.7012V4.75977L10.6816 4.70117H2.91797L2.7998 4.75977ZM4.2998 6.20117C4.43241 6.20117 4.55955 6.25389 4.65332 6.34766C4.74709 6.44142 4.7998 6.56856 4.7998 6.70117V12.7012C4.7998 12.8338 4.74709 12.9609 4.65332 13.0547C4.55955 13.1485 4.43241 13.2012 4.2998 13.2012C4.1672 13.2012 4.04006 13.1485 3.94629 13.0547C3.85252 12.9609 3.7998 12.8338 3.7998 12.7012V6.70117C3.7998 6.56856 3.85252 6.44142 3.94629 6.34766C4.04006 6.25389 4.1672 6.20117 4.2998 6.20117ZM6.7998 6.20117C6.93241 6.20117 7.05955 6.25389 7.15332 6.34766C7.24709 6.44142 7.2998 6.56856 7.2998 6.70117V12.7012C7.2998 12.8338 7.24709 12.9609 7.15332 13.0547C7.05955 13.1485 6.93241 13.2012 6.7998 13.2012C6.6672 13.2012 6.54006 13.1485 6.44629 13.0547C6.35252 12.9609 6.2998 12.8338 6.2998 12.7012V6.70117C6.2998 6.56856 6.35252 6.44142 6.44629 6.34766C6.54006 6.25389 6.6672 6.20117 6.7998 6.20117ZM9.2998 6.20117C9.43241 6.20117 9.55955 6.25389 9.65332 6.34766C9.74709 6.44142 9.7998 6.56856 9.7998 6.70117V12.7012C9.7998 12.8338 9.74709 12.9609 9.65332 13.0547C9.55955 13.1485 9.43241 13.2012 9.2998 13.2012C9.1672 13.2012 9.04006 13.1485 8.94629 13.0547C8.85252 12.9609 8.7998 12.8338 8.7998 12.7012V6.70117C8.7998 6.56856 8.85252 6.44142 8.94629 6.34766C9.04006 6.25389 9.1672 6.20117 9.2998 6.20117ZM1.2998 3.70117H12.2998V2.70117H1.2998V3.70117Z" fill="#808080"/></svg>Remove file</button>
                    <div class="category-wrapper">
                    <p>File Type</p>
                    ${createCategorySelect()}
                    </div>
                </div>
            `;
            fileGrid.insertAdjacentHTML('beforeend', fileCardHTML);
        });

        $(fileGrid).find('.file-type-select:not(.select2-hidden-accessible)').select2({
            minimumResultsForSearch: Infinity
        });
        fileInput.value = '';
    };
    
    // ... (решта коду залишається без змін: openUploadPopup, closeUploadPopup, обробники подій)
    const openUploadPopup = (showDemoFiles = false) => {
        uploadPopup.classList.add('active');
        uploadOverlay.classList.add('active');
        if (showDemoFiles) {
            emptyView.style.display = 'none';
            filesView.style.display = 'block';
            renderDemoFiles();
        } else {
            emptyView.style.display = 'block';
            filesView.style.display = 'none';
            fileGrid.innerHTML = ''; 
        }
    };

    const closeUploadPopup = () => {
        uploadPopup.classList.remove('active');
        uploadOverlay.classList.remove('active');
    };

    if (addFileBtn1) {
        addFileBtn1.addEventListener('click', () => openUploadPopup(false));
    }
    if (addFileBtn2) {
        addFileBtn2.addEventListener('click', () => openUploadPopup(true));
    }
    if (closeUploadBtn) {
        closeUploadBtn.addEventListener('click', closeUploadPopup);
    }
    
    dragDropArea.addEventListener('click', () => fileInput.click());
    browseBtn.addEventListener('click', () => fileInput.click());
    addMoreBtn.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
        handleFileSelection(e.target.files);
    });
    
    function setupDragAndDrop(element) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            element.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });

        element.addEventListener('dragenter', () => element.classList.add('drag-over'));
        element.addEventListener('dragleave', () => element.classList.remove('drag-over'));
        element.addEventListener('drop', (e) => {
            element.classList.remove('drag-over');
            handleFileSelection(e.dataTransfer.files);
        });
    }

    setupDragAndDrop(dragDropArea);
    setupDragAndDrop(filesView);

    fileGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-file-btn')) {
            e.target.closest('.file-card').remove();
            if (fileGrid.children.length === 0) {
                 emptyView.style.display = 'block';
                 filesView.style.display = 'none';
            }
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const overlay = document.querySelector(".overlay");

    // Функція для ініціалізації логіки випадаючого списку
    function initApplicationsBlock() {
        const applicationsSection = document.querySelector('.applications_filter-container');
        if (!applicationsSection) return;

        // Селектори для випадаючого меню
        const userButton = document.getElementById("applications_userButton");
        const userDropdown = document.getElementById("applications_userDropdown");
        const applyBtn = userDropdown.querySelector("#applications_userDropdown-apply");
        const cancelBtn = userDropdown.querySelector("#applications_userDropdown-cancel");
        const ul = userDropdown.querySelector("ul.custom_dropdown-users");
        const searchInput = userDropdown.querySelector(".dropdown_search input");
        const selectedUsersContainer = document.getElementById("applicationsSelectedUsers");

        if (!userButton || !userDropdown || !ul || !selectedUsersContainer || !applyBtn || !cancelBtn) {
            console.error("Essential dropdown elements are missing!");
            return;
        }

        // Множина для зберігання імен обраних категорій
        let selectedCategories = new Set();
        
        // --- 1. НОВІ ДАНІ ---
        const categories = [
            "Applications", "Bank Statements", "EIDL Files", "Financials",
            "Funding Contracts", "Other", "Recorded Calls", "Salesforce"
        ];
        // --------------------

        // Створюємо елементи для сортування (якщо вони ще не існують)
        if (!ul.querySelector('.sort-item')) {
            const sortLi1 = document.createElement('li');
            sortLi1.innerHTML = `Sort A-Z`;
            sortLi1.classList.add('sort-item');
            sortLi1.addEventListener("click", () => sortCategories((a, b) => a.getAttribute("data-category").localeCompare(b.getAttribute("data-category"))));

            const sortLi2 = document.createElement('li');
            sortLi2.innerHTML = `Sort Z-A`;
            sortLi2.classList.add('sort-item');
            sortLi2.addEventListener("click", () => sortCategories((a, b) => b.getAttribute("data-category").localeCompare(a.getAttribute("data-category"))));

            ul.prepend(sortLi2);
            ul.prepend(sortLi1);
        }

        const noItemsLi = document.createElement("li");
        noItemsLi.textContent = "no categories found";
        noItemsLi.classList.add("no-items-found");
        noItemsLi.style.display = "none";
        ul.appendChild(noItemsLi);
        
        // --- 2. Зберігаємо логіку мульти-селекту ---
        categories.forEach((name) => {
            const li = document.createElement("li");
            li.setAttribute("data-category", name);
            li.innerHTML = `
              <div class="custom_checkbox">
                <svg width="11" height="8" viewBox="0 0 11 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.94558 0.255056C9.11838 0.089653 9.34834 -0.00178848 9.58693 2.65108e-05C9.82551 0.0018415 10.0541 0.0967713 10.2244 0.264784C10.3947 0.432797 10.4934 0.660752 10.4997 0.900549C10.506 1.14034 10.4194 1.37323 10.2582 1.55005L5.36357 7.70436C5.2794 7.79551 5.17782 7.86865 5.0649 7.91942C4.95198 7.97018 4.83003 7.99754 4.70636 7.99984C4.58268 8.00214 4.45981 7.97935 4.3451 7.93282C4.23038 7.88629 4.12618 7.81698 4.03872 7.72903L0.792827 4.46564C0.702435 4.38096 0.629933 4.27884 0.579648 4.16537C0.529362 4.05191 0.502323 3.92942 0.500143 3.80522C0.497964 3.68102 0.520688 3.55765 0.566961 3.44248C0.613234 3.3273 0.682108 3.22267 0.769473 3.13483C0.856838 3.047 0.960905 2.97775 1.07547 2.93123C1.19003 2.88471 1.31273 2.86186 1.43627 2.86405C1.5598 2.86624 1.68163 2.89343 1.79449 2.94398C1.90734 2.99454 2.00892 3.06743 2.09315 3.15831L4.66189 5.73967L8.92227 0.28219L8.94558 0.255056Z" fill="white"/></svg>
              </div>
              ${name}
            `;
            ul.appendChild(li);

            li.addEventListener("click", (evt) => {
                evt.stopPropagation();
                li.querySelector(".custom_checkbox").classList.toggle("checked");
            });
        });

        // Пошук
        searchInput.addEventListener("input", function () {
            const query = this.value.toLowerCase();
            const categoryLis = ul.querySelectorAll("li[data-category]");
            let visibleCount = 0;
            categoryLis.forEach(li => {
                const isVisible = li.getAttribute("data-category").toLowerCase().includes(query);
                li.style.display = isVisible ? "" : "none";
                if(isVisible) visibleCount++;
            });
            noItemsLi.style.display = visibleCount === 0 ? "block" : "none";
        });
        
        // Сортування
        function sortCategories(compareFn) {
            const categoryLis = Array.from(ul.querySelectorAll("li[data-category]"));
            categoryLis.sort(compareFn);
            categoryLis.forEach(li => ul.appendChild(li)); // Re-append to sort
        }
        
        // --- 3. Оновлюємо функцію рендерингу обраних елементів ---
        function renderSelectedCategories() {
            selectedUsersContainer.innerHTML = "";
            selectedUsersContainer.classList.toggle('empty', selectedCategories.size === 0);

            selectedCategories.forEach(name => {
                const div = document.createElement("div");
                div.classList.add("applications_selected-user");
                div.innerHTML = `
                  <span>Category:</span>
                  <span class="selected-user-name">${name}</span>
                  <span class="remove-icon" style="cursor: pointer;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="7" height="7" viewBox="0 0 7 7" fill="none"><path d="M7 0.6125L6.3875 0L3.5 2.8875L0.6125 0L0 0.6125L2.8875 3.5L0 6.3875L0.6125 7L3.5 4.1125L6.3875 7L7 6.3875L4.1125 3.5L7 0.6125Z" fill="white"/></svg>
                  </span>`;
                
                div.querySelector('.remove-icon').addEventListener("click", () => {
                    selectedCategories.delete(name);
                    const li = ul.querySelector(`li[data-category="${name}"]`);
                    if (li) li.querySelector(".custom_checkbox").classList.remove("checked");
                    renderSelectedCategories();
                    updateButtonText();
                });
                selectedUsersContainer.appendChild(div);
            });
        }

        // --- 4. Змінюємо текст кнопки ---
        function updateButtonText() {
            const count = selectedCategories.size;
            const textDiv = userButton.querySelector("div");
            textDiv.innerHTML = (count > 0) ? `Filter by Category <span class="employee-count">(${count})</span>` : "Filter by Category";
        }

        function closeDropdown() {
            userDropdown.classList.remove("active");
            userButton.classList.remove("active");
            if (overlay) overlay.classList.remove("open");
        }

        // Кнопка APPLY
        applyBtn.addEventListener("click", function () {
            selectedCategories.clear();
            const categoryLis = ul.querySelectorAll("li[data-category]");
            categoryLis.forEach(li => {
                if (li.querySelector(".custom_checkbox").classList.contains("checked")) {
                    selectedCategories.add(li.getAttribute("data-category"));
                }
            });
            renderSelectedCategories();
            updateButtonText();
            closeDropdown();
        });
        
        // Кнопка CANCEL
        cancelBtn.addEventListener("click", function () {
             const categoryLis = ul.querySelectorAll("li[data-category]");
             categoryLis.forEach(li => {
                const name = li.getAttribute("data-category");
                li.querySelector(".custom_checkbox").classList.toggle("checked", selectedCategories.has(name));
             });
            closeDropdown();
        });

        // Відкриття / закриття дропдауна
        userButton.addEventListener("click", function (e) {
            e.stopPropagation();
            const isActive = userDropdown.classList.toggle("active");
            userButton.classList.toggle("active", isActive);
            if (overlay) overlay.classList.toggle("open", isActive);
        });
        
        // Глобальний обробник для закриття
        document.addEventListener('click', function(event) {
            const isClickInside = userButton.contains(event.target) || userDropdown.contains(event.target);
            if (!isClickInside) {
                closeDropdown();
            }
        });
    }

    // Запускаємо ініціалізацію
    initApplicationsBlock();
});