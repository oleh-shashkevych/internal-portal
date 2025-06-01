import { showNotification } from '../notifications.js';

const jsonData_2025 = {
	year: '2025',
	total_due: '10,800.00',
	total_paid: '7,135.00',
	total: '10,800.00',
	data: [
		{
			itm_id: '24',
			payment_date: '05-16-2024',
			payment_amount: '28,000.00',
			payment_type: 'Ria',
			payment_details: 'This Text message 2',
			deals_paid: [
				{
					name: 'Item Name Text 4882345657568',
					url: 'pathto?itm=877',
				},
				{
					name: 'Item Name Text 675678356',
					url: 'pathto?itm=789',
				},
				{
					name: 'Item Name Text 4356347889769',
					url: 'pathto?itm=565',
				},
				{
					name: 'Item Name Text 789789',
					url: 'pathto?itm=234',
				},
				{
					name: 'Item Name Text 5684845845686',
					url: 'pathto?itm=4577',
				},
				{
					name: 'Item Name Text 5679569456343',
					url: 'pathto?itm=5765',
				},
			],
		},
		{
			itm_id: '25',
			payment_date: '08-16-2024',
			payment_amount: '20,000.00',
			payment_type: 'Ria',
			payment_details: 'This Text message 3',
			deals_paid: [
				{
					name: 'Item Name Text 4882345657568',
					url: 'pathto?itm=877',
				},
				{
					name: 'Item Name Text 675678356',
					url: 'pathto?itm=789',
				},
				{
					name: 'Item Name Text 4356347889769',
					url: 'pathto?itm=565',
				},
				{
					name: 'Item Name Text 789789',
					url: 'pathto?itm=234',
				},
				{
					name: 'Item Name Text 5684845845686',
					url: 'pathto?itm=4577',
				},
				{
					name: 'Item Name Text 5679569456343',
					url: 'pathto?itm=5765',
				},
			],
		},
	],
};

const jsonData_2018 = {
	year: '2018',
	total_due: '15,800.00',
	total_paid: '4,135.00',
	total: '15,800.00',
	data: [
		{
			itm_id: '25',
			payment_date: '01/12/2018',
			payment_amount: '29,000.00',
			payment_type: 'Ria',
			payment_details: 'This Text message 311',
			deals_paid: [
				{
					name: 'Item Name Text 4882345657568',
					url: 'pathto?itm=877',
				},
				{
					name: 'Item Name Text 675678356',
					url: 'pathto?itm=789',
				},
				{
					name: 'Item Name Text 4356347889769',
					url: 'pathto?itm=565',
				},
				{
					name: 'Item Name Text 789789',
					url: 'pathto?itm=234',
				},
				{
					name: 'Item Name Text 5684845845686',
					url: 'pathto?itm=4577',
				},
				{
					name: 'Item Name Text 5679569456343',
					url: 'pathto?itm=5765',
				},
			],
		},
		{
			itm_id: '24',
			payment_date: '04/12/2018',
			payment_amount: '20,000.00',
			payment_type: 'Ria',
			payment_details: 'This Text message 21',
			deals_paid: [
				{
					name: 'Item Name Text 4882345657568',
					url: 'pathto?itm=877',
				},
				{
					name: 'Item Name Text 675678356',
					url: 'pathto?itm=789',
				},
				{
					name: 'Item Name Text 4356347889769',
					url: 'pathto?itm=565',
				},
				{
					name: 'Item Name Text 789789',
					url: 'pathto?itm=234',
				},
				{
					name: 'Item Name Text 5684845845686',
					url: 'pathto?itm=4577',
				},
				{
					name: 'Item Name Text 5679569456343',
					url: 'pathto?itm=5765',
				},
			],
		},
		{
			itm_id: '25',
			payment_date: '01/12/2018',
			payment_amount: '29,000.00',
			payment_type: 'Ria',
			payment_details: 'This Text message 311',
			deals_paid: [
				{
					name: 'Item Name Text 4882345657568',
					url: 'pathto?itm=877',
				},
				{
					name: 'Item Name Text 675678356',
					url: 'pathto?itm=789',
				},
				{
					name: 'Item Name Text 4356347889769',
					url: 'pathto?itm=565',
				},
				{
					name: 'Item Name Text 789789',
					url: 'pathto?itm=234',
				},
				{
					name: 'Item Name Text 5684845845686',
					url: 'pathto?itm=4577',
				},
				{
					name: 'Item Name Text 5679569456343',
					url: 'pathto?itm=5765',
				},
			],
		},
	],
};

const openModalBtn = document.querySelector('.payments_addNew');
const overlay = document.querySelector('.overlay');
const closeModalBtn = document.querySelector('#close_paymentModal');

// Открыть модальное окно
openModalBtn.addEventListener('click', () => {
	overlay.style.display = 'flex';
});

// Закрыть модальное окно при клике на крестик
closeModalBtn.addEventListener('click', () => {
	overlay.style.display = 'none';
});

// Закрыть модальное окно при клике за его пределами
overlay.addEventListener('click', e => {
	if (e.target === overlay) {
		overlay.style.display = 'none';
	}
});

