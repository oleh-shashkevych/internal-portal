class YearDropdown {
	constructor() {
		this.button = document.getElementById('year_filter_button');
		this.dropdown = document.getElementById('year_filter_dropdown');
		this.overlay = document.getElementById('overlay');
		this.yearsList = document.getElementById('year_filter_yearsList');
		this.searchInput = document.getElementById('year_filter_searchInput');
		this.applyBtn = document.getElementById('year_filter_applyBtn');
		this.cancelBtn = document.getElementById('year_filter_cancelBtn');

		this.years = [];
		this.selectedYears = new Set();
		this.tempSelectedYears = new Set();
		this.allYears = [];

		if (this.button && this.dropdown && this.yearsList && this.searchInput && this.applyBtn && this.cancelBtn && this.overlay) {
			this.init();
		} else {
			console.error("YearDropdown: One or more essential DOM elements are missing.");
		}
	}

	init() {
		this.generateYears();
		this.renderYears();
		this.attachEventListeners();
		this.updateButtonText();
	}

	generateYears() {
		const currentYear = new Date().getFullYear();
		const startYear = 2018;
		const endYear = currentYear;
		for (let year = startYear; year <= endYear; year++) {
			this.years.push(year);
		}
		this.allYears = [...this.years];
	}

	renderYears() {
		this.yearsList.innerHTML = '';
		this.years.forEach(year => {
			const li = document.createElement('li');
			li.setAttribute('data-year', year);
			const isSelected = this.tempSelectedYears.has(year);
			li.innerHTML = `
                <div class="custom_checkbox ${isSelected ? 'checked' : ''}">
                    <svg width="11" height="8" viewBox="0 0 11 8" fill="none" style="display: ${isSelected ? 'block' : 'none'}">
                        <path d="M8.94558 0.255056C9.11838 0.089653 9.34834 -0.00178848 9.58693 2.65108e-05C9.82551 0.0018415 10.0541 0.0967713 10.2244 0.264784C10.3947 0.432797 10.4934 0.660752 10.4997 0.900549C10.506 1.14034 10.4194 1.37323 10.2582 1.55005L5.36357 7.70436C5.2794 7.79551 5.17782 7.86865 5.0649 7.91942C4.95198 7.97018 4.83003 7.99754 4.70636 7.99984C4.58268 8.00214 4.45981 7.97935 4.3451 7.93282C4.23038 7.88629 4.12618 7.81698 4.03872 7.72903L0.792827 4.46564C0.702435 4.38096 0.629933 4.27884 0.579648 4.16537C0.529362 4.05191 0.502323 3.92942 0.500143 3.80522C0.497964 3.68102 0.520688 3.55765 0.566961 3.44248C0.613234 3.3273 0.682108 3.22267 0.769473 3.13483C0.856838 3.047 0.960905 2.97775 1.07547 2.93123C1.19003 2.88471 1.31273 2.86186 1.43627 2.86405C1.5598 2.86624 1.68163 2.89343 1.79449 2.94398C1.90734 2.99454 2.00892 3.06743 2.09315 3.15831L4.66189 5.73967L8.92227 0.28219L8.94558 0.255056Z" fill="white"></path>
                    </svg>
                </div>
                ${year}
            `;
			li.addEventListener('click', () => this.toggleYear(year));
			this.yearsList.appendChild(li);
		});
	}

	toggleYear(year) {
		const listItem = this.yearsList.querySelector(`[data-year="${year}"]`);
		if (!listItem) return;
		const checkbox = listItem.querySelector('.custom_checkbox');
		const checkmark = checkbox.querySelector('svg');
		if (this.tempSelectedYears.has(year)) {
			this.tempSelectedYears.delete(year);
			checkbox.classList.remove('checked');
			checkmark.style.display = 'none';
		} else {
			this.tempSelectedYears.add(year);
			checkbox.classList.add('checked');
			checkmark.style.display = 'block';
		}
	}

	updateButtonText() {
		const buttonTextDiv = this.button.querySelector('div');
		let existingCountSpan = buttonTextDiv.querySelector('.employee-count');
		if (existingCountSpan) existingCountSpan.remove();
		if (this.selectedYears.size > 0) {
			const countSpan = document.createElement('span');
			countSpan.className = 'employee-count';
			countSpan.textContent = ` (${this.selectedYears.size})`;
			buttonTextDiv.appendChild(countSpan);
		}
	}

	openDropdown() {
		if (representativeDropdown && representativeDropdown.dropdown.classList.contains('active')) {
			representativeDropdown.cancelSelection();
		}
		this.tempSelectedYears = new Set(this.selectedYears);
		this.years = [...this.allYears];
		this.renderYears();
		this.dropdown.classList.add('active');
		this.overlay.classList.add('open');
		this.button.classList.add('active');
		this.searchInput.value = '';
		setTimeout(() => this.searchInput.focus(), 100);
	}

	closeDropdown() {
		this.dropdown.classList.remove('active');
		if (!representativeDropdown || !representativeDropdown.dropdown.classList.contains('active')) {
			this.overlay.classList.remove('open');
		}
		this.button.classList.remove('active');
		this.searchInput.value = '';
		this.years = [...this.allYears];
	}

	applySelection() {
		this.selectedYears = new Set(this.tempSelectedYears);
		this.updateButtonText();
		this.closeDropdown();
		updateDashboard(); // This will call updateResetButtonVisibility
	}

	cancelSelection() {
		this.closeDropdown();
		updateResetButtonVisibility(); // Call directly
	}

	filterYears(searchTerm) {
		const lowerCaseSearchTerm = searchTerm.toLowerCase();
		this.years = this.allYears.filter(year => year.toString().toLowerCase().includes(lowerCaseSearchTerm));
		this.renderYears();
	}

	attachEventListeners() {
		this.button.addEventListener('click', (e) => {
			e.stopPropagation();
			if (this.dropdown.classList.contains('active')) {
				this.closeDropdown();
			} else {
				this.openDropdown();
			}
		});
		this.overlay.addEventListener('click', () => {
			if (this.dropdown.classList.contains('active')) this.cancelSelection();
		});
		this.dropdown.addEventListener('click', e => e.stopPropagation());
		this.applyBtn.addEventListener('click', () => this.applySelection());
		this.cancelBtn.addEventListener('click', () => this.cancelSelection());
		this.searchInput.addEventListener('input', e => this.filterYears(e.target.value));
		document.addEventListener('keydown', e => {
			if (e.key === 'Escape' && this.dropdown.classList.contains('active')) this.cancelSelection();
		});
	}
}

