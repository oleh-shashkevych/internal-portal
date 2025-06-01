document.addEventListener("DOMContentLoaded", function () {
  const goalBlock = document.querySelector(".goal_chart-monthly");
  const progressBar = document.querySelector(".progress-bar");
  const progressText = document.querySelector(".progress-text");

  if (goalBlock) {
    const maxAmount = parseInt(goalBlock.getAttribute("data-gcp-max"), 10);
    const currentAmount = parseInt(goalBlock.getAttribute("data-gcp-cur"), 10);

    // Рассчитываем процент заполнения
    const progress = (currentAmount / maxAmount) * 100;
    const circleLength = 283; // Длина окружности (2 * π * 45)
    const offset = circleLength - (circleLength * progress) / 100;

    // Устанавливаем прогресс
    progressBar.style.strokeDashoffset = offset;
    // Заменяем точку на запятую в результате toFixed(1)
    progressText.textContent = `$${(currentAmount / 1000000)
      .toFixed(1)
      .replace(".", ",")}m`;
  }
});

const rawData = {
  count_ln_y: 60,
  count_ln_x: 31,
  data: [
    {
      1: 15,
      2: 2,
      3: 45,
      4: 5,
      5: 12,
      6: 31,
      7: 52,
      8: 2,
      9: 34,
      10: 52,
      11: 31,
      12: 32,
      13: 37,
      14: 12,
      15: 32,
      16: 45,
      17: 31,
      18: 12,
      19: 18,
      20: 22,
      21: 20,
      22: 29,
      23: 45,
      24: 49,
      25: 33,
      26: 21,
      27: 42,
      28: 54,
      29: 41,
      30: 22,
      31: 10,
    },
  ],
};

// Подготовка данных
const dataObj = rawData.data[0];
const labels = Array.from({ length: rawData.count_ln_x + 1 }, (_, i) => i);
const dataValues = [0]; // Начинаем с 0, чтобы индекс 0 = 0

for (let i = 1; i <= rawData.count_ln_x; i++) {
  dataValues.push(dataObj[i]);
}

// Функция для форматирования чисел (разделители тысяч и т.д.)
function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

// Кастомная функция для отображения тултипа
function externalTooltipHandler(context) {
  // Tooltip Element
  const { chart, tooltip } = context;
  let tooltipEl = document.getElementById("chartjs-tooltip");

  // Прячем тултип, если нет активного
  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = 0;
    return;
  }

  // Устанавливаем текст тултипа
  // Предположим, что у нас всего один активный элемент (bar)
  if (tooltip.dataPoints && tooltip.dataPoints.length > 0) {
    const dp = tooltip.dataPoints[0];
    const rawValue = dp.raw;
    const formattedValue = formatNumber(rawValue);

    // Заполняем HTML
    tooltipEl.innerHTML = `
          <div class="tooltip-title">Funded Amount</div>
          <div class="tooltip-value"> ${formattedValue}</div>
        `;
  }

  // Определяем позицию
  const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

  // Позиционируем тултип
  tooltipEl.style.opacity = 1;
  tooltipEl.style.left = positionX + tooltip.caretX + "px";
  tooltipEl.style.top = positionY + tooltip.caretY + "px";
}

// Создаём чарт
const ctx = document.getElementById("barChart").getContext("2d");
const barChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: "#28a745",
        borderWidth: 0,
        borderRadius: 0,
        barThickness: 10,
        maxBarThickness: 10,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
        external: externalTooltipHandler,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: rawData.count_ln_y,
        ticks: {
          stepSize: 15,
        },
        grid: {
          display: false,
        },
      },
      x: {
        ticks: {
          autoSkip: false,
          rotation: 0,
          font: {
            size: 10,
          },
        },
        grid: {
          display: false,
        },
      },
    },
  },
});

// Функция для обновления ширины столбцов
function updateBarThickness() {
  const screenWidth = window.innerWidth;
  
  // Сначала фильтруем данные
  const filteredData = labels.map((label, index) => ({
    label: label,
    value: dataValues[index]
  })).filter(item => item.value !== 0);

  barChart.data.labels = filteredData.map(item => item.label);
  barChart.data.datasets[0].data = filteredData.map(item => item.value);
  
  // Затем обновляем ширину столбцов
  if (screenWidth < 650) {
    barChart.data.datasets[0].barThickness = 7;
    barChart.data.datasets[0].maxBarThickness = 7;
  } else if (screenWidth < 480) {
    barChart.data.datasets[0].barThickness = 6;
    barChart.data.datasets[0].maxBarThickness = 6;
  } else {
    barChart.data.datasets[0].barThickness = 10;
    barChart.data.datasets[0].maxBarThickness = 10;
  }
  
  barChart.update();
}

// Вызываем при загрузке страницы
updateBarThickness();

// Слушаем изменение размера окна
window.addEventListener("resize", updateBarThickness);

