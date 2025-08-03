const addHouseFileInput = document.getElementById('addHouseFileInput'); // Скрытый input
const addImgGallery = document.getElementById('addImgGallery'); // Контейнер
const uploadButton = addImgGallery.querySelector('button'); // Кнопка внутри зоны загрузки

// Клик на кнопке вызывает загрузку
uploadButton.addEventListener('click', () => {
	addHouseFileInput.click();
});

// Перетаскивание файла
addImgGallery.addEventListener('dragover', e => {
	e.preventDefault();
	addImgGallery.classList.add('dragging'); // Визуальный эффект
});

addImgGallery.addEventListener('dragleave', () => {
	addImgGallery.classList.remove('dragging'); // Убираем эффект
});

addImgGallery.addEventListener('drop', e => {
	e.preventDefault();
	addImgGallery.classList.remove('dragging'); // Убираем эффект
	const file = e.dataTransfer.files[0]; // Получаем файл из события
	if (file && file.type.startsWith('image')) {
		handleFileUpload(file); // Обработка файла
	}
});

// Обработка выбора файла через input
addHouseFileInput.addEventListener('change', e => {
	const file = e.target.files[0]; // Получаем выбранный файл
	if (file && file.type.startsWith('image')) {
		handleFileUpload(file); // Обработка файла
		// Очищаем значение input, чтобы можно было загрузить одно и то же изображение повторно
		addHouseFileInput.value = '';
	}
});

// Функция обработки файла
function handleFileUpload(file) {
	// Устанавливаем превью изображения
	const reader = new FileReader();
	reader.onload = function (event) {
		addImgGallery.style.backgroundImage = `url(${event.target.result})`;
		addImgGallery.classList.add('has-image'); // Визуальный эффект, если нужно
	};
	reader.readAsDataURL(file);

	// Отправляем файл на сервер
	uploadFileToServer(file)
		.then(response => {
			console.log('Файл успешно загружен:', response);
		})
		.catch(error => {
			console.error('Ошибка загрузки файла:', error);
		});

	// Очищаем блок через 5 секунд
	setTimeout(() => {
		addImgGallery.style.backgroundImage = '';
		addImgGallery.classList.remove('has-image');
	}, 5000);
}

// "Аля" отправка файла на сервер
async function uploadFileToServer(file) {
	// Симуляция отправки файла
	return new Promise((resolve, reject) => {
		console.log('Файл отправляется на сервер...');
		setTimeout(() => {
			// Успешный результат
			console.log('Файл успешно загружен:', file.name);
			resolve({ message: 'Файл успешно загружен!', fileName: file.name });
		}, 1000); // Задержка 1 секунда для имитации запроса
	});
}

// Вибір елементів
const editButtons = document.querySelectorAll('.gallery_item-edit');
const popupEdit = document.getElementById('popup-edit');
const saveButton = document.querySelector('.btn-save');
const cancelButton = document.querySelector('.btn-cancel');
const uploadInput = document.getElementById('upload-image');
let currentGalleryItem = null;

// Відкрити попап
editButtons.forEach(button => {
	button.addEventListener('click', () => {
		currentGalleryItem = button.closest('.gallery_item'); // Находим текущий элемент галереи
		const title = currentGalleryItem.querySelector(
			'.gallery_item-title'
		).textContent; // Получаем текст названия

		// Устанавливаем текст в инпут
		const titleInput = document.getElementById('image-title');
		titleInput.value = title;

		popupEdit.style.display = 'flex'; // Показываем попап
	});
});
// Закрити попап
cancelButton.addEventListener('click', () => {
	popupEdit.style.display = 'none';
});

// Зберегти нову назву
saveButton.addEventListener('click', event => {
	event.preventDefault();
	const titleInput = document.getElementById('image-title');

	// Проверка на пустое значение или слишком длинное название
	if (!titleInput.value.trim() || titleInput.value.trim().length > 80) {
		console.error('Некорректное значение!');
		return;
	}

	// Обновление названия в элементе галереи
	if (currentGalleryItem) {
		const titleElement = currentGalleryItem.querySelector(
			'.gallery_item-title'
		);
		titleElement.textContent = titleInput.value.trim(); // Устанавливаем новое название
	}

	// Закрытие попапа
	popupEdit.style.display = 'none';
	currentGalleryItem = null; // Сбрасываем текущий элемент
});

// Клік поза попапом закриває його
popupEdit.addEventListener('click', event => {
	if (event.target === popupEdit) {
		popupEdit.style.display = 'none';
	}
});

// Вибір елементів
const deleteButtons = document.querySelectorAll('.gallery_item-close');
const popupDelete = document.getElementById('popup-delete');
const deleteConfirmButton = document.querySelector('.btn-delete');
const deleteCancelButton = popupDelete.querySelector('.btn-cancel');

let currentItemToDelete = null;

// Відкрити попап
deleteButtons.forEach(button => {
	button.addEventListener('click', event => {
		popupDelete.style.display = 'flex';

		// Визначаємо, який елемент видаляти
		currentItemToDelete = event.target.closest('.gallery_item');
	});
});

// Підтвердження видалення
deleteConfirmButton.addEventListener('click', () => {
	if (currentItemToDelete) {
		currentItemToDelete.remove();
	}
	popupDelete.style.display = 'none';
	currentItemToDelete = null;
});

// Скасувати видалення
deleteCancelButton.addEventListener('click', () => {
	popupDelete.style.display = 'none';
	currentItemToDelete = null;
});

// Клік поза попапом закриває його
popupDelete.addEventListener('click', event => {
	if (event.target === popupDelete) {
		popupDelete.style.display = 'none';
		currentItemToDelete = null;
	}
});
