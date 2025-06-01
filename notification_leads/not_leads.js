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

// Progress bar functionality
document.addEventListener('DOMContentLoaded', function () {
	const progressItems = document.querySelectorAll('.progress-bar__item');

	progressItems.forEach((item, index) => {
		const btn = item.querySelector('.progress-bar__btn');

		btn.addEventListener('click', () => {
			const isActive = item.classList.contains('active');

			if (isActive && [...progressItems].every((itm, i) => i <= index ? itm.classList.contains('active') : !itm.classList.contains('active'))) {
				// Если клик по последнему активному — сбросить все правее
				progressItems.forEach((itm, idx) => {
					itm.classList.toggle('active', idx < index);
				});
			} else {
				// Иначе установить active до нажатого включительно
				progressItems.forEach((itm, idx) => {
					itm.classList.toggle('active', idx <= index);
				});
			}
		});
	});
});

// Tabs functionality
document.addEventListener('DOMContentLoaded', function () {
	const tabContainers = document.querySelectorAll('.tabs-wrapper');

	tabContainers.forEach(wrapper => {
		const tabButtons = wrapper.querySelectorAll('.tabs-menu__button');
		const tabContents = wrapper.querySelectorAll('.tabs-content__item');

		tabButtons.forEach(button => {
			button.addEventListener('click', () => {
				const targetId = button.getAttribute('data-target');

				tabButtons.forEach(btn => btn.classList.remove('active'));
				tabContents.forEach(tab => tab.classList.remove('active'));

				button.classList.add('active');
				const targetTab = wrapper.querySelector(`#${targetId}`);
				if (targetTab) {
					targetTab.classList.add('active');
				}
			});
		});
	});
});

// QA Edit Functionality
document.addEventListener('DOMContentLoaded', function () {
	const qaItems = document.querySelectorAll('.not-leads-qa__item');

	qaItems.forEach(item => {
		const editBtn = item.querySelector('.not-leads-qa__button.edit');
		const saveBtn = item.querySelector('.not-leads-qa__button.save');
		const answerBlock = item.querySelector('.not-leads-qa__answer');
		const originalContent = answerBlock.textContent.trim();

		editBtn.addEventListener('click', () => {
			const textarea = document.createElement('textarea');
			textarea.value = originalContent;
			textarea.setAttribute('maxlength', '100');
		
			// remove span, add textarea
			answerBlock.innerHTML = '';
			answerBlock.appendChild(textarea);
		
			// remove existing error message if any
			const error = item.querySelector('.not-leads-qa__error');
			if (error) error.remove();
		
			item.classList.add('editing');
		
			// focus and move cursor to end
			textarea.focus();
			textarea.setSelectionRange(textarea.value.length, textarea.value.length);
		});

		saveBtn.addEventListener('click', () => {
			const textarea = answerBlock.querySelector('textarea');
			const value = textarea.value.trim();
		
			// Validation: only check for max 100 characters
			const isValid = value.length <= 100;
		
			// Remove previous error
			item.querySelector('.not-leads-qa__error')?.remove();
			textarea.style.borderColor = '#D0D3D1';
		
			if (!isValid) {
				textarea.style.borderColor = '#FF496B'; // Red border
				const errorMessage = document.createElement('div');
				errorMessage.classList.add('not-leads-qa__error');
				errorMessage.textContent = 'Maximum allowed length is 100 characters.';
				answerBlock.appendChild(errorMessage);
				return;
			}
		
			// Save: replace textarea with span
			const span = document.createElement('span');
			span.textContent = value;
			answerBlock.innerHTML = '';
			answerBlock.appendChild(span);
		
			item.classList.remove('editing');
		});		
	});
});