class RepresentativeDropdown {
	constructor() {
		this.button = document.getElementById('representative_filter_button');
		this.dropdown = document.getElementById('representative_filter_dropdown');
		this.overlay = document.getElementById('overlay');
		this.representativesListElement = document.getElementById('representative_filter_representativesList');
		this.searchInput = document.getElementById('representative_filter_searchInput');
		this.applyBtn = document.getElementById('representative_filter_applyBtn');
		this.cancelBtn = document.getElementById('representative_filter_cancelBtn');

		this.representatives = [];
		this.selectedRepresentatives = new Set();
		this.tempSelectedRepresentatives = new Set();
		this.allRepresentatives = [
			"Monica Cooper", "Laurence Meyer", "Alan Barton", "John Doe", "Jane Smith", "Alan Barton1", "John Doe1", "Jane Smith1", "Monica Cooper22", "Laurence Meyer123", "Alan Barton124", "John Doe2414", "Jane Smith12412", "Alan Barton1124", "John Doe1124", "Jane Smith12414"
		];

		if (this.button && this.dropdown && this.representativesListElement && this.searchInput && this.applyBtn && this.cancelBtn && this.overlay) {
			this.init();
		} else {
			console.error("RepresentativeDropdown: One or more essential DOM elements are missing.");
		}
	}

	init() {
		this.representatives = [...this.allRepresentatives];
		this.renderRepresentatives();
		this.attachEventListeners();
		this.updateButtonText();
	}

