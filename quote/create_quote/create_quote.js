import { showNotification } from '../../notifications.js';

let selectedValues = {
	submitToInput: '',
	industry: '',
	tiers: '',
	checkedTierItems: [],
	teams: [],
	documents: [],
};
//кастомные селекты

const selectBlocks = document.querySelectorAll('.custom_selectBlock');

// Функция закрытия всех селектов
function closeAllSelects() {
	document
		.querySelectorAll('.options-list')
		.forEach(list => list.classList.remove('show'));
}

// Обработчик кликов по селектам
selectBlocks.forEach(block => {
	const select = block.querySelector('.custom_select');
	const optionsList = block.querySelector('.options-list');
	const activeOption = block.querySelector('.active_option');
	const options = block.querySelectorAll('li');

	select.addEventListener('click', e => {
		e.stopPropagation();
		const isOpen = optionsList.classList.contains('show');
		closeAllSelects();
		if (!isOpen) {
			optionsList.classList.add('show');
		}
	});

	// Выбор опции
	options.forEach(option => {
		option.addEventListener('click', () => {
			activeOption.textContent = option.textContent;
			activeOption.classList.add('selected');
			optionsList.classList.remove('show');

			// Обновление объекта значений
			const blockId = block.id.replace('_select', '');
			selectedValues[blockId] = option.textContent;
		});
	});
});

// Закрытие селектов при клике вне
document.addEventListener('click', closeAllSelects);

// Обработчик для input внутри .create_quote-submitBlock
const inputField = document.getElementById('submit_to-input');
if (inputField) {
	inputField.addEventListener('input', e => {
		selectedValues.submitToInput = e.target.value;
	});
}

//tiers section

// Функция обновления checkedTierItems
function updateCheckedItems() {
	selectedValues.checkedTierItems = [
		...document.querySelectorAll('.tier_block-item.checked'),
	].map(item => item.id);
}

// Клик по .tier_block-item
document.querySelectorAll('.tier_block-item').forEach(item => {
	item.addEventListener('click', e => {
		e.stopPropagation(); // Останавливаем всплытие
		item.classList.toggle('checked');
		updateCheckedItems();
	});
});

// Клик по чекбоксу .tiers_item-top-checkbox (TIER 1)
document.querySelectorAll('.tiers_item-top-checkbox').forEach(checkbox => {
	checkbox.addEventListener('click', () => {
		checkbox.classList.toggle('checked');
		const tierBlockItems = checkbox
			.closest('.tiers_item')
			.querySelectorAll('.tier_block-item');
		tierBlockItems.forEach(item =>
			item.classList.toggle('checked', checkbox.classList.contains('checked'))
		);
		updateCheckedItems();
	});
});

// Клик по .tier_letter (групповое выделение)
document.querySelectorAll('.tier_letter').forEach(letter => {
	letter.addEventListener('click', () => {
		const tierBlock = letter.closest('.tier_blockWrapper'); // Родительский блок
		const tierBlockItems = tierBlock.querySelectorAll('.tier_block-item');
		const isChecked = letter.classList.toggle('checked'); // Переключаем состояние буквы
		tierBlockItems.forEach(item => item.classList.toggle('checked', isChecked));
		updateCheckedItems();
	});
});

// teams select
const selectInput = document.querySelector('.customSelect-team .select-input');
const optionsList = document.querySelector('.customSelect-team .teams_list');
const searchInput = document.querySelector('.customSelect-team .search-input');
const hiddenInput = document.querySelector('#teams_input');
const selectedOptionsContainer = document.querySelector(
	'.customSelect-team .selected-options'
);
const placeholder = selectInput.querySelector('.placeholder'); // Плейсхолдер

let selectedValuesTeams = [];

// Открытие/закрытие списка опций
selectInput.addEventListener('click', () => {
	optionsList.style.display =
		optionsList.style.display === 'block' ? 'none' : 'block';
});

// Поиск
searchInput.addEventListener('input', e => {
	const searchValue = e.target.value.toLowerCase().trim();
	const options = optionsList.querySelectorAll('li:not(.search-box)');

	options.forEach(option => {
		const text = option.querySelector('span').textContent.toLowerCase();
		if (text.includes(searchValue)) {
			option.style.display = 'flex'; // Показываем элемент
		} else {
			option.style.display = 'none'; // Скрываем элемент
		}
	});
});

