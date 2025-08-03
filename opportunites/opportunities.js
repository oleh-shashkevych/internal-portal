// Выбираем нав-элементы и секции (без модального окна)
const navItems = document.querySelectorAll('.opportunities_nav-item');
const sections = document.querySelectorAll(
	'.opportunity_details, .contact_roles, .quotes, .funding_details, .documents, .follow_up'
);
// Отдельно получаем модальное окно
const modal = document.querySelector('.funding_details-editModal');

navItems.forEach((item, index) => {
	item.addEventListener('click', function () {
		// Убираем класс selected у всех нав-элементов и секций
		navItems.forEach(el => el.classList.remove('selected'));
		sections.forEach(section => section.classList.remove('selected'));
		// Если модальное окно открыто, закрываем его
		if (modal) {
			modal.classList.remove('selected');
		}
		// Добавляем класс для выбранного нав-элемента и соответствующей секции
		this.classList.add('selected');
		sections[index].classList.add('selected');
	});
});

const quotesNavItems = document.querySelectorAll('.quotes_top-nav--item');
const quotesContent = document.querySelectorAll(
	'.quotes_quotesBlock, .quotes_referral, .quotes_merchant'
);

quotesNavItems.forEach((item, index) => {
	item.addEventListener('click', function () {
		quotesNavItems.forEach(el => el.classList.remove('active'));
		quotesContent.forEach(content => content.classList.remove('active'));

		this.classList.add('active');
		quotesContent[index].classList.add('active');

		if (quotesContent[index].classList.contains('quotes_quotesBlock')) {
			document.getElementById('submit_deal').style.display = 'block';
		} else {
			document.getElementById('submit_deal').style.display = 'none';
		}

		if (quotesContent[index].classList.contains('quotes_referral')) {
			document.getElementById('add_new-referral').style.display = 'block';
		} else {
			document.getElementById('add_new-referral').style.display = 'none';
		}
	});
});

// funding_details-editModal

// Обработчик клика для кнопки редактирования модального окна
const editButton = document.querySelector('.funding_details-edit');
if (editButton && modal) {
	editButton.addEventListener('click', function (e) {
		e.stopPropagation();
		modal.classList.add('selected');
		document.querySelector('.funding_details').classList.remove('selected');
	});
}

const cancelButton = document.querySelector(
	'.funding_details-editModal_cancel'
);

if (cancelButton && modal) {
	cancelButton.addEventListener('click', function (e) {
		e.stopPropagation();
		modal.classList.remove('selected'); // Убираем выбранное состояние у модального окна
		document.querySelector('.funding_details').classList.add('selected'); // Возвращаем класс выбранного состояния основному блоку
	});
}

const burger = document.getElementById('burger');
const closeBurger = document.getElementById('close_burger');
const sideBar = document.querySelector('.left_cp_bar');
const overlay = document.querySelector('.overlay')

// При клике на бургер показываем меню
burger.addEventListener('click', () => {
	sideBar.style.transform = 'translateX(0)';
	overlay.style.display = 'flex';
});

// При клике на крестик скрываем меню
closeBurger.addEventListener('click', () => {
	sideBar.style.transform = 'translateX(-120%)';
		overlay.style.display = 'none';
});

const screenWidth = window.innerWidth;
if (screenWidth <= 1910) {
	document.querySelector('.quote_item-comments').classList.remove('active');
}

// Добавляем слушатель события resize
window.addEventListener('resize', () => {
	const currentWidth = window.innerWidth;
	if (currentWidth <= 1910) {
		document.querySelector('.quote_item-comments').classList.remove('active');
	}
});

document.addEventListener('DOMContentLoaded', function () {
	// Находим индекс слайда с классом "selected"
	const slides = document.querySelectorAll('.swiper-slide');
	let selectedIndex = 0;
	slides.forEach((slide, index) => {
		if (slide.classList.contains('selected')) {
			selectedIndex = index;
		}
	});

	// Чтобы выбранный элемент оказался вторым в видимой группе (центральным при slidesPerView: 3),
	// устанавливаем initialSlide равным (selectedIndex - 1), но не меньше 0
	const initialSlide = selectedIndex > 0 ? selectedIndex - 1 : 0;

	// Определяем отступ между слайдами:
	// Если ширина окна меньше 1910px, отступ будет 25, иначе 0
	let spaceBetweenValue = window.innerWidth < 1910 ? 25 : 0;

	const swiper = new Swiper('.swiper-container', {
		slidesPerView: 2,
		spaceBetween: spaceBetweenValue,
		initialSlide: initialSlide,
		breakpoints: {
			1200: {
				slidesPerView: 6,
			},
			550: {
				slidesPerView: 3,
			},
		},
	});

	// При изменении размера окна обновляем отступ между слайдами
	window.addEventListener('resize', function () {
		swiper.params.spaceBetween = window.innerWidth < 1910 ? 25 : 0;
		swiper.update();
	});
});
