const currentMonthEl = document.querySelector('.current-month');
const prevBtn = document.querySelector('.prev-month');
const nextBtn = document.querySelector('.next-month');

const minDate = new Date(2018, 0); // Январь 2018
const today = new Date();
const maxDate = new Date(today.getFullYear(), today.getMonth()); // Текущий месяц без учета дня

let currentDate = new Date(maxDate.getFullYear(), maxDate.getMonth()); // Начинаем с текущего месяца

function updateDateDisplay() {
	const options = { year: 'numeric', month: 'long' };
	currentMonthEl.textContent = currentDate.toLocaleDateString('en-US', options);

	// Блокируем кнопку "назад", если достигнут минимум
	prevBtn.style.opacity = currentDate <= minDate ? '0.7' : '1';
	prevBtn.style.pointerEvents = currentDate <= minDate ? 'none' : 'auto';

	// Блокируем кнопку "вперед", если достигнут максимум
	nextBtn.style.opacity = currentDate >= maxDate ? '0.7' : '1';
	nextBtn.style.pointerEvents = currentDate >= maxDate ? 'none' : 'auto';
}

prevBtn.addEventListener('click', function () {
	if (currentDate > minDate) {
		currentDate.setMonth(currentDate.getMonth() - 1);
		updateDateDisplay();
	}
});

nextBtn.addEventListener('click', function () {
	if (currentDate < maxDate) {
		currentDate.setMonth(currentDate.getMonth() + 1);
		updateDateDisplay();
	}
});

updateDateDisplay(); // Инициализация
