document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // ЧАСТИНА 1: Лінійний графік (Код, який ти надав - не змінено)
    // ==========================================================================
    const linearChartCtx = document.getElementById('approvalApprovalAmountChart');
    if (linearChartCtx) {
        const MAX_CHART_VALUE = 1000000;
        const MONTHLY_DATA = {
            labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            data: [250000, 600000, 300000, 450000, 500000, 840610, 280000, 180000, 950000, 880000, 980000, 250000]
        };
        new Chart(linearChartCtx, {
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
                        const { ctx, chartArea } = context.chart;
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
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    legend: { display: false },
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
                                let innerHtml = '<thead>';
                                tooltipModel.title.forEach(function(title) {
                                    innerHtml += '<tr><th style="font-weight: 400; font-size: 14px; line-height: 20px">Funded Amount</th></tr>';
                                });
                                innerHtml += '</thead><tbody>';
                                tooltipModel.body.map(b => b.lines).forEach(function(body) {
                                    const formattedAmount = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(parseFloat(body.toString().replace(/[^0-9.-]+/g, "")));
                                    innerHtml += `<tr><td style="font-weight: 600; font-size: 18px; line-height: 22px">${formattedAmount}</td></tr>`;
                                });
                                innerHtml += '</tbody>';
                                tooltipEl.querySelector('table').innerHTML = innerHtml;
                            }
                            const canvasRect = context.chart.canvas.getBoundingClientRect();
                            let newX = canvasRect.left + window.scrollX + context.tooltip.caretX + 15;
                            let newY = canvasRect.top + window.scrollY + context.tooltip.caretY;
                            if (newX + tooltipEl.offsetWidth > window.innerWidth) {
                                newX = canvasRect.left + window.scrollX + context.tooltip.caretX - tooltipEl.offsetWidth - 15;
                            }
                            if (newY - tooltipEl.offsetHeight / 2 < 0) {
                                newY = tooltipEl.offsetHeight / 2;
                            }
                            tooltipEl.style.opacity = 1;
                            tooltipEl.style.position = 'absolute';
                            tooltipEl.style.left = `${newX}px`;
                            tooltipEl.style.top = `${newY}px`;
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
                                if (value > 0) return `${value/1000}K`;
                                return '0';
                            }
                        },
                        grid: {
                            drawBorder: false,
                            color: (context) => (context.tick.value === 0 || context.tick.value === MAX_CHART_VALUE) ? 'transparent' : '#EEEEEE',
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
                            color: (context) => (context.index === 0 || context.index === MONTHLY_DATA.labels.length - 1) ? 'transparent' : '#CDE3D0',
                        }
                    }
                }
            }
        });
    }

    // ==========================================================================
    // ЧАСТИНА 2: Goal Chart (Код, який ти надав - не змінено)
    // ==========================================================================
    const goalChartContainer = document.querySelector('.approval-amount__graphs');
    if (goalChartContainer) {
        const goalsData = [{ label: 'monthly-goal', currentValue: 840610, maxValue: 1000000 }, { label: 'amount-funded', currentValue: 940000, maxValue: 1000000 }, { label: 'previous-total', currentValue: 910000, maxValue: 1000000 }];
        function animateShortValue(element, start, end, duration) {
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                const currentValue = Math.floor(progress * (end - start) + start);
                element.textContent = `$${Math.round(currentValue/1000)}k`;
                if (progress < 1) window.requestAnimationFrame(step);
            };
            window.requestAnimationFrame(step);
        }
        function animateFullValue(element, start, end, duration) {
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                const currentValue = Math.floor(progress * (end - start) + start);
                element.textContent = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(currentValue);
                if (progress < 1) window.requestAnimationFrame(step);
            };
            window.requestAnimationFrame(step);
        }
        function runGoalAnimations() {
            goalsData.forEach(goal => {
                const circleEl = document.getElementById(`${goal.label}-circle`);
                const valueEl = document.getElementById(`${goal.label}-value`);
                const fullValueEl = document.getElementById(`${goal.label}-full-value`);
                if (circleEl && valueEl && fullValueEl) {
                    const percentage = (goal.currentValue / goal.maxValue) * 100;
                    circleEl.style.setProperty('--p', percentage);
                    animateShortValue(valueEl, 0, goal.currentValue, 1500);
                    animateFullValue(fullValueEl, 0, goal.currentValue, 1500);
                }
            });
        }
        setTimeout(runGoalAnimations, 1000);
    }

    // ==========================================================================
    // ЧАСТИНА 3: Kanban Board (ІНТЕГРОВАНО ЛІЧИЛЬНИКИ І КЛАС EMPTY)
    // ==========================================================================
    const kanbanWrapper = document.querySelector('.kanban-board-wrapper');
    if (kanbanWrapper) {

        let draggedCard = null;
        let placeholder = null;
        let sourceInfo = {};
        let dropSucceeded = false;
        let scrollInterval = null;

        // --- НОВІ ФУНКЦІЇ ДЛЯ ОНОВЛЕННЯ ІНТЕРФЕЙСУ ---
        const updateCountersForColumn = (columnElement) => {
            if (!columnElement) return;

            // Оновлення суми та кількості в заголовку колонки
            const headerValueEl = columnElement.querySelector('.kanban-column__header-info-value');
            const headerDealsEl = columnElement.querySelector('.kanban-column__header-info-deals');
            const allCardsInColumn = columnElement.querySelectorAll('.kanban-card');
            
            let totalSum = 0;
            allCardsInColumn.forEach(card => {
                const infoText = card.querySelector('.kanban-card__info')?.textContent || '';
                const match = infoText.match(/\$([0-9,]+)/);
                if (match && match[1]) {
                    totalSum += parseInt(match[1].replace(/,/g, ''), 10);
                }
            });

            if (headerValueEl) {
                headerValueEl.textContent = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(totalSum);
            }
            if (headerDealsEl) {
                headerDealsEl.textContent = `${allCardsInColumn.length} deals`;
            }

            // Оновлення лічильників у кожному блоці статусу
            const statusBlocks = columnElement.querySelectorAll('.status-block');
            statusBlocks.forEach(block => {
                const titleSpan = block.querySelector('.status-block__header-title span');
                const cardsContainer = block.querySelector('.status-block__cards');
                const cardCount = cardsContainer.querySelectorAll('.kanban-card').length;
                
                if (titleSpan) {
                    titleSpan.textContent = `(${cardCount})`;
                }
                // Додавання/видалення класу 'empty'
                if (cardCount === 0) {
                    cardsContainer.classList.add('empty');
                } else {
                    cardsContainer.classList.remove('empty');
                }
            });
        };

        // --- Ініціалізація лічильників при завантаженні ---
        kanbanWrapper.querySelectorAll('.kanban-column').forEach(updateCountersForColumn);

        // --- Основна логіка Drag & Drop (яку ми не чіпаємо) ---
        const startScroll = (dir) => {
            if (scrollInterval) return;
            scrollInterval = setInterval(() => kanbanWrapper.scrollBy({ left: dir * 15, behavior: 'smooth' }), 50);
        };
        const stopScroll = () => {
            clearInterval(scrollInterval);
            scrollInterval = null;
        };

        kanbanWrapper.addEventListener('dragstart', (e) => {
            if (!e.target.classList.contains('kanban-card')) return;
            
            draggedCard = e.target;
            dropSucceeded = false;
            sourceInfo = {
                sourceColumn: draggedCard.closest('.kanban-column'),
                sourceStatusBlock: draggedCard.closest('.status-block'),
                cardId: draggedCard.dataset.cardId,
                userId: draggedCard.closest('.kanban-column').dataset.userId,
                statusId: draggedCard.closest('.status-block').dataset.statusId,
            };
            console.log('--- Drag Start ---', {cardId: sourceInfo.cardId, userId: sourceInfo.userId, statusId: sourceInfo.statusId});

            setTimeout(() => {
                placeholder = document.createElement('div');
                placeholder.className = 'placeholder';
                placeholder.style.height = `${draggedCard.offsetHeight}px`;
                draggedCard.parentElement.insertBefore(placeholder, draggedCard);
                draggedCard.classList.add('is-dragging');
                kanbanWrapper.classList.add('is-dragging');
                if (sourceInfo.sourceStatusBlock) {
                    sourceInfo.sourceStatusBlock.classList.add('is-dragging');
                }
            }, 0);
        });

        kanbanWrapper.addEventListener('dragend', (e) => {
            if (!draggedCard) return;

            if (!dropSucceeded && placeholder) {
                placeholder.parentElement.replaceChild(draggedCard, placeholder);
            } else {
                placeholder?.remove();
            }
            
            draggedCard.classList.remove('is-dragging');
            kanbanWrapper.classList.remove('is-dragging');
            document.querySelectorAll('.is-over').forEach(el => el.classList.remove('is-over'));
            
            if (sourceInfo.sourceStatusBlock) {
                sourceInfo.sourceStatusBlock.classList.remove('is-dragging');
            }
            stopScroll();

            draggedCard = null;
            placeholder = null;
            sourceInfo = {};
        });

        kanbanWrapper.addEventListener('dragover', (e) => {
            e.preventDefault();
            const wrapperRect = kanbanWrapper.getBoundingClientRect();
            if (e.clientX > wrapperRect.right - 50) startScroll(1);
            else if (e.clientX < wrapperRect.left + 50) startScroll(-1);
            else stopScroll();

            const targetContainer = e.target.closest('.status-block__cards');
            document.querySelectorAll('.is-over').forEach(el => el.classList.remove('is-over'));
            if (targetContainer) {
                targetContainer.classList.add('is-over');
            }
        });

        kanbanWrapper.addEventListener('drop', (e) => {
            e.preventDefault();
            const targetContainer = e.target.closest('.status-block__cards');
            if (targetContainer && draggedCard) {
                const targetColumn = targetContainer.closest('.kanban-column');
                targetContainer.appendChild(draggedCard);
                
                const targetInfo = {
                    userId: targetColumn.dataset.userId,
                    statusId: targetContainer.closest('.status-block').dataset.statusId
                };
                console.log('--- Card Dropped ---', { source: {cardId: sourceInfo.cardId, userId: sourceInfo.userId, statusId: sourceInfo.statusId}, target: targetInfo });
                
                dropSucceeded = true;
                
                // --- ОНОВЛЕННЯ ЛІЧИЛЬНИКІВ ПІСЛЯ ДРОПУ ---
                updateCountersForColumn(sourceInfo.sourceColumn);
                if (sourceInfo.sourceColumn !== targetColumn) {
                    updateCountersForColumn(targetColumn);
                }
            }
        });
        
        kanbanWrapper.addEventListener('click', (e) => {
             const card = e.target.closest('.kanban-card');
             if (card) {
                const cardInfo = {
                    cardId: card.dataset.cardId,
                    userId: card.closest('.kanban-column').dataset.userId,
                    statusId: card.closest('.status-block').dataset.statusId,
                };
                console.log('--- Card Clicked ---', cardInfo);
             }
        });
    }
});