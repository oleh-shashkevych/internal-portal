document.addEventListener('DOMContentLoaded', function () {
    console.log('Edit Campaign page loaded');

    // ===========================================
    // 1. CUSTOM MULTI-SELECT LOGIC
    // ===========================================
    const multiselects = document.querySelectorAll('.custom-multiselect');

    multiselects.forEach(ms => {
        const box = ms.querySelector('.select-box');
        const list = ms.querySelector('.options-list');
        const checkboxes = list.querySelectorAll('input[type="checkbox"]');

        updateSelectedText(ms);

        box.addEventListener('click', (e) => {
            e.stopPropagation();
            multiselects.forEach(other => {
                if (other !== ms) other.classList.remove('open');
            });
            document.querySelectorAll('.custom-font-select').forEach(el => el.classList.remove('open'));
            ms.classList.toggle('open');
        });

        checkboxes.forEach(cb => {
            cb.addEventListener('change', () => {
                updateSelectedText(ms);
            });
        });

        list.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });

    function updateSelectedText(container) {
        const checkboxes = container.querySelectorAll('input[type="checkbox"]:checked');
        const displaySpan = container.querySelector('.selected-text');

        if (checkboxes.length === 0) {
            displaySpan.textContent = "Select options";
            displaySpan.style.color = "#808080";
        } else if (checkboxes.length === 1) {
            const labelText = checkboxes[0].parentElement.querySelector('.option-label').textContent;
            displaySpan.textContent = labelText;
            displaySpan.style.color = "#232323";
        } else {
            displaySpan.textContent = `${checkboxes.length} items selected`;
            displaySpan.style.color = "#232323";
        }
    }

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.cp-popup') && !e.target.closest('.color-swatch-wrapper')) {
            multiselects.forEach(ms => ms.classList.remove('open'));
        }
    });

    // ===========================================
    // 2. CUSTOM DATE PICKER LOGIC
    // ===========================================
    const dateTrigger = document.getElementById('date-time-trigger');
    const overlay = document.getElementById('datePickerOverlay');
    const closeBtn = document.getElementById('dpClose');
    const scheduleBtn = document.getElementById('scheduleBtn');
    const previewDisplay = document.getElementById('previewDateTime');
    const timeHourInput = document.getElementById('timeHour');
    const timeAmpmSelect = document.getElementById('timeAmpm');

    if (dateTrigger && overlay && typeof flatpickr !== 'undefined') {
        let selectedDateObj = new Date();

        const fp = flatpickr("#inline-calendar", {
            inline: true,
            dateFormat: "Y-m-d",
            defaultDate: "today",
            onChange: function (selectedDates) {
                if (selectedDates.length > 0) {
                    selectedDateObj = selectedDates[0];
                    updatePreviewText();
                }
            }
        });

        dateTrigger.addEventListener('click', () => {
            overlay.classList.add('active');
            updatePreviewText();
        });

        function closeModal() {
            overlay.classList.remove('active');
        }

        closeBtn.addEventListener('click', closeModal);

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });

        function updatePreviewText() {
            const datePart = fp.formatDate(selectedDateObj, "M j");
            const timePart = `${timeHourInput.value} ${timeAmpmSelect.value}`;
            if (previewDisplay) previewDisplay.textContent = `${datePart}, ${timePart}`;
        }

        if (timeHourInput) timeHourInput.addEventListener('input', updatePreviewText);
        if (timeAmpmSelect) timeAmpmSelect.addEventListener('change', updatePreviewText);

        scheduleBtn.addEventListener('click', () => {
            const datePart = fp.formatDate(selectedDateObj, "m/d/Y");
            const timePart = `${timeHourInput.value} ${timeAmpmSelect.value}`;
            dateTrigger.value = `${datePart} ${timePart}`;
            closeModal();
        });
    }

    // ===========================================
    // 3. CUSTOM COLOR PICKER (Event Delegation)
    // ===========================================
    let activeColorInput = null;
    let activeSwatch = null;

    const pickerDOM = document.createElement('div');
    pickerDOM.className = 'cp-popup';
    pickerDOM.innerHTML = `
        <div class="cp-saturation">
            <div class="cp-saturation-white"></div>
            <div class="cp-saturation-black"></div>
            <div class="cp-cursor"></div>
        </div>
        <div class="cp-hue">
            <div class="cp-hue-cursor"></div>
        </div>
        <div class="cp-presets"></div>
        <div class="cp-hex-wrapper">
            <span class="cp-hex-prefix">#</span>
            <input type="text" class="cp-hex-input" maxlength="6">
        </div>
    `;
    document.body.appendChild(pickerDOM);

    const satBox = pickerDOM.querySelector('.cp-saturation');
    const satCursor = pickerDOM.querySelector('.cp-cursor');
    const hueBox = pickerDOM.querySelector('.cp-hue');
    const hueCursor = pickerDOM.querySelector('.cp-hue-cursor');
    const hexInput = pickerDOM.querySelector('.cp-hex-input');
    const presetsBox = pickerDOM.querySelector('.cp-presets');

    let currentHsv = { h: 0, s: 0, v: 100 };
    let isDraggingSat = false;
    let isDraggingHue = false;

    const presetColors = [
        '#D32F2F', '#C2185B', '#7B1FA2', '#512DA8', '#303F9F', '#1976D2',
        '#0288D1', '#0097A7', '#00796B', '#388E3C', '#689F38', '#AFB42B',
        '#FBC02D', '#FFA000', '#F57C00', '#E64A19', '#5D4037', '#616161',
        '#455A64', '#000000', '#FFFFFF', '#159C2A', '#E8F6EA', '#F5F5F5'
    ];

    presetColors.forEach(color => {
        const div = document.createElement('div');
        div.className = 'cp-preset-color';
        div.style.backgroundColor = color;
        div.addEventListener('click', () => {
            setColorFromHex(color);
            applyColor();
        });
        presetsBox.appendChild(div);
    });

    document.addEventListener('click', (e) => {
        const wrapper = e.target.closest('.color-swatch-wrapper');

        if (!wrapper && !pickerDOM.contains(e.target)) {
            pickerDOM.classList.remove('active');
            document.querySelectorAll('.custom-font-select').forEach(el => el.classList.remove('open'));
            return;
        }

        if (wrapper) {
            e.stopPropagation();
            document.querySelectorAll('.custom-multiselect').forEach(ms => ms.classList.remove('open'));
            document.querySelectorAll('.custom-font-select').forEach(el => el.classList.remove('open'));

            const inputId = wrapper.dataset.target;
            if (!inputId) return;

            activeColorInput = document.getElementById(inputId);
            activeSwatch = wrapper.querySelector('.color-swatch');

            const initialColor = activeColorInput.value || '#FFFFFF';
            setColorFromHex(initialColor);

            const rect = wrapper.getBoundingClientRect();
            let top = rect.bottom + window.scrollY + 5;
            if (top + 350 > document.body.scrollHeight) {
                top = rect.top + window.scrollY - 310;
            }

            pickerDOM.style.top = `${top}px`;
            pickerDOM.style.left = `${rect.left + window.scrollX}px`;
            pickerDOM.classList.add('active');
        }
    });

    satBox.addEventListener('mousedown', (e) => { isDraggingSat = true; updateSatVal(e); });
    hueBox.addEventListener('mousedown', (e) => { isDraggingHue = true; updateHue(e); });

    document.addEventListener('mousemove', (e) => {
        if (isDraggingSat) { e.preventDefault(); updateSatVal(e); }
        if (isDraggingHue) { e.preventDefault(); updateHue(e); }
    });

    document.addEventListener('mouseup', () => {
        isDraggingSat = false;
        isDraggingHue = false;
    });

    function updateSatVal(e) {
        const rect = satBox.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        x = Math.max(0, Math.min(x, rect.width));
        y = Math.max(0, Math.min(y, rect.height));

        currentHsv.s = (x / rect.width) * 100;
        currentHsv.v = 100 - (y / rect.height) * 100;

        updateUI();
        applyColor();
    }

    function updateHue(e) {
        const rect = hueBox.getBoundingClientRect();
        let x = e.clientX - rect.left;
        x = Math.max(0, Math.min(x, rect.width));
        currentHsv.h = (x / rect.width) * 360;
        updateUI();
        applyColor();
    }

    function setColorFromHex(hex) {
        currentHsv = hexToHsv(hex);
        updateUI();
        if (activeColorInput) {
            hexInput.value = hex.replace('#', '');
        }
    }

    function updateUI() {
        satBox.style.backgroundColor = `hsl(${currentHsv.h}, 100%, 50%)`;
        satCursor.style.left = `${currentHsv.s}%`;
        satCursor.style.top = `${100 - currentHsv.v}%`;
        hueCursor.style.left = `${(currentHsv.h / 360) * 100}%`;
        const hex = hsvToHex(currentHsv.h, currentHsv.s, currentHsv.v);
        hexInput.value = hex.replace('#', '');
    }

    function applyColor() {
        const hex = hsvToHex(currentHsv.h, currentHsv.s, currentHsv.v);
        if (activeColorInput && activeSwatch) {
            activeColorInput.value = hex;
            activeSwatch.style.backgroundColor = hex;

            // FIX: Remove plus icon when color is selected
            if (activeSwatch.classList.contains('plus-swatch')) {
                activeSwatch.classList.remove('plus-swatch');
                activeSwatch.innerHTML = ''; // Remove the SVG
            }

            activeColorInput.dispatchEvent(new Event('input'));
        }
    }

    hexInput.addEventListener('change', () => {
        let val = hexInput.value;
        if (!val.startsWith('#')) val = '#' + val;
        if (/^#[0-9A-F]{6}$/i.test(val)) {
            setColorFromHex(val);
            applyColor();
        }
    });

    function hsvToHex(h, s, v) {
        s /= 100; v /= 100;
        let c = v * s;
        let x = c * (1 - Math.abs(((h / 60) % 2) - 1));
        let m = v - c;
        let r = 0, g = 0, b = 0;
        if (0 <= h && h < 60) { r = c; g = x; b = 0; }
        else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
        else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
        else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
        else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
        else if (300 <= h && h < 360) { r = c; g = 0; b = x; }
        r = Math.round((r + m) * 255).toString(16).padStart(2, '0');
        g = Math.round((g + m) * 255).toString(16).padStart(2, '0');
        b = Math.round((b + m) * 255).toString(16).padStart(2, '0');
        return `#${r}${g}${b}`.toUpperCase();
    }

    function hexToHsv(hex) {
        let r = 0, g = 0, b = 0;
        if (!hex) hex = "#FFFFFF";
        if (hex.length === 4) {
            r = parseInt("0x" + hex[1] + hex[1]);
            g = parseInt("0x" + hex[2] + hex[2]);
            b = parseInt("0x" + hex[3] + hex[3]);
        } else if (hex.length === 7) {
            r = parseInt("0x" + hex[1] + hex[2]);
            g = parseInt("0x" + hex[3] + hex[4]);
            b = parseInt("0x" + hex[5] + hex[6]);
        }
        r /= 255; g /= 255; b /= 255;
        let cmin = Math.min(r, g, b), cmax = Math.max(r, g, b), delta = cmax - cmin;
        let h = 0, s = 0, v = 0;
        if (delta === 0) h = 0;
        else if (cmax === r) h = ((g - b) / delta) % 6;
        else if (cmax === g) h = (b - r) / delta + 2;
        else h = (r - g) / delta + 4;
        h = Math.round(h * 60);
        if (h < 0) h += 360;
        v = Math.round(cmax * 100);
        s = cmax === 0 ? 0 : Math.round((delta / cmax) * 100);
        return { h, s, v };
    }

    // ===========================================
    // 4. CUSTOM FONT DROPDOWN LOGIC
    // ===========================================
    function initCustomFontSelect() {
        const select = document.getElementById('style-font');
        if (!select) return;

        select.style.display = 'none';

        const wrapper = document.createElement('div');
        wrapper.className = 'custom-font-select';

        const header = document.createElement('div');
        header.className = 'font-select-header';
        const currentText = select.options[select.selectedIndex].text;
        header.innerHTML = `<span class="current-font">${currentText}</span>
                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="#232323" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

        const list = document.createElement('div');
        list.className = 'font-options-list';

        Array.from(select.options).forEach(opt => {
            const item = document.createElement('div');
            item.className = 'font-option-item';
            item.textContent = opt.text;
            item.style.fontFamily = opt.value;

            if (opt.selected) item.classList.add('selected');

            item.addEventListener('click', (e) => {
                e.stopPropagation();
                select.value = opt.value;
                select.dispatchEvent(new Event('change'));

                header.querySelector('.current-font').textContent = opt.text;
                list.querySelectorAll('.font-option-item').forEach(i => i.classList.remove('selected'));
                item.classList.add('selected');
                wrapper.classList.remove('open');
            });
            list.appendChild(item);
        });

        wrapper.appendChild(header);
        wrapper.appendChild(list);
        select.parentNode.insertBefore(wrapper, select);

        header.addEventListener('click', (e) => {
            e.stopPropagation();
            document.querySelectorAll('.custom-multiselect').forEach(ms => ms.classList.remove('open'));
            wrapper.classList.toggle('open');
        });

        if (!document.getElementById('font-select-styles')) {
            const style = document.createElement('style');
            style.id = 'font-select-styles';
            style.innerHTML = `
                .custom-font-select { position: relative; width: 100%; font-family: 'Urbanist', sans-serif; }
                .font-select-header { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #E0E0E0; cursor: pointer; font-size: 14px; color: #232323; }
                .font-select-header:hover { border-bottom-color: #aaa; }
                .custom-font-select.open .font-select-header { border-bottom-color: #159C2A; }
                .custom-font-select.open .font-select-header svg { transform: rotate(180deg); }
                .font-options-list { display: none; position: absolute; top: 100%; left: 0; width: 100%; background: #fff; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border-radius: 6px; z-index: 100; margin-top: 5px; padding: 5px 0; max-height: 200px; overflow-y: auto; }
                .custom-font-select.open .font-options-list { display: block; }
                .font-option-item { padding: 10px 15px; cursor: pointer; font-size: 14px; color: #232323; }
                .font-option-item:hover { background-color: #F5F5F5; }
                .font-option-item.selected { color: #159C2A; font-weight: 600; background-color: #E8F6EA; }
            `;
            document.head.appendChild(style);
        }
    }
    initCustomFontSelect();


    // ===========================================
    // 5. BUILDER LOGIC
    // ===========================================

    let blocksData = [];
    let selectedBlockId = null;

    const dropzone = document.getElementById('dynamic-builder-area');
    const sidebarTabs = document.querySelectorAll('.sb-tab');

    // --- ACCORDION LOGIC ---
    const accHeaders = document.querySelectorAll('.sb-accordion-header');

    accHeaders.forEach(header => {
        header.addEventListener('click', () => {
            header.classList.toggle('active');
            const targetId = header.dataset.target;
            const body = document.getElementById(targetId);
            if (body) {
                body.classList.toggle('open');
            }
        });
    });

    function openAccordion(id) {
        const body = document.getElementById(id);
        const header = document.querySelector(`.sb-accordion-header[data-target="${id}"]`);
        if (body && !body.classList.contains('open')) body.classList.add('open');
        if (header && !header.classList.contains('active')) header.classList.add('active');
    }

    // --- Tab Switching ---
    if (sidebarTabs.length > 0) {
        sidebarTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                sidebarTabs.forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.sb-panel').forEach(p => p.classList.remove('active'));
                tab.classList.add('active');
                const target = document.getElementById(tab.dataset.target);
                if (target) target.classList.add('active');
            });
        });
    }

    // --- Drag & Drop ---
    const draggables = document.querySelectorAll('.draggable-item');
    draggables.forEach(item => {
        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('type', item.dataset.type);
        });
    });

    if (dropzone) {
        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.classList.add('drag-active');
        });
        dropzone.addEventListener('dragleave', () => {
            dropzone.classList.remove('drag-active');
        });
        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.classList.remove('drag-active');
            const type = e.dataTransfer.getData('type');
            if (type) addBlock(type);
        });
    }

    // --- Block Management ---
    function addBlock(type) {
        const newBlock = {
            id: Date.now(),
            type: type,
            content: getDefaultContent(type),
            isList: false, // New property for Markdown toggle
            styles: getDefaultStyles(type)
        };
        blocksData.push(newBlock);
        renderBlocks();
        selectBlock(newBlock.id);
    }

    function getDefaultContent(type) {
        if (type === 'text') return 'My new text block\nSecond line';
        if (type === 'image') return '../assets/images/logo_placeholder.svg';
        if (type === 'button') return { text: 'Click Me', link: '#' };
        return '';
    }

    function getDefaultStyles(type) {
        const base = {
            paddingTop: '10px',
            paddingBottom: '10px',
            paddingLeft: '20px',
            paddingRight: '20px',
            align: 'left',
            fontFamily: 'inherit',
            fontSize: '16',
            fontWeight: 'normal',
            color: '#232323',
            bgColor: 'transparent'
        };
        if (type === 'button') {
            return { ...base, align: 'center', bgColor: '#159C2A', color: '#FFFFFF', borderRadius: '4px' };
        }
        return base;
    }

    function renderBlocks() {
        if (!dropzone) return;
        dropzone.innerHTML = '';

        if (blocksData.length === 0) {
            dropzone.innerHTML = `
                <div class="empty-state-message">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#159C2A" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
                    <p>Drop content here</p>
                </div>`;
            return;
        }

        blocksData.forEach(block => {
            const el = document.createElement('div');
            el.classList.add('canvas-block');
            if (block.id === selectedBlockId) el.classList.add('selected');
            el.dataset.id = block.id;

            el.style.padding = `${block.styles.paddingTop} ${block.styles.paddingRight} ${block.styles.paddingBottom} ${block.styles.paddingLeft}`;
            el.style.textAlign = block.styles.align;
            el.style.backgroundColor = block.styles.bgColor;

            if (block.type === 'text') {
                const s = block.styles;
                const textStyles = `
                    font-family: ${s.fontFamily === 'inherit' ? 'inherit' : s.fontFamily};
                    font-size: ${s.fontSize}px;
                    font-weight: ${s.fontWeight};
                    color: ${s.color};
                    line-height: 1.5;
                    margin: 0;
                `;

                if (block.isList) {
                    const lines = block.content.split('\n').filter(line => line.trim() !== '');
                    const listItems = lines.map(line => `<li>${line}</li>`).join('');
                    // FIX: Ensure list style is visible and padded
                    el.innerHTML = `<ul style="${textStyles}; padding-left: 20px; margin: 0; text-align: ${s.align}; list-style-type: disc; list-style-position: inside;">${listItems}</ul>`;
                } else {
                    const formattedContent = block.content.replace(/\n/g, '<br>');
                    el.innerHTML = `<div class="inner-text" style="${textStyles}">${formattedContent}</div>`;
                }

            } else if (block.type === 'image') {
                el.innerHTML = `<img src="${block.content}" style="max-width: 100%; height: auto; display: inline-block;">`;
            } else if (block.type === 'button') {
                el.innerHTML = `<a href="${block.content.link}" style="display:inline-block; background:${block.styles.bgColor}; color:${block.styles.color}; padding:10px 20px; text-decoration:none; border-radius:${block.styles.borderRadius}; font-weight:bold;">${block.content.text}</a>`;
            }

            el.addEventListener('click', (e) => {
                e.stopPropagation();
                selectBlock(block.id);
            });

            dropzone.appendChild(el);
        });
    }

    function selectBlock(id) {
        selectedBlockId = id;
        renderBlocks();
        renderInspectorControls(id);
        openAccordion('acc-inspect');
    }

    // --- INSPECTOR RENDERER ---
    function renderInspectorControls(id) {
        // FIX: Ensure ID is integer when searching
        const blockId = parseInt(id);
        const block = blocksData.find(b => b.id === blockId);
        const controlsContainer = document.getElementById('inspector-controls');

        if (!block || !controlsContainer) return;

        let html = '';

        if (block.type === 'text') {
            html += `<div class="insp-section-title">TEXT BLOCK</div>`;

            html += `<div class="insp-group">
                        <label class="insp-label">Content</label>
                        <textarea class="insp-textarea" rows="4" 
                            oninput="window.updateBlock('${blockId}', 'content', this.value)">${block.content}</textarea>
                     </div>`;

            html += `<div class="insp-group flex-row-center">
                        <label class="switch">
                            <input type="checkbox" ${block.isList ? 'checked' : ''} 
                                onchange="window.updateBlock('${blockId}', 'isList', this.checked)">
                            <span class="slider round"></span>
                        </label>
                        <span class="insp-label-inline">Markdown (List)</span>
                     </div>`;

            const hasTextColor = block.styles.color && block.styles.color !== 'transparent';
            const txtPlusClass = hasTextColor ? '' : 'plus-swatch';
            const txtSvg = hasTextColor ? '' : `<svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 1V9M1 5H9" stroke="#808080" stroke-linecap="round"/></svg>`;

            html += `<div class="insp-group">
                        <label class="insp-label">Text color</label>
                        <div class="color-swatch-wrapper" data-target="inp-txt-color-${blockId}">
                            <input type="text" id="inp-txt-color-${blockId}" class="color-input-hidden" value="${block.styles.color}" oninput="window.updateBlock('${blockId}', 'styles.color', this.value)" hidden>
                            <div class="color-swatch ${txtPlusClass}" style="background-color: ${block.styles.color}">
                                ${txtSvg}
                            </div>
                        </div>
                     </div>`;

            const hasBgColor = block.styles.bgColor && block.styles.bgColor !== 'transparent';
            const bgPlusClass = hasBgColor ? '' : 'plus-swatch';
            const bgSvg = hasBgColor ? '' : `<svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 1V9M1 5H9" stroke="#808080" stroke-linecap="round"/></svg>`;
            const bgDisplayColor = block.styles.bgColor === 'transparent' ? '#fff' : block.styles.bgColor;

            html += `<div class="insp-group">
                        <label class="insp-label">Background color</label>
                        <div class="color-swatch-wrapper" data-target="inp-bg-color-${blockId}">
                            <input type="text" id="inp-bg-color-${blockId}" class="color-input-hidden" value="${block.styles.bgColor}" oninput="window.updateBlock('${blockId}', 'styles.bgColor', this.value)" hidden>
                            <div class="color-swatch ${bgPlusClass}" style="background-color: ${bgDisplayColor}">
                                 ${bgSvg}
                            </div>
                        </div>
                     </div>`;

            html += `<div class="insp-group">
                        <label class="insp-label">Font family</label>
                        <select class="insp-select" onchange="window.updateBlock('${blockId}', 'styles.fontFamily', this.value)">
                            <option value="inherit" ${block.styles.fontFamily === 'inherit' ? 'selected' : ''}>Match email settings</option>
                            <option value="'Urbanist', sans-serif" ${block.styles.fontFamily.includes('Urbanist') ? 'selected' : ''}>Urbanist</option>
                            <option value="'Open Sans', sans-serif" ${block.styles.fontFamily.includes('Open Sans') ? 'selected' : ''}>Open Sans</option>
                            <option value="'Times New Roman', serif" ${block.styles.fontFamily.includes('Times') ? 'selected' : ''}>Serif</option>
                        </select>
                     </div>`;

            html += `<div class="insp-group">
                        <label class="insp-label">Font size</label>
                        <div class="slider-row">
                            <span class="icon-label">Tt</span>
                            <input type="range" min="10" max="60" value="${block.styles.fontSize}" 
                                oninput="document.getElementById('fs-val-${blockId}').textContent = this.value + 'px'; window.updateBlock('${blockId}', 'styles.fontSize', this.value)" class="style-range">
                            <span class="val-label" id="fs-val-${blockId}">${block.styles.fontSize}px</span>
                        </div>
                     </div>`;

            html += `<div class="insp-group">
                        <label class="insp-label">Font weight</label>
                        <div class="segmented-control">
                            <button class="${block.styles.fontWeight === 'normal' ? 'active' : ''}" 
                                onclick="window.updateBlock('${blockId}', 'styles.fontWeight', 'normal')">Regular</button>
                            <button class="${block.styles.fontWeight === 'bold' ? 'active' : ''}" 
                                onclick="window.updateBlock('${blockId}', 'styles.fontWeight', 'bold')">Bold</button>
                        </div>
                     </div>`;

            html += `<div class="insp-group">
                        <label class="insp-label">Alignment</label>
                        <div class="segmented-control icon-mode">
                            <button class="${block.styles.align === 'left' ? 'active' : ''}" onclick="window.updateBlock('${blockId}', 'styles.align', 'left')">
                                <svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M0 1H14M0 5H10M0 9H14" stroke="currentColor" stroke-width="1.5"/></svg>
                            </button>
                            <button class="${block.styles.align === 'center' ? 'active' : ''}" onclick="window.updateBlock('${blockId}', 'styles.align', 'center')">
                                <svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M0 1H14M2 5H12M0 9H14" stroke="currentColor" stroke-width="1.5"/></svg>
                            </button>
                            <button class="${block.styles.align === 'right' ? 'active' : ''}" onclick="window.updateBlock('${blockId}', 'styles.align', 'right')">
                                <svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M0 1H14M4 5H14M0 9H14" stroke="currentColor" stroke-width="1.5"/></svg>
                            </button>
                        </div>
                     </div>`;

            const padSlider = (labelIcon, prop, val) => `
                <div class="slider-row compact">
                    <span class="icon-label-img">${labelIcon}</span>
                    <input type="range" min="0" max="100" value="${parseInt(val)}" 
                        oninput="document.getElementById('p-${prop}-${blockId}').textContent = this.value + 'px'; window.updateBlock('${blockId}', 'styles.${prop}', this.value + 'px')" class="style-range">
                    <span class="val-label" id="p-${prop}-${blockId}">${val}</span>
                </div>
             `;
            const iconTop = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1H11M6 3V11" stroke="#232323" stroke-width="1.5"/><path d="M1 1H11" stroke="#232323" stroke-width="2"/></svg>`;
            const iconBottom = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 11H11M6 9V1" stroke="#232323" stroke-width="1.5"/><path d="M1 11H11" stroke="#232323" stroke-width="2"/></svg>`;
            const iconLeft = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1V11M3 6H11" stroke="#232323" stroke-width="1.5"/><path d="M1 1V11" stroke="#232323" stroke-width="2"/></svg>`;
            const iconRight = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M11 1V11M9 6H1" stroke="#232323" stroke-width="1.5"/><path d="M11 1V11" stroke="#232323" stroke-width="2"/></svg>`;

            html += `<div class="insp-group">
                        <label class="insp-label">Padding</label>
                        ${padSlider(iconTop, 'paddingTop', block.styles.paddingTop)}
                        ${padSlider(iconLeft, 'paddingLeft', block.styles.paddingLeft)}
                        ${padSlider(iconRight, 'paddingRight', block.styles.paddingRight)}
                        ${padSlider(iconBottom, 'paddingBottom', block.styles.paddingBottom)}
                      </div>`;
        }
        else if (block.type === 'image') {
            html += `<div class="insp-section-title">IMAGE BLOCK</div>`;
            html += `<div class="insp-group"><label class="insp-label">Image Source URL</label><input type="text" class="insp-input" value="${block.content}" oninput="window.updateBlock('${blockId}', 'content', this.value)"></div>`;
        }
        else if (block.type === 'button') {
            html += `<div class="insp-section-title">BUTTON BLOCK</div>`;
            html += `<div class="insp-group"><label class="insp-label">Button Text</label><input type="text" class="insp-input" value="${block.content.text}" oninput="window.updateBlock('${blockId}', 'content.text', this.value)"></div>`;
            html += `<div class="insp-group"><label class="insp-label">Link URL</label><input type="text" class="insp-input" value="${block.content.link}" oninput="window.updateBlock('${blockId}', 'content.link', this.value)"></div>`;
            html += `<div class="insp-group"><label class="insp-label">Colors</label>
                        <div class="insp-row">
                            <div class="insp-col"><input type="color" value="${block.styles.bgColor}" oninput="window.updateBlock('${blockId}', 'styles.bgColor', this.value)" style="width:100%"></div>
                            <div class="insp-col"><input type="color" value="${block.styles.color}" oninput="window.updateBlock('${blockId}', 'styles.color', this.value)" style="width:100%"></div>
                        </div>
                      </div>`;
        }

        html += `<div style="margin-top:20px; padding-top:15px; border-top:1px solid #eee;">
                    <button onclick="window.deleteBlock(${blockId})" style="width:100%; color:#d32f2f; background:#FFF5F5; border:1px solid #FFCDCD; padding:8px; border-radius:4px; cursor:pointer; font-size:12px; font-weight:600;">
                        Delete Block
                    </button>
                 </div>`;

        controlsContainer.innerHTML = html;
    }

    window.updateBlock = function (id, path, value) {
        const blockId = parseInt(id);
        const block = blocksData.find(b => b.id === blockId);
        if (!block) return;

        if (path.includes('.')) {
            const [parent, child] = path.split('.');
            block[parent][child] = value;
        } else {
            block[path] = value;
        }

        renderBlocks();

        // FIX 2: Ensure ID is passed as numeric or handled correctly in render
        // Optimized: Only re-render if it's NOT a text input event (content) or slider
        // This prevents cursor jumping in textareas, but forces button updates
        if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
            renderInspectorControls(blockId);
        } else if (path === 'isList' || path.includes('styles.align') || path.includes('styles.fontWeight')) {
            // Force update for buttons even if focus is technically somewhere weird
            renderInspectorControls(blockId);
        }
    };

    window.deleteBlock = function (id) {
        blocksData = blocksData.filter(b => b.id !== id);
        const controlsContainer = document.getElementById('inspector-controls');
        if (controlsContainer) {
            controlsContainer.innerHTML = '<div class="empty-state-inspect">Element deleted. Select another.</div>';
        }
        selectedBlockId = null;
        renderBlocks();
    };

    // ===========================================
    // 6. STYLE PANEL LISTENER LOGIC
    // ===========================================
    const backdropInput = document.getElementById('style-backdrop');
    const canvasContainer = document.querySelector('.canvas-container');
    const canvasInput = document.getElementById('style-canvas');
    const paperElement = document.querySelector('.email-paper');
    const borderColorInput = document.getElementById('style-border-color');
    const radiusInput = document.getElementById('style-radius');
    const radiusVal = document.getElementById('radius-val');
    const fontInput = document.getElementById('style-font');
    const textColorInput = document.getElementById('style-text-color');

    function updateSwatch(input, swatchEl) {
        if (swatchEl) {
            swatchEl.style.backgroundColor = input.value;
            if (swatchEl.id === 'swatch-border-color') {
                swatchEl.innerHTML = '';
                swatchEl.classList.remove('plus-swatch');
            }
        }
    }

    if (backdropInput && canvasContainer) {
        backdropInput.addEventListener('input', (e) => {
            updateSwatch(e.target, document.getElementById('swatch-backdrop'));
            canvasContainer.style.backgroundColor = e.target.value;
        });
    }

    if (canvasInput && paperElement) {
        canvasInput.addEventListener('input', (e) => {
            updateSwatch(e.target, document.getElementById('swatch-canvas'));
            paperElement.style.backgroundColor = e.target.value;
        });
    }

    if (borderColorInput && paperElement) {
        borderColorInput.addEventListener('input', (e) => {
            updateSwatch(e.target, document.getElementById('swatch-border-color'));
            paperElement.style.border = `1px solid ${e.target.value}`;
        });
    }

    if (radiusInput && paperElement) {
        radiusInput.value = 0;
        if (radiusVal) radiusVal.textContent = '0px';

        radiusInput.addEventListener('input', (e) => {
            const val = e.target.value;
            if (radiusVal) radiusVal.textContent = val + 'px';
            paperElement.style.borderRadius = val + 'px';
            paperElement.style.overflow = 'hidden';
        });
    }

    if (fontInput && paperElement) {
        fontInput.addEventListener('change', (e) => {
            paperElement.style.fontFamily = e.target.value;
        });
    }

    if (textColorInput && paperElement) {
        textColorInput.addEventListener('input', (e) => {
            updateSwatch(e.target, document.getElementById('swatch-text-color'));
            paperElement.style.color = e.target.value;
            const staticElements = paperElement.querySelectorAll('.static-header, .static-footer, .footer-details p');
            staticElements.forEach(el => el.style.color = e.target.value);
        });
    }

    const burger = document.getElementById('burger');
    const closeBurger = document.getElementById('close_burger');
    const sideBar = document.querySelector('.left_cp_bar');
    const mainOverlay = document.querySelector('.overlay');

    if (burger && closeBurger && sideBar && mainOverlay) {
        burger.addEventListener('click', () => {
            sideBar.style.transform = 'translateX(0)';
            mainOverlay.style.display = 'flex';
        });
        closeBurger.addEventListener('click', () => {
            sideBar.style.transform = 'translateX(-120%)';
            mainOverlay.style.display = 'none';
        });
    }
});