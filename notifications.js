// notifications.js
function showNotification(message, type) {
	const notification = document.createElement('div');
	notification.classList.add('notification');

	// В зависимости от типа выбираем цвет
	if (type === 'error') {
		notification.classList.add('error_notification');
	} else if (type === 'success') {
		notification.classList.add('success_notification');
	} else if (type === 'info') {
		notification.classList.add('info_notification');
	}

	notification.textContent = message;

	// Добавляем уведомление на страницу
	document.body.appendChild(notification);

	// Показываем уведомление
	notification.style.display = 'block';

	// Убираем уведомление через 5 секунд
	setTimeout(() => {
		notification.style.display = 'none';
		document.body.removeChild(notification);
	}, 5000);
}

// Экспортируем функцию для использования в других файлах
export { showNotification };