	renderRepresentatives() {
		this.representativesListElement.innerHTML = '';
		this.representatives.forEach(name => {
			const li = document.createElement('li');
			li.setAttribute('data-representative-name', name);
			const isSelected = this.tempSelectedRepresentatives.has(name);
			li.innerHTML = `
                <div class="custom_checkbox ${isSelected ? 'checked' : ''}">
                    <svg width="11" height="8" viewBox="0 0 11 8" fill="none" style="display: ${isSelected ? 'block' : 'none'}">
                        <path d="M8.94558 0.255056C9.11838 0.089653 9.34834 -0.00178848 9.58693 2.65108e-05C9.82551 0.0018415 10.0541 0.0967713 10.2244 0.264784C10.3947 0.432797 10.4934 0.660752 10.4997 0.900549C10.506 1.14034 10.4194 1.37323 10.2582 1.55005L5.36357 7.70436C5.2794 7.79551 5.17782 7.86865 5.0649 7.91942C4.95198 7.97018 4.83003 7.99754 4.70636 7.99984C4.58268 8.00214 4.45981 7.97935 4.3451 7.93282C4.23038 7.88629 4.12618 7.81698 4.03872 7.72903L0.792827 4.46564C0.702435 4.38096 0.629933 4.27884 0.579648 4.16537C0.529362 4.05191 0.502323 3.92942 0.500143 3.80522C0.497964 3.68102 0.520688 3.55765 0.566961 3.44248C0.613234 3.3273 0.682108 3.22267 0.769473 3.13483C0.856838 3.047 0.960905 2.97775 1.07547 2.93123C1.19003 2.88471 1.31273 2.86186 1.43627 2.86405C1.5598 2.86624 1.68163 2.89343 1.79449 2.94398C1.90734 2.99454 2.00892 3.06743 2.09315 3.15831L4.66189 5.73967L8.92227 0.28219L8.94558 0.255056Z" fill="white"></path>
                    </svg>
                </div>
                ${name}
            `;
			li.addEventListener('click', () => this.toggleRepresentative(name));
			this.representativesListElement.appendChild(li);
		});
	}

	toggleRepresentative(name) {
		const listItem = this.representativesListElement.querySelector(`[data-representative-name="${name}"]`);
		if (!listItem) return;
		const checkbox = listItem.querySelector('.custom_checkbox');
		const checkmark = checkbox.querySelector('svg');
		if (this.tempSelectedRepresentatives.has(name)) {
			this.tempSelectedRepresentatives.delete(name);
			checkbox.classList.remove('checked');
			checkmark.style.display = 'none';
		} else {
			this.tempSelectedRepresentatives.add(name);
			checkbox.classList.add('checked');
			checkmark.style.display = 'block';
		}
	}

	updateButtonText() {
		const buttonTextDiv = this.button.querySelector('div');
		let existingCountSpan = buttonTextDiv.querySelector('.employee-count');
		if (existingCountSpan) existingCountSpan.remove();
		if (this.selectedRepresentatives.size > 0) {
			const countSpan = document.createElement('span');
			countSpan.className = 'employee-count';
			countSpan.textContent = ` (${this.selectedRepresentatives.size})`;
			buttonTextDiv.appendChild(countSpan);
		}
	}

	openDropdown() {
		if (yearDropdown && yearDropdown.dropdown.classList.contains('active')) {
			yearDropdown.cancelSelection();
		}
		this.tempSelectedRepresentatives = new Set(this.selectedRepresentatives);
		this.representatives = [...this.allRepresentatives];
		this.renderRepresentatives();
		this.dropdown.classList.add('active');
		this.overlay.classList.add('open');
		this.button.classList.add('active');
		this.searchInput.value = '';
		setTimeout(() => this.searchInput.focus(), 100);
	}

	closeDropdown() {
		this.dropdown.classList.remove('active');
		if (!yearDropdown || !yearDropdown.dropdown.classList.contains('active')) {
			this.overlay.classList.remove('open');
		}
		this.button.classList.remove('active');
		this.searchInput.value = '';
		this.representatives = [...this.allRepresentatives];
	}

	applySelection() {
		this.selectedRepresentatives = new Set(this.tempSelectedRepresentatives);
		this.updateButtonText();
		this.closeDropdown();
		updateDashboard(); // This will call updateResetButtonVisibility
	}

	cancelSelection() {
		this.closeDropdown();
		updateResetButtonVisibility(); // Call directly
	}

	filterRepresentatives(searchTerm) {
		const lowerCaseSearchTerm = searchTerm.toLowerCase();
		this.representatives = this.allRepresentatives.filter(name => name.toLowerCase().includes(lowerCaseSearchTerm));
		this.renderRepresentatives();
	}

