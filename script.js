let timeoutID = null;

const searchInput = document.getElementById('search');
const searchContainer = document.querySelector('.search');
const cancelButtonInput = document.querySelector('.cancel');
const dropdownMenu = document.querySelector('.dropdown-menu');

// Имитация списка данных (замени на API-запрос, если нужно)
const mockData = [
	{ business_name: 'Apple', program_type: 'Tech', url: 'https://apple.com' },
	{
		business_name: 'Amazon',
		program_type: 'E-commerce',
		url: 'https://amazon.com',
	},
	{
		business_name: 'Adobe',
		program_type: 'Software',
		url: 'https://adobe.com',
	},
	{
		business_name: 'Netflix',
		program_type: 'Streaming',
		url: 'https://netflix.com',
	},
	{
		business_name: 'Nike',
		program_type: 'Sportswear',
		url: 'https://nike.com',
	},
];

// Функция поиска по данным
function getMockData() {
	const query = searchInput.value.trim().toLowerCase();
	if (!query) {
		dropdownMenu.style.display = 'none';
		return;
	}

	// Фильтруем данные
	const filteredData = mockData.filter(item =>
		item.business_name.toLowerCase().includes(query)
	);

	// Если ничего не найдено — скрываем дропдаун
	if (filteredData.length === 0) {
		dropdownMenu.style.display = 'none';
		return;
	}

	// Заполняем дропдаун
	dropdownMenu.innerHTML = filteredData
		.map(
			item =>
				`<a class="dropdown-item" target="_blank" href="${item.url}">${item.business_name}</a>`
		)
		.join('');

	// Показываем `dropdown-menu`
	dropdownMenu.style.display = 'block';
}

// Обновление состояния поиска
function updateSearchState() {
	if (searchInput.value.trim().length > 0) {
		searchContainer.classList.add('active');
		document.body.classList.add('active-search');
		clearTimeout(timeoutID);
		timeoutID = setTimeout(getMockData, 300); // Debounce
	} else {
		searchContainer.classList.remove('active');
		document.body.classList.remove('active-search');
		dropdownMenu.style.display = 'none';
	}
}

// Показываем дропдаун при фокусе (если есть текст)
searchInput.addEventListener('focus', function () {
	searchContainer.classList.add('active');
	if (searchInput.value.trim().length > 0) {
		getMockData();
	}
});

// Обрабатываем ввод текста
searchInput.addEventListener('input', updateSearchState);

// Очистка поля поиска
cancelButtonInput.addEventListener('click', function () {
	searchInput.value = '';
	updateSearchState();
});

// Закрытие дропдауна при клике вне поиска
document.addEventListener('click', function (e) {
	if (!searchContainer.contains(e.target) && !dropdownMenu.contains(e.target)) {
		searchContainer.classList.remove('active');
		document.body.classList.remove('active-search');
		dropdownMenu.style.display = 'none';
	}
});

// Выбор элемента из дропдауна
dropdownMenu.addEventListener('click', function (e) {
	if (e.target.classList.contains('dropdown-item')) {
		searchInput.value = e.target.textContent;
		updateSearchState();
	}
});

const collapseButtons = document.querySelectorAll('.collapse-parent');

collapseButtons.forEach(button => {
	button.addEventListener('click', function (e) {
		e.preventDefault();

		// Переключаем активное состояние кнопки
		this.classList.toggle('active');

		// Находим связанный контент
		const content = this.nextElementSibling;

		// Если контент открыт - закрываем его
		if (content.style.maxHeight) {
			content.style.maxHeight = null;
		} else {
			// Если закрыт - открываем
			content.style.maxHeight = content.scrollHeight + 'px';
		}
	});
});
