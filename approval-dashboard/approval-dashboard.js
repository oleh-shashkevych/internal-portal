document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // ЧАСТИНА 1: Лінійний графік 
    // ==========================================================================
    const linearChartCtx = document.getElementById('approvalApprovalAmountChart');
    if (linearChartCtx) {
        const MAX_CHART_VALUE = 500000; 
        const MONTHLY_DATA = {
            labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            data: [250000, 480000, 300000, 450000, 190000, 440610, 280000, 180000, 95000, 280000, 398000, 250000]
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
                            // --- ЗМІНЕНО: Повністю оновлена логіка тултіпа ---
                            let tooltipEl = document.getElementById('chartjs-tooltip');

                            // Створення елемента при першому рендері
                            if (!tooltipEl) {
                                tooltipEl = document.createElement('div');
                                tooltipEl.id = 'chartjs-tooltip';
                                tooltipEl.style.opacity = 0;
                                tooltipEl.style.pointerEvents = 'none';
                                tooltipEl.style.position = 'absolute';
                                tooltipEl.style.background = '#fff';
                                tooltipEl.style.borderRadius = '3px';
                                tooltipEl.style.color = '#1B1B1B';
                                tooltipEl.style.border = '1px solid #E8E9E8';
                                tooltipEl.style.padding = '8px';
                                tooltipEl.style.fontFamily = 'Urbanist, sans-serif';
                                tooltipEl.style.textAlign = 'left';
                                tooltipEl.innerHTML = '<table></table>';
                                document.body.appendChild(tooltipEl);
                            }

                            const tooltipModel = context.tooltip;

                            // Сховати, якщо немає тултіпа
                            if (tooltipModel.opacity === 0) {
                                tooltipEl.style.opacity = 0;
                                return;
                            }

                            // Встановлення тексту
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

                            const { chart } = context;
                            const canvasRect = chart.canvas.getBoundingClientRect();
                            const tooltipHeight = tooltipEl.offsetHeight;
                            const tooltipWidth = tooltipEl.offsetWidth;

                            // Встановлюємо перехід (transition) залежно від стану
                            if (tooltipEl.style.opacity !== '1') {
                                // Перша поява: тільки анімація прозорості
                                tooltipEl.style.transition = 'opacity 0.2s ease';
                            } else {
                                // Наступні переміщення: плавна зміна позиції та прозорості
                                tooltipEl.style.transition = 'opacity 0.2s ease, top 0.2s ease, left 0.2s ease';
                            }

                            // Розрахунок позиції, щоб тултіп не виходив за межі вікна
                            let newX = canvasRect.left + window.scrollX + tooltipModel.caretX + 15;
                            let newY = canvasRect.top + window.scrollY + tooltipModel.caretY - (tooltipHeight / 2);

                            if (newX + tooltipWidth > document.documentElement.clientWidth) {
                                newX = canvasRect.left + window.scrollX + tooltipModel.caretX - tooltipWidth - 15;
                            }
                            
                            // Застосування позиції
                            tooltipEl.style.left = newX + 'px';
                            tooltipEl.style.top = newY + 'px';
                            tooltipEl.style.opacity = 1;
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: MAX_CHART_VALUE,
                        border: { display: false },
                        ticks: {
                            stepSize: 100000, 
                            color: '#1B1B1B',
                            font: { family: 'Urbanist', size: 12, weight: '300' },
                            padding: 10,
                            callback: function(value) {
                                if (value === 500000) return '500K';
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
    // ЧАСТИНА 2: Goal Chart 
    // ==========================================================================
    const goalChartContainer = document.querySelector('.approval-amount__graphs');
    if (goalChartContainer) {
        const goalsData = [{ label: 'monthly-goal', currentValue: 440610.37, maxValue: 500000 }, { label: 'amount-funded', currentValue: 480000, maxValue: 500000 }, { label: 'previous-total', currentValue: 460000, maxValue: 500000 }];
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
                const currentValue = progress * (end - start) + start;
                element.textContent = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(currentValue);
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
    // ЧАСТИНА 3: Kanban Board
    // ==========================================================================
    const kanbanWrapper = document.querySelector('.kanban-board-wrapper');
    if (kanbanWrapper) {

        let draggedCard = null;
        let placeholder = null;
        let sourceInfo = {};
        let dropSucceeded = false;
        let scrollInterval = null;

        const updateCountersForColumn = (columnElement) => {
            if (!columnElement) return;

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

            const statusBlocks = columnElement.querySelectorAll('.status-block');
            statusBlocks.forEach(block => {
                const titleSpan = block.querySelector('.status-block__header-title span');
                const cardsContainer = block.querySelector('.status-block__cards');
                const cardCount = cardsContainer.querySelectorAll('.kanban-card').length;
                
                if (titleSpan) {
                    titleSpan.textContent = `(${cardCount})`;
                }
                if (cardCount === 0) {
                    cardsContainer.classList.add('empty');
                } else {
                    cardsContainer.classList.remove('empty');
                }
            });
        };

        kanbanWrapper.querySelectorAll('.kanban-column').forEach(updateCountersForColumn);

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