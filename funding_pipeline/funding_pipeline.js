const items = [
	{
		funded_date: '01.02.2025',
		business_name: 'Certified Mailing Solutions, Inc',
		lender: 'Daniel Tighe',
		funded_amount: 100000,
		commission_paid: 50000,
		renewal_status: 'approved',
	},
	{
		funded_date: '05.02.2025',
		business_name: 'Certified Mailing Solutions, Inc',
		lender: 'Daniel Tighe',
		funded_amount: 100000,
		commission_paid: 70000,
		renewal_status: 'underwriting',
	},
	{
		funded_date: '07.02.2025',
		business_name: 'Certified Mailing Solutions, Inc',
		lender: 'Daniel Tighe',
		funded_amount: 250000,
		commission_paid: 25000,
		renewal_status: 'declined',
	},
	{
		funded_date: '01.16.2024',
		business_name: 'Certified Mailing Solutions, Inc',
		lender: 'Daniel Tighe',
		funded_amount: 100000,
		commission_paid: 100000,
		renewal_status: 'approved',
	},
	{
		funded_date: '11.16.2022',
		business_name: 'Certified Mailing Solutions, Inc',
		lender: 'Daniel Tighe',
		funded_amount: 80000,
		commission_paid: 80000,
		renewal_status: 'approved',
	},
	{
		funded_date: '07.16.2022',
		business_name: 'Certified Mailing Solutions, Inc',
		lender: 'Daniel Tighe',
		funded_amount: 100000,
		commission_paid: 100000,
		renewal_status: 'approved',
	},
	{
		funded_date: '02.16.2023',
		business_name: 'Certified Mailing Solutions, Inc',
		lender: 'Daniel Tighe',
		funded_amount: 90000,
		commission_paid: 90000,
		renewal_status: 'approved',
	},
	{
		funded_date: '12.16.2024',
		business_name: 'Certified Mailing Solutions, Inc',
		lender: 'Daniel Tighe',
		funded_amount: 50000,
		commission_paid: 50000,
		renewal_status: 'approved',
	},
	{
		funded_date: '12.16.2024',
		business_name: 'Certified Mailing Solutions, Inc',
		lender: 'Daniel Tighe',
		funded_amount: 50000,
		commission_paid: 50000,
		renewal_status: 'approved',
	},
	{
		funded_date: '12.14.2024',
		business_name: 'Certified Mailing Solutions, Inc',
		lender: 'Daniel Tighe',
		funded_amount: 50000,
		commission_paid: 50000,
		renewal_status: 'approved',
	},
	{
		funded_date: '12.10.2024',
		business_name: 'Certified Mailing Solutions, Inc',
		lender: 'Daniel Tighe',
		funded_amount: 50000,
		commission_paid: 50000,
		renewal_status: 'underwriting',
	},
	{
		funded_date: '12.17.2024',
		business_name: 'Certified Mailing Solutions, Inc',
		lender: 'Daniel Tighe',
		funded_amount: 50000,
		commission_paid: 50000,
		renewal_status: 'declined',
	},
	{
		funded_date: '11.12.2024',
		business_name: 'Certified Mailing Solutions, Inc',
		lender: 'Daniel Tighe',
		funded_amount: 50000,
		commission_paid: 50000,
		renewal_status: 'funded',
	},
	{
		funded_date: '09.19.2024',
		business_name: 'Certified Mailing Solutions, Inc',
		lender: 'Daniel Tighe',
		funded_amount: 50000,
		commission_paid: 50000,
		renewal_status: 'approved',
	},
];

const ctx = document.getElementById('myChart').getContext('2d');
const tooltipEl = document.getElementById('custom-tooltip');

// Стандартные месяцы
const months = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];

// Фильтрация данных по году 2025
let yearToDisplay = 2025;
const filteredItems = items.filter(item => {
	const dateParts = item.funded_date.split('.'); // Теперь формат MM.DD.YYYY
	const year = parseInt(dateParts[2], 10); // Извлекаем год
	return year === yearToDisplay; // Оставляем только данные за 2025 год
});

// Массив для хранения суммы по месяцам
const monthlyData = new Array(12).fill(0); // 12 месяцев