// Pre-approvals popup functionality
document.addEventListener('DOMContentLoaded', () => {
	const popup = document.getElementById('approvalPopup');
	const trigger = document.getElementById('pre-approvals-popup');
	const closeBtn = popup?.querySelector('[data-close="approvalPopup"]');
	const popupApprovalOverlay = document.getElementById('popupOverlay');
	const form = document.getElementById('approvalForm');

	const programType = document.getElementById('approvalProgramType');
	const amount = document.getElementById('approvalAmount');
	const lender = document.getElementById('approvalLender');

	trigger?.addEventListener('click', openPopup);
	closeBtn?.addEventListener('click', closePopup);

	function openPopup() {
		popup?.classList.add('active');
		popupApprovalOverlay?.classList.add('active');
		document.body.classList.add('noscroll');
		form?.reset();
		clearValidation();
	}

	function closePopup() {
		popup?.classList.remove('active');
		popupApprovalOverlay?.classList.remove('active');
		document.body.classList.remove('noscroll');
		clearValidation();
	}

	amount?.addEventListener('input', () => {
		if (!amount) return;
	
		const rawValue = amount.value;
		const oldCursor = amount.selectionStart;
	
		// Залишаємо лише цифри та крапку
		const cleaned = rawValue.replace(/[^\d.]/g, '');
	
		let [intPart, decimalPart] = cleaned.split('.');
		intPart = intPart || '0';
		intPart = intPart.replace(/^0+/, '') || '0';
	
		if (decimalPart !== undefined) {
			decimalPart = decimalPart.substring(0, 2);
		} else {
			decimalPart = '';
		}
	
		const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		let formatted = formattedInt;
	
		if (cleaned.includes('.')) {
			formatted += '.' + decimalPart;
		} else {
			formatted += '.00';
		}
	
		// Визначаємо кількість символів зліва від курсора у сирому значенні
		const leftPartRaw = rawValue.slice(0, oldCursor);
		const cleanedLeftPart = leftPartRaw.replace(/[^\d.]/g, '');
	
		// Визначаємо нову позицію курсора після форматування
		let newCursor = formatted.length;
		let cleanIndex = 0;
		for (let i = 0, count = 0; i < formatted.length && count < cleanedLeftPart.length; i++) {
			if (/\d|\./.test(formatted[i])) {
				count++;
				cleanIndex = i + 1;
			}
		}
		newCursor = cleanIndex;
	
		// Применяем формат
		amount.value = formatted;
		amount.setSelectionRange(newCursor, newCursor);
	});	

	function formatAmount(value) {
		const raw = value.replace(/[^\d.]/g, '');
		let [intPart, decimalPart] = raw.split('.');
	
		intPart = intPart.replace(/^0+/, '') || '0';
	
		// Ограничиваем decimalPart двумя символами и дополняем до двух знаков
		if (decimalPart === undefined) {
			decimalPart = '00';
		} else if (decimalPart.length === 1) {
			decimalPart = decimalPart + '0';
		} else {
			decimalPart = decimalPart.substring(0, 2);
		}
	
		intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	
		return `${intPart}.${decimalPart}`;
	}	

	form?.querySelectorAll('input, select, textarea').forEach(field => {
		field.addEventListener('input', () => {
			const group = field.closest('.form-group');
			if (group?.classList.contains('invalid')) {
				group.classList.remove('invalid');
			}
		});
		field.addEventListener('change', () => {
			const group = field.closest('.form-group');
			if (group?.classList.contains('invalid')) {
				group.classList.remove('invalid');
			}
		});
	});

	form?.addEventListener('submit', e => {
		e.preventDefault();
		const isValid = validateFields();
		if (isValid) {
			console.log('Form is valid! Submitting...');
			closePopup();
		} else {
			console.log('Form validation failed.');
		}
	});

	function validateFields() {
		let valid = true;
		clearValidation();

		if (!programType?.value) {
			markInvalid(programType);
			valid = false;
		}

		const amountValue = amount?.value.replace(/,/g, '');
		if (!amountValue || isNaN(parseFloat(amountValue)) || parseFloat(amountValue) <= 0) {
			markInvalid(amount);
			valid = false;
		}

		if (!lender?.value) {
			markInvalid(lender);
			valid = false;
		}

		return valid;
	}

	function markInvalid(el) {
		const formGroup = el?.closest('.form-group');
		if (formGroup) {
			formGroup.classList.add('invalid');
		}
	}

	function clearValidation() {
		const invalidGroups = popup?.querySelectorAll('.form-group.invalid');
		invalidGroups?.forEach(group => {
			group.classList.remove('invalid');
		});
	}	
});