	attachEventListeners() {
		this.button.addEventListener('click', (e) => {
			e.stopPropagation();
			if (this.dropdown.classList.contains('active')) {
				this.closeDropdown();
			} else {
				this.openDropdown();
			}
		});
		this.overlay.addEventListener('click', () => {
			if (this.dropdown.classList.contains('active')) this.cancelSelection();
		});
		this.dropdown.addEventListener('click', e => e.stopPropagation());
		this.applyBtn.addEventListener('click', () => this.applySelection());
		this.cancelBtn.addEventListener('click', () => this.cancelSelection());
		this.searchInput.addEventListener('input', e => this.filterRepresentatives(e.target.value));
		document.addEventListener('keydown', e => {
			if (e.key === 'Escape' && this.dropdown.classList.contains('active')) this.cancelSelection();
		});
	}
}

let yearDropdown, representativeDropdown, resetFiltersButton;

const items = [
	{ funded_date: '01.02.2025', business_name: 'Certified Mailing Solutions, Inc', lender: 'Daniel Tighe', funded_amount: 100000, commission_paid: 50000, renewal_status: 'approved', representative: 'Monica Cooper' },
	{ funded_date: '01.15.2025', business_name: 'Tech Innovations LLC', lender: 'Laura Bell', funded_amount: 150000, commission_paid: 7500, renewal_status: 'funded', representative: 'Alan Barton' },
    { funded_date: '02.05.2025', business_name: 'Solutions Inc', lender: 'Daniel Tighe', funded_amount: 120000, commission_paid: 70000, renewal_status: 'underwriting', representative: 'Laurence Meyer' },
	{ funded_date: '02.20.2025', business_name: 'GreenScape Gardens', lender: 'Green Fund Co', funded_amount: 80000, commission_paid: 4000, renewal_status: 'approved', representative: 'Monica Cooper' },
	{ funded_date: '03.07.2025', business_name: 'Mail Solutions, Inc', lender: 'Daniel Tighe', funded_amount: 250000, commission_paid: 25000, renewal_status: 'declined', representative: 'John Doe' },
	{ funded_date: '03.10.2025', business_name: 'Global Exports Ltd', lender: 'TradeWinds Cap', funded_amount: 300000, commission_paid: 15000, renewal_status: 'funded', representative: 'Jane Smith' },
	{ funded_date: '04.01.2025', business_name: 'Local Bakery Co', lender: 'Community Fin', funded_amount: 50000, commission_paid: 2500, renewal_status: 'underwriting', representative: 'Alan Barton' },
    { funded_date: '04.15.2025', business_name: 'Innovate Solutions', lender: 'Future Finance', funded_amount: 220000, commission_paid: 11000, renewal_status: 'approved', representative: 'Laurence Meyer' },
    { funded_date: '08.15.2025', business_name: 'Future Gadgets', lender: 'TechLend', funded_amount: 180000, commission_paid: 9000, renewal_status: 'funded', representative: 'Monica Cooper' },
    { funded_date: '10.22.2025', business_name: 'Artisan Crafts', lender: 'Handmade Capital', funded_amount: 70000, commission_paid: 3500, renewal_status: 'approved', representative: 'Alan Barton' },
    { funded_date: '11.05.2025', business_name: 'Robotics Advanced', lender: 'NextGen Funding', funded_amount: 450000, commission_paid: 22500, renewal_status: 'funded', representative: 'John Doe' },

	{ funded_date: '01.16.2024', business_name: 'Vintage Cars Inc', lender: 'Old School Loans', funded_amount: 100000, commission_paid: 10000, renewal_status: 'approved', representative: 'Monica Cooper' },
    { funded_date: '01.20.2024', business_name: 'Healthy Foods Ltd', lender: 'Green Valley Capital', funded_amount: 75000, commission_paid: 3750, renewal_status: 'funded', representative: 'Laurence Meyer' },
	{ funded_date: '02.10.2024', business_name: 'Bookworm Cafe', lender: 'Page Turner Inc', funded_amount: 60000, commission_paid: 3000, renewal_status: 'funded', representative: 'John Doe' },
    { funded_date: '02.25.2024', business_name: 'Adventure Tours Co.', lender: 'Explore More Funds', funded_amount: 120000, commission_paid: 6000, renewal_status: 'approved', representative: 'Jane Smith' },
	{ funded_date: '03.20.2024', business_name: 'Fast Track Couriers', lender: 'Speedy Cash', funded_amount: 120000, commission_paid: 6000, renewal_status: 'approved', representative: 'Jane Smith' },
	{ funded_date: '04.05.2024', business_name: 'Ocean Adventures', lender: 'Blue Water Fund', funded_amount: 180000, commission_paid: 9000, renewal_status: 'underwriting', representative: 'Alan Barton' },
	{ funded_date: '05.15.2024', business_name: 'Mountain Gear Co.', lender: 'Summit Loans', funded_amount: 90000, commission_paid: 4500, renewal_status: 'declined', representative: 'Laurence Meyer' },
    { funded_date: '05.25.2024', business_name: 'Sunshine Daycare', lender: 'Happy Kids Capital', funded_amount: 75000, commission_paid: 3750, renewal_status: 'funded', representative: 'Monica Cooper'},
    { funded_date: '06.10.2024', business_name: 'Aqua Marine Supplies', lender: 'Oceanic Finance', funded_amount: 95000, commission_paid: 4750, renewal_status: 'approved', representative: 'Alan Barton' },
    { funded_date: '07.01.2024', business_name: 'Digital Marketing Pros', lender: 'Online Growth Inc.', funded_amount: 110000, commission_paid: 5500, renewal_status: 'funded', representative: 'John Doe' },
    { funded_date: '08.18.2024', business_name: 'Luxury Travel Agency', lender: 'Exotic Ventures', funded_amount: 200000, commission_paid: 10000, renewal_status: 'approved', representative: 'Jane Smith' },
    { funded_date: '09.22.2024', business_name: 'Pet Paradise Store', lender: 'Animal Care Capital', funded_amount: 85000, commission_paid: 4250, renewal_status: 'underwriting', representative: 'Monica Cooper' },
    { funded_date: '10.30.2024', business_name: 'Sustainable Living Co.', lender: 'Eco Future Funds', funded_amount: 130000, commission_paid: 6500, renewal_status: 'funded', representative: 'Laurence Meyer' },
    { funded_date: '11.12.2024', business_name: 'Smart Home Solutions', lender: 'Connected Living Inc.', funded_amount: 160000, commission_paid: 8000, renewal_status: 'approved', representative: 'Alan Barton' },
	{ funded_date: '12.16.2024', business_name: 'Holiday Specials Ltd', lender: 'Festive Funds', funded_amount: 50000, commission_paid: 5000, renewal_status: 'approved', representative: 'Laurence Meyer' },


	{ funded_date: '11.16.2022', business_name: 'Historical Archives', lender: 'PastPerfect Ltd', funded_amount: 80000, commission_paid: 8000, renewal_status: 'approved', representative: 'John Doe' },
	{ funded_date: '07.16.2022', business_name: 'Summer Fest Events', lender: 'FunTimes Capital', funded_amount: 100000, commission_paid: 10000, renewal_status: 'approved', representative: 'Jane Smith' },
	{ funded_date: '02.16.2023', business_name: 'Winter Wonders', lender: 'SnowCap Finance', funded_amount: 90000, commission_paid: 9000, renewal_status: 'approved', representative: 'Alan Barton' },
    { funded_date: '08.10.2023', business_name: 'Space Explorers Toy Co.', lender: 'Galaxy Funding', funded_amount: 120000, commission_paid: 6000, renewal_status: 'funded', representative: 'John Doe1' },
    { funded_date: '09.15.2023', business_name: 'Construction Pro Services', lender: 'BuildIt Bank', funded_amount: 250000, commission_paid: 12500, renewal_status: 'approved', representative: 'Jane Smith1' },
    { funded_date: '10.20.2023', business_name: 'Good Grief Counseling', lender: 'Helpful Hands Capital', funded_amount: 80000, commission_paid: 4000, renewal_status: 'underwriting', representative: 'Monica Cooper22' },
    { funded_date: '11.05.2023', business_name: 'Justice League Supplies', lender: 'Hero Finance', funded_amount: 180000, commission_paid: 9000, renewal_status: 'funded', representative: 'Laurence Meyer123' },
    { funded_date: '12.01.2023', business_name: 'Topiary Masters', lender: 'Evergreen Loans', funded_amount: 95000, commission_paid: 4750, renewal_status: 'approved', representative: 'Alan Barton1' },
];