// Агрегация данных по месяцам
filteredItems.forEach(item => {
	const dateParts = item.funded_date.split('.'); // Разделяем дату на компоненты (MM.DD.YYYY)
	const monthIndex = parseInt(dateParts[0], 10) - 1; // Месяц (0-11), теперь индекс месяца - это первая часть
	const fundedAmount = parseInt(item.funded_amount, 10);

	monthlyData[monthIndex] += fundedAmount; // Суммируем сумму по месяцам
});

// Форматируем данные для графика
const formattedData = monthlyData.map(value => Math.floor(value)); // Делим на 1000 для отображения в тысячах

const gradient = ctx.createLinearGradient(0, 0, 0, 430);
gradient.addColorStop(0.9, 'rgba(34, 197, 59, 0.21)');
gradient.addColorStop(1, 'rgba(34, 197, 59, 0)');

// Создание графика
const chart = new Chart(ctx, {
	type: 'line',
	data: {
		labels: months, // Метки месяцев для оси X
		datasets: [
			{
				label: 'Funded Amount',
				data: formattedData,
				borderColor: '#159C2A',
				backgroundColor: gradient,
				pointRadius: 4,
				pointHoverRadius: 6,
				borderWidth: 2,
				fill: 'start',
				tension: 0, // Плавность линии
			},
		],
	},
	options: {
		responsive: true,
		plugins: {
			tooltip: {
				enabled: false, // Отключаем стандартный тултип
				external: function (context) {
					const { chart, tooltip } = context;

					if (tooltip.opacity === 0) {
						tooltipEl.style.display = 'none';
						return;
					}

					const tooltipData = tooltip.dataPoints[0];
					const index = tooltipData.dataIndex; // Индекс точки
					const fullValue = monthlyData[index]; // Полное значение из monthlyData

					// Заполнение тултипа
					tooltipEl.innerHTML = `
            <div class="tooltip-label">Funded Amount</div>
            <div class="tooltip-value">$ ${fullValue}</div>
          `;

					// Позиционирование тултипа
					tooltipEl.style.left =
						chart.canvas.offsetLeft +
						tooltip.caretX -
						tooltipEl.offsetWidth -
						130 +
						'px';
					tooltipEl.style.top =
						chart.canvas.offsetTop + tooltip.caretY - 70 + 'px';
					tooltipEl.style.opacity = 1;
					tooltipEl.style.display = 'block';
				},
			},
			legend: {
				display: false, // Отключаем легенду
			},
		},
		scales: {
			x: {
				grid: {
					color: 'rgba(200, 200, 200, 0.5)',
					borderDash: [5, 5],
				},
			},
			y: {
				beginAtZero: true,
				grid: {
					color: 'rgba(200, 200, 200, 0.5)',
					borderDash: [5, 5],
				},
				ticks: {
					callback: function (value) {
						return `$ ${value.toLocaleString('en-US')}`;
					},
				},
			},
		},
		hover: {
			mod: 'nearest',
			intersect: true,
		},
		onHover: (event, chartElements) => {
			const canvas = event.native.target;
			canvas.style.cursor = chartElements.length ? 'pointer' : 'default';
		},
	},
});

chart.canvas.addEventListener('click', event => {
	const activePoints = chart.getElementsAtEventForMode(
		event,
		'nearest',
		{ intersect: true },
		false
	);

	if (activePoints.length > 0) {
		const index = activePoints[0].index; // Индекс месяца
		const selectedMonth = months[index]; // Месяц, на который был клик

		// Определяем выбранный год (например, текущий год)
		const selectedYear = new Date().getFullYear(); // или извлекаем из данных, если нужен конкретный год

		// Фильтруем элементы, связанные с этим месяцем и годом
		const selectedItems = items.filter(item => {
			const itemMonth = item.funded_date.split('.')[0]; // Получаем месяц из первой части даты (MM.DD.YYYY)
			const itemYear = item.funded_date.split('.')[2]; // Получаем год из последней части даты (MM.DD.YYYY)
			return (
				months[index].slice(0, 3).toLowerCase() ===
					months[parseInt(itemMonth) - 1].slice(0, 3).toLowerCase() &&
				itemYear === selectedYear.toString() // Добавляем проверку по году
			);
		});

		// Обновляем таблицу с выбранными элементами
		renderTableItems(selectedItems);
	}
});

const today = new Date();
const lastMonth = new Date();
lastMonth.setMonth(today.getMonth() - 1);