// Pre-approvals edit popup functionality
document.addEventListener('DOMContentLoaded', () => {
    const editPopup = document.getElementById('editPreapprovalPopup');
    const popupOverlay = document.getElementById('popupOverlay');
    const editForm = document.getElementById('editPreapprovalForm');
    const tableBody = editPopup.closest('body');

    if (!editPopup || !popupOverlay || !editForm) {
        console.error("Popup elements not found!");
        return;
    }

    function openPopup(popupElement) {
        if (popupElement) {
            popupElement.classList.add('active');
            popupOverlay.classList.add('active');
        }
    }

    function closePopup(popupElement) {
        if (popupElement) {
            popupElement.classList.remove('active');
            popupOverlay.classList.remove('active');
        }

        // Сбрасываем классы ошибок при закрытии попапа
        resetFormErrors();
		// Убираем выделение строки
		tableBody.querySelectorAll('.not-leads-approvals__row.focused').forEach(row => {
			row.classList.remove('focused');
		});

    }

    function resetFormErrors() {
        // Сбрасываем классы invalid для всех полей
        const formGroups = editForm.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            group.classList.remove('invalid');
        });
    }

    tableBody.addEventListener('click', (event) => {
        const editButton = event.target.closest('.js-edit-preapproval');
        if (!editButton) return;

        const row = editButton.closest('.not-leads-approvals__row');
        if (!row) return;

        const rowId = row.dataset.id;
        const statusEl = row.querySelector('[data-field="status"] span');
        const amountEl = row.querySelector('[data-field="amount"]');

        const statusValue = statusEl ? statusEl.textContent.trim() : '';
        const amountValue = amountEl ? amountEl.textContent.trim() : '';

        const formStatus = editForm.querySelector('#editStatus');
        const formAmount = editForm.querySelector('#editAmount');
        const formPreapprovalId = editForm.querySelector('#editPreapprovalId');

        if (formAmount) formAmount.value = amountValue;
        if (formPreapprovalId) formPreapprovalId.value = rowId;

        if (formStatus) {
            let statusFound = false;
            for (let option of formStatus.options) {
                if (option.value === statusValue || option.text === statusValue) {
                    option.selected = true;
                    statusFound = true;
                    break;
                }
            }
        }

		tableBody.querySelectorAll('.not-leads-approvals__row.focused').forEach(row => {
			row.classList.remove('focused');
		});

		row.classList.add('focused');

        openPopup(editPopup);
    });

    editPopup.addEventListener('click', (event) => {
        if (event.target.closest('.js-popup-close')) {
             closePopup(editPopup);
        }
    });

    editForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(editForm);
        const updatedData = Object.fromEntries(formData.entries());
        const rowId = updatedData.preapprovalId;

        // Сначала проверим заполненность обязательных полей
        const requiredFields = ['editAmount', 'editStatus', 'approvalProgramType', 'approvalLender'];
        let isValid = true;

        requiredFields.forEach(fieldId => {
            const fieldElement = editForm.querySelector(`#${fieldId}`);
            const formGroup = fieldElement.closest('.form-group');
            if (fieldElement && !fieldElement.value.trim()) {
                isValid = false;
                formGroup.classList.add('invalid'); // Добавляем класс invalid
            } else {
                formGroup.classList.remove('invalid'); // Убираем класс invalid, если поле заполнено
            }
        });

        if (!isValid) {
            return;
        }

        console.log('Saving data for row:', rowId, updatedData);

        const rowToUpdate = tableBody.querySelector(`.not-leads-approvals__row[data-id="${rowId}"]`);

        if (rowToUpdate) {
            const statusContainerEl = rowToUpdate.querySelector('[data-field="status"]');
            const amountEl = rowToUpdate.querySelector('[data-field="amount"]');

            if (amountEl) amountEl.textContent = updatedData.amount;

            if (statusContainerEl) {
                const selectedStatusText = updatedData.status;
                let statusClass = '';
                switch(selectedStatusText.toLowerCase()) {
                    case 'approved': statusClass = 'tag-approved'; break;
                    case 'funded': statusClass = 'tag-funded'; break;
                    default: statusClass = 'tag-default';
                }
                 statusContainerEl.innerHTML = `<span class="${statusClass}">${selectedStatusText}</span>`;
            }

            closePopup(editPopup);

        } else {
            console.error("Row to update not found:", rowId);
        }
    });
});

