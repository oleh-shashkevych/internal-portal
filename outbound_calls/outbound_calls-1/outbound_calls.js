// Находим элементы
const selectedYear = document.getElementById('selected_year');
const yearDropdown = document.getElementById('year_dropdown');
const yearList = document.getElementById('year_list');
const yearSelect = document.getElementById('outbound-year_select');
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

const jsonData = {
	users: [
		{ user: 'Val', monthsData: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2] },
		{ user: 'Tanya', monthsData: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3] },
		{ user: 'Dan', monthsData: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5] },
	],
};

const months = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec',
];
const table = document.getElementById('data-table');

// Добавляем строки с данными пользователей
jsonData.users.forEach(user => {
	const total = user.monthsData.reduce((sum, val) => sum + val, 0); // Считаем Total для строки
	const row = document.createElement('tr');
	row.classList.add('row-hover'); // Класс для эффекта наведения

	row.innerHTML =
		`<td><a href="../outbound_calls-2/outbound_calls.html" class="user-link" title="${user.user}">${user.user}</a></td>` + // Квадратик с первой буквой имени
		user.monthsData.map(data => `<td>${data}</td>`).join('') +
		`<td class="total-column">${total}</td>`; // Столбец "Total" с отдельным классом
	table.appendChild(row);
});

// Добавляем строку Total
const totalRow = document.createElement('tr');
totalRow.classList.add('total-row');
const totals = months.map((_, i) =>
	jsonData.users.reduce((sum, user) => sum + user.monthsData[i], 0)
);
const grandTotal = totals.reduce((sum, val) => sum + val, 0); // Общая сумма всех данных
totalRow.innerHTML =
	`<td>Total</td>` +
	totals.map(total => `<td>${total}</td>`).join('') +
	`<td class="total-column">${grandTotal}</td>`;
table.appendChild(totalRow);

// Добавляем строку Average
const averageRow = document.createElement('tr');
averageRow.classList.add('average-row');
const averages = totals.map(total =>
	(total / jsonData.users.length).toFixed(2)
);
averageRow.innerHTML =
	`<td>Average</td>` +
	averages.map(avg => `<td>${avg}</td>`).join('') +
	`<td class="total-column">${(grandTotal / jsonData.users.length)}</td>`; // Применяем класс total-column
table.appendChild(averageRow);
