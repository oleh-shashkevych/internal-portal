document.addEventListener('DOMContentLoaded', () => {

    // --- ОБЩАЯ ЛОГИКА СТРАНИЦЫ (БУРГЕР, ПАНЕЛИ И Т.Д.) ---
    const burger = document.getElementById('burger');
    const closeBurger = document.getElementById('close_burger');
    const sideBar = document.querySelector('.left_cp_bar');
    const overlay = document.querySelector('.overlay');

    if (burger && closeBurger && sideBar && overlay) {
        burger.addEventListener('click', () => {
            sideBar.style.transform = 'translateX(0)';
            overlay.style.display = 'flex';
        });

        closeBurger.addEventListener('click', () => {
            sideBar.style.transform = 'translateX(-120%)';
            overlay.style.display = 'none';
        });
    }

    const tabsContainer = document.querySelector('.lender-tabs');
    const tabButtons = document.querySelectorAll('.lender-tabs__button');
    const contentItems = document.querySelectorAll('.lender-content__item');

    tabsContainer.addEventListener('click', function(event) {
        const clickedButton = event.target.closest('.lender-tabs__button');

        // Если клик был не по кнопке, ничего не делаем
        if (!clickedButton) {
            return;
        }

        // Находим индекс нажатой кнопки
        const clickedIndex = Array.from(tabButtons).indexOf(clickedButton);

        // Убираем класс 'active' у всех кнопок
        tabButtons.forEach(button => {
            button.classList.remove('active');
        });

        // Добавляем класс 'active' нажатой кнопке
        clickedButton.classList.add('active');
        
        // Скрываем весь контент
        contentItems.forEach(item => {
            item.style.display = 'none';
        });
        
        // Показываем контент, соответствующий нажатому табу
        if(contentItems[clickedIndex]) {
            contentItems[clickedIndex].style.display = 'block';
        }
    });
});