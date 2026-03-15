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

function toggleContactsPanel(width) {
    const panel = document.querySelector('.contacts_panel');
    const toggleButton = document.getElementById('open_contacts');

    if (!panel || !toggleButton) return;

    if (width <= 1920) {
        panel.classList.remove('active');
        toggleButton.classList.remove('active');
    } else {
        panel.classList.add('active');
        toggleButton.classList.add('active');
    }
}

// Инициализация при загрузке
toggleContactsPanel(window.innerWidth);

// Слушатель изменения размера окна
window.addEventListener('resize', () => {
    toggleContactsPanel(window.innerWidth);
});

document.addEventListener('DOMContentLoaded', function () {
    const tabButtons = document.querySelectorAll('.pr-tab-btn');
    const tabContents = document.querySelectorAll('.pr-tab-content');

    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Убираем класс active у всех кнопок и контента
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));

                // Добавляем класс active кликнутой кнопке
                button.classList.add('active');

                // Ищем соответствующий контент по data-tab и показываем его
                const tabId = button.getAttribute('data-tab');
                const targetContent = document.getElementById(`tab-${tabId}`);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const balanceData = {
        maxAmount: 5000.00,
        currentAmount: 1350.00,
        availableLeads: 30
    };

    function formatCurrency(amount) {
        return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    const elCurrent = document.getElementById('lgvCurrentBalance');
    const elMax = document.getElementById('lgvMaxBalance');
    const elLeads = document.getElementById('lgvAvailableLeads');
    const elFill = document.getElementById('lgvProgressFill');

    if (elCurrent && elMax && elLeads && elFill) {
        elCurrent.textContent = formatCurrency(balanceData.currentAmount);
        elMax.textContent = formatCurrency(balanceData.maxAmount);
        elLeads.textContent = balanceData.availableLeads;

        const percent = (balanceData.currentAmount / balanceData.maxAmount) * 100;

        setTimeout(() => {
            elFill.style.width = `${Math.min(Math.max(percent, 0), 100)}%`;
        }, 300);
    }

    // Tab switching logic (reusing standard logic for .pr-tab-btn inside .lgv-main if it wasn't global)
    const lgvMain = document.querySelector('.lgv-main');
    if (lgvMain) {
        const tabButtons = lgvMain.querySelectorAll('.pr-tab-btn');
        const tabContents = lgvMain.querySelectorAll('.pr-tab-content');

        if (tabButtons.length > 0) {
            tabButtons.forEach(button => {
                button.addEventListener('click', () => {
                    tabButtons.forEach(btn => btn.classList.remove('active'));
                    tabContents.forEach(content => content.classList.remove('active'));

                    button.classList.add('active');

                    const tabId = button.getAttribute('data-tab');
                    const targetContent = document.getElementById(`tab-${tabId}`);
                    if (targetContent) {
                        targetContent.classList.add('active');
                    }
                });
            });
        }
    }
});