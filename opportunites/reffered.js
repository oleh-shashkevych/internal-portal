import { showNotification } from '../notifications.js';

document
	.querySelectorAll('.create_quote-documents--item_checkbox')
	.forEach(checkbox => {
		checkbox.addEventListener('click', function () {
			this.classList.toggle('checked');
		});
	});

// Custom select functionality
document.querySelectorAll('.custom-selectADD').forEach(select => {
	const input = select.querySelector('.select-input');
	const optionsList = select.querySelector('.options-list');
	const placeholder = input.querySelector('.placeholder');

	input.addEventListener('click', () => {
		optionsList.classList.toggle('show');
	});

	optionsList.querySelectorAll('li').forEach(option => {
		option.addEventListener('click', () => {
			placeholder.textContent = option.textContent;
			optionsList.classList.remove('show');
		});
	});

	// Close dropdown when clicking outside
	document.addEventListener('click', e => {
		if (!select.contains(e.target)) {
			optionsList.classList.remove('show');
		}
	});
});

const popup_delete = document.getElementById('popup-delete');
const deleteButtons = document.querySelectorAll('.referral-table-delete-btn');
const cancelButton = document.querySelector('.btn-cancel');
const confirmDeleteButton = document.querySelector('.btn-delete');
let currentItem = null; // Переменная для хранения элемента, который будем удалять

// Открываем popup_delete и запоминаем элемент для удаления
deleteButtons.forEach(button => {
	button.addEventListener('click', function (event) {
		event.stopPropagation();
		popup_delete.classList.add('open');
		currentItem = this.closest('.quotes_referral-table--item'); // Получаем родительский элемент
	});
});

// Закрываем popup_delete при нажатии на "Cancel"
cancelButton.addEventListener('click', function () {
	popup_delete.classList.remove('open');
	currentItem = null;
});

// Удаляем элемент при подтверждении удаления
confirmDeleteButton.addEventListener('click', function () {
	if (currentItem) {
		currentItem.remove();
		currentItem = null;
	}
	popup_delete.classList.remove('open');
});


const addNewReferral = document.getElementById('add_new-referral');

addNewReferral.addEventListener('click', function (event) {
	event.stopPropagation();
	document.getElementById('popup-add').classList.add('open');
});

const resetAddForm = () => {
	// Сброс обычных инпутов
	document.getElementById('add-item-form').reset();

	// Сброс кастомных селектов
	const customSelects = document.querySelectorAll('.custom-selectADD');
	customSelects.forEach(select => {
		const placeholder = select.querySelector('.placeholder');
		placeholder.textContent = 'Select options';
		select.style.border = '1px solid #E4E4E7'; // Возвращаем дефолтный цвет бордера
		select.classList.remove('error');
	});

	// Сброс стилей для обычных инпутов
	const inputs = document
		.getElementById('add-item-form')
		.querySelectorAll('input');
	inputs.forEach(input => {
		input.style.border = '1px solid #E4E4E7';
		input.classList.remove('error');
	});
};

// Input masks and validation
const formatCurrency = input => {
	let value = input.value.replace(/[^\d.]/g, '');
	const parts = value.split('.');
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	if (parts.length > 1) {
		parts[1] = parts[1].slice(0, 2);
	}
	input.value = parts.join('.');
};

const formatFactorRate = input => {
	// Удаляем все кроме цифр и точки
	let value = input.value.replace(/[^\d.]/g, '');

	// Проверяем, есть ли точка в значении
	if (!value.includes('.')) {
		// Если значение равно 1 и точки нет, добавляем .000
		if (value === '1') {
			value = '1.000';
		}
	}

	const numValue = parseFloat(value);

	// Проверяем границы
	if (numValue < 1) value = '1';
	if (numValue > 1.999) value = '1.999';

	input.value = value;
};
// Apply masks to currency inputs
['approval-amount', 'payback-amount', 'payment-amount'].forEach(id => {
	const input = document.getElementById(id);
	input.addEventListener('input', () => formatCurrency(input));
});

