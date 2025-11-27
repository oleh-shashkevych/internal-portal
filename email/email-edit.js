document.addEventListener('DOMContentLoaded', function () {
    console.log('Edit Campaign page loaded');

    // ===========================================
    // 1. CUSTOM MULTI-SELECT LOGIC (State & Income)
    // ===========================================
    const multiselects = document.querySelectorAll('.custom-multiselect');

    multiselects.forEach(ms => {
        const box = ms.querySelector('.select-box');
        const list = ms.querySelector('.options-list');
        const checkboxes = list.querySelectorAll('input[type="checkbox"]');

        // Initial text update
        updateSelectedText(ms);

        // Toggle dropdown
        box.addEventListener('click', (e) => {
            e.stopPropagation();
            // Close others
            multiselects.forEach(other => {
                if (other !== ms) other.classList.remove('open');
            });
            // Close font dropdown if open
            document.querySelectorAll('.custom-font-select').forEach(el => el.classList.remove('open'));

            ms.classList.toggle('open');
        });

        // Handle checkbox changes
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

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        // Don't close if clicking inside a custom color picker (handled separately)
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
    // 3. CUSTOM COLOR PICKER (Advanced)
    // ===========================================
    const colorWrappers = document.querySelectorAll('.color-swatch-wrapper');
    let activeColorInput = null;
    let activeSwatch = null;

    // A. Create Picker DOM dynamically
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

    // B. Elements & State
    const satBox = pickerDOM.querySelector('.cp-saturation');
    const satCursor = pickerDOM.querySelector('.cp-cursor');
    const hueBox = pickerDOM.querySelector('.cp-hue');
    const hueCursor = pickerDOM.querySelector('.cp-hue-cursor');
    const hexInput = pickerDOM.querySelector('.cp-hex-input');
    const presetsBox = pickerDOM.querySelector('.cp-presets');

    let currentHsv = { h: 0, s: 0, v: 100 };
    let isDraggingSat = false;
    let isDraggingHue = false;

    // C. Presets Generation
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
            // FIX: Apply immediately on preset click
            setColorFromHex(color);
            applyColor();
        });
        presetsBox.appendChild(div);
    });

    // D. Open Picker Logic
    colorWrappers.forEach(wrapper => {
        wrapper.addEventListener('click', (e) => {
            e.stopPropagation();

            // Close other popups
            document.querySelectorAll('.custom-multiselect').forEach(ms => ms.classList.remove('open'));
            document.querySelectorAll('.custom-font-select').forEach(el => el.classList.remove('open'));

            // Setup active context
            const inputId = wrapper.dataset.target;
            if (!inputId) return;

            activeColorInput = document.getElementById(inputId);
            activeSwatch = wrapper.querySelector('.color-swatch');

            // Init with current value
            const initialColor = activeColorInput.value || '#FFFFFF';
            setColorFromHex(initialColor);

            // Positioning
            const rect = wrapper.getBoundingClientRect();
            let top = rect.bottom + window.scrollY + 5;
            if (top + 350 > document.body.scrollHeight) {
                top = rect.top + window.scrollY - 310;
            }

            pickerDOM.style.top = `${top}px`;
            pickerDOM.style.left = `${rect.left + window.scrollX}px`;
            pickerDOM.classList.add('active');
        });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
        if (!pickerDOM.contains(e.target) && !e.target.closest('.color-swatch-wrapper')) {
            pickerDOM.classList.remove('active');
        }
        // Also close custom font dropdown
        document.querySelectorAll('.custom-font-select').forEach(el => el.classList.remove('open'));
    });

    // E. Drag Logic
    satBox.addEventListener('mousedown', (e) => {
        isDraggingSat = true;
        updateSatVal(e);
    });

    hueBox.addEventListener('mousedown', (e) => {
        isDraggingHue = true;
        updateHue(e);
    });

    document.addEventListener('mousemove', (e) => {
        if (isDraggingSat) { e.preventDefault(); updateSatVal(e); }
        if (isDraggingHue) { e.preventDefault(); updateHue(e); }
    });

    document.addEventListener('mouseup', () => {
        isDraggingSat = false;
        isDraggingHue = false;
    });

    // F. Update Functions
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

            if (activeSwatch.id === 'swatch-border-color') {
                activeSwatch.innerHTML = '';
                activeSwatch.classList.remove('plus-swatch');
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

    // --- Helpers: Color Math ---
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

        // Hide original
        select.style.display = 'none';

        // Create Custom UI
        const wrapper = document.createElement('div');
        wrapper.className = 'custom-font-select';

        // Header
        const header = document.createElement('div');
        header.className = 'font-select-header';
        const currentText = select.options[select.selectedIndex].text;
        header.innerHTML = `<span class="current-font">${currentText}</span>
                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="#232323" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

        // List
        const list = document.createElement('div');
        list.className = 'font-options-list';

        Array.from(select.options).forEach(opt => {
            const item = document.createElement('div');
            item.className = 'font-option-item';
            item.textContent = opt.text;
            item.style.fontFamily = opt.value; // Show preview in actual font

            if (opt.selected) item.classList.add('selected');

            item.addEventListener('click', (e) => {
                e.stopPropagation();
                // Update Select
                select.value = opt.value;
                select.dispatchEvent(new Event('change'));

                // Update UI
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

        // Toggle logic
        header.addEventListener('click', (e) => {
            e.stopPropagation();
            // Close other dropdowns
            document.querySelectorAll('.custom-multiselect').forEach(ms => ms.classList.remove('open'));
            wrapper.classList.toggle('open');
        });

        // Add styling dynamically if not present
        if (!document.getElementById('font-select-styles')) {
            const style = document.createElement('style');
            style.id = 'font-select-styles';
            style.innerHTML = `
                .custom-font-select {
                    position: relative;
                    width: 100%;
                    font-family: 'Urbanist', sans-serif;
                }
                .font-select-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 8px 0;
                    border-bottom: 1px solid #E0E0E0;
                    cursor: pointer;
                    font-size: 14px;
                    color: #232323;
                }
                .font-select-header:hover { border-bottom-color: #aaa; }
                .custom-font-select.open .font-select-header { border-bottom-color: #159C2A; }
                .custom-font-select.open .font-select-header svg { transform: rotate(180deg); }
                
                .font-options-list {
                    display: none;
                    position: absolute;
                    top: 100%;
                    left: 0;
                    width: 100%;
                    background: #fff;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                    border-radius: 6px;
                    z-index: 100;
                    margin-top: 5px;
                    padding: 5px 0;
                    max-height: 200px;
                    overflow-y: auto;
                }
                .custom-font-select.open .font-options-list { display: block; }
                
                .font-option-item {
                    padding: 10px 15px;
                    cursor: pointer;
                    font-size: 14px;
                    color: #232323;
                }
                .font-option-item:hover { background-color: #F5F5F5; }
                .font-option-item.selected { color: #159C2A; font-weight: 600; background-color: #E8F6EA; }
            `;
            document.head.appendChild(style);
        }
    }

    // Call init
    initCustomFontSelect();


    // ===========================================
    // 5. BUILDER LOGIC (UPDATED WITH ACCORDION)
    // ===========================================

    let blocksData = [];
    let selectedBlockId = null;

    const dropzone = document.getElementById('dynamic-builder-area');
    const sidebarTabs = document.querySelectorAll('.sb-tab');

    // --- ACCORDION LOGIC ---
    const accHeaders = document.querySelectorAll('.sb-accordion-header');

    accHeaders.forEach(header => {
        header.addEventListener('click', () => {
            // Toggle active class on header
            header.classList.toggle('active');

            // Toggle body
            const targetId = header.dataset.target;
            const body = document.getElementById(targetId);
            if (body) {
                body.classList.toggle('open');
            }
        });
    });

    // Helper to open a specific accordion (used when selecting blocks)
    function openAccordion(id) {
        const body = document.getElementById(id);
        const header = document.querySelector(`.sb-accordion-header[data-target="${id}"]`);

        if (body && !body.classList.contains('open')) {
            body.classList.add('open');
        }
        if (header && !header.classList.contains('active')) {
            header.classList.add('active');
        }
    }

    // --- Tab Switching (Content / Style) ---
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
            styles: getDefaultStyles(type)
        };
        blocksData.push(newBlock);
        renderBlocks();
        selectBlock(newBlock.id);
    }

    function getDefaultContent(type) {
        if (type === 'text') return '<h3>Hello World</h3><p>Edit this text in the sidebar.</p>';
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
            align: 'center'
        };
        if (type === 'button') {
            return { ...base, bgColor: '#159C2A', color: '#FFFFFF', borderRadius: '4px' };
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

            if (block.type === 'text') {
                el.innerHTML = `<div class="inner-text">${block.content}</div>`;
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

        // 1. Populate Inspect Panel
        renderInspectorControls(id);

        // 2. Automatically open Inspect Accordion
        openAccordion('acc-inspect');
    }

    function renderInspectorControls(id) {
        const block = blocksData.find(b => b.id === id);
        // Target the NEW container inside the accordion
        const controlsContainer = document.getElementById('inspector-controls');

        if (!block || !controlsContainer) return;

        let html = '';

        // -- Specific Controls --
        if (block.type === 'text') {
            html += `<div class="insp-group">
                        <label class="insp-label">Text Content</label>
                        <textarea class="insp-textarea" rows="4" oninput="window.updateBlock('${id}', 'content', this.value)">${block.content}</textarea>
                     </div>`;
        }
        else if (block.type === 'image') {
            html += `<div class="insp-group">
                        <label class="insp-label">Image Source URL</label>
                        <input type="text" class="insp-input" value="${block.content}" oninput="window.updateBlock('${id}', 'content', this.value)">
                     </div>`;
        }
        else if (block.type === 'button') {
            html += `<div class="insp-group">
                        <label class="insp-label">Button Label</label>
                        <input type="text" class="insp-input" value="${block.content.text}" oninput="window.updateBlock('${id}', 'content.text', this.value)">
                     </div>
                     <div class="insp-group">
                        <label class="insp-label">Link URL</label>
                        <input type="text" class="insp-input" value="${block.content.link}" oninput="window.updateBlock('${id}', 'content.link', this.value)">
                     </div>
                     <div class="insp-row">
                        <div class="insp-col"><label class="insp-label">BG Color</label><input type="color" value="${block.styles.bgColor}" oninput="window.updateBlock('${id}', 'styles.bgColor', this.value)" style="width:100%"></div>
                        <div class="insp-col"><label class="insp-label">Text Color</label><input type="color" value="${block.styles.color}" oninput="window.updateBlock('${id}', 'styles.color', this.value)" style="width:100%"></div>
                     </div>`;
        }

        // -- Alignment --
        html += `<div class="insp-group">
                    <label class="insp-label">Alignment</label>
                    <div class="btn-group-align">
                    <button class="align-btn ${block.styles.align === 'left' ? 'active' : ''}" onclick="window.updateBlock('${id}', 'styles.align', 'left')">L</button>
                    <button class="align-btn ${block.styles.align === 'center' ? 'active' : ''}" onclick="window.updateBlock('${id}', 'styles.align', 'center')">C</button>
                    <button class="align-btn ${block.styles.align === 'right' ? 'active' : ''}" onclick="window.updateBlock('${id}', 'styles.align', 'right')">R</button>
                    </div>
                 </div>`;

        // -- Delete Button --
        html += `<div style="margin-top:15px; padding-top:15px; border-top:1px solid #eee; text-align:right;">
                    <button onclick="window.deleteBlock(${id})" style="color:#d32f2f; background:none; border:none; cursor:pointer; font-size:12px; font-weight:600;">
                        Delete Element
                    </button>
                 </div>`;

        controlsContainer.innerHTML = html;
    }

    // Global helpers attached to window
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
    };

    window.deleteBlock = function (id) {
        blocksData = blocksData.filter(b => b.id !== id);

        // Reset Inspector
        const controlsContainer = document.getElementById('inspector-controls');
        if (controlsContainer) {
            controlsContainer.innerHTML = '<div class="empty-state-inspect">Element deleted. Select another.</div>';
        }

        selectedBlockId = null; // Deselect
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
    const borderSwatch = document.getElementById('swatch-border-color');

    const radiusInput = document.getElementById('style-radius');
    const radiusVal = document.getElementById('radius-val');

    const fontInput = document.getElementById('style-font');

    const textColorInput = document.getElementById('style-text-color');
    const textSwatch = document.getElementById('swatch-text-color');

    // Helper
    function updateSwatch(input, swatchEl) {
        if (swatchEl) {
            swatchEl.style.backgroundColor = input.value;
            if (swatchEl.id === 'swatch-border-color') {
                swatchEl.innerHTML = '';
                swatchEl.classList.remove('plus-swatch');
            }
        }
    }

    // 1. Backdrop
    if (backdropInput && canvasContainer) {
        backdropInput.addEventListener('input', (e) => {
            updateSwatch(e.target, document.getElementById('swatch-backdrop'));
            canvasContainer.style.backgroundColor = e.target.value;
        });
    }

    // 2. Canvas Color
    if (canvasInput && paperElement) {
        canvasInput.addEventListener('input', (e) => {
            updateSwatch(e.target, document.getElementById('swatch-canvas'));
            paperElement.style.backgroundColor = e.target.value;
        });
    }

    // 3. Border Color
    if (borderColorInput && paperElement) {
        borderColorInput.addEventListener('input', (e) => {
            updateSwatch(e.target, document.getElementById('swatch-border-color'));
            paperElement.style.border = `1px solid ${e.target.value}`;
        });
    }

    // 4. Border Radius
    if (radiusInput && paperElement) {
        // Fix: Force slider to 0 on load to prevent browser caching/defaulting to middle
        radiusInput.value = 0;
        if (radiusVal) radiusVal.textContent = '0px';

        radiusInput.addEventListener('input', (e) => {
            const val = e.target.value;
            if (radiusVal) radiusVal.textContent = val + 'px';
            paperElement.style.borderRadius = val + 'px';
            paperElement.style.overflow = 'hidden';
        });
    }

    // 5. Font Family
    if (fontInput && paperElement) {
        fontInput.addEventListener('change', (e) => {
            paperElement.style.fontFamily = e.target.value;
        });
    }

    // 6. Text Color
    if (textColorInput && paperElement) {
        textColorInput.addEventListener('input', (e) => {
            updateSwatch(e.target, document.getElementById('swatch-text-color'));
            paperElement.style.color = e.target.value;
            const staticElements = paperElement.querySelectorAll('.static-header, .static-footer, .footer-details p');
            staticElements.forEach(el => el.style.color = e.target.value);
        });
    }

    // Sidebar Toggler
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