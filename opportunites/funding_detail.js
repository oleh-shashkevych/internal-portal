import { showNotification } from '../notifications.js';

document.addEventListener('DOMContentLoaded', function () {
	// 1. Инициализация flatpickr на календарных полях с привязкой к родительскому элементу

	document
		.querySelectorAll('.funding_details-editModal_calendarField')
		.forEach(function (calendarField) {
			const span = calendarField.querySelector('span');
			const dateValue = span.innerText.trim();

			// Создаем input и скрываем его с помощью класса visually-hidden
			const input = document.createElement('input');
			input.type = 'text';
			input.value = dateValue;
			input.classList.add('visually-hidden'); // input не виден, но присутствует в DOM
			calendarField.appendChild(input);

			flatpickr(input, {
				dateFormat: 'm-d-Y', // формат MM-DD-YYYY
				defaultDate: dateValue,
				disableMobile: true, // всегда используем кастомный flatpickr
				appendTo: calendarField, // календарь рендерится внутри контейнера
				onChange: function (selectedDates, dateStr) {
					span.innerText = dateStr;
				},
			});

			// По клику на контейнер открываем кастомный flatpickr
			calendarField.addEventListener('click', function () {
				input._flatpickr.open();
			});
		});

	// 2. Функционал кастомного выпадающего списка (select)
	const placeholderText = 'Choose option';
	const placeholderColor = '#aaa';
	const normalColor = '#232323';

	document
		.querySelectorAll('.funding_details-editModal_customSelect')
		.forEach(function (select) {
			const span = select.querySelector('span');
			const dropdown = select.querySelector('.options-list');

			if (span.textContent.trim() === placeholderText) {
				span.style.color = placeholderColor;
			} else {
				span.style.color = normalColor;
			}

			select.addEventListener('click', function (e) {
				e.stopPropagation();
				dropdown.style.display =
					dropdown.style.display === 'block' ? 'none' : 'block';
			});

			dropdown.querySelectorAll('li').forEach(function (item) {
				item.addEventListener('click', function (e) {
					e.stopPropagation();
					span.textContent = item.textContent;
					span.style.color = normalColor;
					dropdown.style.display = 'none';
					// Сбрасываем поворот стрелки после выбора опции
				});
			});
		});
	document.addEventListener('click', function () {
		document
			.querySelectorAll('.funding_details-editModal_customSelect .options-list')
			.forEach(function (dd) {
				dd.style.display = 'none';
			});
	});

	// 3. Функционал кастомных чекбоксов
	document
		.querySelectorAll('.funding_details-editModal_checkboxField')
		.forEach(function (field) {
			field.addEventListener('click', function () {
				const checkbox = field.querySelector('.custom_checkbox');
				checkbox.classList.toggle('checked');
			});
		});

	// 4. Маска для полей суммы (формат валюты, как formatCurrency)
	document
		.querySelectorAll('input.default_formatted')
		.forEach(function (input) {
			input.addEventListener('input', function () {
				// Удаляем все символы, кроме цифр и точки
				let value = input.value.replace(/[^\d.]/g, '');
				const parts = value.split('.');
				// Добавляем разделитель тысяч в целую часть
				parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
				// Ограничиваем дробную часть до 2 цифр, если она есть
				if (parts.length > 1) {
					parts[1] = parts[1].slice(0, 2);
				}
				input.value = parts.join('.');
			});
		});

	// 5. Маска для поля Rate (формат ставки, как formatFactorRate)
	const formatFactorRate = input => {
		// Удаляем все символы, кроме цифр и точки
		let value = input.value.replace(/[^\d.]/g, '');

		// Если значение не начинается с "1.", добавляем его
		if (!value.startsWith('1.')) {
			// Убираем возможное начальное "1" с точкой, чтобы избежать дублирования,
			// затем добавляем корректный префикс
			value = '1.' + value.replace(/^1\.?/, '');
		}

		// Разбиваем строку по точке
		const parts = value.split('.');
		// Целая часть должна быть равна "1"
		const integerPart = '1';
		// Объединяем все остальные части как дробную, оставляя только цифры
		let decimalPart = parts.slice(1).join('').replace(/[^\d]/g, '');

		// Собираем итоговое значение
		let formatted = integerPart + '.' + decimalPart;

		// Проверяем границы
		const numValue = parseFloat(formatted);
		if (numValue < 1) {
			formatted = '1.';
		} else if (numValue > 1.999) {
			formatted = '1.999';
		}

		input.value = formatted;
	};

	const rateInput = document.querySelector('input.rate_formatted');

	// При фокусе, если поле пустое, вставляем маску "1." и устанавливаем курсор после точки
	rateInput.addEventListener('focus', e => {
		if (e.target.value === '') {
			e.target.value = '1.';
			// Устанавливаем позицию курсора после "1."
			e.target.setSelectionRange(2, 2);
		}
	});

	// Обработка ввода
	rateInput.addEventListener('input', () => {
		formatFactorRate(rateInput);
	});

	// При потере фокуса, если ничего не введено после точки, очищаем поле
	rateInput.addEventListener('blur', e => {
		if (e.target.value === '1.') {
			e.target.value = '';
		}
	});
});

document
	.querySelectorAll(
		'.funding_details-editModal_field input, .funding_details-editModal_field textarea'
	)
	.forEach(function (input) {
		input.addEventListener('focus', function () {
			const field = input.closest('.funding_details-editModal_field');
			if (field) {
				field.style.border = '1px solid black';
			}
		});
		input.addEventListener('blur', function () {
			const field = input.closest('.funding_details-editModal_field');
			if (field) {
				field.style.border = '';
			}
		});
	});

document
	.querySelector('.funding_details-editModal_save')
	.addEventListener('click', function (e) {
		e.preventDefault();
		let isValid = true;

		// Проверяем все поля с классом funding_details-editModal_field
		document
			.querySelectorAll('.funding_details-editModal_field')
			.forEach(field => {
				// Сбрасываем предыдущую ошибку
				field.classList.remove('error');

				// Если внутри поля есть input или textarea, проверяем их значение
				const inputEl = field.querySelector('input, textarea');
				if (inputEl) {
					if (inputEl.value.trim() === '') {
						field.classList.add('error');
						isValid = false;
					}
				} else {
					// Для кастомных селектов/календарей – проверяем содержимое span
					const spanEl = field.querySelector('span');
					if (spanEl) {
						const text = spanEl.innerText.trim();
						if (text === '' || text === 'Choose option') {
							field.classList.add('error');
							isValid = false;
						}
					}
				}
			});

		// Проверяем поля-чекбоксы с классом funding_details-editModal_checkboxField
		document
			.querySelectorAll('.funding_details-editModal_checkboxField')
			.forEach(field => {
				field.classList.remove('error');
				// Если элемент чекбокса не отмечен (нет класса "checked"), добавляем ошибку
				const checkbox = field.querySelector('.custom_checkbox');
				if (checkbox && !checkbox.classList.contains('checked')) {
					checkbox.classList.add('error');
					isValid = false;
				}
			});

		if (isValid) {
			showNotification('Form submitted', 'success');

			// Сбрасываем форму (если форма имеет нативный метод reset)
			document.querySelector('.funding_details-editModal').reset();

			// Через 2 секунды снимаем класс "selected" с модального окна и возвращаем выбранное состояние основному блоку
			setTimeout(() => {
				document
					.querySelector('.funding_details-editModal')
					.classList.remove('selected');
				document.querySelector('.funding_details').classList.add('selected');
			}, 2000);
		} else {
			showNotification('Set all fields', 'error');
		}
	});