// Данные для списка опций
const dealsPaidData = [
	{ id: '10', name: 'David Bechtel Photography Dba Loft Creative Group #1' },
	{ id: '11', name: 'Carlie Care Kids Inc #1' },
	{ id: '15', name: 'David Bechtel Photography Dba Loft Creative Group #1' },
	{ id: '20', name: 'Hayes Lawncare And Landscape Services #1' },
	{ id: '22', name: 'C&j Mechanical Services #1' },
	{ id: '25', name: 'Low Country Fish Camp Homes Homes At Olive Shell #1' },
	{ id: '30', name: 'LSSP Corporation #9' },
	{ id: '31', name: 'TABA PERSONAL CARE LLC #1' },
	{ id: '33', name: 'Gustavo Anthony Ponce De Leon Dba Chula Vista Fence #1' },
	{ id: '40', name: "Ljl Food Management Inc Dba Tina's Cafe #1" },
];

flatpickr('#payment_date', {
	dateFormat: 'm-d-Y',
	minDate: '01.01.2018',
});

// Элементы для кастомного селекта Payment Type
const paymentTypeSelect = document.querySelector('#payment_type .select-input');
const paymentTypeOptions = document.querySelector(
	'#payment_type .options-listPay'
);
const paymentTypeHiddenInput = document.createElement('input');

// Создание скрытого поля для передачи значения
paymentTypeHiddenInput.type = 'hidden';
paymentTypeHiddenInput.name = 'payment_type';
paymentTypeHiddenInput.id = 'payment_type_input';
document.querySelector('#payment_type').appendChild(paymentTypeHiddenInput);

// Открытие/закрытие списка опций
paymentTypeSelect.addEventListener('click', () => {
	paymentTypeOptions.style.display =
		paymentTypeOptions.style.display === 'block' ? 'none' : 'block';
});

// Обработка клика на опцию
paymentTypeOptions.addEventListener('click', e => {
	const option = e.target.closest('li');
	if (!option) return;

	// Снимаем выделение со всех опций
	Array.from(paymentTypeOptions.children).forEach(child => {
		child.classList.remove('selected');
	});

	// Устанавливаем выбранную опцию
	option.classList.add('selected');
	paymentTypeSelect.innerHTML = `<span>${option.textContent}</span>`;
	paymentTypeHiddenInput.value = option.id; // Сохраняем ID выбранной опции

	// Закрываем список после выбора
	paymentTypeOptions.style.display = 'none';
});

// Закрытие списка при клике вне кастомного селекта
document.addEventListener('click', e => {
	if (!e.target.closest('#payment_type')) {
		paymentTypeOptions.style.display = 'none';
	}
});

// Элементы для кастомного селекта deals_paid
const selectInput = document.querySelector('#deals_paid_select .select-input');
const optionsList = document.querySelector('#deals_paid_select .options-list');
const hiddenInput = document.querySelector('#deals_paid_input');
const searchInput = document.querySelector('#deals_paid_select .search-input'); // Поле ввода поиска

// Генерация опций из массива
dealsPaidData.forEach(item => {
	const li = document.createElement('li');
	li.dataset.value = item.id; // Присваиваем id в data-value
	li.innerHTML = `<span class="checkbox"></span> ${item.name}`;
	optionsList.appendChild(li); // Добавляем элемент в список
});

let selectedValues = [];

// Открытие/закрытие списка опций
selectInput.addEventListener('click', () => {
	optionsList.style.display =
		optionsList.style.display === 'block' ? 'none' : 'block';
});

// Обработка клика на опцию
optionsList.addEventListener('click', e => {
	const option = e.target.closest('li:not(.search-box)');
	if (!option) return;

	const value = option.getAttribute('data-value');
	const checkbox = option.querySelector('.checkbox');

	if (selectedValues.includes(value)) {
		// Удаляем, если уже выбрано
		selectedValues = selectedValues.filter(v => v !== value);
		option.classList.remove('selected');
		checkbox.classList.remove('active');
		updateSelectedOptions();
	} else {
		// Добавляем новое значение
		selectedValues.push(value);
		option.classList.add('selected');
		checkbox.classList.add('active');
		updateSelectedOptions();
	}
});

// Обновление отображения выбранных опций
function updateSelectedOptions() {
	selectInput.innerHTML = '';
	if (selectedValues.length === 0) {
		selectInput.innerHTML = '<span class="placeholder">Select options</span>';
	} else {
		selectedValues.forEach(value => {
			const item = document.createElement('div');
			item.classList.add('selected-item');
			item.textContent = optionsList
				.querySelector(`[data-value="${value}"]`)
				.textContent.trim();

			const removeBtn = document.createElement('span');
			removeBtn.classList.add('remove');
			removeBtn.textContent = '×';
			removeBtn.addEventListener('click', () => {
				selectedValues = selectedValues.filter(v => v !== value);
				const option = optionsList.querySelector(`[data-value="${value}"]`);
				option.classList.remove('selected');
				option.querySelector('.checkbox').classList.remove('active');
				updateSelectedOptions();
			});

			item.appendChild(removeBtn);
			selectInput.appendChild(item);
		});
	}

	// Обновляем скрытое поле
	hiddenInput.value = selectedValues.join(',');
}

// Реализация поиска
const allOptions = Array.from(
	optionsList.querySelectorAll('li:not(.search-box)')
);

searchInput.addEventListener('input', e => {
	const searchValue = e.target.value.toLowerCase().trim();

	allOptions.forEach(option => {
		const text = option.textContent.toLowerCase();
		if (text.includes(searchValue)) {
			option.style.display = 'flex'; // Показываем элемент
		} else {
			option.style.display = 'none'; // Прячем элемент
		}
	});
});