document.addEventListener("DOMContentLoaded", function () {
  const overlay = document.querySelector(".overlay");

  // Общий обработчик клика для всех блоков
  document.addEventListener("click", function (ev) {
    const allDropdowns = document.querySelectorAll(".custom_dropdown");
    const allUserButtons = document.querySelectorAll(".user-button");

    // Проверяем, был ли клик внутри любого дропдауна или на любой кнопке
    let isInsideDropdown = Array.from(allDropdowns).some((dropdown) =>
      dropdown.contains(ev.target)
    );
    let isOnUserButton = Array.from(allUserButtons).some(
      (button) => button === ev.target
    );

    // Если клик вне всех дропдаунов и кнопок, закрываем всё
    if (!isInsideDropdown && !isOnUserButton) {
      allDropdowns.forEach((dropdown) => {
        dropdown.classList.remove("active");
      });
      allUserButtons.forEach((button) => {
        button.classList.remove("active");
      });
      if (overlay) {
        overlay.classList.remove("open");
      }
    }
    // Если клик внутри дропдауна или на кнопке, ничего не делаем
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // =========================================================
  // 1) ГЛОБАЛЬНАЯ ЛОГИКА ДЛЯ REVENUE-БЛОКА
  //    (который имеет класс .revenue)
  // =========================================================

  function initGlobalFilterHandlers() {
    const revenueSection = document.querySelector(".revenue");
    if (!revenueSection) return;

    const filterWrappers = revenueSection.querySelectorAll(
      ".dashboard_filter-wrapper"
    );
    filterWrappers.forEach((wrapper) => {
      const periodButtons = wrapper.querySelectorAll(
        ".dashboard_filter button"
      );
      const userButton = wrapper.querySelector(".user-button");
      const userDropdown = wrapper.querySelector(".custom_dropdown");
      const overlay = document.querySelector(".overlay");

      function resetActiveButtons() {
        periodButtons.forEach((btn) => btn.classList.remove("active"));
      }

      // Клики по кнопкам "TODAY / THIS WEEK / THIS MONTH"
      periodButtons.forEach((button) => {
        button.addEventListener("click", function () {
          resetActiveButtons();
          this.classList.add("active");
          // Просто закрываем дропдаун, если он открыт
          if (userDropdown) {
            userDropdown.classList.remove("active");
            userButton.classList.remove("active");
            overlay.classList.toggle("open");
          }
        });
      });

      // Открытие / закрытие дропдауна
      if (userButton && userDropdown) {
        userButton.addEventListener("click", function (e) {
          e.stopPropagation();
          userDropdown.classList.toggle("active");
          userButton.classList.toggle("active");
          overlay.classList.toggle("open");
        });
      }
    });
  }

  // Вызываем инициализацию "глобальных" фильтров для Revenue
  initGlobalFilterHandlers();

  // =========================================================
  // 2) СКРИПТ ДЛЯ REVENUE-БЛОКА (ДИНАМИЧЕСКИЙ СПИСОК, APPLY/CANCEL)
  // =========================================================

  (function initRevenueBlock() {
    const userDropdown = document.getElementById("revenue_userDropdown");
    if (!userDropdown) return;
    const ul = userDropdown.querySelector("ul");
    if (!ul) return;

    // Сохраняем первые два li – элементы для сортировки.
    const originalSortingLis = Array.from(ul.children).slice(0, 2);

    // Очищаем список и восстанавливаем сортировочные элементы.
    ul.innerHTML = "";
    originalSortingLis.forEach((li) => ul.appendChild(li));

    // >>> НОВОЕ: Создаём li для "no users found" <<<
    const noUsersLi = document.createElement("li");
    noUsersLi.textContent = "no user found";
    noUsersLi.classList.add("no-users-found");
    noUsersLi.style.display = "none";
    ul.appendChild(noUsersLi);
    // ----------------------------------------------

    // Данные пользователей: имя и доход.
    const userRevenueMapping = {
      "Anatoliy Anatoliy": 700000,
      "James Bons": 1250000,
      "Samanta Brolish": 1100000,
      "John Doe": 900000,
      "Jane Smith": 800000,
      "Anatoliy Anatoliy1": 70000,
      "James Bons1": 250000,
      "Samanta Brolish1": 100000,
      "John Doe1": 90000,
      "Jane Smith1": 80000,
    };

    function updateRevenueUserButtonText() {
      const userButton = document.getElementById("revenue_userButton");
      if (!userButton) return;
      const textDiv = userButton.querySelector("div");
      if (!textDiv) return;
      const count = document.querySelectorAll(
        ".revenue_info-items .revenue_user"
      ).length;
      if (count > 0) {
        textDiv.innerHTML = `Employee Name <span class="employee-count">(${count})</span>`;
      } else {
        textDiv.textContent = "Employee Name";
      }
    }

    // Создадим динамические li для каждого юзера.
    const dynamicUserLis = [];
    for (let userName in userRevenueMapping) {
      if (Object.prototype.hasOwnProperty.call(userRevenueMapping, userName)) {
        const revenue = userRevenueMapping[userName];
        const li = document.createElement("li");
        li.setAttribute("data-revenue", revenue);
        li.setAttribute("data-username", userName);
        li.innerHTML = `
          <div class="custom_checkbox">
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="8" viewBox="0 0 11 8" fill="none">
              <path d="M8.94558 0.255056C9.11838 0.089653 9.34834 -0.00178848 9.58693 2.65108e-05C9.82551 0.0018415 10.0541 0.0967713 10.2244 0.264784C10.3947 0.432797 10.4934 0.660752 10.4997 0.900549C10.506 1.14034 10.4194 1.37323 10.2582 1.55005L5.36357 7.70436C5.2794 7.79551 5.17782 7.86865 5.0649 7.91942C4.95198 7.97018 4.83003 7.99754 4.70636 7.99984C4.58268 8.00214 4.45981 7.97935 4.3451 7.93282C4.23038 7.88629 4.12618 7.81698 4.03872 7.72903L0.792827 4.46564C0.702435 4.38096 0.629933 4.27884 0.579648 4.16537C0.529362 4.05191 0.502323 3.92942 0.500143 3.80522C0.497964 3.68102 0.520688 3.55765 0.566961 3.44248C0.613234 3.3273 0.682108 3.22267 0.769473 3.13483C0.856838 3.047 0.960905 2.97775 1.07547 2.93123C1.19003 2.88471 1.31273 2.86186 1.43627 2.86405C1.5598 2.86624 1.68163 2.89343 1.79449 2.94398C1.90734 2.99454 2.00892 3.06743 2.09315 3.15831L4.66189 5.73967L8.92227 0.28219L8.94558 0.255056Z" fill="white"/>
            </svg>
          </div>
          ${userName}
        `;
        dynamicUserLis.push(li);
        ul.appendChild(li);
      }
    }

    // Сохраним исходный порядок динамических li для сброса сортировки.
    const originalDynamicUserLis = Array.from(dynamicUserLis);

    // Поиск (Revenue)
    const searchInput = userDropdown.querySelector(".dropdown_search input");
    if (searchInput) {
      searchInput.addEventListener("input", function () {
        const query = this.value.toLowerCase();
        let visibleCount = 0;

        dynamicUserLis.forEach((li) => {
          const name = li.getAttribute("data-username").toLowerCase();
          const isVisible = name.includes(query);
          li.style.display = isVisible ? "" : "none";
          if (isVisible) visibleCount++;
        });

        // >>> НОВАЯ ЛОГИКА показа/скрытия сортировки и "no users found" <<<
        if (visibleCount === 0) {
          // Скрываем сортировочные li
          originalSortingLis.forEach((li) => (li.style.display = "none"));
          // Показываем "no users found"
          noUsersLi.style.display = "";
        } else {
          // Показываем сортировочные li
          originalSortingLis.forEach((li) => (li.style.display = ""));
          // Скрываем "no users found"
          noUsersLi.style.display = "none";
        }
      });
    }

    // Сортировка (Revenue)
    const liItems = Array.from(ul.children);
    const sortOldToNew = liItems[0];
    const sortNewToOld = liItems[1];

    function sortUsers(compareFn) {
      const userItems = Array.from(ul.querySelectorAll("li[data-revenue]"));
      userItems.sort(compareFn);
      userItems.forEach((li) => li.remove());
      originalSortingLis.forEach((li) => ul.appendChild(li));
      userItems.forEach((li) => ul.appendChild(li));
      dynamicUserLis.length = 0;
      Array.from(ul.querySelectorAll("li[data-revenue]")).forEach((li) =>
        dynamicUserLis.push(li)
      );
    }

    sortOldToNew.addEventListener("click", function () {
      sortUsers(
        (a, b) =>
          Number(a.getAttribute("data-revenue")) -
          Number(b.getAttribute("data-revenue"))
      );
    });
    sortNewToOld.addEventListener("click", function () {
      sortUsers(
        (a, b) =>
          Number(b.getAttribute("data-revenue")) -
          Number(a.getAttribute("data-revenue"))
      );
    });

    // Контейнер для выбранных юзеров
    const infoItems = document.querySelector(".revenue_info-items");
    if (!infoItems) return;

    // При клике по li переключаем "checked"
    dynamicUserLis.forEach((li) => {
      li.addEventListener("click", function (e) {
        e.stopPropagation();
        const checkbox = li.querySelector(".custom_checkbox");
        checkbox.classList.toggle("checked");
      });
    });

    const userButton = document.getElementById("revenue_userButton");

    // Обновлённая функция обновления прогресс-бара
    function updateProgressBar(element, revenueValue) {
      const finishElem = document.getElementById("revenue_progress-finish");
      if (!finishElem) return;
      const maxValue = Number(finishElem.textContent.trim().replace(/,/g, ""));
      const ratio = revenueValue / maxValue;

      const progressLine = element.querySelector(".user_progress_line");
      if (progressLine) {
        progressLine.style.width = ratio * 100 + "%";

        const progressLineValue = progressLine.querySelector(
          ".user_progress_line-value"
        );
        if (progressLineValue) {
          const progressLineWidth = progressLine.offsetWidth;
          const textWidth = progressLineValue.offsetWidth;

          if (textWidth + 20 > progressLineWidth) {
            progressLineValue.style.position = "absolute";
            progressLineValue.style.left = progressLineWidth + 10 + "px";
            progressLineValue.style.right = "auto";
            progressLineValue.style.color = "black";
          } else {
            progressLineValue.style.position = "absolute";
            progressLineValue.style.right = "10px";
            progressLineValue.style.left = "auto";
            progressLineValue.style.color = "#fff";
          }
        }
      }
    }

    // Обработчик кнопки APPLY для Revenue-блока
    const applyBtn = document.getElementById("revenue_userDropdown-apply");
    if (applyBtn) {
      applyBtn.addEventListener("click", function () {
        infoItems.innerHTML = "";
        dynamicUserLis.forEach((li) => {
          const checkbox = li.querySelector(".custom_checkbox");
          if (checkbox.classList.contains("checked")) {
            const userName = li.getAttribute("data-username");
            const revenueValue = Number(li.getAttribute("data-revenue"));
            const revenueDiv = document.createElement("div");
            revenueDiv.classList.add("revenue_user");
            revenueDiv.setAttribute("data-rvn-usr", revenueValue);
            revenueDiv.setAttribute("data-username", userName);
            revenueDiv.innerHTML = `
  <p>${userName}</p>
  <div class="user_progress-bar">
    <span class="user_progress_line">
      <span class="user_progress_line-value">$ ${revenueValue.toLocaleString(
        "en-US",
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }
      )}</span>
    </span>
  </div>
`;
            infoItems.appendChild(revenueDiv);
            updateProgressBar(revenueDiv, revenueValue);
          }
        });

        // Сброс поиска/сортировки (без сброса состояния "checked")
        dynamicUserLis.forEach((li) => {
          li.style.display = "";
        });
        if (searchInput) {
          searchInput.value = "";
        }
        // Восстанавливаем исходный порядок элементов в списке
        const currentUserLis = Array.from(
          ul.querySelectorAll("li[data-revenue]")
        );
        currentUserLis.forEach((li) => li.remove());
        originalDynamicUserLis.forEach((li) => ul.appendChild(li));

        // Закрываем дропдаун и обновляем текст кнопки
        userDropdown.classList.remove("active");
        userButton.classList.remove("active");
        overlay.classList.remove("open");
        updateRevenueUserButtonText();
      });
    }

    // Кнопка Cancel
    const cancelBtn = document.getElementById("revenue_userDropdown-cancel");
    if (cancelBtn) {
      cancelBtn.addEventListener("click", function () {
        if (searchInput) searchInput.value = "";
        dynamicUserLis.forEach((li) => {
          const checkbox = li.querySelector(".custom_checkbox");
          const userName = li.getAttribute("data-username");
          if (
            !infoItems.querySelector(
              `.revenue_user[data-username="${userName}"]`
            )
          ) {
            checkbox.classList.remove("checked");
          }
          li.style.display = "";
        });
        const currentUserLis = Array.from(
          ul.querySelectorAll("li[data-revenue]")
        );
        currentUserLis.forEach((li) => li.remove());
        originalDynamicUserLis.forEach((li) => ul.appendChild(li));
        userDropdown.classList.remove("active");
        userButton.classList.remove("active");
        overlay.classList.remove("open");
      });
    }

    // Обновление прогресс-баров для уже имеющихся (если есть)
    document.querySelectorAll(".revenue_user").forEach((user) => {
      const userValue = Number(user.getAttribute("data-rvn-usr"));
      updateProgressBar(user, userValue);
    });

    // >>> Автоматически отмечаем всех юзеров <<<
    dynamicUserLis.forEach((li) => {
      const checkbox = li.querySelector(".custom_checkbox");
      checkbox.classList.add("checked");
    });
    if (applyBtn) {
      applyBtn.click();
    }
  })();

  // =========================================================
  // 3) СКРИПТ ДЛЯ APPLICATIONS-БЛОКА
  // =========================================================

  (function initApplicationsBlock() {
    const applicationsSection = document.querySelector(".applications");
    if (!applicationsSection) return;

    // Кнопки периода (TODAY / WEEK / MONTH) только внутри .applications
    const filterWrapper = applicationsSection.querySelector(
      ".dashboard_filter-wrapper"
    );
    if (filterWrapper) {
      const periodButtons = filterWrapper.querySelectorAll(
        ".dashboard_filter button"
      );
      periodButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
          periodButtons.forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
        });
      });
    }

    // Селекторы для выпадающего меню
    const userButton = document.getElementById("applications_userButton");
    const userDropdown = document.getElementById("applications_userDropdown");
    const applyBtn = document.getElementById("applications_userDropdown-apply");
    const cancelBtn = document.getElementById(
      "applications_userDropdown-cancel"
    );
    const ul = userDropdown
      ? userDropdown.querySelector("ul.custom_dropdown-users")
      : null;
    const searchInput = userDropdown
      ? userDropdown.querySelector(".dropdown_search input")
      : null;
    const selectedUsersContainer = document.getElementById(
      "applicationsSelectedUsers"
    );

    // Множество выбранных сотрудников
    let selectedEmployees = new Set();

    // Открытие / закрытие дропдауна
    if (userButton && userDropdown) {
      userButton.addEventListener("click", function (e) {
        e.stopPropagation();
        userDropdown.classList.toggle("active");
        userButton.classList.toggle("active");
        overlay.classList.toggle("open");
      });
    }

    if (!ul) return;

    // Сохраняем первые два li (для сортировки)
    const allLi = Array.from(ul.children);
    const sortLi1 = allLi[0]; // Sort Oldest to Newest
    const sortLi2 = allLi[1]; // Sort Newest to oldest

    // Очищаем всё и возвращаем сортировочные li
    ul.innerHTML = "";
    ul.appendChild(sortLi1);
    ul.appendChild(sortLi2);

    // >>> ДОБАВЛЯЕМ li "no users found" <<<
    const noUsersLi = document.createElement("li");
    noUsersLi.textContent = "no users found";
    noUsersLi.classList.add("no-users-found");
    noUsersLi.style.display = "none"; // скрыт по умолчанию
    ul.appendChild(noUsersLi);
    // ------------------------------------

    // Пример массива сотрудников
    const employees = [
      "Monica Cooper",
      "Laurence Meyer",
      "Alan Barton",
      "John Doe",
      "Jane Smith",
      "Alan Barton1",
      "John Doe1",
      "Jane Smith1",
    ];

    // Создаём li для каждого сотрудника
    employees.forEach((name) => {
      const li = document.createElement("li");
      li.setAttribute("data-username", name);
      li.innerHTML = `
      <div class="custom_checkbox">
        <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
          <path d="M8.94558 0.255056C9.11838 0.089653 9.34834 -0.00178848 9.58693 2.65108e-05C9.82551 0.0018415 10.0541 0.0967713 10.2244 0.264784C10.3947 0.432797 10.4934 0.660752 10.4997 0.900549C10.506 1.14034 10.4194 1.37323 10.2582 1.55005L5.36357 7.70436C5.2794 7.79551 5.17782 7.86865 5.0649 7.91942C4.95198 7.97018 4.83003 7.99754 4.70636 7.99984C4.58268 8.00214 4.45981 7.97935 4.3451 7.93282C4.23038 7.88629 4.12618 7.81698 4.03872 7.72903L0.792827 4.46564C0.702435 4.38096 0.629933 4.27884 0.579648 4.16537C0.529362 4.05191 0.502323 3.92942 0.500143 3.80522C0.497964 3.68102 0.520688 3.55765 0.566961 3.44248C0.613234 3.3273 0.682108 3.22267 0.769473 3.13483C0.856838 3.047 0.960905 2.97775 1.07547 2.93123C1.19003 2.88471 1.31273 2.86186 1.43627 2.86405C1.5598 2.86624 1.68163 2.89343 1.79449 2.94398C1.90734 2.99454 2.00892 3.06743 2.09315 3.15831L4.66189 5.73967L8.92227 0.28219L8.94558 0.255056Z" fill="white"/>
        </svg>
      </div>
      ${name}
    `;
      ul.appendChild(li);

      // При клике переключаем класс "checked"
      li.addEventListener("click", (evt) => {
        evt.stopPropagation();
        const checkbox = li.querySelector(".custom_checkbox");
        checkbox.classList.toggle("checked");
      });
    });

    // Поиск (Applications)
    if (searchInput) {
      searchInput.addEventListener("input", function () {
        const query = this.value.toLowerCase();
        const userLis = ul.querySelectorAll("li[data-username]");
        let visibleCount = 0;

        userLis.forEach((li) => {
          const uname = li.getAttribute("data-username").toLowerCase();
          const isVisible = uname.includes(query);
          li.style.display = isVisible ? "" : "none";
          if (isVisible) visibleCount++;
        });

        // >>> НОВАЯ ЛОГИКА: если ничего не найдено, скрываем сортировку, показываем "no users found" <<<
        if (visibleCount === 0) {
          sortLi1.style.display = "none";
          sortLi2.style.display = "none";
          noUsersLi.style.display = "";
        } else {
          sortLi1.style.display = "";
          sortLi2.style.display = "";
          noUsersLi.style.display = "none";
        }
      });
    }

    // Сортировка (Applications)
    function sortAppsUsers(compareFn) {
      const userLis = Array.from(ul.querySelectorAll("li[data-username]"));
      userLis.sort(compareFn);
      userLis.forEach((li) => li.remove());

      // Заново добавляем сортировочные li, потом — остальные
      ul.appendChild(sortLi1);
      ul.appendChild(sortLi2);
      userLis.forEach((li) => ul.appendChild(li));

      // "no users found" всегда в конце
      ul.appendChild(noUsersLi);
    }

    sortLi1.addEventListener("click", () => {
      // Sort Oldest to Newest => алфавит А-Я
      sortAppsUsers((a, b) => {
        const nameA = a.getAttribute("data-username").toLowerCase();
        const nameB = b.getAttribute("data-username").toLowerCase();
        return nameA.localeCompare(nameB);
      });
    });

    sortLi2.addEventListener("click", () => {
      // Sort Newest to Oldest => алфавит Я-А
      sortAppsUsers((a, b) => {
        const nameA = a.getAttribute("data-username").toLowerCase();
        const nameB = b.getAttribute("data-username").toLowerCase();
        return nameB.localeCompare(nameA);
      });
    });

    // Рендер выбранных сотрудников под графиком
    function renderSelectedUsers() {
      if (!selectedUsersContainer) return;
      selectedUsersContainer.innerHTML = "";
      selectedEmployees.forEach((name) => {
        const div = document.createElement("div");
        div.classList.add("applications_selected-user");
        div.setAttribute("data-username", name);
        div.innerHTML = `
        <span>Employee:</span>
        <span class="selected-user-name"> ${name}</span>
        <span class="remove-icon" style="cursor: pointer;">
          <svg xmlns="http://www.w3.org/2000/svg" width="7" height="7" viewBox="0 0 7 7" fill="none">
            <path d="M7 0.6125L6.3875 0L3.5 2.8875L0.6125 0L0 0.6125L2.8875 3.5L0 6.3875L0.6125 7L3.5 4.1125L6.3875 7L7 6.3875L4.1125 3.5L7 0.6125Z" fill="white"/>
          </svg>
        </span>
      `;
        div.addEventListener("click", () => {
          selectedEmployees.delete(name);
          const li = ul.querySelector(`li[data-username="${name}"]`);
          if (li) {
            const checkbox = li.querySelector(".custom_checkbox");
            checkbox.classList.remove("checked");
          }
          renderSelectedUsers();
          updateEmployeeButtonText();
        });
        selectedUsersContainer.appendChild(div);
      });
    }

    // Обновление счётчика (Employee Name (n))
    function updateEmployeeButtonText() {
      if (!userButton) return;
      const count = selectedEmployees.size;
      const textDiv = userButton.querySelector("div");
      if (!textDiv) return;
      if (count > 0) {
        textDiv.innerHTML = `Employee Name <span class="employee-count">(${count})</span>`;
      } else {
        textDiv.textContent = "Employee Name";
      }
    }

    // Кнопка APPLY
    if (applyBtn) {
      applyBtn.addEventListener("click", function () {
        const userLis = ul.querySelectorAll("li[data-username]");
        userLis.forEach((li) => {
          const name = li.getAttribute("data-username");
          const checkbox = li.querySelector(".custom_checkbox");
          if (checkbox.classList.contains("checked")) {
            selectedEmployees.add(name);
          } else {
            selectedEmployees.delete(name);
          }
        });
        renderSelectedUsers();
        updateEmployeeButtonText();
        // Сброс поиска
        if (searchInput) searchInput.value = "";
        userLis.forEach((li) => (li.style.display = ""));
        // Восстанавливаем сортировочные пункты и скрываем "no users found"
        sortLi1.style.display = "";
        sortLi2.style.display = "";
        noUsersLi.style.display = "none";

        userDropdown.classList.remove("active");
        userButton.classList.remove("active");
        overlay.classList.remove("open");
      });
    }

    // Кнопка CANCEL
    if (cancelBtn) {
      cancelBtn.addEventListener("click", function () {
        // Откатываем состояние чекбоксов
        const userLis = ul.querySelectorAll("li[data-username]");
        userLis.forEach((li) => {
          const name = li.getAttribute("data-username");
          const checkbox = li.querySelector(".custom_checkbox");
          if (selectedEmployees.has(name)) {
            checkbox.classList.add("checked");
          } else {
            checkbox.classList.remove("checked");
          }
          li.style.display = "";
        });
        // Сброс строки поиска
        if (searchInput) searchInput.value = "";
        // Восстанавливаем сортировочные пункты и скрываем "no users found"
        sortLi1.style.display = "";
        sortLi2.style.display = "";
        noUsersLi.style.display = "none";

        userDropdown.classList.remove("active");
        userButton.classList.remove("active");
        overlay.classList.remove("open");
      });
    }
  })();
});