const ctx = document.getElementById('myChart').getContext('2d');
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const defaultLineColors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
    '#E91E63', '#2196F3', '#FFEB3B', '#00BCD4', '#673AB7', '#FF9800',
    '#F44336', '#03A9F4', '#CDDC39', '#009688', '#9C27B0', '#FF5722'
];
const CHART_CONTAINER_HEIGHT = 400;


const chart = new Chart(ctx, {
	type: 'line',
	data: {
		labels: months,
		datasets: [{ // Initial placeholder dataset
			label: 'Total Funded Amount',
			data: new Array(12).fill(0),
            borderColor: '#159C2A',
			backgroundColor: (() => {
                const gradient = ctx.createLinearGradient(0, 0, 0, CHART_CONTAINER_HEIGHT);
                gradient.addColorStop(0.9, 'rgba(34, 197, 59, 0.21)');
                gradient.addColorStop(1, 'rgba(34, 197, 59, 0)');
                return gradient;
            })(),
			pointRadius: 4,
			pointHoverRadius: 6,
			borderWidth: 2,
			fill: 'start',
			tension: 0.1,
        }],
	},
	options: {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
            title: {
                display: false,
                text: '',
                padding: { top: 10, bottom: 10 },
                font: { size: 16 }
            },
			tooltip: {
				enabled: true,
                mode: 'index',
                intersect: false,
                backgroundColor: '#FFFFFF', // White background for tooltip
                titleColor: '#000000',    // Black title text
                bodyColor: '#000000',     // Black body text
				callbacks: {
					labelColor: function(context) { // For the color swatch
                        const dataset = context.chart.data.datasets[context.datasetIndex];
                        const color = dataset.borderColor;
                        return {
                            borderColor: color,
                            backgroundColor: color, // Makes the square filled
                            borderWidth: 2, // Can adjust if using pointStyle
                            // pointStyle: 'rect', // Optionally use for explicit square
                        };
                    },
                    label: function(context) {
						let label = context.dataset.label || '';
						if (label) label += ': ';
						if (context.parsed.y !== null) {
							label += '$' + context.parsed.y.toLocaleString();
						}
						return label;
					},
                    title: function(tooltipItems) {
                        return tooltipItems[0].label; // Month name
                    }
				}
			},
			legend: { display: false }, // External legend will be used
		},
		scales: {
			x: { grid: { color: 'rgba(200, 200, 200, 0.5)', borderDash: [5, 5] } },
			y: {
				beginAtZero: true,
				grid: { color: 'rgba(200, 200, 200, 0.5)', borderDash: [5, 5] },
				ticks: { callback: value => `$ ${value.toLocaleString('en-US')}` },
			},
		},
		hover: { mode: 'nearest', intersect: true },
		onHover: (event, chartElements) => {
			const canvas = event.native?.target;
            if(canvas) canvas.style.cursor = chartElements.length ? 'pointer' : 'default';
		},
	},
});