// Инициализация startDatePicker
const startDatePicker = flatpickr('#pipeline_startDatePicker', {
	dateFormat: 'm.d.Y',
	maxDate: today,
	inline: true,
	defaultDate: lastMonth, // Устанавливаем дату на месяц назад
	onChange: selectedDates => {
		const bottomBlock = document.querySelector('.pipeline_chooseDate-bottom');

		if (selectedDates.length > 0) {
			bottomBlock.style.display = 'flex';

			const startDate = selectedDates[0];
			startDate.setHours(0, 0, 0, 0); // Устанавливаем начало дня

			// Обновляем отображение Start Date
			document.querySelectorAll('.pipeline_dateStart').forEach(el => {
				el.innerText = formatDate(startDate, 'mm.dd.yyyy');
			});

			document.getElementById('chooseDate-dayStart').innerText =
				startDate.getDate();
			document.getElementById('chooseDate-monthStart').innerText =
				startDate.toLocaleString('en-US', { month: 'long' });
			document.getElementById('chooseDate-yearStart').innerText =
				startDate.getFullYear();

			// Ререндер данных, если обе даты выбраны
			if (endDatePicker.selectedDates.length > 0) {
				const endDate = endDatePicker.selectedDates[0];
				const filteredItems = filterItemsByDateRange(items, [
					startDate,
					endDate,
				]);
			}
		}
	},
});

// Инициализация endDatePicker
const endDatePicker = flatpickr('#pipeline_endDatePicker', {
	dateFormat: 'm.d.Y',
	inline: true,
	defaultDate: today, // Устанавливаем текущую дату
	maxDate: today, // Ограничиваем максимальную дату сегодняшним днем
	onChange: selectedDates => {
		const bottomBlock = document.querySelector('.pipeline_chooseDate-bottom');

		if (selectedDates.length > 0) {
			bottomBlock.style.display = 'flex';

			const endDate = selectedDates[0];
			endDate.setHours(23, 59, 59, 999); // Устанавливаем конец дня

			// Обновляем отображение End Date
			document.querySelectorAll('.pipeline_dateEnd').forEach(el => {
				el.innerText = formatDate(endDate, 'mm.dd.yyyy');
			});

			document.getElementById('chooseDate-dayEnd').innerText =
				endDate.getDate();
			document.getElementById('chooseDate-monthEnd').innerText =
				endDate.toLocaleString('en-US', { month: 'long' });
			document.getElementById('chooseDate-yearEnd').innerText =
				endDate.getFullYear();

			// Ререндер данных, если обе даты выбраны
			if (startDatePicker.selectedDates.length > 0) {
				const startDate = startDatePicker.selectedDates[0];
				const filteredItems = filterItemsByDateRange(items, [
					startDate,
					endDate,
				]);
			}
		}
	},
});

// Функция для установки диапазонов дат
function setDateRange(rangeType) {
	const today = new Date();
	let startDate, endDate;

	switch (rangeType) {
		case 'Today':
			startDate = new Date(today);
			endDate = new Date(today);
			break;
		case 'Yesterday':
			startDate = new Date(today); // Создаем новый объект
			startDate.setDate(today.getDate() - 1);
			endDate = new Date(startDate); // Устанавливаем endDate в то же значение
			break;
		case 'This Month':
			startDate = new Date(today.getFullYear(), today.getMonth(), 1);
			endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
			break;
		case 'Last Month':
			startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
			endDate = new Date(today.getFullYear(), today.getMonth(), 0);
			break;
		case 'Last 7 Days':
			startDate = new Date(today);
			startDate.setDate(today.getDate() - 7);
			endDate = new Date();
			break;
		case 'Last 30 Days':
			startDate = new Date(today);
			startDate.setDate(today.getDate() - 30);
			endDate = new Date();
			break;
		case 'Last 60 Days':
			startDate = new Date(today);
			startDate.setDate(today.getDate() - 60);
			endDate = new Date();
			break;
		case 'Last 90 Days':
			startDate = new Date(today);
			startDate.setDate(today.getDate() - 90);
			endDate = new Date();
			break;
		default:
			return;
	}

	// Устанавливаем время на начало дня для startDate и конец дня для endDate
	startDate.setHours(0, 0, 0, 0);
	endDate.setHours(23, 59, 59, 999);

	// Устанавливаем даты в оба календаря
	startDatePicker.setDate(startDate);
	endDatePicker.setDate(endDate);

	// Обновляем отображение выбранных дат
	updateDateDisplay([startDate, endDate]);
	const filteredItems = filterItemsByDateRange(items, [startDate, endDate]);
	renderTableItems(filteredItems);
	updateChartData(filteredItems);
}