// Закрытие списка при клике вне элемента
document.addEventListener('click', e => {
	if (!e.target.closest('#deals_paid_select')) {
		optionsList.style.display = 'none';
	}
});

// Маска для поля Payment Amount
new Cleave('#payment_amount', {
	numeral: true,
	numeralThousandsGroupStyle: 'thousand',
	numeralDecimalMark: '.',
	numeralDecimalScale: 2,
});

// Закрытие списка при клике вне элемента
document.addEventListener('click', e => {
	if (!e.target.closest('#deals_paid_select')) {
		optionsList.style.display = 'none';
	}
});

const form = document.querySelector('.payments_modal');
const paymentDate = document.getElementById('payment_date');
const paymentAmount = document.getElementById('payment_amount');
const paymentType = document.getElementById('payment_type_input'); // Скрытое поле для Payment Type
const paymentDetails = document.getElementById('payment_details');
const dealsPaid = document.getElementById('deals_paid_input'); // Скрытое поле для Deals Paid

form.addEventListener('submit', e => {
	e.preventDefault(); // Останавливаем отправку формы

	let isValid = true;

	// Проверяем Payment Date
	if (!paymentDate.value.trim()) {
		showError(paymentDate, 'Please select a payment date.');
		isValid = false;
	} else {
		removeError(paymentDate);
	}

	// Проверяем Payment Amount
	if (!paymentAmount.value.trim()) {
		showError(paymentAmount, 'Please enter a payment amount.');
		isValid = false;
	} else {
		removeError(paymentAmount);
	}

	// Проверяем Payment Type
	if (!paymentType.value.trim()) {
		showError(
			document.querySelector('#payment_type .select-input'),
			'Please select a payment type.'
		);
		isValid = false;
	} else {
		removeError(document.querySelector('#payment_type .select-input'));
	}

	// Проверяем Payment Details
	if (!paymentDetails.value.trim()) {
		showError(paymentDetails, 'Please enter payment details.');
		isValid = false;
	} else {
		removeError(paymentDetails);
	}

	// Если все поля заполнены, можно отправлять форму
	if (isValid) {
		console.log('Form submitted!');

		// Очистка всех полей формы
		form.reset();

		// Очистка кастомного селекта Payment Type
		paymentTypeHiddenInput.value = ''; // Сбросить скрытое поле
		paymentTypeSelect.innerHTML =
			'<span class="placeholder">Select Payment Type</span>'; // Обновить отображение

		// Очистка кастомного селекта Deals Paid
		selectedValues = []; // Очистить выбранные значения
		updateSelectedOptions(); // Обновить отображение выбранных значений (которых нет)

		// Удаление класса 'selected' у всех опций в списке Payment Type
		const paymentTypeOptionsList = document.querySelectorAll(
			'#payment_type .options-list li'
		);
		paymentTypeOptionsList.forEach(option => {
			option.classList.remove('selected');
		});

		// Удаление класса 'selected' и 'active' у всех опций в списке Deals Paid
		const dealsPaidOptionsList = document.querySelectorAll(
			'#deals_paid_select .options-list li'
		);
		dealsPaidOptionsList.forEach(option => {
			option.classList.remove('selected');
			option.querySelector('.checkbox')?.classList.remove('active');
		});

		// Добавляем сообщение о том, что форма была отправлена
		const submittedMessage = document.createElement('span');
		submittedMessage.classList.add('submitted_message');
		submittedMessage.textContent = 'Form submitted';
		form.appendChild(submittedMessage);

		// Через 2 секунды скрываем оверлей
		setTimeout(() => {
			overlay.style.display = 'none';
			// Удаляем сообщение о том, что форма отправлена
			submittedMessage.remove();
		}, 2000);
	}
});

// Функция для отображения ошибки
function showError(element, message) {
	const parent = element.closest('.custom-selectDeals') || element;

	// Если ошибка уже существует, не добавляем новую
	if (
		parent.nextElementSibling &&
		parent.nextElementSibling.classList.contains('error-message')
	) {
		return;
	}

	const error = document.createElement('span');
	error.className = 'error-message';
	error.textContent = message;
	error.style.color = 'red';
	error.style.fontSize = '12px';
	error.style.marginTop = '5px';

	parent.closest('.payments_modal-item').appendChild(error);
	parent.style.border = '1px solid red';
}

// Функция для удаления ошибки
function removeError(element) {
	const parent = element.closest('.custom-selectDeals') || element;

	const error = parent
		.closest('.payments_modal-item')
		.querySelector('.error-message');
	if (error) {
		error.remove();
	}

	// Проверяем, если поле заполнено корректно
	if (
		element.value ||
		(element.closest('.custom-selectDeals') &&
			element.closest('.custom-selectDeals').querySelector('.selected'))
	) {
		parent.style.border = '1px solid green'; // Зеленый бордер, если все верно
	} else {
		parent.style.border = ''; // Если пусто — сбрасываем цвет
	}
}

// Для инпутов и календарей (или кастомных селектов)
document.querySelector('#payment_date').addEventListener('input', function () {
	removeError(this); // Удаляем ошибку и проверяем состояние
});

document
	.querySelector('#payment_amount')
	.addEventListener('input', function () {
		removeError(this); // Удаляем ошибку и проверяем состояние
	});

document.querySelector('#payment_type').addEventListener('click', function () {
	removeError(this); // Убираем ошибку, если был выбран элемент в кастомном селекте
});