(function initFundedDealsBlock() {
  // Элементы дропдауна Funded deals
  const userButton = document.getElementById("funded_userButton");
  const userDropdown = document.getElementById("funded_userDropdown");
  const applyBtn = document.getElementById("funded_userDropdown-apply");
  const cancelBtn = document.getElementById("funded_userDropdown-cancel");
  const ul = userDropdown
    ? userDropdown.querySelector("ul.custom_dropdown-users")
    : null;
  const searchInput = userDropdown
    ? userDropdown.querySelector(".dropdown_search input")
    : null;
  const selectedUsersContainer = document.querySelector(
    ".funded_deals-selected_users"
  );

  // Множество выбранных сотрудников
  let selectedEmployees = new Set();

  if (!userButton || !userDropdown || !ul) return;

  // Открытие/закрытие дропдауна при клике на кнопку
  userButton.addEventListener("click", function (e) {
    e.stopPropagation();
    userDropdown.classList.toggle("active");
    userButton.classList.toggle("active");
    overlay.classList.toggle("open");
  });

  // Переключение кнопок периода
  const fundedSection = document.querySelector(".dashboard_funded-deals");
  if (fundedSection) {
    const periodButtons = fundedSection.querySelectorAll(
      ".dashboard_filter button"
    );
    periodButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        periodButtons.forEach((b) => b.classList.remove("active"));
        this.classList.add("active");
      });
    });
  }

  // Сохраняем первые два li (для сортировки) - как в Applications блоке
  const allLi = Array.from(ul.children);
  const sortLi1 = allLi[0]; // Sort Oldest to Newest
  const sortLi2 = allLi[1]; // Sort Newest to oldest

  // Очищаем всё и возвращаем сортировочные li
  ul.innerHTML = "";
  ul.appendChild(sortLi1);
  ul.appendChild(sortLi2);

  // >>> ДОБАВЛЯЕМ li "no users found" <<<
  const noUsersLi = document.createElement("li");
  noUsersLi.textContent = "no users found";
  noUsersLi.classList.add("no-users-found");
  noUsersLi.style.display = "none"; // скрыт по умолчанию
  ul.appendChild(noUsersLi);
  // ------------------------------------

  // Пример массива сотрудников
  const employees = [
    "Monica Cooper",
    "Laurence Meyer",
    "Alan Barton",
    "John Doe",
    "Jane Smith",
    "Alan Barton1",
    "John Doe1",
    "Jane Smith1",
    "Monica Cooper22",
    "Laurence Meyer123",
    "Alan Barton124",
    "John Doe2414",
    "Jane Smith12412",
    "Alan Barton1124",
    "John Doe1124",
    "Jane Smith12414",
  ];

  // Создаём li для каждого сотрудника
  employees.forEach((name) => {
    const li = document.createElement("li");
    li.setAttribute("data-username", name);
    li.innerHTML = `
			<div class="custom_checkbox">
				<svg width="11" height="8" viewBox="0 0 11 8" fill="none">
					<path d="M8.94558 0.255056C9.11838 0.089653 9.34834 -0.00178848 9.58693 2.65108e-05C9.82551 0.0018415 10.0541 0.0967713 10.2244 0.264784C10.3947 0.432797 10.4934 0.660752 10.4997 0.900549C10.506 1.14034 10.4194 1.37323 10.2582 1.55005L5.36357 7.70436C5.2794 7.79551 5.17782 7.86865 5.0649 7.91942C4.95198 7.97018 4.83003 7.99754 4.70636 7.99984C4.58268 8.00214 4.45981 7.97935 4.3451 7.93282C4.23038 7.88629 4.12618 7.81698 4.03872 7.72903L0.792827 4.46564C0.702435 4.38096 0.629933 4.27884 0.579648 4.16537C0.529362 4.05191 0.502323 3.92942 0.500143 3.80522C0.497964 3.68102 0.520688 3.55765 0.566961 3.44248C0.613234 3.3273 0.682108 3.22267 0.769473 3.13483C0.856838 3.047 0.960905 2.97775 1.07547 2.93123C1.19003 2.88471 1.31273 2.86186 1.43627 2.86405C1.5598 2.86624 1.68163 2.89343 1.79449 2.94398C1.90734 2.99454 2.00892 3.06743 2.09315 3.15831L4.66189 5.73967L8.92227 0.28219L8.94558 0.255056Z" fill="white"/>
				</svg>
			</div>
			${name}
		`;
    ul.appendChild(li);

    // При клике переключаем класс "checked" (для чекбоксов)
    li.addEventListener("click", (evt) => {
      evt.stopPropagation();
      const checkbox = li.querySelector(".custom_checkbox");
      checkbox.classList.toggle("checked");
    });
  });

  // Поиск
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const query = this.value.toLowerCase();
      const userLis = ul.querySelectorAll("li[data-username]");
      let visibleCount = 0;

      userLis.forEach((li) => {
        // Пропускаем li "no users found"
        if (li === noUsersLi) return;
        const uname = li.getAttribute("data-username").toLowerCase();
        const isVisible = uname.includes(query);
        li.style.display = isVisible ? "" : "none";
        if (isVisible) visibleCount++;
      });

      // Если никого не нашли, скрываем сортировку и показываем "no users found"
      if (visibleCount === 0) {
        sortLi1.style.display = "none";
        sortLi2.style.display = "none";
        noUsersLi.style.display = "";
      } else {
        sortLi1.style.display = "";
        sortLi2.style.display = "";
        noUsersLi.style.display = "none";
      }
    });
  }

  // Сортировка
  function sortFundedUsers(compareFn) {
    const userLis = Array.from(ul.querySelectorAll("li[data-username]"));
    userLis.sort(compareFn);
    userLis.forEach((li) => li.remove());

    // Возвращаем пункты сортировки
    ul.appendChild(sortLi1);
    ul.appendChild(sortLi2);
    // Добавляем отсортированные li
    userLis.forEach((li) => ul.appendChild(li));
    // "no users found" всегда в конце
    ul.appendChild(noUsersLi);
  }

  sortLi1.addEventListener("click", () => {
    // Sort Oldest to Newest => алфавит А-Я
    sortFundedUsers((a, b) => {
      const nameA = a.getAttribute("data-username").toLowerCase();
      const nameB = b.getAttribute("data-username").toLowerCase();
      return nameA.localeCompare(nameB);
    });
  });

  sortLi2.addEventListener("click", () => {
    // Sort Newest to Oldest => алфавит Я-А
    sortFundedUsers((a, b) => {
      const nameA = a.getAttribute("data-username").toLowerCase();
      const nameB = b.getAttribute("data-username").toLowerCase();
      return nameB.localeCompare(nameA);
    });
  });

  // Рендер выбранных сотрудников под графиком
  function renderSelectedUsers() {
    if (!selectedUsersContainer) return;
    selectedUsersContainer.innerHTML = "";
    selectedEmployees.forEach((name) => {
      const div = document.createElement("div");
      div.classList.add("funded_deals_selected-user");
      div.setAttribute("data-username", name);
      div.innerHTML = `
				<span>Employee:</span>
				<span class="selected-user-name"> ${name}</span>
				<span class="remove-icon" style="cursor: pointer;">
					<svg xmlns="http://www.w3.org/2000/svg" width="7" height="7" viewBox="0 0 7 7" fill="none">
						<path d="M7 0.6125L6.3875 0L3.5 2.8875L0.6125 0L0 0.6125L2.8875 3.5L0 6.3875L0.6125 7L3.5 4.1125L6.3875 7L7 6.3875L4.1125 3.5L7 0.6125Z" fill="white"/>
					</svg>
				</span>
			`;
      // По клику на плашку удаляем сотрудника
      div.addEventListener("click", () => {
        selectedEmployees.delete(name);
        const li = ul.querySelector(`li[data-username="${name}"]`);
        if (li) {
          const checkbox = li.querySelector(".custom_checkbox");
          checkbox.classList.remove("checked");
        }
        renderSelectedUsers();
        updateEmployeeButtonText();
      });
      selectedUsersContainer.appendChild(div);
    });
  }

  // Обновление текста кнопки с количеством выбранных сотрудников
  function updateEmployeeButtonText() {
    if (!userButton) return;
    const count = selectedEmployees.size;
    const textDiv = userButton.querySelector("div");
    if (!textDiv) return;
    if (count > 0) {
      textDiv.innerHTML = `Employee Name <span class="employee-count">(${count})</span>`;
    } else {
      textDiv.textContent = "Employee Name";
    }
  }

  // Кнопка APPLY
  if (applyBtn) {
    applyBtn.addEventListener("click", function () {
      const userLis = ul.querySelectorAll("li[data-username]");
      userLis.forEach((li) => {
        const name = li.getAttribute("data-username");
        const checkbox = li.querySelector(".custom_checkbox");
        if (checkbox.classList.contains("checked")) {
          selectedEmployees.add(name);
        } else {
          selectedEmployees.delete(name);
        }
      });
      renderSelectedUsers();
      updateEmployeeButtonText();

      // Сброс поиска
      if (searchInput) searchInput.value = "";
      userLis.forEach((li) => (li.style.display = ""));
      // Показываем сортировку и скрываем "no users found"
      sortLi1.style.display = "";
      sortLi2.style.display = "";
      noUsersLi.style.display = "none";

      userDropdown.classList.remove("active");
      userButton.classList.remove("active");
      overlay.classList.remove("open");
    });
  }

  // Кнопка CANCEL
  if (cancelBtn) {
    cancelBtn.addEventListener("click", function () {
      // Откатываем состояние чекбоксов
      const userLis = ul.querySelectorAll("li[data-username]");
      userLis.forEach((li) => {
        const name = li.getAttribute("data-username");
        const checkbox = li.querySelector(".custom_checkbox");
        if (selectedEmployees.has(name)) {
          checkbox.classList.add("checked");
        } else {
          checkbox.classList.remove("checked");
        }
        li.style.display = "";
      });
      if (searchInput) searchInput.value = "";

      // Показываем сортировку и скрываем "no users found"
      sortLi1.style.display = "";
      sortLi2.style.display = "";
      noUsersLi.style.display = "none";

      userDropdown.classList.remove("active");
      userButton.classList.remove("active");
      overlay.classList.remove("open");
    });
  }
})();

const burger = document.getElementById("burger");
const closeBurger = document.getElementById("close_burger");
const sideBar = document.querySelector(".left_cp_bar");
const overlay = document.querySelector(".overlay");

// При клике на бургер показываем меню
burger.addEventListener("click", () => {
  sideBar.style.transform = "translateX(0)";
  overlay.style.display = "flex";
});

// При клике на крестик скрываем меню
closeBurger.addEventListener("click", () => {
  sideBar.style.transform = "translateX(-120%)";
  overlay.style.display = "none";
});
