const currentYear = new Date().getFullYear();
let currentChart = null;

// Находим элементы
const selectedYear = document.getElementById('selected_year');
const yearDropdown = document.getElementById('year_dropdown');
const yearList = document.getElementById('year_list');
const yearSelect = document.getElementById('year_select');
const arrow = document.getElementById('year_select-arrow');

// Открытие/закрытие дропдауна
function closeDropdown() {
	yearDropdown.style.display = 'none';
	arrow.style.transform = 'rotate(0deg)';
}

function openDropdown() {
	yearDropdown.style.display = 'block';
	arrow.style.transform = 'rotate(180deg)';
}

yearSelect.addEventListener('click', () => {
	if (yearDropdown.style.display === 'none') {
		openDropdown();
	} else {
		closeDropdown();
	}
});

// Добавляем года в список
for (let year = 2025; year >= 2018; year--) {
	const listItem = document.createElement('li');
	listItem.textContent = year;
	listItem.addEventListener('click', () => {
		selectedYear.textContent = year; // Устанавливаем выбранный год
		closeDropdown(); // Закрываем dropdown

		fetchDataForYear(year) // Передаем значение выбранного года
			.then(data => {
				updateChartWithNewData(data); // Обновляем график с новыми данными
			})
			.catch(error => {
				console.error('Ошибка при загрузке данных для года', year, error);
			});
	});

	yearList.appendChild(listItem);
}

// Закрытие dropdown при клике вне
document.addEventListener('click', e => {
	if (!e.target.closest('#year_select')) {
		closeDropdown();
	}
});

// Блокировка всплытия события
yearDropdown.addEventListener('click', e => {
	e.stopPropagation();
});

const tooltipEl = document.getElementById('custom-tooltip');

// Симуляция запроса данных
function fetchDataForYear(year) {
	return new Promise(resolve => {
		setTimeout(() => {
			let data;

			if (year === 2025) {
				data = {
					status: 'true',
					msg: '',
					year: '2025',
					data_val: [
						{
							month_num: '1',
							month_name: 'January',
							goal_sum: '20,000.00',
							job_sum: '14,256.20',
						},
						{
							month_num: '2',
							month_name: 'February',
							goal_sum: '15,000.00',
							job_sum: '29,236.20',
						},
						{
							month_num: '3',
							month_name: 'March',
							goal_sum: '35,000.00',
							job_sum: '12,131.90',
						},
						{
							month_num: '4',
							month_name: 'April',
							goal_sum: '0',
							job_sum: '10,231.00',
						},
						{
							month_num: '5',
							month_name: 'May',
							goal_sum: '15,000.00',
							job_sum: '13,212.12',
						},
						{
							month_num: '6',
							month_name: 'June',
							goal_sum: '15,000.00',
							job_sum: '13,212.12',
						},
						{
							month_num: '7',
							month_name: 'July',
							goal_sum: '0',
							job_sum: '0',
						},
						{
							month_num: '8',
							month_name: 'August',
							goal_sum: '50,000.00',
							job_sum: '38,023.12',
						},
						{
							month_num: '9',
							month_name: 'September',
							goal_sum: '0',
							job_sum: '0',
						},
						{
							month_num: '10',
							month_name: 'October',
							goal_sum: '0',
							job_sum: '0',
						},
						{
							month_num: '11',
							month_name: 'November',
							goal_sum: '0',
							job_sum: '0',
						},
						{
							month_num: '12',
							month_name: 'December',
							goal_sum: '0',
							job_sum: '3,023.12',
						},
					],
				};
			} else {
				data = {
					status: 'true',
					msg: '',
					year: '2023',
					data_val: [
						{
							month_num: '1',
							month_name: 'January',
							goal_sum: '0',
							job_sum: '0',
						},
						{
							month_num: '2',
							month_name: 'February',
							goal_sum: '45,000.00',
							job_sum: '9,236.20',
						},
						{
							month_num: '3',
							month_name: 'March',
							goal_sum: '35,000.00',
							job_sum: '12,131.90',
						},
						{
							month_num: '4',
							month_name: 'April',
							goal_sum: '0',
							job_sum: '10,231.00',
						},
						{
							month_num: '5',
							month_name: 'May',
							goal_sum: '15,000.00',
							job_sum: '13,212.12',
						},
						{
							month_num: '6',
							month_name: 'June',
							goal_sum: '15,000.00',
							job_sum: '13,212.12',
						},
						{
							month_num: '7',
							month_name: 'July',
							goal_sum: '0',
							job_sum: '0',
						},
						{
							month_num: '8',
							month_name: 'August',
							goal_sum: '80,000.00',
							job_sum: '68,023.12',
						},
						{
							month_num: '9',
							month_name: 'September',
							goal_sum: '0',
							job_sum: '0',
						},
						{
							month_num: '10',
							month_name: 'October',
							goal_sum: '0',
							job_sum: '0',
						},
						{
							month_num: '11',
							month_name: 'November',
							goal_sum: '0',
							job_sum: '0',
						},
						{
							month_num: '12',
							month_name: 'December',
							goal_sum: '0',
							job_sum: '3,023.12',
						},
					],
				};
			}
			// Эмуляция задержки запроса и передача данных
			resolve(data);
		}, 1000); // Задержка 1 секунда для эмуляции ответа
	});
}