// Factor Rate validation
const factorRateInput = document.getElementById('factor-rate');
factorRateInput.addEventListener('input', () =>
	formatFactorRate(factorRateInput)
);

// Terms field validation
const termsInput = document.getElementById('terms');
termsInput.addEventListener('input', () => {
	if (termsInput.value.length > 10) {
		termsInput.value = termsInput.value.slice(0, 10);
	}
});

const closeAddPopup = () => {
	document.getElementById('popup-add').classList.remove('open');
	resetAddForm();
};

// Form submission handling
document.getElementById('add-item-form').addEventListener('submit', e => {
	e.preventDefault();

	// Validate all fields are filled
	const requiredFields = [
		'program',
		'lender',
		'approval-amount',
		'factor-rate',
		'payback-amount',
		'payment-structure',
		'payment-amount',
		'terms',
		'status',
	];

	let isValid = true;

	requiredFields.forEach(fieldId => {
		const element = document.getElementById(fieldId);
		if (element.classList.contains('custom-selectADD')) {
			const placeholder = element.querySelector('.placeholder');
			if (placeholder.textContent === 'Select options') {
				isValid = false;
				element.style.border = '1px solid red';
				element.classList.toggle('error');
			} else {
				element.style.border = '1px solid #159c2a';
			}
		} else if (!element.value) {
			isValid = false;
			element.style.border = '1px solid red';
			element.classList.toggle('error');
		} else {
			element.style.border = '1px solid #159c2a';
		}
	});

	if (!isValid) {
		showNotification('Set all fields', 'error');
		return;
	}

	// If validation passes, prepare form data
	const formData = {
		date: new Date().toISOString().split('T')[0],
		program: document.querySelector('#program .placeholder').textContent,
		lender: document.querySelector('#lender .placeholder').textContent,
		approvalAmount: document.getElementById('approval-amount').value,
		factorRate: document.getElementById('factor-rate').value,
		paybackAmount: document.getElementById('payback-amount').value,
		paymentStructure: document.querySelector('#payment-structure .placeholder')
			.textContent,
		paymentAmount: document.getElementById('payment-amount').value,
		terms: document.getElementById('terms').value,
		status: document.querySelector('#status .placeholder').textContent,
	};

	closeAddPopup();
	// Here you can send formData to your backend
	console.log('Form data:', formData);
});

// Close modal functionality

document
	.getElementById('close_addModal')
	.addEventListener('click', closeAddPopup);

const popupStips = document.getElementById('popup-stips');
const closeStipsBtn = document.getElementById('close_stipsModal');
const cancelStipsBtn = document.querySelector('.popup_edit-cancel');
const addBtn = document.querySelector('.popup_edit-add');
const itemsContainer = document.querySelector('.popup_edit-items');
const openStipsPopup = document.querySelectorAll('.open_stips-modal');
const form = document.getElementById('edit-stips');

// Open popup handlers
openStipsPopup.forEach(item => {
	item.addEventListener('click', () => {
		popupStips.classList.toggle('open');
	});
});

// Close popup handlers
function closePopup() {
	popupStips.classList.toggle('open');
}

closeStipsBtn.addEventListener('click', closePopup);
cancelStipsBtn.addEventListener('click', closePopup);

// Валидация специальных символов
function validateInput(input) {
	// Разрешаем буквы (включая кириллицу), цифры, запятые, точки, тире, нижние подчеркивания и пробелы
	const allowedCharsRegex = /[^a-zA-Zа-яА-ЯёЁ0-9,.\-_ ]/g;
	const value = input.value;

	if (allowedCharsRegex.test(value)) {
		input.value = value.replace(allowedCharsRegex, '');
		input.classList.add('error');
		setTimeout(() => {
			input.classList.remove('error');
		}, 2000);
	}
}