// Add stips functionality
document.addEventListener('DOMContentLoaded', () => {
	const stipsPopup = document.getElementById('stipsPopup');
	const popupOverlay = document.getElementById('popupOverlay');
	const openStipsButton = document.getElementById('open_stips_button');
	const addFieldButton = stipsPopup.querySelector('.btn-add-field');
	const formListContainer = stipsPopup.querySelector('.form-list-items');
	const applyButton = stipsPopup.querySelector('.btn-apply');

	if (!stipsPopup || !popupOverlay || !openStipsButton || !addFieldButton || !formListContainer) {
		console.error("STIPs popup elements not found!");
		return;
	}

	const cancelButton = stipsPopup.querySelector('.btn-cancel');

	if (cancelButton) {
		cancelButton.addEventListener('click', () => {
			// Убираем .checked с кастомных чекбоксов
			const checkboxMarks = document.querySelectorAll('.form-check.checked');
			checkboxMarks.forEach(mark => mark.classList.remove('checked'));
		});
	}

	function openPopup(popupElement) {
		popupElement.classList.add('active');
		popupOverlay.classList.add('active');
	}

	function closePopup(popupElement) {
		popupElement.classList.remove('active');
		popupOverlay.classList.remove('active');
	
		const transitionHandler = () => {
			resetPopup();
			popupElement.removeEventListener('transitionend', transitionHandler);
		};
	
		// Ждём завершения анимации попапа
		popupElement.addEventListener('transitionend', transitionHandler);
	}

	function resetPopup() {
		// Сброс input-значений и классов
		const inputItems = formListContainer.querySelectorAll('.form-list-item');
		inputItems.forEach((item, index) => {
			const input = item.querySelector('input');
			if (input) {
				input.value = '';
			}
			item.classList.remove('invalid');
			if (index > 0) {
				item.remove(); // удаляем все кроме первого
			}
		});
	
		// Сброс кастомных чекбоксов
		const checkboxMarks = document.querySelectorAll('.form-check.checked');
		checkboxMarks.forEach(mark => mark.classList.remove('checked'));
	
		// Очистка полей form-checkbox-input
		const checkboxTextInputs = document.querySelectorAll('.form-checkbox-input');
		checkboxTextInputs.forEach(input => {
			input.value = '';
		});
	
		updateDeleteButtons();
	}		

	openStipsButton.addEventListener('click', () => {
		openPopup(stipsPopup);
	});

	document.addEventListener('click', (event) => {
		const closeTrigger = event.target.closest('[data-close]');
		if (closeTrigger) {
			const popupId = closeTrigger.getAttribute('data-close');
			const targetPopup = document.getElementById(popupId);
			if (targetPopup) {
				closePopup(targetPopup);
			}
		}
	});

	const checkboxes = document.querySelectorAll('.form-checkbox');
	checkboxes.forEach((checkbox) => {
		checkbox.addEventListener('click', (event) => {
			if (event.target.tagName.toLowerCase() === 'input') return;
			const check = checkbox.querySelector('.form-check');
			if (check) {
				check.classList.toggle('checked');
			}
		});
	});

	function createInputBlock() {
		const wrapper = document.createElement('div');
		wrapper.className = 'form-list-item form-group';

		wrapper.innerHTML = `
			<input type="text" maxlength="150" required>
			<button class="btn-delete-field" type="button">
				<svg xmlns="http://www.w3.org/2000/svg" width="12" height="13" viewBox="0 0 12 13" fill="none">
					<path fill-rule="evenodd" clip-rule="evenodd" d="M1.13208 12.2981C0.878239 12.5519 0.466682 12.5519 0.212841 12.2981C-0.0409992 12.0443 -0.0409992 11.6327 0.212841 11.3789L5.09172 6.49997L0.212841 1.62109C-0.0409992 1.36725 -0.0409992 0.955695 0.212841 0.701855C0.466682 0.448014 0.878239 0.448014 1.13208 0.701855L6.01096 5.58073L10.8898 0.701855C11.1437 0.448014 11.5552 0.448014 11.8091 0.701855C12.0629 0.955695 12.0629 1.36725 11.8091 1.62109L6.9302 6.49997L11.8091 11.3789C12.0629 11.6327 12.0629 12.0443 11.8091 12.2981C11.5552 12.5519 11.1437 12.5519 10.8898 12.2981L6.01096 7.41921L1.13208 12.2981Z" fill="#223322"/>
				</svg>
			</button>
		`;

		return wrapper;
	}

	addFieldButton.addEventListener('click', () => {
		const currentItems = formListContainer.querySelectorAll('.form-list-item');
		if (currentItems.length >= 10) {
			console.warn('Максимум 10 полей допускается.');
			return;
		}
	
		const newField = createInputBlock();
		formListContainer.appendChild(newField);
		updateDeleteButtons();
	});

	formListContainer.addEventListener('click', (event) => {
		if (event.target.closest('.btn-delete-field')) {
			const items = formListContainer.querySelectorAll('.form-list-item');
			if (items.length <= 1) return;

			const item = event.target.closest('.form-list-item');
			if (!item) return;

			const isFirstItem = item === items[0];
			if (!isFirstItem) {
				item.remove();
			}
		}
	});

	function updateDeleteButtons() {
		const items = formListContainer.querySelectorAll('.form-list-item');
		items.forEach((item, index) => {
			const deleteButton = item.querySelector('.btn-delete-field');
			if (deleteButton) {
				deleteButton.style.display = index === 0 ? 'none' : '';
			}
		});
	}

	updateDeleteButtons();

	if (applyButton) {
		applyButton.addEventListener('click', () => {
			const inputItems = formListContainer.querySelectorAll('.form-list-item');
			let isValid = true;

			inputItems.forEach(item => {
				const input = item.querySelector('input');
				if (input) {
					const trimmedValue = input.value.trim();
					if (trimmedValue === '') {
						item.classList.add('invalid');
						isValid = false;
					} else {
						item.classList.remove('invalid');
					}
				}
			});

			if (!isValid) {
				console.warn("Please fill out all required fields.");
				return;
			}

			console.log("Все поля заполнены. Можно продолжать.");
			closePopup(stipsPopup); // также вызывает resetPopup()
		});
	}
});

// Checkbox Documents functionality
const checkBlocks = document.querySelectorAll('.not-leads-documents__check');

checkBlocks.forEach(block => {
    block.addEventListener('click', () => {
        block.classList.toggle('active_cat_files');
    });
});