// Функция для обновления графика
function updateChartWithNewData(jsonData) {
	// Преобразуем данные для графика
	const labels = jsonData.data_val.map(item => item.month_name);
	const monthlyGoals = jsonData.data_val.map(item =>
		item.goal_sum && item.goal_sum !== '0'
			? parseFloat(item.goal_sum.replace(/,/g, ''))
			: 0
	);
	const monthlyEarnings = jsonData.data_val.map(item =>
		item.job_sum && item.job_sum !== '0'
			? parseFloat(item.job_sum.replace(/,/g, ''))
			: 0
	);

	// Получаем контекст канваса
	const ctx = document.getElementById('targetsChart').getContext('2d');

	// Уничтожаем старый график, если он существует
	if (currentChart) {
		currentChart.destroy();
	}

	renderTableItems(jsonData);

	const greenGradient = ctx.createLinearGradient(0, 0, 0, 430);
	greenGradient.addColorStop(0.9, 'rgba(34, 197, 59, 0.21)');
	greenGradient.addColorStop(1, 'rgba(34, 197, 59, 0)');

	const blueGradient = ctx.createLinearGradient(0, 0, 0, 430);
	blueGradient.addColorStop(0.7, 'rgba(0, 112, 240, 0.21)');
	blueGradient.addColorStop(1, 'rgba(0, 112, 240, 0)');

	// Создаём новый график
	currentChart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: labels,
			datasets: [
				{
					label: 'Target',
					data: monthlyGoals,
					borderColor: 'blue',
					backgroundColor: blueGradient,
					pointRadius: 4,
					pointHoverRadius: 6,
					borderWidth: 2,
					fill: 'start',
					tension: 0,
				},
				{
					label: 'Earnings',
					data: monthlyEarnings,
					borderColor: '#159C2A',
					backgroundColor: greenGradient,
					pointRadius: 4,
					pointHoverRadius: 6,
					borderWidth: 2,
					fill: 'start',
					tension: 0,
				},
			],
		},
		options: {
			responsive: true,
			plugins: {
				tooltip: {
					enabled: false,
					external: function (context) {
						const { chart, tooltip } = context;
						if (tooltip.opacity === 0) {
							tooltipEl.style.opacity = 0;
							return;
						}

						const tooltipData = tooltip.dataPoints[0];
						const datasetLabel = tooltipData.dataset.label;
						const value = tooltipData.raw.toLocaleString('en-US');
						const month = labels[tooltipData.dataIndex];

						tooltipEl.innerHTML = `
              <div class="tooltip-label">${month}</div>
              <div class="tooltip-value">${datasetLabel}: $${value}</div>
            `;

						tooltipEl.style.display = 'block';
						const tooltipWidth = tooltipEl.offsetWidth;

						let tooltipX =
							chart.canvas.offsetLeft + tooltip.caretX - tooltipWidth - 10;
						let tooltipY = chart.canvas.offsetTop + tooltip.caretY - 70;

						if (tooltipX + tooltipWidth > window.innerWidth) {
							tooltipX = window.innerWidth - tooltipWidth - 10;
						}

						if (tooltipX < 0) {
							tooltipX = 10;
						}

						tooltipEl.style.left = `${tooltipX}px`;
						tooltipEl.style.top = `${tooltipY}px`;
						tooltipEl.style.opacity = 1;
						tooltipEl.style.display = 'grid';
					},
				},
				legend: {
					display: false,
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
							return `$${value.toLocaleString('en-US')}`;
						},
					},
					suggestedMax: Math.max(...monthlyGoals, ...monthlyEarnings) * 1.5,
				},
			},
			onHover: (event, chartElements) => {
				const canvas = event.native.target;
				canvas.style.cursor = chartElements.length ? 'pointer' : 'default';
			},
		},
	});
}

fetchDataForYear(2025).then(data => {
	updateChartWithNewData(data); // Данные для 2025 года
});

function renderTableItems(data) {
	const targetsTableItems = document.getElementById('targetsTableItems');
	targetsTableItems.innerHTML = '';

	// Если нет данных, показываем сообщение
	if (data.data_val.length === 0) {
		const noDataMessage = document.createElement('div');
		noDataMessage.classList.add('no-data');
		noDataMessage.innerText = 'No items found for the selected date range';
		pipelineTableItems.appendChild(noDataMessage);
		return;
	}

	// Добавляем элементы в таблицу
	data.data_val.forEach(item => {
		const itemElement = document.createElement('div');
		itemElement.classList.add('targets_table-item');

		itemElement.innerHTML = `
      <div class="month">${item?.month_name}</div>
      <div class="goals">$${item?.goal_sum}</div>
      <div class="hit">$${item?.job_sum}</div>`;
		targetsTableItems.appendChild(itemElement);
	});
}
