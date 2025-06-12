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
			
			closePopup();
		} else {
			
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
				
				return;
			}

			
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


document.addEventListener('DOMContentLoaded', () => {

    // --- FEE AGREEMENT TABLE LOGIC ---
    const feeAgreementTableContainer = document.getElementById('fee-agreement-table-container');
    const editFeePopup = document.getElementById('editFeeAgreementPopup');
    const deleteConfirmPopup = document.getElementById('deleteConfirmPopup');
    const popupOverlay = document.getElementById('popupOverlay');
    const createFeePopup = document.getElementById('createFeePopup');

    if (!feeAgreementTableContainer || !editFeePopup || !deleteConfirmPopup || !popupOverlay || !createFeePopup) {
        
        return;
    }

    const initialData = [
        { id: 1, name: "Nicole’s Consulting & Trucking Solutions #1", program: "SLOC", status: "Draft", routingNumber: '123456789', accountNumber: '987654321' },
        { id: 2, name: "D c expediting llc #1", program: "SBA", status: "Sent", routingNumber: '123456789', accountNumber: '987654321' },
        { id: 3, name: "The KEY2TAX Refund Service LLC #1", program: "MCA", status: "Signed", routingNumber: '123456789', accountNumber: '987654321' },
        { id: 4, name: "Go Property Restoration Llc #1", program: "SBA", status: "Cancelled", routingNumber: '123456789', accountNumber: '987654321' },
        { id: 5, name: "503 Automotive And Tire Llc #1", program: "SLOC", status: "Sent", routingNumber: '123456789', accountNumber: '987654321' }
    ];

    let tableData = initialData.map(item => ({
        ...item,
        sentDate: generateRandomDate(),
        fundingAmount: generateRandomAmount(),
        fee: generateRandomAmount() / 10,
    }));
    
    let nextId = tableData.length > 0 ? Math.max(...tableData.map(i => i.id)) + 1 : 1;

    // --- Utility Functions ---
    function generateRandomDate() {
        const start = new Date(2024, 0, 1);
        const end = new Date();
        const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;
    }

    function generateRandomAmount() {
        return Math.random() * 9999999;
    }

    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    }
    
    function getStatusClass(status) {
        return `tag-${status.toLowerCase()}`;
    }
    
    // --- Rendering ---
    function renderTable() {
        const rows = feeAgreementTableContainer.querySelectorAll('.row-wrapper');
        rows.forEach(row => row.remove());
        
        tableData.forEach(item => {
            const rowWrapper = document.createElement('div');
            rowWrapper.className = 'row-wrapper';
            rowWrapper.dataset.id = item.id;
            rowWrapper.innerHTML = `
                <div class="not-leads-fee-agreement__row">
                    <div class="not-leads-fee-agreement__item" data-label="Sent Date">${item.sentDate}</div>
                    <div class="not-leads-fee-agreement__item" data-label="Opportunity Name">${item.name}</div>
                    <div class="not-leads-fee-agreement__item" data-label="Program">${item.program}</div>
                    <div class="not-leads-fee-agreement__item" data-label="Funding Amount">${formatCurrency(item.fundingAmount)}</div>
                    <div class="not-leads-fee-agreement__item" data-label="Fee">${formatCurrency(item.fee)}</div>
                    <div class="not-leads-fee-agreement__item" data-label="Status"><span class="status-tag ${getStatusClass(item.status)}">${item.status}</span></div>
                    <div class="not-leads-fee-agreement__item actions">
                        <div class="fee-agreement-actions">
                            <button class="action-btn edit" data-action="edit" title="Edit"><svg width="11" height="14" viewBox="0 0 11 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.446184 12.4912L2.43697 12.5C2.43764 12.5 2.43831 12.5 2.43898 12.5C2.55787 12.5 2.67182 12.4527 2.75597 12.3685L10.8688 4.24189C10.9528 4.15772 11 4.04346 11 3.92438C11 3.8053 10.9527 3.69116 10.8687 3.60698L8.89549 1.63143C8.72047 1.45623 8.43676 1.45612 8.26174 1.63154L0.138721 9.76821C0.0551321 9.85194 0.00784725 9.96541 0.0075111 10.0838L3.80098e-06 12.0405C-0.00100464 12.2884 0.198779 12.4901 0.446184 12.4912ZM8.57872 2.58374L9.91794 3.92449L8.10565 5.73989L6.76666 4.39891L8.57872 2.58374ZM0.903122 10.2723L6.1328 5.03371L7.47168 6.3748L2.2541 11.6013L0.898079 11.5953L0.903122 10.2723Z" fill="#6D6D6D"></path></svg></button>
                            <button class="action-btn resend" data-action="resend" title="Resend"><svg width="14" height="12" viewBox="0 0 23 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.3103 0.233398H0.999744C0.667053 0.233398 0.39502 0.503594 0.39502 0.838123V17.1638C0.39502 17.4965 0.667053 17.7667 0.999744 17.7667H22.3103C22.6448 17.7667 22.915 17.4965 22.915 17.1638V0.838123C22.915 0.503594 22.6448 0.233398 22.3103 0.233398ZM20.5917 1.44285L11.655 10.0395L2.72017 1.44285H20.5917ZM21.7056 16.5591H1.60447V2.09536L11.2782 11.2765C11.4988 11.4548 11.8131 11.4548 12.0337 11.2765L21.7056 2.09536V16.5591Z" fill="#6D6D6D"></path></svg></button>
                            <button class="action-btn delete" data-action="delete" title="Delete"><svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.01676 11.3813C1.01676 12.4483 1.88371 13.3152 2.95069 13.3152H8.60119C9.66815 13.3152 10.5351 12.4483 10.5351 11.3813V4.42344H12V3.353H8.31411V1.84421C8.31411 1.20586 7.79283 0.68457 7.15447 0.68457H4.40165C3.7633 0.68457 3.24201 1.20586 3.24201 1.84421V3.35161H0V4.42205H1.01678L1.01676 11.3813ZM4.31247 1.84421C4.31247 1.79404 4.35149 1.75501 4.40167 1.75501H7.15449C7.20467 1.75501 7.24369 1.79404 7.24369 1.84421V3.35161H4.31247V1.84421ZM2.08941 4.42201H9.46468V11.3799C9.46468 11.8566 9.0772 12.2433 8.60122 12.2433H2.95287C2.47618 12.2433 2.08941 11.8559 2.08941 11.3799V4.42201ZM4.13033 6.33301H5.20077V10.2685H4.13033V6.33301ZM7.64626 6.33301H6.57582V10.2685H7.64626V6.33301Z" fill="#6D6D6D"></path></svg></button>
                            <button class="action-btn toggle-details" data-action="toggle" title="Open/Hide Details"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.9201 8.94995L13.4001 15.47C12.6301 16.24 11.3701 16.24 10.6001 15.47L4.08008 8.94995" stroke="#6D6D6D" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
                        </div>
                    </div>
                </div>
                <div class="additional-info-row"><div class="additional-info-content">05.29.2025 12:21 PM Jonathan Sivak Moved from Discovery Call to Declined, 5 days turnaround<br>05.23.2025 22:45 PM Nataliya Baltsevych Moved from Preliminary Review to Discovery Call, same day turnaround<br>05.23.2025 22:45 PM Nataliya Baltsevych Moved to Preliminary Review</div></div>
            `;
            feeAgreementTableContainer.appendChild(rowWrapper);
        });
    }

    // --- Popup Handling ---
    let itemToDeleteId = null;

    function openPopup(popup) {
        popup.classList.add('active');
        popupOverlay.classList.add('active');
        document.body.classList.add('noscroll');
    }

    function closeAllPopups() {
        document.querySelectorAll('.popup.active').forEach(p => p.classList.remove('active'));
        popupOverlay.classList.remove('active');
        document.body.classList.remove('noscroll');
        document.querySelectorAll('.row-wrapper').forEach(r => r.classList.remove('focused-edit', 'focused-delete'));
        itemToDeleteId = null;
    }

     function openEditPopup(itemId) {
        const itemData = tableData.find(item => item.id === itemId);
        if (!itemData) {
            
            return;
        }
    
        const form = document.getElementById('editFeeForm');
        form.reset(); // Сбрасываем форму
    
        // Заполняем поля формы
        form.querySelector('#editItemId').value = itemData.id;
        $('#editOpportunityName').val(itemData.name).trigger('change');
        form.querySelector('#editFundingAmount').value = itemData.fundingAmount.toFixed(2);
        form.querySelector('#editFeeAmount').value = itemData.fee.toFixed(2);
        form.querySelector('#editRoutingNumber').value = itemData.routingNumber || '';
        form.querySelector('#editAccountNumber').value = itemData.accountNumber || '';
        
        // Форматируем числовые поля после заполнения
        finalizeCurrencyFormat({ target: form.querySelector('#editFundingAmount') });
        finalizeCurrencyFormat({ target: form.querySelector('#editFeeAmount') });

        form.querySelectorAll('.form-group.invalid').forEach(el => el.classList.remove('invalid'));
        openPopup(editFeePopup);
    }

    function openDeletePopup(itemId) {
        itemToDeleteId = itemId;
        openPopup(deleteConfirmPopup);
    }

    // --- Form Logic: Create Fee ---
    const createFeeBtn = document.getElementById('create-fee-btn');
    const createFeeForm = document.getElementById('createFeeForm');

    // Initialize Select2 for Create Popup
    $('#opportunityName').select2({
        placeholder: "Select an opportunity",
        allowClear: true,
        dropdownParent: $('#createFeePopup')
    });
    
    // --- ДОБАВЬТЕ ЭТОТ БЛОК ДЛЯ ИНИЦИАЛИЗАЦИИ SELECT2 В EDIT POPUP ---
    $('#editOpportunityName').select2({
        placeholder: "Select an opportunity",
        allowClear: true,
        dropdownParent: $('#editFeeAgreementPopup') // Указываем родительский элемент
    });

    // --- НОВЫЙ КОД: Начало блока для кастомной маски ---

   	const fundingAmountInput = document.getElementById('fundingAmount');
    const feeAmountInput = document.getElementById('feeAmount');
    const editFundingAmountInput = document.getElementById('editFundingAmount'); // Новое поле
    const editFeeAmountInput = document.getElementById('editFeeAmount'); // Новое поле

    // Устанавливаем плейсхолдер
    fundingAmountInput.setAttribute('placeholder', '9,999,999.00');
    feeAmountInput.setAttribute('placeholder', '9,999,999.00');

    // Функция для форматирования значения в реальном времени
    function formatCurrencyInput(e) {
        const input = e.target;
        let value = input.value;
        
        // 1. Очищаем значение, оставляем только цифры и одну точку
        let numericValue = value.replace(/[^0-9.]/g, '');
        const parts = numericValue.split('.');
        if (parts.length > 2) {
            numericValue = parts[0] + '.' + parts.slice(1).join('');
        }
    
        let [integerPart, decimalPart] = numericValue.split('.');
    
        // 2. Ограничиваем целую часть до 7 знаков
        if (integerPart) {
            integerPart = integerPart.substring(0, 7);
        } else {
            integerPart = '';
        }
    
        // 3. Ограничиваем дробную часть до 2 знаков
        if (decimalPart) {
            decimalPart = decimalPart.substring(0, 2);
        }
    
        // 4. Форматируем целую часть, добавляя запятые
        let formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        
        // 5. Собираем и устанавливаем новое значение
        let newValue = formattedInteger;
        if (decimalPart !== undefined) {
            newValue += '.' + decimalPart;
        } else if (numericValue.includes('.')) {
            newValue += '.';
        }
        
        input.value = newValue;
    }

    // Функция для добавления .00, если нужно
    function finalizeCurrencyFormat(e) {
        const input = e.target;
        let value = input.value;
    
        if (value) {
            // Убираем точку в конце, если она есть
            if (value.endsWith('.')) {
                value = value.slice(0, -1);
            }
            
            let [integerPart, decimalPart] = value.split('.');
    
            // Если нет дробной части, добавляем ".00"
            if (!decimalPart) {
                value += '.00';
            } else {
                // Если только одна цифра после точки, добавляем "0"
                if (decimalPart.length === 1) {
                    value += '0';
                }
            }
            input.value = value;
        }
    }

    fundingAmountInput.addEventListener('input', formatCurrencyInput);
    feeAmountInput.addEventListener('input', formatCurrencyInput);
    editFundingAmountInput.addEventListener('input', formatCurrencyInput); // Новый слушатель
    editFeeAmountInput.addEventListener('input', formatCurrencyInput); // Новый слушатель

    fundingAmountInput.addEventListener('blur', finalizeCurrencyFormat);
    feeAmountInput.addEventListener('blur', finalizeCurrencyFormat);
    editFundingAmountInput.addEventListener('blur', finalizeCurrencyFormat); // Новый слушатель
    editFeeAmountInput.addEventListener('blur', finalizeCurrencyFormat); // Новый слушатель
    
    document.getElementById('routingNumber').addEventListener('input', (e) => e.target.value = e.target.value.replace(/[^0-9]/g, ''));
    document.getElementById('accountNumber').addEventListener('input', (e) => e.target.value = e.target.value.replace(/[^0-9]/g, ''));
    document.getElementById('editRoutingNumber').addEventListener('input', (e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')); // Новый слушатель
    document.getElementById('editAccountNumber').addEventListener('input', (e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')); // Новый слушатель

    function validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            const group = field.closest('.form-group');
            if (!field.value || field.value.trim() === '') {
                group.classList.add('invalid');
                isValid = false;
            } else {
                group.classList.remove('invalid');
            }
        });
        return isValid;
    }

    createFeeBtn.addEventListener('click', () => {
        createFeeForm.reset();
        $('#opportunityName').val(null).trigger('change'); // Reset Select2
        createFeeForm.querySelectorAll('.form-group.invalid').forEach(el => el.classList.remove('invalid'));
        openPopup(createFeePopup);
    });

    createFeeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateForm(createFeeForm)) {
            const formData = new FormData(createFeeForm);
            const programs = ['SLOC', 'SBA', 'MCA'];
            const statuses = ['Draft', 'Sent', 'Signed', 'Cancelled'];

            // --- ИЗМЕНЕННЫЙ КОД: Правильное получение числовых значений ---
            const fundingAmountRaw = formData.get('fundingAmount') || '0';
            const feeAmountRaw = formData.get('fee') || '0';
            
            const newItem = {
                id: nextId++,
                name: formData.get('opportunityName'),
                // Очищаем строку от всего, кроме цифр и точки, перед преобразованием
                fundingAmount: parseFloat(fundingAmountRaw.replace(/[^\d.]/g, '')),
                fee: parseFloat(feeAmountRaw.replace(/[^\d.]/g, '')),
                sentDate: generateRandomDate(),
                program: programs[Math.floor(Math.random() * programs.length)],
                status: statuses[Math.floor(Math.random() * statuses.length)],
            };
            
            tableData.push(newItem);
            renderTable();
            closeAllPopups(); // Close popup on successful submission
        }
    });

	const editFeeForm = document.getElementById('editFeeForm');
    editFeeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateForm(editFeeForm)) {
            const formData = new FormData(editFeeForm);
            const itemId = parseInt(formData.get('itemId'), 10);
            const itemIndex = tableData.findIndex(item => item.id === itemId);
    
            if (itemIndex !== -1) {
                // Обновляем данные в массиве
                tableData[itemIndex].name = formData.get('opportunityName');
                tableData[itemIndex].fundingAmount = parseFloat(formData.get('fundingAmount').replace(/[^\d.]/g, ''));
                tableData[itemIndex].fee = parseFloat(formData.get('fee').replace(/[^\d.]/g, ''));
                tableData[itemIndex].routingNumber = formData.get('routingNumber');
                tableData[itemIndex].accountNumber = formData.get('accountNumber');
                
                renderTable(); // Перерисовываем таблицу с обновленными данными
            } else {
                
            }
    
            closeAllPopups(); // Закрываем попап
        }
    });

    // --- Table Action Handling ---
    function handleTableClick(e) {
        const actionBtn = e.target.closest('.action-btn');
        if (!actionBtn) return;

        const action = actionBtn.dataset.action;
        const rowWrapper = actionBtn.closest('.row-wrapper');
        const itemId = parseInt(rowWrapper.dataset.id, 10);
        
        document.querySelectorAll('.row-wrapper').forEach(r => r.classList.remove('focused-edit', 'focused-delete'));

        switch(action) {
            case 'edit':
                rowWrapper.classList.add('focused-edit');
                openEditPopup(itemId);
                break;
            case 'delete':
                rowWrapper.classList.add('focused-delete');
                openDeletePopup(itemId);
                break;
            case 'toggle':
                rowWrapper.classList.toggle('expanded');
                break;
            case 'resend':
                alert('Resend functionality to be implemented.');
                break;
        }
    }

    function confirmDelete() {
        if (itemToDeleteId === null) return;
        tableData = tableData.filter(item => item.id !== itemToDeleteId);
        renderTable();
        closeAllPopups();
    }

    // --- General Event Listeners ---
    feeAgreementTableContainer.addEventListener('click', handleTableClick);

    document.querySelectorAll('.js-popup-close').forEach(btn => {
        btn.addEventListener('click', closeAllPopups);
    });
    
    document.getElementById('confirmDeleteBtn').addEventListener('click', confirmDelete);
    document.getElementById('cancelDeleteBtn').addEventListener('click', closeAllPopups);

    // Initial Render
    renderTable();
});
