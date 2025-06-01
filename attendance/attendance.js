// Получаем все элементы DOM
const add_new = document.querySelector('.attendance_newBTN');
const overlay = document.querySelector('.overlay');
const close = document.getElementById('close_attendanceModal');
const today = new Date();
const lastMonth = new Date();
lastMonth.setMonth(today.getMonth() - 1);

// Показ оверлея
add_new.addEventListener('click', () => {
	overlay.style.display = 'flex'; // Показать модальное окно
	document.body.style.overflow = 'hidden'; // Блокируем прокрутку страницы
});

// Закрытие оверлея
close.addEventListener('click', () => {
	overlay.style.display = 'none'; // Скрыть модальное окно
	document.body.style.overflow = 'auto'; // Восстановить прокрутку страницы
});

// Получаем блоки для дат
const startDateBlock = document.querySelector('.start_date-wrap');
const endDateBlock = document.querySelector('.end_date-wrap');
const startDateText = startDateBlock.querySelector('p');
const endDateText = endDateBlock.querySelector('p');

// Создаем элементы для отображения ошибок
const errorStartDate = document.createElement('p');
errorStartDate.classList.add('error-message');
errorStartDate.textContent = 'First Date is required';
startDateBlock.appendChild(errorStartDate);
errorStartDate.style.display = 'none';

// Инициализация flatpickr для End Date
const endDatePicker = flatpickr('#attendance_endDatePicker', {
	dateFormat: 'm.d.Y',
	inline: true,
	defaultDate: null, // Изначально не выбрана дата
	maxDate: today,
	onChange: function (selectedDates) {
		const endDate = selectedDates[0];
		if (endDate) {
			// Если дата выбрана, показываем её
			endDateText.textContent = endDatePicker.formatDate(endDate, 'm.d.Y');
			// Убираем ошибку и проверяем, если Start Date выбран
			errorEndDate.style.display = 'none'; // Убираем ошибку
			// Если Start Date выбран, меняем бордер на зелёный
			if (startDatePicker.selectedDates.length > 0) {
				endDateBlock.style.border = '1px solid #159c2a'; // Зелёный бордер
			}
		} else {
			// Если дата очищена, возвращаем бордер в стандартный стиль
			endDateText.textContent = ''; // Очищаем отображение даты
			endDateBlock.style.border = '1px solid #ccc'; // Стандартный бордер
		}
	},
});

// Инициализация flatpickr для Start Date
const startDatePicker = flatpickr('#attendance_startDatePicker', {
	dateFormat: 'm.d.Y',
	maxDate: today,
	inline: true,
	defaultDate: lastMonth, // Устанавливаем defaultDate для автоматического заполнения при открытии
	onReady: function (selectedDates, dateStr, instance) {
		// Проверяем, если календарь еще не был открыт, то устанавливаем defaultDate
		if (selectedDates.length === 0) {
			instance.setDate(lastMonth, true); // Устанавливаем значение при инициализации, если нет выбранной даты
		}
	},
	onChange: function (selectedDates) {
		const startDate = selectedDates[0];
		if (startDate) {
			// Если дата выбрана, скрываем ошибку и меняем стиль для Start Date
			startDateText.textContent = startDatePicker.formatDate(
				startDate,
				'm.d.Y'
			);
			errorStartDate.style.display = 'none';
			startDateBlock.style.border = '1px solid #159c2a';

			// Скрываем ошибку для End Date и восстанавливаем стиль
			errorEndDate.style.display = 'none';
			endDateBlock.style.border = '1px solid #ccc'; // Восстанавливаем стиль блока

			// Устанавливаем минимальную дату для End Date
			endDatePicker.set('minDate', startDate);
		} else {
			startDateText.textContent = 'Select date'; // Показать текст, если дата не выбрана
		}

		// Проверяем, нужно ли сбросить End Date
		const endDate = endDatePicker.selectedDates[0];
		if (endDate && endDate < startDate) {
			endDateText.textContent = ''; // Очищаем отображение даты
			endDatePicker.clear(); // Очищаем выбранную дату
		}
	},
});

// Функция для инициализации с проверкой, была ли открыта дата
function initStartDatePicker() {
	const startDatePickerWrapper = document.querySelector('.start-date-picker');
	const isOpen =
		startDatePickerWrapper &&
		!startDatePickerWrapper.classList.contains('hidden');

	if (!isOpen) {
		// Если календарь не был открыт, сбрасываем значение
		startDatePicker.clear(); // Очищаем выбранную дату
	} else {
		// Устанавливаем дату по умолчанию, если календарь открыт
		startDatePicker.setDate(lastMonth);
	}
}