// Функция для обновления отображаемых дат
function updateDateDisplay(selectedDates) {
	if (selectedDates.length > 0) {
		const startDate = selectedDates[0];
		const endDate = selectedDates[1] || startDate;

		document.querySelectorAll('.pipeline_dateStart').forEach(el => {
			el.innerText = formatDate(startDate, 'dd.mm.yyyy');
		});
		document.querySelectorAll('.pipeline_dateEnd').forEach(el => {
			el.innerText = formatDate(endDate, 'dd.mm.yyyy');
		});

		document.getElementById('chooseDate-dayStart').innerText =
			startDate.getDate();
		document.getElementById('chooseDate-monthStart').innerText =
			startDate.toLocaleString('en-US', { month: 'long' });
		document.getElementById('chooseDate-yearStart').innerText =
			startDate.getFullYear();

		document.getElementById('chooseDate-dayEnd').innerText = endDate.getDate();
		document.getElementById('chooseDate-monthEnd').innerText =
			endDate.toLocaleString('en-US', { month: 'long' });
		document.getElementById('chooseDate-yearEnd').innerText =
			endDate.getFullYear();

		// Показываем блок с кнопками
		document.querySelector('.pipeline_chooseDate-bottom').style.display =
			'flex';
	}
}

// Функция для форматирования дат
function formatDate(date, format) {
	const map = {
		dd: String(date.getDate()).padStart(2, '0'),
		mm: String(date.getMonth() + 1).padStart(2, '0'),
		yyyy: date.getFullYear(),
	};
	return format.replace(/dd|mm|yyyy/gi, matched => map[matched]);
}

// Функция фильтрации элементов по диапазону дат
function filterItemsByDateRange(items, selectedDates) {
	let startDate = selectedDates[0];
	let endDate = selectedDates[1] || startDate;

	// Устанавливаем время для выбранных дат на 00:00:00 (начало дня) и 23:59:59 (конец дня)
	startDate.setHours(0, 0, 0, 0);
	endDate.setHours(23, 59, 59, 999);

	return items.filter(item => {
		// Преобразуем строку funded_date в формат Date, используя parseDate
		const fundedDate = parseDate(item.funded_date);

		// Фильтруем элементы по диапазону дат
		return fundedDate >= startDate && fundedDate <= endDate;
	});
}

// Функция для корректного парсинга даты в формате mm.dd.yyyy
function parseDate(dateStr) {
	const [month, day, year] = dateStr.split('.'); // Разделяем строку на месяц, день и год

	// Проверяем, что все части существуют
	if (!day || !month || !year) {
		return new Date(NaN); // Возвращаем "Invalid Date", если формат неверен
	}

	// Преобразуем в формат yyyy-mm-dd
	const formattedDate = `${year}-${month}-${day}`;
	const date = new Date(formattedDate); // Создаем объект Date

	if (isNaN(date.getTime())) {
		return new Date(NaN); // Возвращаем "Invalid Date", если дата невалидна
	}

	return date; // Возвращаем правильную дату
}

// Функция рендеринга элементов таблицы
function renderTableItems(items) {
	const pipelineTableItems = document.getElementById('pipelineTableItems');
	pipelineTableItems.innerHTML = ''; // Очистить таблицу перед добавлением новых данных

	// Если нет данных, показываем сообщение
	if (items.length === 0) {
		const noDataMessage = document.createElement('div');
		noDataMessage.classList.add('no-data');
		noDataMessage.innerText = 'No items found for the selected date range';
		pipelineTableItems.appendChild(noDataMessage);
		return;
	}

	// Добавляем элементы в таблицу
	items.forEach(item => {
		const itemElement = document.createElement('div');
		itemElement.classList.add('pipline_table-item');

		itemElement.innerHTML = `
      <div class="funded_date">${item.funded_date}</div>
      <div class="business_name">${item.business_name}</div>
      <div class="lender">${item.lender}</div>
      <div class="funded_amount">$${item.funded_amount}</div>
      <div class="commission_paid">$${item.commission_paid}</div>
      <div class="renewal_status">
        <div class="${item.renewal_status}">
          ${
						item.renewal_status.charAt(0).toUpperCase() +
						item.renewal_status.slice(1)
					}
        </div>
      </div>
    `;
		pipelineTableItems.appendChild(itemElement);
	});
}