function renderTableItems(filteredData) {
    const pipelineTableItems = document.getElementById('pipelineTableItems');
    pipelineTableItems.innerHTML = '';
    if (filteredData.length === 0) {
        pipelineTableItems.innerHTML = '<div class="no-data">No items found for the selected criteria.</div>';
        return;
    }

    filteredData.forEach(item => {
        const itemElement = document.createElement('a');
        itemElement.classList.add('pipline_table-item');
        itemElement.href = 'https://olehshashkevych.io/wp-content/themes/template/projects/broker-portal/templates/details/details.html';

        const displayDate = item.funded_date.replace(/\./g, '/');

        const formattedFundedAmount = `$ ${item.funded_amount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;

        const formattedCommissionPaid = `$ ${item.commission_paid.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;

        itemElement.innerHTML = `
            <div class="funded_date">${displayDate}</div>
            <div class="business_name">${item.business_name}</div>
            <div class="lender">${item.lender}</div>
            <div class="funded_amount">${formattedFundedAmount}</div>
            <div class="commission_paid">${formattedCommissionPaid}</div>
            <div class="renewal_status"><div class="${item.renewal_status.toLowerCase()}">${item.renewal_status.charAt(0).toUpperCase() + item.renewal_status.slice(1)}</div></div>
        `;
        pipelineTableItems.appendChild(itemElement);
    });
}

function updateResetButtonVisibility() {
    if (!yearDropdown || !representativeDropdown || !resetFiltersButton) return;

    const currentGlobalYear = new Date().getFullYear();
    // Check if the only selected year is the current year (default)
    const isDefaultYearOnlySelected = yearDropdown.selectedYears.size === 1 && yearDropdown.selectedYears.has(currentGlobalYear);
    // Check if no representatives are selected
    const noRepsSelected = representativeDropdown.selectedRepresentatives.size === 0;

    if (isDefaultYearOnlySelected && noRepsSelected) {
        // This is the default state (current year selected, no reps selected)
        resetFiltersButton.classList.add('hidden');
    } else if (yearDropdown.selectedYears.size === 0 && noRepsSelected && yearDropdown.allYears.includes(currentGlobalYear)) {
        // This handles the case where filters might have been cleared to a state where no year is explicitly selected
        // but the chart defaults to the current year. If current year is a valid option, this is effectively default.
         resetFiltersButton.classList.add('hidden');
    }
    else {
        // Any other combination means filters are active beyond the default
        resetFiltersButton.classList.remove('hidden');
    }
}

function updateLegend(selectedRepsArray, activeDatasets) {
    const legendContainer = document.getElementById('chartLegend');
    if (!legendContainer) return;
    legendContainer.innerHTML = '';

    selectedRepsArray.forEach(repName => {
        const datasetForRep = activeDatasets.find(ds => ds.label === repName);
        if (datasetForRep) {
            const color = datasetForRep.borderColor; // Get color from the dataset
            const legendItem = document.createElement('div');
            legendItem.className = 'legend-item';
            legendItem.innerHTML = `
                <span class="legend-color-swatch" style="background-color: ${color};"></span>
                <span>${repName}</span>
            `;
            legendContainer.appendChild(legendItem);
        }
    });
}

function updateChartData(itemsToProcess, selectedRepsArray, targetYearForChart) {
    const newDatasets = [];
    let localColorIndex = 0; // Used to pick colors sequentially from the palette for the current selection

    if (selectedRepsArray.length > 0) {
        selectedRepsArray.forEach(repName => {
            const repColor = defaultLineColors[localColorIndex % defaultLineColors.length];
            localColorIndex++;

            const monthlyData = new Array(12).fill(0);

            itemsToProcess.forEach(item => {
                if (item.representative === repName && parseInt(item.funded_date.split('.')[2], 10) === targetYearForChart) {
                    const dateParts = item.funded_date.split('.'); // MM.DD.YYYY
                    const monthIndex = parseInt(dateParts[0], 10) - 1;
                    if (monthIndex >= 0 && monthIndex < 12) {
                        monthlyData[monthIndex] += parseInt(item.funded_amount, 10);
                    }
                }
            });

            const repGradient = ctx.createLinearGradient(0, 0, 0, CHART_CONTAINER_HEIGHT);
            try {
                const tempColor = Chart.helpers.color(repColor); // For Chart.js v3+
                repGradient.addColorStop(0, tempColor.alpha(0.5).rgbString());
                repGradient.addColorStop(1, tempColor.alpha(0.05).rgbString());
            } catch (e) { // Fallback for hex colors if Chart.helpers.color is not available or repColor is not an object
                let r = parseInt(repColor.slice(1, 3), 16);
                let g = parseInt(repColor.slice(3, 5), 16);
                let b = parseInt(repColor.slice(5, 7), 16);
                repGradient.addColorStop(0, `rgba(${r},${g},${b},0.5)`);
                repGradient.addColorStop(1, `rgba(${r},${g},${b},0.05)`);
            }
            newDatasets.push({
                label: repName, data: monthlyData, borderColor: repColor, backgroundColor: repGradient,
                pointRadius: 4, pointHoverRadius: 6, borderWidth: 2, fill: 'start', tension: 0.1,
            });
        });
    } else { // Default: Show total funded amount if no representatives are selected
        const monthlyData = new Array(12).fill(0);
        itemsToProcess.forEach(item => {
            if (parseInt(item.funded_date.split('.')[2], 10) === targetYearForChart) {
                const dateParts = item.funded_date.split('.');
                const monthIndex = parseInt(dateParts[0], 10) - 1;
                 if (monthIndex >= 0 && monthIndex < 12) {
                    monthlyData[monthIndex] += parseInt(item.funded_amount, 10);
                }
            }
        });
        const defaultGradient = ctx.createLinearGradient(0, 0, 0, CHART_CONTAINER_HEIGHT);
        defaultGradient.addColorStop(0.9, 'rgba(34, 197, 59, 0.21)');
        defaultGradient.addColorStop(1, 'rgba(34, 197, 59, 0)');
        newDatasets.push({
            label: 'Total Funded Amount', data: monthlyData, borderColor: '#159C2A', backgroundColor: defaultGradient,
            fill: 'start', tension: 0.1, pointRadius: 4, pointHoverRadius: 6, borderWidth: 2,
        });
    }

    chart.data.labels = months; // X-axis is always months
    chart.data.datasets = newDatasets;
    if (chart.options.plugins.title) { // Ensure title plugin options exist
        chart.options.plugins.title.text = `Funding Data for ${targetYearForChart}`;
        chart.options.plugins.title.display = true;
    }
    chart.update();
    updateLegend(selectedRepsArray, chart.data.datasets); // Update legend after chart datasets are set
}

function updateDashboard() {
    if (!yearDropdown || !representativeDropdown) {
        console.warn("Dashboard update called before year/representative dropdowns are initialized.");
        return;
    }
    const selectedYears = Array.from(yearDropdown.selectedYears);
    const selectedReps = Array.from(representativeDropdown.selectedRepresentatives);

    let chartDisplayYear;
    if (selectedYears.length > 0) {
        chartDisplayYear = selectedYears[0];
    } else {
        chartDisplayYear = new Date().getFullYear();
    }

    let filteredForTable = [...items];
    if (selectedYears.length > 0) {
        filteredForTable = filteredForTable.filter(item => {
            const itemYear = parseInt(item.funded_date.split('.')[2], 10);
            return selectedYears.includes(itemYear);
        });
    }
    if (selectedReps.length > 0) {
        filteredForTable = filteredForTable.filter(item => selectedReps.includes(item.representative));
    }
    renderTableItems(filteredForTable);
    updateChartData(items, selectedReps, chartDisplayYear);
    updateResetButtonVisibility(); // Call this after dashboard updates
}

document.addEventListener('DOMContentLoaded', () => {
	yearDropdown = new YearDropdown();
	representativeDropdown = new RepresentativeDropdown();
    resetFiltersButton = document.getElementById('reset_filters_button');

    const currentGlobalYear = new Date().getFullYear();
    if (yearDropdown.allYears.includes(currentGlobalYear) && yearDropdown.selectedYears.size === 0) {
        yearDropdown.selectedYears.add(currentGlobalYear);
        yearDropdown.tempSelectedYears.add(currentGlobalYear);
        yearDropdown.updateButtonText();
    }

    if (resetFiltersButton) {
        resetFiltersButton.addEventListener('click', () => {
            // Reset Year Dropdown
            yearDropdown.selectedYears.clear();
            yearDropdown.tempSelectedYears.clear();
            // Set current year as default selected after reset
            const currentYr = new Date().getFullYear();
            if (yearDropdown.allYears.includes(currentYr)) {
                yearDropdown.selectedYears.add(currentYr);
                yearDropdown.tempSelectedYears.add(currentYr); // Keep temp in sync
            }
            yearDropdown.updateButtonText();

            // Reset Representative Dropdown
            representativeDropdown.selectedRepresentatives.clear();
            representativeDropdown.tempSelectedRepresentatives.clear();
            representativeDropdown.updateButtonText();

            updateDashboard(); // This will also call updateResetButtonVisibility
        });
    } else {
        console.error("Reset filters button not found.");
    }

	updateDashboard(); // Initial load will also call updateResetButtonVisibility
});