// Вызовите эту функцию при инициализации, чтобы сбросить значение, если календарь не был открыт.
initStartDatePicker();

// Валидация Start Date
const startDateInput = document.querySelector('#attendance_startDatePicker');
startDateInput.addEventListener('change', () => {
	if (!startDatePicker.selectedDates.length) {
		errorStartDate.style.display = 'block';
		startDateBlock.style.border = '1px solid red';
	} else {
		errorStartDate.style.display = 'none';
		startDateBlock.style.border = '1px solid #159c2a';
	}
});

// Создаем элемент для отображения ошибки для End Date
const errorEndDate = document.createElement('p');
errorEndDate.classList.add('error-message');
errorEndDate.textContent = 'Please select a start date first.';
errorEndDate.style.display = 'none'; // Скрыто по умолчанию
endDateBlock.appendChild(errorEndDate);

// Показ календаря для Start Date
startDateBlock.addEventListener('click', () => {
	const startDatePickerWrapper = document.querySelector('.start-date-picker');
	startDatePickerWrapper.classList.toggle('hidden');
});

// Показ календаря для End Date
endDateBlock.addEventListener('click', () => {
	// Проверяем, если не выбран Start Date, то не показываем календарь для End Date
	if (startDatePicker.selectedDates.length === 0) {
		// Показываем ошибку
		errorEndDate.style.display = 'block';
		endDateBlock.style.border = '1px solid red'; // Оформляем ошибку для блока
		return; // Прерываем выполнение, если Start Date не выбран
	} else {
		// Убираем ошибку, если Start Date выбран
		errorEndDate.style.display = 'none';
		endDateBlock.style.border = '1px solid #ccc'; // Восстанавливаем стандартный стиль
	}

	const endDatePickerWrapper = document.querySelector('.end-date-picker');
	endDatePickerWrapper.classList.toggle('hidden'); // Убираем класс hidden
});
// Валидация End Date
const endDateInput = document.querySelector('#attendance_endDatePicker');
endDateInput.addEventListener('change', () => {
	// Если не выбрана дата, показываем ошибку и красим бордер в красный
	if (!endDatePicker.selectedDates.length) {
		errorEndDate.style.display = 'block';
		endDateBlock.style.border = '1px solid red';
	} else {
		// Если дата выбрана, только убираем ошибку, но не меняем бордер на зелёный
		errorEndDate.style.display = 'none';
	}
});

startDatePicker.config.onChange.push(function (selectedDates) {
	if (selectedDates.length > 0) {
		// Закрываем оба календаря
		const startDatePickerWrapper = document.querySelector('.start-date-picker');

		startDatePickerWrapper.classList.add('hidden');
	}
});

endDatePicker.config.onChange.push(function (selectedDates) {
	if (selectedDates.length > 0) {
		// Закрываем оба календаря
		const startDatePickerWrapper = document.querySelector('.start-date-picker');
		const endDatePickerWrapper = document.querySelector('.end-date-picker');

		startDatePickerWrapper.classList.add('hidden');
		endDatePickerWrapper.classList.add('hidden');
	}
});

// Валидация поля Select
const selectInput = document.querySelector('.custom-select__input');
const dropdown = document.querySelector('.custom-select__dropdown');
const hiddenInput = document.querySelector('.absent_type-input');
const errorBlockSelect = document.createElement('p');
errorBlockSelect.classList.add('error-message');
errorBlockSelect.textContent = 'Choose option';
errorBlockSelect.style.display = 'none';
selectInput.parentNode.appendChild(errorBlockSelect);

selectInput.addEventListener('click', () => {
	dropdown.classList.toggle('hidden');
});

dropdown.addEventListener('click', e => {
	if (e.target.tagName === 'LI') {
		const value = e.target.getAttribute('data-value'); // Получаем data-value
		if (!value) {
			console.error('data-value не найдено для выбранного элемента');
			return;
		}

		// Устанавливаем текст выбранного элемента в видимую часть селекта
		selectInput.textContent = e.target.textContent;

		// Устанавливаем значение в скрытый input
		hiddenInput.value = value;

		// Убираем визуальные ошибки, если были
		dropdown.classList.add('hidden'); // Скрываем дропдаун
		selectInput.style.border = '1px solid #159c2a';
		errorBlockSelect.style.display = 'none';
	}
});