// Обработчик кликов по опциям
optionsList.addEventListener('click', e => {
	const li = e.target.closest('li');
	if (!li || li.classList.contains('search-box')) return;

	const checkbox = li.querySelector('.teams_list-checkbox');
	const teamId = li.id;
	const teamName = li.querySelector('span').textContent;

	// Проверяем, выбран ли элемент
	if (checkbox.classList.contains('active')) {
		// Убираем из выбранных
		checkbox.classList.remove('active');
		checkbox.classList.remove('checked'); // Убираем класс checked
		selectedValuesTeams = selectedValuesTeams.filter(value => value !== teamId);
		selectedValues.teams = selectedValues.teams.filter(id => id !== teamId); // Убираем из массива teams
	} else {
		// Добавляем в выбранные
		checkbox.classList.add('active');
		checkbox.classList.add('checked'); // Добавляем класс checked
		selectedValuesTeams.push(teamId);
		selectedValues.teams.push(teamId); // Добавляем в массив teams
	}

	// Обновляем отображение выбранных опций
	updateSelectedOptions();
});

// Обработчик кликов по выбранным опциям (кнопка удаления)
selectedOptionsContainer.addEventListener('click', e => {
	const removeBtn = e.target.closest('.remove');
	if (!removeBtn) return;

	const selectedItem = removeBtn.closest('.selected-item');
	const teamId = selectedItem.dataset.teamId;

	// Убираем из выбранных
	selectedValuesTeams = selectedValuesTeams.filter(value => value !== teamId);
	selectedValues.teams = selectedValues.teams.filter(id => id !== teamId); // Убираем из массива teams

	// Убираем активный класс с чекбокса и класс checked
	const checkbox = optionsList.querySelector(`#${teamId} .teams_list-checkbox`);
	checkbox.classList.remove('active');
	checkbox.classList.remove('checked'); // Убираем класс checked

	// Обновляем отображение выбранных опций
	updateSelectedOptions();
});

// Функция обновления отображения выбранных опций
function updateSelectedOptions() {
	selectedOptionsContainer.innerHTML = ''; // Очистим контейнер

	// Обновляем плейсхолдер
	if (selectedValuesTeams.length > 0) {
		placeholder.style.display = 'none'; // Скрываем плейсхолдер
		selectedValuesTeams.forEach(value => {
			const option = optionsList.querySelector(`#${value}`);
			const teamName = option.querySelector('span').textContent;

			const selectedItem = document.createElement('div');
			selectedItem.classList.add('selected-item');
			selectedItem.dataset.teamId = value; // Добавляем ID элемента в data-атрибут
			selectedItem.textContent = teamName;

			const removeBtn = document.createElement('span');
			removeBtn.classList.add('remove');
			removeBtn.textContent = '×';
			selectedItem.appendChild(removeBtn);
			selectedOptionsContainer.appendChild(selectedItem);
		});
	} else {
		placeholder.style.display = 'block'; // Показываем плейсхолдер, если ничего не выбрано
	}

	// Обновляем скрытое поле
	hiddenInput.value = selectedValuesTeams.join(',');
}

// Закрытие списка при клике вне кастомного селекта
document.addEventListener('click', e => {
	if (
		!e.target.closest('.customSelect-team') &&
		!e.target.closest('.selected-options')
	) {
		optionsList.style.display = 'none';
	}
});

selectedOptionsContainer.addEventListener('click', e => {
	e.stopPropagation(); // Останавливаем распространение события
});

//documents checkbox

const checkboxes = document.querySelectorAll(
	'.create_quote-documents--item_checkbox'
);

checkboxes.forEach(checkbox => {
	checkbox.addEventListener('click', function () {
		const parentItem = this.closest('.create_quote-documents--item');
		const itemId = parentItem.id; // Получаем ID документа

		// Тогглим класс "checked"
		this.classList.toggle('checked');

		if (this.classList.contains('checked')) {
			// Добавляем ID в массив, если его там нет
			if (!selectedValues.documents.includes(itemId)) {
				selectedValues.documents.push(itemId);
			}
		} else {
			// Удаляем ID из массива
			selectedValues.documents = selectedValues.documents.filter(
				id => id !== itemId
			);
		}
	});
});

const submitButton = document.querySelector('.create_quote-submit');
submitButton.addEventListener('click', function () {
	console.log('Отправляем данные:', selectedValues);

	// Проверяем, есть ли незаполненные поля
	const emptyFields = Object.entries(selectedValues)
		.filter(([key, value]) => {
			if (Array.isArray(value)) {
				return value.length === 0;
			}
			return !value;
		})
		.map(([key]) => key);

	if (emptyFields.length > 0) {
		showNotification(`Не заповнені поля: ${emptyFields.join(', ')}`, 'error');
	} else {
		showNotification('Всі поля заповнені! Відправка даних...', 'success');
	}
});
