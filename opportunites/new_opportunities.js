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