// Add new field functionality
function createNewField() {
	const totalFields = itemsContainer.children.length;

	if (totalFields >= 10) {
		return;
	}

	const newItem = document.createElement('div');
	newItem.className = 'popup_edit-item';

	const input = document.createElement('input');
	input.type = 'text';
	input.maxLength = 150;
	input.required = true;

	input.addEventListener('input', () => validateInput(input));

	const deleteBtn = document.createElement('button');
	deleteBtn.className = 'delete-field-btn';
	deleteBtn.type = 'button';
	deleteBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="13" viewBox="0 0 12 13" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd"
                d="M1.13208 12.2981C0.878239 12.5519 0.466682 12.5519 0.212841 12.2981C-0.0409992 12.0443 -0.0409992 11.6327 0.212841 11.3789L5.09172 6.49997L0.212841 1.62109C-0.0409992 1.36725 -0.0409992 0.955695 0.212841 0.701855C0.466682 0.448014 0.878239 0.448014 1.13208 0.701855L6.01096 5.58073L10.8898 0.701855C11.1437 0.448014 11.5552 0.448014 11.8091 0.701855C12.0629 0.955695 12.0629 1.36725 11.8091 1.62109L6.9302 6.49997L11.8091 11.3789C12.0629 11.6327 12.0629 12.0443 11.8091 12.2981C11.5552 12.5519 11.1437 12.5519 10.8898 12.2981L6.01096 7.41921L1.13208 12.2981Z"
                fill="#232323"/>
        </svg>
    `;

	deleteBtn.addEventListener('click', () => {
		newItem.remove();
	});

	newItem.appendChild(input);
	newItem.appendChild(deleteBtn);
	itemsContainer.appendChild(newItem);
}

addBtn.addEventListener('click', e => {
	e.preventDefault();
	createNewField();
});

// Обработчики кликов для всех чекбоксов
document.querySelectorAll('.edit_check').forEach(checkWrapper => {
	checkWrapper.addEventListener('click', e => {
		// Проверяем что клик не был по инпуту
		if (!e.target.classList.contains('voided_check-input')) {
			const checkbox = checkWrapper.querySelector(
				'.create_quote-documents--item_checkbox'
			);
			if (checkbox) {
				checkbox.classList.toggle('checked');
			}
		}
	});
});

// Form submission handler
form.addEventListener('submit', e => {
	e.preventDefault();

	// Validate all visible inputs
	const additionalInputs = itemsContainer.querySelectorAll('input');
	let isValid = true;

	additionalInputs.forEach(input => {
		if (!input.value.trim()) {
			isValid = false;
			input.classList.add('error');
		} else {
			input.classList.remove('error');
		}
	});

	// Validate voided check input if checkbox is checked
	const voidedCheckbox = document.querySelector(
		'.edit_check:has(.create_quote-documents--item_checkbox.checked) .voided_check-input'
	);
	if (voidedCheckbox && !voidedCheckbox.value.trim()) {
		isValid = false;
		voidedCheckbox.classList.add('error');
	} else if (voidedCheckbox) {
		voidedCheckbox.classList.remove('error');
	}

	if (!isValid) {
		showNotification('Set all fields', 'error');
		return;
	}

	// Collect form data
	const formData = {
		checkboxes: Array.from(
			document.querySelectorAll('.create_quote-documents--item_checkbox')
		).map((checkbox, index) => ({
			name: checkbox.closest('.edit_check').querySelector('p').textContent,
			checked: checkbox.classList.contains('checked'),
			value:
				index === 0 && checkbox.classList.contains('checked')
					? checkbox.closest('.edit_check').querySelector('.voided_check-input')
							.value
					: null,
		})),
		additionalFields: Array.from(additionalInputs).map(input =>
			input.value.trim()
		),
	};

	console.log('Form Data:', formData);
	// Here you can send the formData to your server or process it further

	closePopup(); // Close popup after successful submission
});

// Добавляем валидацию для существующих инпутов
document.querySelectorAll('input[type="text"]').forEach(input => {
	input.addEventListener('input', () => validateInput(input));
});