// Обработчик клика по элементам списка
document.querySelectorAll('.pipeline_chooseDate-dates li').forEach(li => {
	li.addEventListener('click', () => {
		const rangeType = li.innerText.trim();
		setDateRange(rangeType); // Возможно, нужно тут уточнить логику
		// Применить фильтрацию сразу после выбора диапазона
		const filteredItems = filterItemsByDateRange(items, [startDate, endDate]);
		renderTableItems(filteredItems);
		updateChartData(filteredItems);
	});
});

const chooseDate = document.querySelector('.pipeline_chooseDate');
const closeChooseCalendar = document.getElementById(
	'pipeline_chooseDate-cancel'
);
const openChooseCalendar = document.getElementById('chooseDate_open');

const applyChooseCalendar = document.getElementById(
	'pipeline_chooseDate-apply'
);

// Обработчик клика по кнопке Apply
applyChooseCalendar.addEventListener('click', () => {
	chooseDate.classList.toggle('show');

	const startSelectedDate = startDatePicker.selectedDates[0];
	const endSelectedDate = endDatePicker.selectedDates[0] || startSelectedDate;

	if (startSelectedDate && endSelectedDate) {
		// Filter items by date range
		const filteredItems = filterItemsByDateRange(items, [
			startSelectedDate,
			endSelectedDate,
		]);

		// Update table
		renderTableItems(filteredItems);

		// Update chart with filtered items
		updateChartData(filteredItems);
	}
});

// Функция для обновления данных графика
function updateChartData(filteredItems) {
	// Initialize monthly data array
	const monthlyData = new Array(12).fill(0);

	// Get the latest year from filtered items
	const years = filteredItems.map(item => {
		const dateParts = item.funded_date.split('.');
		return parseInt(dateParts[2], 10);
	});
	const latestYear = Math.max(...years);

	// Filter items for the latest year and aggregate by month
	filteredItems
		.filter(item => {
			const dateParts = item.funded_date.split('.');
			return parseInt(dateParts[2], 10) === latestYear;
		})
		.forEach(item => {
			const dateParts = item.funded_date.split('.');
			const monthIndex = parseInt(dateParts[0], 10) - 1; // Month is the first part
			const fundedAmount = parseInt(item.funded_amount, 10);
			monthlyData[monthIndex] += fundedAmount;
		});

	// Update chart data
	chart.data.datasets[0].data = monthlyData;
	chart.update();
}

// Открыть календарь
openChooseCalendar.addEventListener('click', () => {
	chooseDate.classList.toggle('show');
});

// Закрыть календарь и сбросить выбор
closeChooseCalendar.addEventListener('click', () => {
	chooseDate.classList.toggle('show');

	// Сброс выбора в календаре
	startDatePicker.clear();
	endDatePicker.clear();

	// Обнуление значений в блоках
	document
		.querySelectorAll('.pipeline_dateStart, .pipeline_dateEnd')
		.forEach(el => {
			el.innerText = 'DD.MM.YYYY';
		});

	document.getElementById('chooseDate-dayStart').innerText = '0';
	document.getElementById('chooseDate-monthStart').innerText = 'Month';
	document.getElementById('chooseDate-yearStart').innerText = '0';

	document.getElementById('chooseDate-dayEnd').innerText = '0';
	document.getElementById('chooseDate-monthEnd').innerText = 'Month';
	document.getElementById('chooseDate-yearEnd').innerText = '0';

	// Скрываем блок с кнопками
	document.querySelector('.pipeline_chooseDate-bottom').style.display = 'none';
});


function filterItemsByYear(items, year) {
	return items.filter(item => {
		const itemYear = item.funded_date.split('.')[2]; // Получаем год из даты (MM.DD.YYYY)
		return itemYear === year.toString();
	});
}

// Изначально рендерим элементы за 2025 год
window.addEventListener('DOMContentLoaded', () => {
	const startYear = 2025;
	renderTableItems(filterItemsByYear(items, startYear));
});