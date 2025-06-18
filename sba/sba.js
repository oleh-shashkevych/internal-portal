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

    toggleContactsPanel(window.innerWidth);
    window.addEventListener('resize', () => {
        toggleContactsPanel(window.innerWidth);
    });

    // --- FEE AGREEMENT TABLE LOGIC ---
    const feeAgreementTableContainer = document.getElementById('fee-agreement-table-container');
    const editFeePopup = document.getElementById('editFeeAgreementPopup');
    const deleteConfirmPopup = document.getElementById('deleteConfirmPopup');
    const popupOverlay = document.getElementById('popupOverlay');
    const createFeePopup = document.getElementById('createFeePopup');
    const previewFeePopup = document.getElementById('previewFeePopup');

    if (!feeAgreementTableContainer || !editFeePopup || !deleteConfirmPopup || !popupOverlay || !createFeePopup || !previewFeePopup) {
        return;
    }

    const initialData = [
        { id: 1, name: "Nicole’s Consulting & Trucking Solutions #1", program: "SLOC", status: "Draft", routingNumber: '123456789', accountNumber: '987654321' },
        { id: 2, name: "D c expediting llc #1", program: "SBA", status: "Sent", routingNumber: '123456789', accountNumber: '987654321' },
        { id: 3, name: "The KEY2TAX Refund Service LLC #1", program: "MCA", status: "Signed", routingNumber: '123456789', accountNumber: '987654321' },
        { id: 4, name: "Go Property Restoration Llc #1", program: "SBA", status: "Cancelled", routingNumber: '123456789', accountNumber: '987654321' },
        { id: 5, name: "503 Automotive And Tire Llc #1", program: "SLOC", status: "Sent", routingNumber: '123456789', accountNumber: '987654321' }
    ];

    let tableData = initialData.map(item => ({
        ...item,
        sentDate: generateRandomDate(),
        fundingAmount: generateRandomAmount(),
        fee: generateRandomAmount() / 10,
    }));

    let nextId = tableData.length > 0 ? Math.max(...tableData.map(i => i.id)) + 1 : 1;

    function generateRandomDate() {
        const start = new Date(2024, 0, 1);
        const end = new Date();
        const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;
    }

    function generateRandomAmount() {
        return Math.random() * 9999999;
    }

    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    function getStatusClass(status) {
        return `tag-${status.toLowerCase()}`;
    }

    function renderTable() {
        const rows = feeAgreementTableContainer.querySelectorAll('.row-wrapper');
        rows.forEach(row => row.remove());
        tableData.forEach(item => {
            const rowWrapper = document.createElement('div');
            rowWrapper.className = 'row-wrapper';
            rowWrapper.dataset.id = item.id;
            rowWrapper.innerHTML = `
                <div class="not-leads-fee-agreement__row">
                    <div class="not-leads-fee-agreement__item" data-label="Sent Date">${item.sentDate}</div>
                    <div class="not-leads-fee-agreement__item" data-label="Opportunity Name">${item.name}</div>
                    <div class="not-leads-fee-agreement__item" data-label="Program">${item.program}</div>
                    <div class="not-leads-fee-agreement__item" data-label="Funding Amount">${formatCurrency(item.fundingAmount)}</div>
                    <div class="not-leads-fee-agreement__item" data-label="Fee">${formatCurrency(item.fee)}</div>
                    <div class="not-leads-fee-agreement__item" data-label="Status"><span class="status-tag ${getStatusClass(item.status)}">${item.status}</span></div>
                    <div class="not-leads-fee-agreement__item actions">
                        <div class="fee-agreement-actions">
                            <button class="action-btn edit" data-action="edit" title="Edit"><svg width="11" height="14" viewBox="0 0 11 14" fill="none" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)"><path d="M0.446184 12.4912L2.43697 12.5C2.43764 12.5 2.43831 12.5 2.43898 12.5C2.55787 12.5 2.67182 12.4527 2.75597 12.3685L10.8688 4.24189C10.9528 4.15772 11 4.04346 11 3.92438C11 3.8053 10.9527 3.69116 10.8687 3.60698L8.89549 1.63143C8.72047 1.45623 8.43676 1.45612 8.26174 1.63154L0.138721 9.76821C0.0551321 9.85194 0.00784725 9.96541 0.0075111 10.0838L3.80098e-06 12.0405C-0.00100464 12.2884 0.198779 12.4901 0.446184 12.4912ZM8.57872 2.58374L9.91794 3.92449L8.10565 5.73989L6.76666 4.39891L8.57872 2.58374ZM0.903122 10.2723L6.1328 5.03371L7.47168 6.3748L2.2541 11.6013L0.898079 11.5953L0.903122 10.2723Z" fill="#6D6D6D"></path></svg></button>
                            <button class="action-btn resend" data-action="resend" title="Resend"><svg width="14" height="12" viewBox="0 0 23 18" fill="none" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)"><path d="M22.3103 0.233398H0.999744C0.667053 0.233398 0.39502 0.503594 0.39502 0.838123V17.1638C0.39502 17.4965 0.667053 17.7667 0.999744 17.7667H22.3103C22.6448 17.7667 22.915 17.4965 22.915 17.1638V0.838123C22.915 0.503594 22.6448 0.233398 22.3103 0.233398ZM20.5917 1.44285L11.655 10.0395L2.72017 1.44285H20.5917ZM21.7056 16.5591H1.60447V2.09536L11.2782 11.2765C11.4988 11.4548 11.8131 11.4548 12.0337 11.2765L21.7056 2.09536V16.5591Z" fill="#6D6D6D"></path></svg></button>
                            <button class="action-btn delete" data-action="delete" title="Delete"><svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.01676 11.3813C1.01676 12.4483 1.88371 13.3152 2.95069 13.3152H8.60119C9.66815 13.3152 10.5351 12.4483 10.5351 11.3813V4.42344H12V3.353H8.31411V1.84421C8.31411 1.20586 7.79283 0.68457 7.15447 0.68457H4.40165C3.7633 0.68457 3.24201 1.20586 3.24201 1.84421V3.35161H0V4.42205H1.01678L1.01676 11.3813ZM4.31247 1.84421C4.31247 1.79404 4.35149 1.75501 4.40167 1.75501H7.15449C7.20467 1.75501 7.24369 1.79404 7.24369 1.84421V3.35161H4.31247V1.84421ZM2.08941 4.42201H9.46468V11.3799C9.46468 11.8566 9.0772 12.2433 8.60122 12.2433H2.95287C2.47618 12.2433 2.08941 11.8559 2.08941 11.3799V4.42201ZM4.13033 6.33301H5.20077V10.2685H4.13033V6.33301ZM7.64626 6.33301H6.57582V10.2685H7.64626V6.33301Z" fill="#6D6D6D"></path></svg></button>
                            <button class="action-btn toggle-details" data-action="toggle" title="Open/Hide Details"><svg viewBox="0 0 24 24" fill="none" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)"><path d="M19.9201 8.94995L13.4001 15.47C12.6301 16.24 11.3701 16.24 10.6001 15.47L4.08008 8.94995" stroke="#6D6D6D" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
                        </div>
                    </div>
                </div>
                <div class="additional-info-row"><div class="additional-info-content">05/29/2025 12:25 PM Monica Miller <strong>signed</strong> SBA Fee Sheet <br>05/29/2025 12:21 PM Jonathan Sivak Moved <strong>edited</strong> SBA Fee Sheet from Funding Amount $50,000.00 to $120,000.00 and <strong>send</strong> to <strong>Monica Miller</strong> at <strong>monica@gmail.com</strong> CC <strong>jimmy@gmail.com</strong><br>05/23/2025 22:45 PM Nataliya Baltsevych <strong>saved</strong> SBA Fee Sheet as Draft. <br>05/23/2025 22:45 PM Nataliya Baltsevych <strong>created</strong> SBA Fee Sheet and <strong>send</strong> to <strong>Monica Miller</strong> at <strong>monica@gmail.com</strong> CC <strong>jimmy@gmail.com</strong></div></div>
            `;
            feeAgreementTableContainer.appendChild(rowWrapper);
        });
    }

    function resetAllPopupForms() {
        const createFeeForm = document.getElementById('createFeeForm');
        if (createFeeForm) {
            createFeeForm.reset();
            $('#opportunityName').val(null).trigger('change');
            createFeeForm.querySelectorAll('.form-group.invalid').forEach(el => el.classList.remove('invalid'));
        }

        const editFeeForm = document.getElementById('editFeeForm');
        if (editFeeForm) {
            editFeeForm.reset();
            $('#editOpportunityName').val(null).trigger('change');
            editFeeForm.querySelectorAll('.form-group.invalid').forEach(el => el.classList.remove('invalid'));
        }

        const previewFeeForm = document.getElementById('previewFeeForm');
        if (previewFeeForm) {
            previewFeeForm.reset();
            $('#previewOpportunityName').val(null).trigger('change');
            $('#previewTo').val(null).trigger('change');
            $('#previewCC').val(null).trigger('change');
            previewFeeForm.querySelectorAll('.form-group.invalid').forEach(el => el.classList.remove('invalid'));
        }
    }

    let itemToDeleteId = null;

    function openPopup(popup) {
        popup.classList.add('active');
        popupOverlay.classList.add('active');
        document.body.classList.add('noscroll');
    }

    function closeAllPopups() {
        document.querySelectorAll('.popup.active').forEach(p => p.classList.remove('active'));
        popupOverlay.classList.remove('active');
        document.body.classList.remove('noscroll');
        document.querySelectorAll('.row-wrapper').forEach(r => r.classList.remove('focused-edit', 'focused-delete'));
        itemToDeleteId = null;
        resetAllPopupForms();
    }

    function openEditPopup(itemId) {
        const itemData = tableData.find(item => item.id === itemId);
        if (!itemData) return;

        const form = document.getElementById('editFeeForm');
        form.querySelectorAll('.form-group.invalid').forEach(el => el.classList.remove('invalid'));

        const fundingInput = form.querySelector('#editFundingAmount');
        const feeInput = form.querySelector('#editFeeAmount');

        form.querySelector('#editItemId').value = itemData.id;
        $('#editOpportunityName').val(itemData.name).trigger('change');
        fundingInput.value = itemData.fundingAmount.toFixed(2);
        feeInput.value = itemData.fee.toFixed(2);
        form.querySelector('#editRoutingNumber').value = itemData.routingNumber || '';
        form.querySelector('#editAccountNumber').value = itemData.accountNumber || '';

        fundingInput.dispatchEvent(new Event('input'));
        feeInput.dispatchEvent(new Event('input'));
        finalizeCurrencyFormat({ target: fundingInput });
        finalizeCurrencyFormat({ target: feeInput });

        openPopup(editFeePopup);
    }

    function openDeletePopup(itemId) {
        itemToDeleteId = itemId;
        openPopup(deleteConfirmPopup);
    }

    const createFeeBtn = document.getElementById('create-fee-btn');
    const previewFeeBtn = document.getElementById('preview-fee-btn');
    const createFeeForm = document.getElementById('createFeeForm');
    const previewFeeForm = document.getElementById('previewFeeForm');
    const saveDraftBtn = createFeeForm.querySelector('.btn-save-draft');
    const createPreviewBtn = createFeeForm.querySelector('.btn-apply');

    // Initialize single-select Select2
    $('#opportunityName, #editOpportunityName, #previewOpportunityName').each(function() {
        const popupId = $(this).closest('.popup').attr('id');
        $(this).select2({
            placeholder: "Select an opportunity",
            allowClear: true,
            dropdownParent: $(`#${popupId}`)
        });
    });

    // Initialize multi-select Select2 for new fields
    $('.select2-field-multiple').each(function() {
        const popupId = $(this).closest('.popup').attr('id');
        $(this).select2({
            placeholder: "Select emails...",
            tokenSeparators: [',', ' '],
            dropdownParent: $(`#${popupId}`)
        });
    });

    const currencyInputs = ['fundingAmount', 'feeAmount', 'editFundingAmount', 'editFeeAmount', 'previewFundingAmount', 'previewFeeAmount'];
    const numberInputs = ['routingNumber', 'accountNumber', 'editRoutingNumber', 'editAccountNumber', 'previewRoutingNumber', 'previewAccountNumber'];

    function formatCurrencyInput(e) {
        const input = e.target;
        let value = input.value;
        let numericValue = value.replace(/[^0-9.]/g, '');
        const parts = numericValue.split('.');
        if (parts.length > 2) {
            numericValue = parts[0] + '.' + parts.slice(1).join('');
        }
        let [integerPart, decimalPart] = numericValue.split('.');
        if (integerPart) integerPart = integerPart.substring(0, 7);
        else integerPart = '';
        if (decimalPart) decimalPart = decimalPart.substring(0, 2);
        let formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        let newValue = formattedInteger;
        if (decimalPart !== undefined) {
            newValue += '.' + decimalPart;
        } else if (numericValue.includes('.')) {
            newValue += '.';
        }
        input.value = newValue;
    }

    function finalizeCurrencyFormat(e) {
        const input = e.target;
        let value = input.value;
        if (value) {
            if (value.endsWith('.')) {
                value = value.slice(0, -1);
            }
            let [integerPart, decimalPart] = value.split('.');
            if (!decimalPart) {
                value += '.00';
            } else if (decimalPart.length === 1) {
                value += '0';
            }
            input.value = value;
        }
    }

    currencyInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', formatCurrencyInput);
            input.addEventListener('blur', finalizeCurrencyFormat);
        }
    });
    numberInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', (e) => e.target.value = e.target.value.replace(/[^0-9]/g, ''));
        }
    });

    function validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        form.querySelectorAll('.form-group.invalid').forEach(el => el.classList.remove('invalid'));

        requiredFields.forEach(field => {
            const group = field.closest('.form-group');
            if (group) {
                let isEmpty = false;
                // Check for multi-select select2
                if ($(field).hasClass('select2-field-multiple')) {
                    isEmpty = $(field).val().length === 0;
                } else if (!field.value || field.value.trim() === '') {
                    isEmpty = true;
                }
                
                if (isEmpty) {
                    group.classList.add('invalid');
                    isValid = false;
                }
            }
        });
        return isValid;
    }


    createFeeBtn.addEventListener('click', () => {
        openPopup(createFeePopup);
    });

    previewFeeBtn.addEventListener('click', () => {
        // Pre-fill with demo data as per the screenshot, since no other source is specified
        $('#previewTo').val(['JBlanchard@mail.com', 'EvaRMoore@mail.com']).trigger('change');
        $('#previewCC').val(['JBlanchard@mail.com', 'EvaRMoore@mail.com']).trigger('change');
        openPopup(previewFeePopup);
    });

    if (createPreviewBtn) {
        createPreviewBtn.type = 'button';
        createPreviewBtn.addEventListener('click', () => {
            // Проверяем, валидна ли форма
            if (validateForm(createFeeForm)) {

                // 1. Собираем данные из формы (этот код взят из обработчика saveDraftBtn)
                const formData = new FormData(createFeeForm);
                const fundingAmountRaw = formData.get('fundingAmount') || '0';
                const feeAmountRaw = formData.get('fee') || '0';
                const newItem = {
                    id: nextId++,
                    name: $('#opportunityName').val(),
                    fundingAmount: parseFloat(fundingAmountRaw.replace(/[^\d.]/g, '')),
                    fee: parseFloat(feeAmountRaw.replace(/[^\d.]/g, '')),
                    routingNumber: formData.get('routingNumber'),
                    accountNumber: formData.get('accountNumber'),
                    sentDate: new Date().toLocaleDateString('en-US'),
                    program: 'SBA', // Можете поменять при необходимости
                    status: 'Draft', // Можете поменять на 'Sent' или другой статус
                };

                // 2. Добавляем новый элемент в наш массив данных
                tableData.push(newItem);

                // 3. Теперь перерисовываем таблицу с новыми данными
                renderTable();

                // 4. И в конце закрываем окно
                closeAllPopups();
            }
        });
    }

    if (saveDraftBtn) {
        saveDraftBtn.addEventListener('click', () => {
            if (validateForm(createFeeForm)) {
                const formData = new FormData(createFeeForm);
                const fundingAmountRaw = formData.get('fundingAmount') || '0';
                const feeAmountRaw = formData.get('fee') || '0';
                const newItem = {
                    id: nextId++,
                    name: $('#opportunityName').val(),
                    fundingAmount: parseFloat(fundingAmountRaw.replace(/[^\d.]/g, '')),
                    fee: parseFloat(feeAmountRaw.replace(/[^\d.]/g, '')),
                    routingNumber: formData.get('routingNumber'),
                    accountNumber: formData.get('accountNumber'),
                    sentDate: new Date().toLocaleDateString('en-US'),
                    program: 'SBA',
                    status: 'Draft',
                };
                tableData.push(newItem);
                renderTable();
                closeAllPopups();
            }
        });
    }

    previewFeeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateForm(previewFeeForm)) {
            const formData = new FormData(previewFeeForm);
            const fundingAmountRaw = formData.get('fundingAmount') || '0';
            const feeAmountRaw = formData.get('fee') || '0';
            const newItem = {
                id: nextId++,
                name: $('#previewOpportunityName').val(),
                fundingAmount: parseFloat(fundingAmountRaw.replace(/[^\d.]/g, '')),
                fee: parseFloat(feeAmountRaw.replace(/[^\d.]/g, '')),
                routingNumber: formData.get('routingNumber'),
                accountNumber: formData.get('accountNumber'),
                sentDate: new Date().toLocaleDateString('en-US'),
                program: 'SBA',
                status: 'Sent',
            };
            tableData.push(newItem);
            renderTable();
            closeAllPopups();
        }
    });

    const editFeeForm = document.getElementById('editFeeForm');
    editFeeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateForm(editFeeForm)) {
            const formData = new FormData(editFeeForm);
            const itemId = parseInt(formData.get('itemId'), 10);
            const itemIndex = tableData.findIndex(item => item.id === itemId);
            if (itemIndex !== -1) {
                tableData[itemIndex].name = formData.get('opportunityName');
                tableData[itemIndex].fundingAmount = parseFloat(formData.get('fundingAmount').replace(/[^\d.]/g, ''));
                tableData[itemIndex].fee = parseFloat(formData.get('fee').replace(/[^\d.]/g, ''));
                tableData[itemIndex].routingNumber = formData.get('routingNumber');
                tableData[itemIndex].accountNumber = formData.get('accountNumber');
                renderTable();
            }
            closeAllPopups();
        }
    });

    function handleTableClick(e) {
        const actionBtn = e.target.closest('.action-btn');
        if (!actionBtn) return;
        const action = actionBtn.dataset.action;
        const rowWrapper = actionBtn.closest('.row-wrapper');
        const itemId = parseInt(rowWrapper.dataset.id, 10);
        document.querySelectorAll('.row-wrapper').forEach(r => r.classList.remove('focused-edit', 'focused-delete'));
        switch (action) {
            case 'edit':
                rowWrapper.classList.add('focused-edit');
                openEditPopup(itemId);
                break;
            case 'delete':
                rowWrapper.classList.add('focused-delete');
                openDeletePopup(itemId);
                break;
            case 'toggle':
                rowWrapper.classList.toggle('expanded');
                break;
            case 'resend':
                console.log('Resend functionality to be implemented.');
                break;
        }
    }

    function confirmDelete() {
        if (itemToDeleteId === null) return;
        tableData = tableData.filter(item => item.id !== itemToDeleteId);
        renderTable();
        closeAllPopups();
    }

    feeAgreementTableContainer.addEventListener('click', handleTableClick);
    document.querySelectorAll('.js-popup-close').forEach(btn => {
        btn.addEventListener('click', closeAllPopups);
    });
    document.getElementById('confirmDeleteBtn').addEventListener('click', confirmDelete);
    document.getElementById('cancelDeleteBtn').addEventListener('click', closeAllPopups);

    // --- НОВАЯ ЛОГИКА СЧЕТЧИКА СИМВОЛОВ ---
    function setupCharacterCounter(textareaId, counterId) {
        const textarea = document.getElementById(textareaId);
        const counter = document.getElementById(counterId);

        if (textarea && counter) {
            const maxLength = parseInt(textarea.getAttribute('maxlength'), 10);

            const updateCounter = () => {
                const currentLength = textarea.value.length;
                const remaining = maxLength - currentLength;
                counter.textContent = `${remaining} characters left`;
            };
            
            textarea.addEventListener('input', updateCounter);
            updateCounter(); // Set initial value on load
        }
    }

    setupCharacterCounter('previewText', 'previewTextCounter');
    setupCharacterCounter('emailNote', 'emailNoteCounter');
    setupCharacterCounter('callNote', 'callNoteCounter');
    setupCharacterCounter('smsNote', 'smsNoteCounter');
    // --- КОНЕЦ НОВОЙ ЛОГИКИ ---

    renderTable();
});