// Логика для нового кастомного селекта "Paid Status"
const paidStatusInput = document.querySelector('.paid-status-input');
const paidStatusDropdown = paidStatusInput.nextElementSibling;
const paidStatusHiddenInput = document.querySelector(
	'.paid-status-hidden-input'
);
const errorBlockPaidStatus = document.createElement('p');

errorBlockPaidStatus.classList.add('error-message');
errorBlockPaidStatus.textContent = 'Choose paid status';
errorBlockPaidStatus.style.display = 'none';
paidStatusInput.parentNode.appendChild(errorBlockPaidStatus);

// Открытие/закрытие dropdown для Paid Status
paidStatusInput.addEventListener('click', () => {
	paidStatusDropdown.classList.toggle('hidden');
});

// Логика выбора значения Paid Status
paidStatusDropdown.addEventListener('click', e => {
	if (e.target.tagName === 'LI') {
		const value = e.target.getAttribute('data-value'); // Получаем значение data-value
		if (!value) {
			console.error('data-value не найдено для выбранного элемента');
			return;
		}

		// Устанавливаем текст выбранного элемента в видимую часть селекта
		paidStatusInput.textContent = e.target.textContent;

		// Устанавливаем значение в скрытый input
		paidStatusHiddenInput.value = value;

		// Убираем визуальные ошибки, если были
		paidStatusDropdown.classList.add('hidden'); // Скрываем дропдаун
		paidStatusInput.style.border = '1px solid #159c2a';
		errorBlockPaidStatus.style.display = 'none';
	}
});

// Валидация поля Notes
const notesInput = document.querySelector('#notes');
const textareaLeft = document.querySelector('.textarea_left');
const errorBlockNotes = document.createElement('p');
errorBlockNotes.classList.add('error-message');
errorBlockNotes.textContent = 'Notes are required';
errorBlockNotes.style.display = 'none';
notesInput.parentNode.appendChild(errorBlockNotes);

notesInput.addEventListener('input', () => {
	const remainingChars = 500 - notesInput.value.length;
	textareaLeft.textContent = `${remainingChars} characters left`;

	if (notesInput.value.trim().length > 0) {
		notesInput.style.border = '1px solid #159c2a';
		errorBlockNotes.style.display = 'none';
	} else {
		notesInput.style.border = '1px solid red';
		errorBlockNotes.style.display = 'block';
	}
});

// Проверка перед отправкой формы
document
	.querySelector('.attendance_modal-btn')
	.addEventListener('click', event => {
		const startDate = startDatePicker.selectedDates?.[0] || null;
		const notesValue = notesInput.value.trim();
		const selectedValue = hiddenInput ? hiddenInput.value : '';
		const paidStatusValue = paidStatusHiddenInput
			? paidStatusHiddenInput.value
			: '';

		console.log(
			'Start Date:',
			startDate
				? startDatePicker.formatDate(startDate, 'm.d.Y')
				: 'Not selected'
		);
		console.log(
			'End Date:',
			endDatePicker.selectedDates.length > 0
				? endDatePicker.formatDate(endDatePicker.selectedDates[0], 'm.d.Y')
				: 'Not selected'
		);
		console.log('Selected Option:', selectedValue);
		console.log('Paid Status:', paidStatusValue);
		console.log('Notes:', notesValue);

		let isValid = true;

		// Валидация Start Date
		if (!startDate) {
			isValid = false;
			errorStartDate.style.display = 'block';
			startDateBlock.style.border = '1px solid red';
		} else {
			errorStartDate.style.display = 'none';
			startDateBlock.style.border = '1px solid #159c2a';
		}

		// Валидация Select
		if (!selectedValue) {
			isValid = false;
			errorBlockSelect.style.display = 'block';
			selectInput.style.border = '1px solid red';
		}

		// Валидация Paid Status
		if (!paidStatusValue) {
			isValid = false;
			errorBlockPaidStatus.style.display = 'block';
			paidStatusInput.style.border = '1px solid red';
		}

		// Валидация Notes
		if (notesValue.length === 0) {
			isValid = false;
			notesInput.style.border = '1px solid red';
			errorBlockNotes.style.display = 'block';
		}

		// Если есть ошибка, отправка формы блокируется
		if (!isValid) {
			event.preventDefault();
		}
	});
