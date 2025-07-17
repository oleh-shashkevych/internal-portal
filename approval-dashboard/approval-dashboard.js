document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // ДАНІ ДЛЯ ДЕШБОРДУ
    // ==========================================================================
    const dashboardData = {
        direct: {
            lineChartData: {
                labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                funded: [250000, 420000, 300000, 450000, 190000, 440610, 280000, 180000, 95000, 280000, 398000, 250000],
                goal: [280000, 470000, 340000, 480000, 220000, 470000, 310000, 210000, 130000, 320000, 430000, 290000]
            },
            goalsData: [{
                label: 'monthly-goal',
                currentValue: 440610.37,
                maxValue: 500000
            }, {
                label: 'amount-funded',
                currentValue: 480000,
                maxValue: 500000
            }, {
                label: 'previous-total',
                currentValue: 460000,
                maxValue: 500000
            }],
            statsData: {
                concluded: {
                    value: 2500000,
                    count: 24,
                    optionPercent: 5,
                },
                killed: {
                    value: 1500000,
                    count: 12,
                    optionPercent: -5,
                }
            }
        },
        referral: {
            lineChartData: {
                labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                funded: [150000, 220000, 180000, 250000, 150000, 240610, 180000, 120000, 75000, 180000, 298000, 150000],
                goal: [180000, 270000, 240000, 280000, 180000, 270000, 210000, 150000, 110000, 220000, 330000, 190000]
            },
            goalsData: [{
                label: 'monthly-goal',
                currentValue: 240610.37,
                maxValue: 300000
            }, {
                label: 'amount-funded',
                currentValue: 280000,
                maxValue: 300000
            }, {
                label: 'previous-total',
                currentValue: 260000,
                maxValue: 300000
            }],
            statsData: {
                concluded: {
                    value: 1800000,
                    count: 18,
                    optionPercent: -2,
                },
                killed: {
                    value: 850000,
                    count: 7,
                    optionPercent: 3,
                }
            }
        }
    };

    let linearChart;

    // ==========================================================================
    // ЧАСТИНА 1: Лінійний графік
    // ==========================================================================
    const linearChartCtx = document.getElementById('approvalApprovalAmountChart');
    if (linearChartCtx) {
        const MAX_CHART_VALUE = 500000;
        const initialData = dashboardData.direct.lineChartData;

        linearChart = new Chart(linearChartCtx, {
            type: 'line',
            data: {
                labels: initialData.labels,
                datasets: [{
                    label: 'Funded Amount',
                    data: initialData.funded,
                    fill: true,
                    borderColor: '#159C2A',
                    borderWidth: 3,
                    tension: 0,
                    backgroundColor: context => {
                        const {
                            ctx,
                            chartArea
                        } = context.chart;
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
                }, {
                    label: 'Goal Amount',
                    data: initialData.goal,
                    fill: true,
                    borderColor: '#4242f5',
                    borderWidth: 3,
                    tension: 0,
                    backgroundColor: context => {
                        const {
                            ctx,
                            chartArea
                        } = context.chart;
                        if (!chartArea) return null;
                        const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                        gradient.addColorStop(0, 'rgba(66, 66, 245, 0.4)');
                        gradient.addColorStop(1, 'rgba(66, 66, 245, 0)');
                        return gradient;
                    },
                    pointRadius: 3,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: '#4242f5',
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
                    intersect: false
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
                                tooltipEl.style.opacity = 0;
                                tooltipEl.style.pointerEvents = 'none';
                                tooltipEl.style.position = 'absolute';
                                tooltipEl.style.background = '#fff';
                                tooltipEl.style.borderRadius = '3px';
                                tooltipEl.style.color = '#1B1B1B';
                                tooltipEl.style.border = '1px solid #E8E9E8';
                                tooltipEl.style.padding = '8px 12px';
                                tooltipEl.style.fontFamily = 'Urbanist, sans-serif';
                                tooltipEl.style.textAlign = 'left';
                                tooltipEl.innerHTML = '<table></table>';
                                document.body.appendChild(tooltipEl);
                            }
                            const tooltipModel = context.tooltip;
                            if (tooltipModel.opacity === 0) {
                                tooltipEl.style.opacity = 0;
                                return;
                            }
                            if (tooltipModel.body) {
                                let innerHtml = '<tbody>';
                                tooltipModel.dataPoints.forEach(function(dataPoint) {
                                    const datasetLabel = dataPoint.dataset.label || '';
                                    const rawValue = dataPoint.raw;
                                    const formattedAmount = new Intl.NumberFormat('en-US', {
                                        style: 'currency',
                                        currency: 'USD',
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    }).format(rawValue);
                                    const labelStyle = 'font-weight: 400; font-size: 14px; line-height: 20px; color: #646564; padding-right: 15px;';
                                    const valueStyle = 'font-weight: 600; font-size: 18px; line-height: 22px; text-align: left;';
                                    innerHtml += '<tr>';
                                    innerHtml += `<td style="${labelStyle}">${datasetLabel}</td>`;
                                    innerHtml += '</tr>';
                                    innerHtml += '<tr>';
                                    innerHtml += `<td style="${valueStyle}">${formattedAmount}</td>`;
                                    innerHtml += '</tr>';
                                });
                                innerHtml += '</tbody>';
                                tooltipEl.querySelector('table').innerHTML = innerHtml;
                            }
                            const {
                                chart
                            } = context;
                            const canvasRect = chart.canvas.getBoundingClientRect();
                            const tooltipHeight = tooltipEl.offsetHeight;
                            const tooltipWidth = tooltipEl.offsetWidth;
                            tooltipEl.style.transition = 'opacity 0.2s ease, top 0.2s ease, left 0.2s ease';
                            let newX = canvasRect.left + window.scrollX + tooltipModel.caretX + 15;
                            let newY = canvasRect.top + window.scrollY + tooltipModel.caretY - (tooltipHeight / 2);
                            if (newX + tooltipWidth > document.documentElement.clientWidth) {
                                newX = canvasRect.left + window.scrollX + tooltipModel.caretX - tooltipWidth - 15;
                            }
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
                        border: {
                            display: false
                        },
                        ticks: {
                            stepSize: 50000,
                            color: '#1B1B1B',
                            font: {
                                family: 'Urbanist',
                                size: 12,
                                weight: '300'
                            },
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
                        border: {
                            display: false
                        },
                        ticks: {
                            color: '#1B1B1B',
                            font: {
                                family: 'Urbanist',
                                size: 12,
                                weight: '300'
                            },
                            padding: 10
                        },
                        grid: {
                            drawBorder: false,
                            color: (context) => (context.index === 0 || context.index === initialData.labels.length - 1) ? 'transparent' : '#CDE3D0',
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
            element.textContent = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(currentValue);
            if (progress < 1) window.requestAnimationFrame(step);
        };
        window.requestAnimationFrame(step);
    }

    function runGoalAnimations(goalsData) {
        if (!goalChartContainer) return;
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

    setTimeout(() => runGoalAnimations(dashboardData.direct.goalsData), 1000);

    // ==========================================================================
    // ЧАСТИНА 3: Kanban Board
    // ==========================================================================
    const kanbanWrapper = document.querySelector('.kanban-board-wrapper');

    if (kanbanWrapper) {
        const STAR_INACTIVE_SVG = `<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.82927 0.75623C8.00888 0.203444 8.79093 0.203444 8.97054 0.75623L10.5103 5.49524C10.5907 5.74245 10.821 5.90983 11.081 5.90983H16.0639C16.6451 5.90983 16.8868 6.6536 16.4165 6.99524L12.3853 9.92411C12.175 10.0769 12.087 10.3477 12.1673 10.5949L13.7071 15.3339C13.8867 15.8867 13.254 16.3464 12.7838 16.0048L8.75257 13.0759C8.54228 12.9231 8.25752 12.9231 8.04723 13.0759L4.01599 16.0048C3.54576 16.3464 2.91307 15.8867 3.09268 15.3339L4.63248 10.5949C4.71281 10.3477 4.62481 10.0769 4.41452 9.92411L0.383276 6.99524C-0.0869521 6.6536 0.154713 5.90983 0.735947 5.90983H5.71884C5.97877 5.90983 6.20915 6.74245 6.28947 6.49524L7.82927 0.75623Z" fill="#EFEFEF"/></svg>`;
        const STAR_ACTIVE_SVG = `<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.82927 0.75623C8.00888 0.203444 8.79093 0.203444 8.97054 0.75623L10.5103 5.49524C10.5907 5.74245 10.821 5.90983 11.081 5.90983H16.0639C16.6451 5.90983 16.8868 6.6536 16.4165 6.99524L12.3853 9.92411C12.175 10.0769 12.087 10.3477 12.1673 10.5949L13.7071 15.3339C13.8867 15.8867 13.254 16.3464 12.7838 16.0048L8.75257 13.0759C8.54228 12.9231 8.25752 12.9231 8.04723 13.0759L4.01599 16.0048C3.54576 16.3464 2.91307 15.8867 3.09268 15.3339L4.63248 10.5949C4.71281 10.3477 4.62481 10.0769 4.41452 9.92411L0.383276 6.99524C-0.0869521 6.6536 0.154713 5.90983 0.735947 5.90983H5.71884C5.97877 5.90983 6.20915 6.74245 6.28947 6.49524L7.82927 0.75623Z" fill="#54BE59"/></svg>`;
        const STAR_HOVER_SVG = `<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.82927 0.75623C8.00888 0.203444 8.79093 0.203444 8.97054 0.75623L10.5103 5.49524C10.5907 5.74245 10.821 5.90983 11.081 5.90983H16.0639C16.6451 5.90983 16.8868 6.6536 16.4165 6.99524L12.3853 9.92411C12.175 10.0769 12.087 10.3477 12.1673 10.5949L13.7071 15.3339C13.8867 15.8867 13.254 16.3464 12.7838 16.0048L8.75257 13.0759C8.54228 12.9231 8.25752 12.9231 8.04723 13.0759L4.01599 16.0048C3.54576 16.3464 2.91307 15.8867 3.09268 15.3339L4.63248 10.5949C4.71281 10.3477 4.62481 10.0769 4.41452 9.92411L0.383276 6.99524C-0.0869521 6.6536 0.154713 5.90983 0.735947 5.90983H5.71884C5.97877 5.90983 6.20915 6.74245 6.28947 6.49524L7.82927 0.75623Z" fill="#54BE5980"/></svg>`;

        const renderStars = (starsContainer) => {
            starsContainer.innerHTML = '';
            const rating = parseInt(starsContainer.dataset.rating || '0', 10);

            for (let i = 1; i <= 3; i++) {
                const starEl = document.createElement('span');
                starEl.className = 'star';
                starEl.dataset.value = i;
                starEl.innerHTML = i <= rating ? STAR_ACTIVE_SVG : STAR_INACTIVE_SVG;
                starsContainer.appendChild(starEl);
            }

            const setStarsVisualState = (hoverValue) => {
                const currentRating = parseInt(starsContainer.dataset.rating || '0', 10);
                starsContainer.querySelectorAll('.star').forEach(s => {
                    const starValue = parseInt(s.dataset.value, 10);
                    if (hoverValue > 0) {
                        if (starValue <= currentRating) {
                            s.innerHTML = STAR_ACTIVE_SVG;
                        } else if (starValue <= hoverValue) {
                            s.innerHTML = STAR_HOVER_SVG;
                        } else {
                            s.innerHTML = STAR_INACTIVE_SVG;
                        }
                    } else {
                        s.innerHTML = starValue <= currentRating ? STAR_ACTIVE_SVG : STAR_INACTIVE_SVG;
                    }
                });
            };

            starsContainer.addEventListener('mousemove', (e) => {
                const hoveredStar = e.target.closest('.star');
                if (hoveredStar) {
                    const hoverValue = parseInt(hoveredStar.dataset.value, 10);
                    setStarsVisualState(hoverValue);
                }
            });

            starsContainer.addEventListener('mouseleave', () => {
                setStarsVisualState(0);
            });
        };

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

        function initializeKanban(boardElement) {
            if (!boardElement) return;

            boardElement.querySelectorAll('.kanban-card').forEach(card => {
                const starsContainer = card.querySelector('.kanban-card__stars');
                if (starsContainer) {
                    const oldClass = Array.from(starsContainer.classList).find(c => c.startsWith('item-stars-'));
                    if (oldClass) {
                        starsContainer.dataset.rating = oldClass.split('-')[2];
                        starsContainer.classList.remove(oldClass);
                    }
                    renderStars(starsContainer);
                }

                const handleMouseMove = (e) => {
                    const cardRect = card.getBoundingClientRect();
                    const isTopHalf = e.clientY < cardRect.top + cardRect.height / 2;

                    if (isTopHalf) {
                         card.draggable = true;
                         card.style.cursor = 'grab';
                    } else {
                         card.draggable = false;
                         card.style.cursor = 'default';
                    }
                };
                
                card.addEventListener('mouseenter', () => card.addEventListener('mousemove', handleMouseMove));
                card.addEventListener('mouseleave', () => {
                    card.removeEventListener('mousemove', handleMouseMove);
                    card.draggable = false;
                    card.style.cursor = 'default';
                });
            });

            boardElement.querySelectorAll('.kanban-column').forEach(updateCountersForColumn);
        }

        let draggedCard = null;
        let placeholder = null;
        let sourceInfo = {};
        let dropSucceeded = false;
        let isSameSpotDrop = false;
        let scrollInterval = null;

        const startScroll = (dir) => {
            if (scrollInterval) return;
            scrollInterval = setInterval(() => kanbanWrapper.scrollBy({
                left: dir * 15,
                behavior: 'smooth'
            }), 50);
        };
        const stopScroll = () => {
            clearInterval(scrollInterval);
            scrollInterval = null;
        };

        document.querySelectorAll('.kanban-set').forEach(board => initializeKanban(board));

        kanbanWrapper.addEventListener('dragstart', (e) => {
            const card = e.target.closest('.kanban-card');
            if (!card || !card.draggable) {
                e.preventDefault();
                return;
            }
            draggedCard = card;
            const sourceColumn = draggedCard.closest('.kanban-column');
            const sourceStatusBlock = draggedCard.closest('.status-block');

            sourceInfo = {
                cardId: draggedCard.dataset.cardId,
                userId: sourceColumn.dataset.userId,
                statusId: sourceStatusBlock.dataset.statusId,
                sourceColumn: sourceColumn,
                sourceStatusBlock: sourceStatusBlock 
            };
            
            console.log('--- Drag Start ---', {
                cardId: sourceInfo.cardId,
                userId: sourceInfo.userId,
                statusId: sourceInfo.statusId
            });

            draggedCard.style.cursor = 'grabbing';
            dropSucceeded = false;
            isSameSpotDrop = false;
            
            const clone = draggedCard.cloneNode(true);
            clone.id = 'drag-ghost';
            clone.style.position = 'absolute';
            clone.style.top = '-9999px';
            clone.style.width = `${draggedCard.offsetWidth}px`;
            document.body.appendChild(clone);
            e.dataTransfer.setDragImage(clone, e.offsetX, e.offsetY);
            
            setTimeout(() => {
                placeholder = document.createElement('div');
                placeholder.className = 'placeholder';
                placeholder.style.height = `${draggedCard.offsetHeight}px`;
                draggedCard.parentElement.insertBefore(placeholder, draggedCard);
                draggedCard.classList.add('is-dragging');
                kanbanWrapper.classList.add('is-dragging');
                
                const sourceCardsContainer = sourceInfo.sourceStatusBlock.querySelector('.status-block__cards');
                if (sourceCardsContainer) {
                    sourceCardsContainer.classList.add('dragging');
                }

            }, 0);
        });

        kanbanWrapper.addEventListener('dragend', (e) => {
            if (!draggedCard) return;
            const ghost = document.getElementById('drag-ghost');
            if (ghost) ghost.remove();

            if (!dropSucceeded && placeholder) {
                placeholder.parentElement.replaceChild(draggedCard, placeholder);
                
                if (!isSameSpotDrop) {
                    console.log('--- Card Returned ---', {
                        cardId: sourceInfo.cardId,
                        userId: sourceInfo.userId,
                        statusId: sourceInfo.statusId
                    });
                }

            } else {
                placeholder?.remove();
            }
            draggedCard.classList.remove('is-dragging');
            draggedCard.style.cursor = 'default';
            kanbanWrapper.classList.remove('is-dragging');
            document.querySelectorAll('.is-over').forEach(el => el.classList.remove('is-over'));
            
            if (sourceInfo.sourceStatusBlock) {
                const sourceCardsContainer = sourceInfo.sourceStatusBlock.querySelector('.status-block__cards');
                if (sourceCardsContainer) {
                    sourceCardsContainer.classList.remove('dragging');
                }
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
                const sourceContainer = sourceInfo.sourceStatusBlock.querySelector('.status-block__cards');

                if (targetContainer === sourceContainer) {
                    isSameSpotDrop = true;
                    return;
                }

                const targetColumn = targetContainer.closest('.kanban-column');
                const targetStatusBlock = targetContainer.closest('.status-block');
                
                const dropData = {
                    previous: {
                        cardId: sourceInfo.cardId,
                        userId: sourceInfo.userId,
                        statusId: sourceInfo.statusId
                    },
                    current: {
                        cardId: draggedCard.dataset.cardId,
                        userId: targetColumn.dataset.userId,
                        statusId: targetStatusBlock.dataset.statusId
                    }
                };
                
                console.log('--- Card Dropped ---', dropData);

                targetContainer.appendChild(draggedCard);
                dropSucceeded = true;
                
                updateCountersForColumn(sourceInfo.sourceColumn);
                if (sourceInfo.sourceColumn !== targetColumn) {
                    updateCountersForColumn(targetColumn);
                }
            }
        });

        kanbanWrapper.addEventListener('click', (e) => {
            const star = e.target.closest('.star');

            if (star) {
                const starsContainer = star.parentElement;
                const card = starsContainer.closest('.kanban-card');
                const currentRating = parseInt(starsContainer.dataset.rating || '0', 10);
                const clickedValue = parseInt(star.dataset.value, 10);
                let newRating = (clickedValue === currentRating) ? clickedValue - 1 : clickedValue;
                starsContainer.dataset.rating = newRating;
                renderStars(starsContainer);
                const cardInfo = {
                    userId: card.closest('.kanban-column').dataset.userId,
                    statusId: card.closest('.status-block').dataset.statusId,
                    cardId: card.dataset.cardId,
                    rating: newRating,
                };
                console.log('--- Rating Changed ---', cardInfo);
            } else {
                const card = e.target.closest('.kanban-card');
                if (card) {
                    const cardRect = card.getBoundingClientRect();
                    const isTopHalf = e.clientY < cardRect.top + card.offsetHeight / 2;

                    if (isTopHalf) {
                        const cardInfo = {
                            cardId: card.dataset.cardId,
                            userId: card.closest('.kanban-column').dataset.userId,
                            statusId: card.closest('.status-block').dataset.statusId,
                        };
                        console.log('--- Card Clicked ---', cardInfo);
                    }
                }
            }
        });
    }

    // ==========================================================================
    // ЧАСТИНА 4: Логіка перемикання даних
    // ==========================================================================
    function updateStatsBlock(data) {
        const formatCurrency = (value) => new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(value);
        const concludedValueEl = document.getElementById('stats-concluded-value');
        const concludedCountEl = document.getElementById('stats-concluded-count');
        const concludedTotalEl = document.getElementById('stats-concluded-total-value');
        const concludedOptionEl = document.getElementById('stats-concluded-option');
        concludedValueEl.textContent = formatCurrency(data.concluded.value);
        concludedCountEl.textContent = data.concluded.count;
        concludedTotalEl.textContent = formatCurrency(data.concluded.value);
        concludedValueEl.classList.remove('color-red');
        concludedValueEl.classList.add('color-green');
        concludedCountEl.classList.remove('color-red');
        concludedCountEl.classList.add('color-green');
        let concludedPercent = data.concluded.optionPercent;
        let concludedSign = concludedPercent >= 0 ? '+' : '';
        let concludedColor = concludedPercent >= 0 ? 'color-green' : 'color-red';
        concludedOptionEl.innerHTML = `Last 12 months <span class="${concludedColor}">${concludedSign}${concludedPercent}%</span>`;
        const killedValueEl = document.getElementById('stats-killed-value');
        const killedCountEl = document.getElementById('stats-killed-count');
        const killedTotalEl = document.getElementById('stats-killed-total-value');
        const killedOptionEl = document.getElementById('stats-killed-option');
        killedValueEl.textContent = formatCurrency(data.killed.value);
        killedCountEl.textContent = data.killed.count;
        killedTotalEl.textContent = formatCurrency(data.killed.value);
        killedValueEl.classList.remove('color-green');
        killedValueEl.classList.add('color-red');
        killedCountEl.classList.remove('color-green');
        killedCountEl.classList.add('color-red');
        let killedPercent = data.killed.optionPercent;
        let killedSign = killedPercent >= 0 ? '+' : '';
        let killedColor = killedPercent >= 0 ? 'color-green' : 'color-red';
        killedOptionEl.innerHTML = `Last 12 months <span class="${killedColor}">${killedSign}${killedPercent}%</span>`;
    }

    function updateDashboard(type) {
        const data = dashboardData[type];
        if (!data) return;
        if (linearChart) {
            linearChart.data.datasets[0].data = data.lineChartData.funded;
            linearChart.data.datasets[1].data = data.lineChartData.goal;
            linearChart.update();
        }
        runGoalAnimations(data.goalsData);
        updateStatsBlock(data.statsData);
        document.querySelectorAll('.kanban-set').forEach(board => {
            board.classList.add('hidden');
        });
        const activeKanbanBoard = document.getElementById(`kanban-${type}`);
        if (activeKanbanBoard) {
            activeKanbanBoard.classList.remove('hidden');
        }
    }

    const switchButtons = document.querySelectorAll('.approval__switch-btn');
    switchButtons.forEach(button => {
        button.addEventListener('click', () => {
            switchButtons.forEach(btn => btn.classList.remove('approval__switch-btn--active'));
            button.classList.add('approval__switch-btn--active');
            const dataType = button.dataset.type;
            updateDashboard(dataType);
        });
    });

    // ==========================================================================
    // ЧАСТИНА 5: Логіка скролу для Kanban-дошки (ADDED)
    // ==========================================================================
    const kanbanScrollWrapper = document.querySelector('.kanban-board-wrapper');
    const prevButton = document.getElementById('kanban-scroll-prev');
    const nextButton = document.getElementById('kanban-scroll-next');

    if (kanbanScrollWrapper && prevButton && nextButton) {
        const updateNavButtonsState = () => {
            const activeBoard = kanbanScrollWrapper.querySelector('.kanban-set:not(.hidden)');
            if (!activeBoard) {
                prevButton.disabled = true;
                nextButton.disabled = true;
                return;
            }
            const scrollLeft = kanbanScrollWrapper.scrollLeft;
            const scrollWidth = activeBoard.scrollWidth;
            const clientWidth = kanbanScrollWrapper.clientWidth;
            prevButton.disabled = scrollLeft < 1;
            nextButton.disabled = scrollLeft + clientWidth >= scrollWidth - 1;
        };
        const handleScroll = (direction) => {
            const activeBoard = kanbanScrollWrapper.querySelector('.kanban-set:not(.hidden)');
            const firstColumn = activeBoard ? activeBoard.querySelector('.kanban-column') : null;
            if (!firstColumn) return;
            const scrollAmount = firstColumn.offsetWidth + 10;
            kanbanScrollWrapper.scrollBy({
                left: scrollAmount * direction,
                behavior: 'smooth'
            });
        };
        prevButton.addEventListener('click', () => handleScroll(-1));
        nextButton.addEventListener('click', () => handleScroll(1));
        kanbanScrollWrapper.addEventListener('scroll', updateNavButtonsState);
        const switchButtonsAll = document.querySelectorAll('.approval__switch-btn');
        switchButtonsAll.forEach(button => {
            button.addEventListener('click', () => {
                kanbanScrollWrapper.scrollLeft = 0;
                setTimeout(updateNavButtonsState, 100);
            });
        });
        updateNavButtonsState();
    }
});