// Для кастомных селектов
paymentTypeOptions.addEventListener('click', e => {
	const option = e.target.closest('li');
	if (!option) return;

	// Убираем ошибку, если выбор сделан
	removeError(paymentTypeSelect);
});

// Для deals_paid
const dealsPaidSelect = document.querySelector(
	'#deals_paid_select .select-input'
);
const dealsPaidOptions = document.querySelector(
	'#deals_paid_select .options-list'
);

dealsPaidOptions.addEventListener('click', e => {
	const option = e.target.closest('li');
	if (!option) return;

	// Убираем ошибку, если выбор сделан
	removeError(dealsPaidSelect);
});

// Для текстового поля
const paymentDetailsTextarea = document.querySelector('#payment_details');
paymentDetailsTextarea.addEventListener('input', function () {
	removeError(this); // Удаляем ошибку и проверяем состояние
});

// Находим элементы
const selectedYear = document.getElementById('selected_year');
const yearDropdown = document.getElementById('year_dropdown');
const yearList = document.getElementById('year_list');
const yearSelect = document.getElementById('payments-year_select');
const arrow = document.getElementById('year_select-arrow');

// Открытие/закрытие дропдауна
function closeDropdown() {
	yearDropdown.classList.remove('active');
	arrow.style.transform = 'rotate(0deg)';
}

function openDropdown() {
	yearDropdown.classList.add('active');
	arrow.style.transform = 'rotate(180deg)';
}

yearSelect.addEventListener('click', e => {
	// Проверяем наличие класса "active"
	if (yearDropdown.classList.contains('active')) {
		closeDropdown();
	} else {
		openDropdown();
	}
	e.stopPropagation(); // Блокируем всплытие события
});

// Добавляем года в список
for (let year = 2025; year >= 2018; year--) {
	const listItem = document.createElement('li');
	listItem.textContent = year;
	listItem.addEventListener('click', () => {
		selectedYear.textContent = year; // Устанавливаем выбранный год
		closeDropdown(); // Закрываем dropdown
	});

	yearList.appendChild(listItem);
}

// Закрытие dropdown при клике вне
document.addEventListener('click', e => {
	if (!e.target.closest('#payments-year_select')) {
		closeDropdown();
	}
});

// Блокировка всплытия события на dropdown
yearDropdown.addEventListener('click', e => {
	e.stopPropagation();
});

const toggleButton = document.getElementById('toggle_links');
const linksList = document.querySelector('.notes_links_list');

toggleButton.addEventListener('click', () => {
	// Переключение класса 'open' для списка
	linksList.classList.toggle('open');

	// Переключение текста кнопки и класса 'active'
});

const dataByYear = {
	2025: jsonData_2025,
	2018: jsonData_2018,
};

