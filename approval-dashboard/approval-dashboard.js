document.addEventListener('DOMContentLoaded', () => {
    // 1. Дані та налаштування для графіка
    const MAX_CHART_VALUE = 1000000;
    const MONTHLY_DATA = {
        labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        data: [250000, 600000, 300000, 450000, 500000, 840610, 280000, 180000, 950000, 880000, 980000, 250000]
    };

    const ctx = document.getElementById('approvalApprovalAmountChart');
    if (!ctx) return;

    // 2. Конфігурація Chart.js з виправленим тултіпом
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: MONTHLY_DATA.labels,
            datasets: [{
                label: 'Funded Amount',
                data: MONTHLY_DATA.data,
                fill: true,
                borderColor: '#159C2A',
                borderWidth: 3,
                tension: 0,
                backgroundColor: context => {
                    const chart = context.chart;
                    const {ctx, chartArea} = chart;
                    if (!chartArea) return null;
                    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                    gradient.addColorStop(0, 'rgba(21, 156, 42, 0.4)');
                    gradient.addColorStop(1, 'rgba(21, 156, 42, 0)');
                    return gradient;
                },
                pointRadius: 3,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#159C2A',
                pointBorderWidth: 3,
                pointHoverRadius: 3,
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#232323',
                pointHoverBorderWidth: 3,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false,
                    position: 'nearest',
                    external: function(context) {
                        let tooltipEl = document.getElementById('chartjs-tooltip');
                        if (!tooltipEl) {
                            tooltipEl = document.createElement('div');
                            tooltipEl.id = 'chartjs-tooltip';
                            tooltipEl.innerHTML = '<table></table>';
                            document.body.appendChild(tooltipEl);
                        }
                        const tooltipModel = context.tooltip;
                        if (tooltipModel.opacity === 0) {
                            tooltipEl.style.opacity = 0;
                            return;
                        }
                        if (tooltipModel.body) {
                            const titleLines = tooltipModel.title || [];
                            const bodyLines = tooltipModel.body.map(b => b.lines);
                            let innerHtml = '<thead>';
                            titleLines.forEach(function(title) {
                                // innerHtml += '<tr><th style="font-weight: 400; font-size: 14px; line-height: 20px">' + title + '</th></tr>';
								innerHtml += '<tr><th style="font-weight: 400; font-size: 14px; line-height: 20px">Funded Amount</th></tr>';
                            });
                            innerHtml += '</thead><tbody>';
                            bodyLines.forEach(function(body, i) {
                                const amount = parseFloat(body.toString().replace(/[^0-9.-]+/g, ""));
                                // const formattedAmount = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
								const formattedAmount = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
                                innerHtml += `<tr><td style="font-weight: 600; font-size: 18px; line-height: 22px">${formattedAmount}</td></tr>`;
                            });
                            innerHtml += '</tbody>';
                            let table = tooltipEl.querySelector('table');
                            table.innerHTML = innerHtml;
                        }

                        const canvasRect = context.chart.canvas.getBoundingClientRect();

                        // --- Нова, надійна логіка позиціювання ---
                        let newX = canvasRect.left + window.scrollX + tooltipModel.caretX + 15;
                        let newY = canvasRect.top + window.scrollY + tooltipModel.caretY;

                        // Перевірка виходу за праву межу вікна
                        if (newX + tooltipEl.offsetWidth > window.innerWidth) {
                            newX = canvasRect.left + window.scrollX + tooltipModel.caretX - tooltipEl.offsetWidth - 15;
                        }
                        
                        // Перевірка виходу за верхню межу вікна
                        if (newY - tooltipEl.offsetHeight / 2 < 0) {
                            newY = tooltipEl.offsetHeight / 2;
                        }

                        tooltipEl.style.opacity = 1;
                        tooltipEl.style.position = 'absolute';
                        tooltipEl.style.left = newX + 'px';
                        tooltipEl.style.top = newY + 'px';
                        tooltipEl.style.transform = 'translateY(0)';
                        tooltipEl.style.background = '#fff';
                        tooltipEl.style.borderRadius = '3px';
                        tooltipEl.style.color = '#1B1B1B';
                        tooltipEl.style.border = '1px solid #E8E9E8';
                        tooltipEl.style.padding = '8px';
                        tooltipEl.style.pointerEvents = 'none';
                        tooltipEl.style.transition = 'all .3s ease';
                        tooltipEl.style.fontFamily = 'Urbanist, sans-serif';
                        tooltipEl.style.textAlign = 'left';
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: MAX_CHART_VALUE,
                    border: { display: false },
                    ticks: {
                        stepSize: 250000,
                        color: '#1B1B1B',
                        font: { family: 'Urbanist', size: 12, weight: '300' },
                        padding: 10,
                        callback: function(value) {
                            if (value === 1000000) return '1M';
                            if (value > 0) return `${value / 1000}K`;
                            return '0';
                        }
                    },
                    grid: {
                        drawBorder: false,
                        color: (context) => {
                            if (context.tick.value === 0 || context.tick.value === MAX_CHART_VALUE) {
                                return 'transparent';
                            }
                            return '#EEEEEE';
                        },
                    },
                },
                x: {
                    border: { display: false },
                    ticks: {
                        color: '#1B1B1B',
                        font: { family: 'Urbanist', size: 12, weight: '300' },
                        padding: 10
                    },
                    grid: {
                        drawBorder: false,
                        color: (context) => {
                            if (context.index === 0 || context.index === MONTHLY_DATA.labels.length - 1) {
                                return 'transparent';
                            }
                            return '#CDE3D0';
                        },
                    }
                }
            }
        }
    });
});

// ==========================================================================
// Goal Chart (Approval Amount) Animation
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Перевіряємо, чи існує хоча б один елемент, щоб запускати логіку
    const goalChartContainer = document.querySelector('.approval-amount__graphs');
    if (goalChartContainer) {
        const goalsData = [{
            label: 'monthly-goal',
            currentValue: 840610,
            maxValue: 1000000
        }, {
            label: 'amount-funded',
            currentValue: 940000,
            maxValue: 1000000
        }, {
            label: 'previous-total',
            currentValue: 910000,
            maxValue: 1000000
        }];

        // Анімація для скороченого значення (напр. $841k)
        function animateShortValue(element, start, end, duration) {
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                const currentValue = Math.floor(progress * (end - start) + start);
                const shortValue = Math.round(currentValue / 1000);
                element.textContent = `$${shortValue}k`;
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };
            window.requestAnimationFrame(step);
        }

        // НОВА ФУНКЦІЯ: Анімація для повного значення (напр. $840,610)
        function animateFullValue(element, start, end, duration) {
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                const currentValue = Math.floor(progress * (end - start) + start);
                // Форматуємо число як валюту без копійок
                element.textContent = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                }).format(currentValue);
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };
            window.requestAnimationFrame(step);
        }

        function runGoalAnimations() {
            goalsData.forEach(goal => {
                const circleElement = document.getElementById(`${goal.label}-circle`);
                const valueElement = document.getElementById(`${goal.label}-value`);
                const fullValueElement = document.getElementById(`${goal.label}-full-value`);

                if (circleElement && valueElement && fullValueElement) {
                    const percentage = (goal.currentValue / goal.maxValue) * 100;
                    circleElement.style.setProperty('--p', percentage);
                    
                    // Запускаємо анімацію для обох значень
                    animateShortValue(valueElement, 0, goal.currentValue, 1500);
                    animateFullValue(fullValueElement, 0, goal.currentValue, 1500); // <-- ОСЬ ТУТ ЗМІНА
                }
            });
        }

        setTimeout(runGoalAnimations, 1000);
    }
});