function updatePaymentsData(year) {
	const data = dataByYear[year];

	// Обновление общих данных
	document.querySelector(
		'.payments_general-item:nth-child(1) p'
	).textContent = `$${data.total_due}`;
	document.querySelector(
		'.payments_general-item:nth-child(2) p'
	).textContent = `$${data.total_paid}`;
	document.querySelector(
		'.payments_general-item:nth-child(3) p'
	).textContent = `$${data.total}`;

	// Обновление таблицы с платежами
	const paymentsItemsContainer = document.querySelector('.payments_items');
	paymentsItemsContainer.innerHTML = ''; // Очищаем таблицу перед добавлением новых данных

	data.data.forEach(payment => {
		const paymentItem = document.createElement('div');
		paymentItem.classList.add('payments_item');
		paymentItem.id = `${payment.itm_id}`;

		// Добавляем данные платежа
		paymentItem.innerHTML = `
		                <div class="popup-delete" id="popup-delete">
                  <div class="popup-content">
                    <h3>Are you sure you want to delete this item?</h3>
                    <p class="popup-item-id" id="popup-item-id" style="display: none;"></p>
                    <div class="popup-buttons">
                      <button class="btn-delete">Delete</button>
                      <button class="btn-cancel">Cancel</button>
                    </div>
                  </div>
                </div>

		 <div class="overlay" id="edit_modal">
                  <form class="payments_modal" id="edit_payment-item">
                    <div class="payments_modal-top">
                      <h3 class="payments_modal-title">Edit item</h3>
                      <svg style="cursor: pointer;" id="close_paymentEditModal" xmlns="http://www.w3.org/2000/svg"
                        width="12" height="13" viewBox="0 0 12 13" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd"
                          d="M1.13208 12.2981C0.878239 12.5519 0.466682 12.5519 0.212841 12.2981C-0.0409992 12.0443 -0.0409992 11.6327 0.212841 11.3789L5.09172 6.49997L0.212841 1.62109C-0.0409992 1.36725 -0.0409992 0.955695 0.212841 0.701855C0.466682 0.448014 0.878239 0.448014 1.13208 0.701855L6.01096 5.58073L10.8898 0.701855C11.1437 0.448014 11.5552 0.448014 11.8091 0.701855C12.0629 0.955695 12.0629 1.36725 11.8091 1.62109L6.9302 6.49997L11.8091 11.3789C12.0629 11.6327 12.0629 12.0443 11.8091 12.2981C11.5552 12.5519 11.1437 12.5519 10.8898 12.2981L6.01096 7.41921L1.13208 12.2981Z"
                          fill="#232323" />
                      </svg>
                    </div>

                    <!-- Payment Date -->
                    <div class="payments_modal-item">
                      <label for="payment_date">Payment Date*</label>
                      <input type="text" class="payment_date_${payment.itm_id}" id="payment_date" name="payment_date">
                    </div>


                    <!-- Payment Amount -->
                    <div class="payments_modal-item">
                      <label for="payment_amount">Payment Amount*</label>
                      <input type="text" id="payment_amount" class="payment_amount_${payment.itm_id}" name="payment_amount">
                    </div>

                    <!-- Payment Type -->
                    <div class="payments_modal-item">
                      <label for="payment Type">Payment Type*</label>
                      <div class="custom-selectDeals" id="payment_type">
                        <div class="select-input" tabindex="0">
                          <span class="placeholder">Select options</span>
                          <div class="selected-options"></div>
                        </div>
                        <ul class="options-listPay">
                          <li id="payroll">Payroll</li>
                          <li id="paypal">Paypal</li>
                          <li id="ria">Ria</li>
                          <li id="payoneer">Payoneer</li>
                        </ul>
                      </div>
                    </div>

                    <!-- Payment Details -->
                    <div class="payments_modal-item">
                      <label for="payment_details">Payment Details*</label>
                      <textarea id="payment_details" name="payment_details" maxlength="500"></textarea>
                      <span class="textarea_left">500 characters left</span>
                    </div>

                    <div class="payments_modal-item">
                      <label for="deals_paid">Deals Paid</label>
                      <div class="custom-selectDeals" id="deals_paid_select">
                        <div class="select-input" tabindex="0">
                          <span class="placeholder">Select options</span>
                          <div class="selected-options"></div>
                        </div>
                        <ul class="options-list">
												<li class="search-box">
													<input type="text" class="search-input" placeholder="Search...">
												</li>
                          <!-- Поле для поиска -->
                          <!-- Опции будут добавляться сюда динамически -->
                        </ul>
                        <input type="hidden" id="deals_paid_input" name="deals_paid" value="">
                      </div>
                    </div>

                    <button type="submit" class="payments_modal-btn">
                      Save
                    </button>
                  </form>
                </div>
      <div class="payment_date">${payment.payment_date}</div>
      <div class="payment_amount">$${payment.payment_amount}</div>
      <div class="deals_paid">${payment.payment_type}</div> <!-- Добавлено payment_type -->
			<div class="notes-row">
      <div class="notes">${payment.payment_details} <!-- Здесь текст платежа -->
        <div class="notes_links">
          <ul class="notes_links_list"></ul> <!-- Список ссылок будет динамически добавляться -->						
        </div>
			</div>
			<div class="gallery_item-btns">
													<button class="toggle_links">
					<svg fill="#000000" height="14px" width="14px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
                            xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 330 330" xml:space="preserve" stroke="#000000">
                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="1.98"></g>
                            <g id="SVGRepo_iconCarrier">
                              <path id="XMLID_225_"
                                d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393 c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393 s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z">
                              </path>
                            </g>
                          </svg>
													</button> <!-- Кнопка с текстом More... -->
											<button data-id="${payment.itm_id}" class="gallery_item-edit">
												<svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" viewBox="0 0 16 15" fill="none">
													<rect x="6.79761" y="13.3181" width="9.06294" height="1.45455" fill="#8B928C" />
													<path
														d="M11.4225 0.227295L0 11.2268V14.7727H3.68235L15.1049 3.77329L11.4225 0.227295ZM3.09411 13.4051H1.42027V11.7933L9.74871 3.77332L11.4225 5.38511L3.09411 13.4051ZM10.753 2.80627L11.4225 2.16156L13.0963 3.77332L12.4268 4.41809L10.753 2.80627Z"
														fill="#8B928C" />
												</svg>
												
											</button>
											<button data-id="${payment.itm_id}" class="gallery_item-close">
												<svg xmlns="http://www.w3.org/2000/svg" width="30" height="19" viewBox="0 0 30 19" fill="none">
													<path fill-rule="evenodd" clip-rule="evenodd"
														d="M11.1463 1.5V0.5H6.57488V1.5H0.860596V3.5H16.8606V1.5H11.1463ZM1.8606 16.1667C1.8606 17.453 2.90705 18.5 4.19392 18.5H13.5273C14.8141 18.5 15.8606 17.453 15.8606 16.1667V4.5H1.8606V16.1667ZM29.8606 4.5H17.8606V6.5H29.8606V4.5ZM17.8606 9.5H26.8606V11.5H17.8606V9.5ZM22.8606 14.5H17.8606V16.5H22.8606V14.5Z"
														fill="#8B928C" />
												</svg>
											</button>
										</div>
      </div>
    `;

		const notesLinksList = paymentItem.querySelector('.notes_links_list');
		const notesLinksContainer = paymentItem.querySelector('.notes_links');
		const toggleButton = paymentItem.querySelector('.toggle_links');

		// Очищаем список
		notesLinksList.innerHTML = '';

		// Проверяем есть ли deals_paid и не пустой ли он
		if (payment.deals_paid && payment.deals_paid.length > 0) {
			// Показываем контейнер и кнопку
			notesLinksContainer.style.display = 'block';
			toggleButton.style.display = 'block';

			payment.deals_paid.forEach(deal => {
				if (deal && deal.name) {
					const linkItem = document.createElement('li');
					linkItem.innerHTML = `<a href="${deal.url}" target="_blank">${deal.name}</a>`;
					notesLinksList.appendChild(linkItem);
				}
			});
		} else {
			// Скрываем контейнер и кнопку если deals_paid пустой
			notesLinksContainer.style.display = 'none';
			toggleButton.style.display = 'none';
		}

		// Добавляем созданный элемент в контейнер
		paymentsItemsContainer.appendChild(paymentItem);

		// Добавляем обработчик для кнопки "More..."
		toggleButton.addEventListener('click', () => {
			// Переключение класса 'open' для списка
			notesLinksList.classList.toggle('open');

			// Переключение текста кнопки и класса 'active'
			if (notesLinksList.classList.contains('open')) {
				toggleButton.innerHTML = `<svg fill="#000000" height="14px" width="14px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 330 330" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path id="XMLID_224_" d="M325.606,229.393l-150.004-150C172.79,76.58,168.974,75,164.996,75c-3.979,0-7.794,1.581-10.607,4.394 l-149.996,150c-5.858,5.858-5.858,15.355,0,21.213c5.857,5.857,15.355,5.858,21.213,0l139.39-139.393l139.397,139.393 C307.322,253.536,311.161,255,315,255c3.839,0,7.678-1.464,10.607-4.394C331.464,244.748,331.464,235.251,325.606,229.393z"></path> </g></svg>`;
				toggleButton.classList.add('active');
			} else {
				toggleButton.innerHTML = `<svg fill="#000000" height="14px" width="14px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
                            xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 330 330" xml:space="preserve" stroke="#000000">
                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="1.98"></g>
                            <g id="SVGRepo_iconCarrier">
                              <path id="XMLID_225_"
                                d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393 c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393 s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z">
                              </path>
                            </g>
                          </svg>`;
				toggleButton.classList.remove('active');
			}
		});

		const deleteButtonM = paymentItem.querySelector('.gallery_item-close');

		deleteButtonM.addEventListener('click', event => {
			const itemId = deleteButtonM.dataset.id; // Получаем ID элемента
			const popup = paymentItem.querySelector('#popup-delete');
			const popupItemId = paymentItem.querySelector('#popup-item-id');
			const cancelButton = paymentItem.querySelector('.btn-cancel');

			cancelButton.addEventListener('click', () => {
				const popup = paymentItem.querySelector('#popup-delete');
				popup.style.display = 'none'; // Скрыть попап
			});

			// Обработчик для кнопки Delete
			const deleteButton = paymentItem.querySelector('.btn-delete');
			deleteButton.addEventListener('click', () => {
				const itemId = paymentItem.querySelector('#popup-item-id').textContent; // Получаем ID элемента из скрытого поля

				// Удаляем элемент из данных
				const index = dataByYear[year].data.findIndex(
					item => item.itm_id === itemId
				);
				if (index !== -1) {
					dataByYear[year].data.splice(index, 1); // Удаляем элемент
				}

				// Обновляем данные на странице (например, вызываем updatePaymentsData для перерисовки)
				updatePaymentsData(year);
				showNotification('Item deleted', 'success');

				// Закрыть попап
				const popup = paymentItem.querySelector('#popup-delete');
				popup.style.display = 'none';
			});

			// Устанавливаем ID в скрытый элемент попапа
			popupItemId.textContent = itemId;

			// Показываем попап
			popup.style.display = 'flex';
		});

		const editButton = paymentItem.querySelector('.gallery_item-edit');

		// Обработчик для кнопки "Edit"
		editButton.addEventListener('click', event => {
			const paymentId = String(editButton.dataset.id);
			const paymentData = dataByYear[year].data.find(
				item => String(item.itm_id) === paymentId
			);

			if (paymentData) {
				const editModal = paymentItem.querySelector('#edit_modal');
				editModal.style.display = 'flex';

				const close = paymentItem.querySelector('#close_paymentEditModal');
				const paymentTypeContainer = editModal.querySelector('#payment_type');
				const paymentTypeSelect =
					paymentTypeContainer.querySelector('.select-input');
				const paymentTypeOptions =
					paymentTypeContainer.querySelector('.options-listPay');
				const paymentTypeHiddenInput = document.createElement('input');

				// Reset previous setup
				resetEventListeners();

				paymentTypeHiddenInput.type = 'hidden';
				paymentTypeHiddenInput.name = 'payment_type';
				paymentTypeHiddenInput.id = 'payment_type_input';
				paymentTypeContainer.appendChild(paymentTypeHiddenInput);

				// Payment Type Dropdown Setup remains the same...
				function setupPaymentTypeDropdown() {
					const paymentTypeOptions =
						paymentTypeContainer.querySelector('.options-listPay');

			

					// Store all payment type options for filtering
					const paymentTypeItems = Array.from(
						paymentTypeOptions.querySelectorAll('li:not(.search-box)')
					);

					// Add search functionality
					
					
					// Previous click handlers
					paymentTypeSelect.removeEventListener(
						'click',
						paymentTypeSelect.clickListener
					);
					paymentTypeOptions.removeEventListener(
						'click',
						paymentTypeOptions.clickListener
					);

					paymentTypeSelect.clickListener = () => {
						paymentTypeOptions.style.display =
							paymentTypeOptions.style.display === 'block' ? 'none' : 'block';
						if (paymentTypeOptions.style.display === 'block') {
							searchInput.focus(); // Auto-focus search input when dropdown opens
						}
					};

					paymentTypeOptions.clickListener = e => {
						const option = e.target.closest('li:not(.search-box)');
						if (!option) return;

						paymentTypeContainer
							.querySelectorAll('li')
							.forEach(li => li.classList.remove('selected'));

						option.classList.add('selected');
						paymentTypeSelect.innerHTML = `<span>${option.textContent}</span>`;
						paymentTypeHiddenInput.value = option.textContent;

						paymentTypeOptions.style.display = 'none';
						searchInput.value = ''; // Clear search when option is selected
						paymentTypeItems.forEach(item => {
							item.style.display = 'block'; // Reset visibility of all items
						});
					};

					paymentTypeSelect.addEventListener(
						'click',
						paymentTypeSelect.clickListener
					);
					paymentTypeOptions.addEventListener(
						'click',
						paymentTypeOptions.clickListener
					);

					// Close dropdown when clicking outside
					document.addEventListener('click', e => {
						if (!paymentTypeContainer.contains(e.target)) {
							paymentTypeOptions.style.display = 'none';
							searchInput.value = ''; // Clear search when dropdown closes
							paymentTypeItems.forEach(item => {
								item.style.display = 'block'; // Reset visibility of all items
							});
						}
					});
				}

				function resetEventListeners() {
					close.onclick = null;
					editModal.onsubmit = null;
					const handleClickOutside = editModal.onclick;
					if (handleClickOutside) {
						editModal.removeEventListener('click', handleClickOutside);
					}
				}

				const closeHandler = () => {
					resetForm();
					editModal.style.display = 'none';
				};

				close.addEventListener('click', closeHandler);

				// Populate modal with existing payment data
				editModal.querySelector('#payment_date').value =
					paymentData.payment_date;
				editModal.querySelector('#payment_amount').value =
					paymentData.payment_amount;
				editModal.querySelector('#payment_details').value =
					paymentData.payment_details;

				flatpickr(`.payment_date_${paymentData.itm_id}`, {
					dateFormat: 'm-d-Y',
					minDate: '01.01.2018',
				});

				new Cleave(`.payment_amount_${paymentData.itm_id}`, {
					numeral: true,
					numeralThousandsGroupStyle: 'thousand',
					numeralDecimalMark: '.',
					numeralDecimalScale: 2,
				});

				// Set initial payment type
				const initialPaymentType = paymentData.payment_type.toLowerCase();
				paymentTypeContainer
					.querySelector(`#${initialPaymentType}`)
					.classList.add('selected');

				paymentTypeSelect.textContent = paymentData.payment_type;

				// Deals Paid Dropdown Setup
				const selectInput = editModal.querySelector(
					'#deals_paid_select .select-input'
				);
				const optionsList = editModal.querySelector(
					'#deals_paid_select .options-list'
				);
				const hiddenInput = editModal.querySelector('#deals_paid_input');
				const searchInput = editModal.querySelector(
					'#deals_paid_select .search-input'
				);

				// Clear previous options
				optionsList.innerHTML = '';

				// Combine existing deals_paid with dealsPaidData
				const existingDeals = paymentData.deals_paid.map(item => ({
					id: item.name, // Using name as id for existing items
					name: item.name,
				}));

				// Merge and deduplicate deals
				const allDeals = [...existingDeals, ...dealsPaidData].reduce(
					(acc, current) => {
						const x = acc.find(item => item.name === current.name);
						if (!x) {
							return acc.concat([current]);
						}
						return acc;
					},
					[]
				);

				// Generate options from combined data
				allDeals.forEach(item => {
					const li = document.createElement('li');
					li.dataset.value = item.name;
					li.dataset.id = item.id;
					li.innerHTML = `<span class="checkbox"></span> ${item.name}`;
					optionsList.appendChild(li);
				});

				// Initialize selectedValues with existing selections
				let selectedValues = [...paymentData.deals_paid.map(item => item.name)];

				function updateSelectedOptions() {
					// Очищаем содержимое selectInput
					selectInput.innerHTML = '';

					// Создаем поисковый инпут
					const searchInput = document.createElement('input');
					searchInput.type = 'text';
					searchInput.classList.add('search-input');
					searchInput.placeholder = 'Search options...';

					// Добавляем слушатель для поиска (опционально, если нужно)
					searchInput.addEventListener('input', e => {
						const searchText = e.target.value.toLowerCase();
						const options = optionsList.querySelectorAll('[data-value]');
						options.forEach(option => {
							const text = option.textContent.trim().toLowerCase();
							if (text.includes(searchText)) {
								option.style.display = '';
							} else {
								option.style.display = 'none';
							}
						});
					});

					// Вставляем поисковой инпут в начало
					selectInput.appendChild(searchInput);

					// Если нет выбранных значений
					if (selectedValues.length === 0) {
						selectInput.innerHTML +=
							'<span class="placeholder">Select options</span>';
					} else {
						selectedValues.forEach(value => {
							const item = document.createElement('div');
							item.classList.add('selected-item');
							item.textContent = optionsList
								.querySelector(`[data-value="${value}"]`)
								.textContent.trim();

							const removeBtn = document.createElement('span');
							removeBtn.classList.add('remove');
							removeBtn.textContent = '×';
							removeBtn.addEventListener('click', () => {
								selectedValues = selectedValues.filter(v => v !== value);
								const option = optionsList.querySelector(
									`[data-value="${value}"]`
								);
								option.classList.remove('selected');
								option.querySelector('.checkbox').classList.remove('active');
								updateSelectedOptions();
							});

							item.appendChild(removeBtn);
							selectInput.appendChild(item);
						});
					}

					// Обновляем скрытый инпут
					hiddenInput.value = selectedValues.join(',');
				}

				// Mark initially selected options
				selectedValues.forEach(value => {
					const option = optionsList.querySelector(`[data-value="${value}"]`);
					if (option) {
						option.classList.add('selected');
						option.querySelector('.checkbox').classList.add('active');
					}
				});

				updateSelectedOptions();

				// Deals Paid Dropdown Interactions
				selectInput.onclick = e => {
					if (e.target.classList.contains('remove')) return;
					optionsList.style.display =
						optionsList.style.display === 'block' ? 'none' : 'block';
				};

				optionsList.onclick = e => {
					const option = e.target.closest('li:not(.search-box)');
					if (!option) return;

					const value = option.getAttribute('data-value');
					const checkbox = option.querySelector('.checkbox');

					if (selectedValues.includes(value)) {
						selectedValues = selectedValues.filter(v => v !== value);
						option.classList.remove('selected');
						checkbox.classList.remove('active');
					} else {
						selectedValues.push(value);
						option.classList.add('selected');
						checkbox.classList.add('active');
					}

					updateSelectedOptions();
				};

				// Search functionality
				const allOptions = Array.from(
					optionsList.querySelectorAll('li:not(.search-box)')
				);
				searchInput.oninput = e => {
					const searchValue = e.target.value.toLowerCase().trim();
					allOptions.forEach(option => {
						const text = option.textContent.toLowerCase();
						option.style.display = text.includes(searchValue) ? 'flex' : 'none';
					});
				};

				function resetForm() {
					editModal.querySelector('form').reset();

					const paymentTypeSelect = editModal.querySelector(
						'#payment_type .select-input'
					);
					paymentTypeSelect.textContent = 'Select Payment Type';
					paymentTypeSelect
						.querySelector('.selected')
						?.classList.remove('selected');

					selectedValues = [];
					const dealsSelect = editModal.querySelector(
						'#deals_paid_select .select-input'
					);
					dealsSelect.innerHTML =
						'<span class="placeholder">Select options</span>';
					optionsList.innerHTML = '';

					optionsList.querySelectorAll('li').forEach(option => {
						option.classList.remove('selected');
						option.querySelector('.checkbox')?.classList.remove('active');
					});

					editModal
						.querySelectorAll('.error-message')
						.forEach(msg => msg.remove());
					editModal.querySelector('.success-message')?.remove();
				}

				// Submit Handler
				const submitHandler = e => {
					e.preventDefault();

					const paymentDate = editModal.querySelector('#payment_date').value;
					const paymentAmount =
						editModal.querySelector('#payment_amount').value;
					const paymentDetails =
						editModal.querySelector('#payment_details').value;
					const paymentType = editModal
						.querySelector('#payment_type')
						.querySelector('.select-input').textContent;

					const dealsPaid = selectedValues.map(value => {
						// Find the deal in either existing data or new dealsPaidData
						const existingDeal = paymentData.deals_paid.find(
							deal => deal.name === value
						);
						const newDeal = dealsPaidData.find(deal => deal.name === value);

						return {
							name: value,
							url: existingDeal
								? existingDeal.url
								: `defaultpath?itm=${newDeal ? newDeal.id : value}`,
						};
					});

					let isValid = true;

					if (!paymentDate) {
						isValid = false;
						showError('payment_date', 'Please provide a payment date');
					}

					if (!paymentAmount) {
						isValid = false;
						showError('payment_amount', 'Please provide a payment amount');
					}

					if (!paymentDetails) {
						isValid = false;
						showError('payment_details', 'Please provide payment details');
					}

					if (!isValid) return;

					const updatedPayment = dataByYear[year].data.find(
						item => String(item.itm_id) === String(paymentId)
					);

					if (updatedPayment) {
						Object.assign(updatedPayment, {
							payment_date: paymentDate,
							payment_amount: paymentAmount,
							payment_details: paymentDetails,
							payment_type: paymentType,
							deals_paid: dealsPaid,
						});
					}

					showSuccess('Payment details successfully updated!');

					setTimeout(() => {
						updatePaymentsData(year);
						showNotification('Item edited', 'success');
						editModal.style.display = 'none';
						resetForm();
					}, 2000);
				};

				function showError(fieldId, message) {
					const inputElement = editModal.querySelector(`#${fieldId}`);
					const errorMessage = document.createElement('div');
					errorMessage.classList.add('error-message');
					errorMessage.textContent = message;
					inputElement.insertAdjacentElement('afterend', errorMessage);
				}

				function showSuccess(message) {
					const successMessage = document.createElement('div');
					successMessage.classList.add('success-message');
					successMessage.textContent = message;
					editModal.querySelector('form').appendChild(successMessage);
				}

				setupPaymentTypeDropdown();
				setupOutsideClickHandler();
				editModal.addEventListener('submit', submitHandler);

				function setupOutsideClickHandler() {
					const handleClickOutside = e => {
						const isClickInsideSelect = e.target.closest('#deals_paid_select');
						if (!isClickInsideSelect && optionsList.style.display === 'block') {
							optionsList.style.display = 'none';
						}
					};

					// Добавляем слушатель на модальное окно
					editModal.addEventListener('click', handleClickOutside);
				}
			}
		});
	});
}

// Инициализация по умолчанию
updatePaymentsData(2025);

// Обработчик для выбора года
yearList.addEventListener('click', e => {
	const selectedYear = e.target.textContent;
	if (dataByYear[selectedYear]) {
		document.getElementById('selected_year').textContent = selectedYear;
		updatePaymentsData(selectedYear);
	}
});
