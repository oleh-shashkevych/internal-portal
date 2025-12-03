document.addEventListener('DOMContentLoaded', function () {
    console.log('Edit Campaign page loaded');

    // ===========================================
    // 0. GLOBAL VARIABLES & STATE
    // ===========================================
    let blocksData = [];
    let selectedBlockId = null;
    let dragSrcIndex = null;
    let isPreviewMode = false;

    // History State
    const historyStack = [];
    let historyStep = -1;
    const MAX_HISTORY = 50;

    // DOM Elements
    const dropzone = document.getElementById('dynamic-builder-area');
    const paperElement = document.querySelector('.email-paper');
    const canvasContainer = document.querySelector('.canvas-container');

    // Create Code Editor Area (PRE tag) inside Canvas dynamically
    const codeEditor = document.createElement('pre');
    codeEditor.id = 'canvas-code-editor';
    canvasContainer.appendChild(codeEditor);

    // ===========================================
    // 1. HELPER FUNCTIONS (COLOR MATH)
    // ===========================================
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
        if (hex.startsWith('#')) hex = hex.slice(1);

        if (hex.length === 3) {
            r = parseInt(hex[0] + hex[0], 16);
            g = parseInt(hex[1] + hex[1], 16);
            b = parseInt(hex[2] + hex[2], 16);
        } else if (hex.length === 6) {
            r = parseInt(hex.substring(0, 2), 16);
            g = parseInt(hex.substring(2, 4), 16);
            b = parseInt(hex.substring(4, 6), 16);
        } else {
            return { h: 0, s: 0, v: 100 };
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
    // 2. HISTORY MANAGEMENT & TOOLBAR
    // ===========================================
    function saveHistory() {
        if (historyStep < historyStack.length - 1) {
            historyStack.splice(historyStep + 1);
        }
        const state = JSON.stringify(blocksData);
        historyStack.push(state);
        if (historyStack.length > MAX_HISTORY) {
            historyStack.shift();
        } else {
            historyStep++;
        }
    }

    function undo() {
        if (historyStep > 0) {
            historyStep--;
            blocksData = JSON.parse(historyStack[historyStep]);
            selectedBlockId = null;
            renderBlocks();
            updateInspectorState();
        }
    }

    function redo() {
        if (historyStep < historyStack.length - 1) {
            historyStep++;
            blocksData = JSON.parse(historyStack[historyStep]);
            selectedBlockId = null;
            renderBlocks();
            updateInspectorState();
        }
    }

    function updateInspectorState() {
        const container = document.getElementById('inspector-controls');
        if (container && selectedBlockId === null) {
            container.innerHTML = '<div class="empty-state-inspect">Select an element to edit.</div>';
        } else if (selectedBlockId) {
            renderInspectorControls(selectedBlockId);
        }
    }

    // Toolbar Listeners
    const tools = document.querySelectorAll('.tool-btn');
    tools.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const mode = btn.dataset.mode;
            const title = btn.getAttribute('title');

            // Handle Mode Switching
            if (mode) {
                document.querySelectorAll('.tool-btn[data-mode]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Reset States
                isPreviewMode = false;
                paperElement.classList.remove('preview-active');
                canvasContainer.classList.remove('mode-code');

                if (mode === 'edit') {
                    renderBlocks();
                    if (blocksData.length > 0) selectBlock(blocksData[0].id);
                    else {
                        selectedBlockId = null;
                        updateInspectorState();
                    }
                }
                else if (mode === 'preview') {
                    isPreviewMode = true;
                    selectedBlockId = null;
                    paperElement.classList.add('preview-active');
                    renderBlocks();
                    updateInspectorState();
                }
                else if (mode === 'code') {
                    selectedBlockId = null; // Deselect
                    updateInspectorState(); // Clear inspector
                    canvasContainer.classList.add('mode-code');
                    codeEditor.textContent = generateEmailHtml();
                }
                else if (mode === 'json') {
                    selectedBlockId = null; // Deselect
                    updateInspectorState(); // Clear inspector
                    canvasContainer.classList.add('mode-code');
                    const exportData = {
                        root: {
                            type: "EmailLayout",
                            data: {
                                backdropColor: document.getElementById('style-backdrop').value,
                                canvasColor: document.getElementById('style-canvas').value,
                                fontFamily: document.getElementById('style-font').value,
                                childrenIds: blocksData.map(b => `block-${b.id}`)
                            }
                        },
                        blocks: blocksData.reduce((acc, block) => {
                            acc[`block-${block.id}`] = block;
                            return acc;
                        }, {})
                    };
                    codeEditor.textContent = JSON.stringify(exportData, null, 2);
                }
            }
            else if (title === 'Undo') {
                undo();
            }
            else if (title === 'Redo') {
                redo();
            }
        });
    });

    function generateEmailHtml() {
        const bg = document.getElementById('style-backdrop').value;
        const canvasBg = document.getElementById('style-canvas').value;
        const fontFamily = document.getElementById('style-font').value;
        const textColor = document.getElementById('style-text-color').value;
        const borderRadius = document.getElementById('style-radius').value;

        let html = `<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 0; background-color: ${bg};">
    <div style="background-color: ${bg}; font-family: ${fontFamily}; color: ${textColor}; padding: 40px 0;">
        <table align="center" width="100%" style="max-width: 600px; background-color: ${canvasBg}; margin: 0 auto; border-collapse: collapse; border-radius: ${borderRadius}px; overflow: hidden;">
            <tbody>
                <tr>
                    <td style="padding: 0;">\n`;

        blocksData.forEach(block => {
            const pTop = block.styles.paddingTop;
            const pBottom = block.styles.paddingBottom;
            const pLeft = block.styles.paddingLeft;
            const pRight = block.styles.paddingRight;
            const align = block.styles.align;
            const bgCol = block.styles.bgColor === 'transparent' ? 'transparent' : block.styles.bgColor;

            const wrapperStyle = `padding: ${pTop} ${pRight} ${pBottom} ${pLeft}; background-color: ${bgCol}; text-align: ${align};`;

            html += `                        \n`;
            html += `                        <div style="${wrapperStyle}">\n`;

            if (block.type === 'text') {
                const s = block.styles;
                const fontStyle = `font-family: ${s.fontFamily === 'inherit' ? 'inherit' : s.fontFamily}; font-size: ${s.fontSize}px; font-weight: ${s.fontWeight}; color: ${s.color}; line-height: 1.5; margin: 0;`;

                if (block.isList) {
                    html += `                            <ul style="${fontStyle} padding-left: 20px; margin: 0; list-style-position: inside;">\n`;
                    block.content.split('\n').forEach(line => {
                        if (line.trim()) html += `                                <li>${line}</li>\n`;
                    });
                    html += `                            </ul>\n`;
                } else {
                    html += `                            <div style="${fontStyle}">${block.content.replace(/\n/g, '<br>')}</div>\n`;
                }
            }
            else if (block.type === 'image') {
                const s = block.styles;
                const imgStyle = `max-width: 100%; width: ${s.width}; height: ${s.height}; display: inline-block; vertical-align: ${s.verticalAlign || 'middle'}; object-fit: ${s.objectFit || 'fill'};`;

                if (block.content.link) {
                    html += `                            <a href="${block.content.link}" target="_blank"><img src="${block.content.url}" alt="${block.content.alt}" style="${imgStyle}" border="0"></a>\n`;
                } else {
                    html += `                            <img src="${block.content.url}" alt="${block.content.alt}" style="${imgStyle}" border="0">\n`;
                }
            }
            else if (block.type === 'button') {
                const s = block.styles;
                let btnRadius = '4px';
                if (s.btnStyle === 'rectangle') btnRadius = '0px';
                if (s.btnStyle === 'pill') btnRadius = '50px';

                const widthStyle = s.widthMode === 'full' ? '100%' : 'auto';
                const displayStyle = s.widthMode === 'full' ? 'block' : 'inline-block';

                let pad = '12px 24px';
                if (s.btnSize === 'xs') pad = '6px 12px';
                if (s.btnSize === 'sm') pad = '8px 16px';
                if (s.btnSize === 'lg') pad = '16px 32px';

                const btnStyle = `display: ${displayStyle}; width: ${widthStyle}; background-color: ${s.buttonColor}; color: ${s.color}; padding: ${pad}; text-decoration: none; border-radius: ${btnRadius}; font-family: ${s.fontFamily === 'inherit' ? 'inherit' : s.fontFamily}; font-size: ${s.fontSize}px; font-weight: ${s.fontWeight}; text-align: center; box-sizing: border-box;`;

                html += `                            <a href="${block.content.link}" target="_blank" style="${btnStyle}">${block.content.text}</a>\n`;
            }

            html += `                        </div>\n`;
        });

        html += `                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</body>
</html>`;
        return html;
    }

    // ===========================================
    // 3. CUSTOM UI LOGIC (Multiselect, Date, Color)
    // ===========================================

    // Multiselect
    const multiselects = document.querySelectorAll('.custom-multiselect');
    multiselects.forEach(ms => {
        const box = ms.querySelector('.select-box');
        const list = ms.querySelector('.options-list');
        const checkboxes = list.querySelectorAll('input[type="checkbox"]');
        updateSelectedText(ms);
        box.addEventListener('click', (e) => {
            e.stopPropagation();
            multiselects.forEach(other => { if (other !== ms) other.classList.remove('open'); });
            document.querySelectorAll('.custom-font-select').forEach(el => el.classList.remove('open'));
            ms.classList.toggle('open');
        });
        checkboxes.forEach(cb => cb.addEventListener('change', () => updateSelectedText(ms)));
        list.addEventListener('click', (e) => e.stopPropagation());
    });

    // Close multiselects when clicking outside
    document.addEventListener('click', function () {
        document.querySelectorAll('.custom-multiselect').forEach(ms => {
            ms.classList.remove('open');
        });
    });

    function updateSelectedText(container) {
        const checkboxes = container.querySelectorAll('input[type="checkbox"]:checked');
        const displaySpan = container.querySelector('.selected-text');
        if (checkboxes.length === 0) {
            displaySpan.textContent = "Select options";
            displaySpan.style.color = "#808080";
        } else if (checkboxes.length === 1) {
            displaySpan.textContent = checkboxes[0].parentElement.querySelector('.option-label').textContent;
            displaySpan.style.color = "#232323";
        } else {
            displaySpan.textContent = `${checkboxes.length} items selected`;
            displaySpan.style.color = "#232323";
        }
    }

    // Date Picker
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
            inline: true, dateFormat: "Y-m-d", defaultDate: "today",
            onChange: function (selectedDates) {
                if (selectedDates.length > 0) { selectedDateObj = selectedDates[0]; updatePreviewText(); }
            }
        });
        dateTrigger.addEventListener('click', () => { overlay.classList.add('active'); updatePreviewText(); });
        function closeModal() { overlay.classList.remove('active'); }
        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
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

    // Color Picker
    let activeColorInput = null;
    let activeSwatch = null;
    const pickerDOM = document.createElement('div');
    pickerDOM.className = 'cp-popup';
    pickerDOM.innerHTML = `
        <div class="cp-saturation"><div class="cp-saturation-white"></div><div class="cp-saturation-black"></div><div class="cp-cursor"></div></div>
        <div class="cp-hue"><div class="cp-hue-cursor"></div></div>
        <div class="cp-presets"></div>
        <div class="cp-hex-wrapper"><span class="cp-hex-prefix">#</span><input type="text" class="cp-hex-input" maxlength="6"></div>
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

    function setColorFromHex(hex) {
        currentHsv = hexToHsv(hex);
        updateUI();
        if (activeColorInput) hexInput.value = hex.replace('#', '');
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
            if (activeSwatch.classList.contains('plus-swatch')) {
                activeSwatch.classList.remove('plus-swatch');
                activeSwatch.innerHTML = '';
            }
            activeColorInput.dispatchEvent(new Event('input'));
        }
    }
    function updateSatVal(e) {
        const rect = satBox.getBoundingClientRect();
        let x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        let y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
        currentHsv.s = (x / rect.width) * 100;
        currentHsv.v = 100 - (y / rect.height) * 100;
        updateUI(); applyColor();
    }
    function updateHue(e) {
        const rect = hueBox.getBoundingClientRect();
        let x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        currentHsv.h = (x / rect.width) * 360;
        updateUI(); applyColor();
    }

    const presetColors = ['#D32F2F', '#C2185B', '#7B1FA2', '#512DA8', '#303F9F', '#1976D2', '#0288D1', '#0097A7', '#00796B', '#388E3C', '#689F38', '#AFB42B', '#FBC02D', '#FFA000', '#F57C00', '#E64A19', '#5D4037', '#616161', '#455A64', '#000000', '#FFFFFF', '#159C2A', '#E8F6EA', '#F5F5F5'];
    presetColors.forEach(color => {
        const div = document.createElement('div');
        div.className = 'cp-preset-color';
        div.style.backgroundColor = color;
        div.addEventListener('click', () => {
            setColorFromHex(color);
            applyColor();
            saveHistory();
        });
        presetsBox.appendChild(div);
    });

    document.addEventListener('click', (e) => {
        const wrapper = e.target.closest('.color-swatch-wrapper');
        if (!wrapper && !pickerDOM.contains(e.target)) {
            pickerDOM.classList.remove('active');
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
            if (top + 350 > document.body.scrollHeight) top = rect.top + window.scrollY - 310;
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
        if (isDraggingSat || isDraggingHue) {
            isDraggingSat = false;
            isDraggingHue = false;
            saveHistory();
        }
    });
    hexInput.addEventListener('change', () => {
        let val = hexInput.value;
        if (!val.startsWith('#')) val = '#' + val;
        if (/^#[0-9A-F]{6}$/i.test(val)) {
            setColorFromHex(val);
            applyColor();
            saveHistory();
        }
    });

    // Font Select
    function initCustomFontSelect() {
        const select = document.getElementById('style-font');
        if (!select) return;
        select.style.display = 'none';
        const wrapper = document.createElement('div');
        wrapper.className = 'custom-font-select';
        const header = document.createElement('div');
        header.className = 'font-select-header';
        const currentText = select.options[select.selectedIndex].text;
        header.innerHTML = `<span class="current-font">${currentText}</span><svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="#232323" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
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
            style.innerHTML = `.custom-font-select { position: relative; width: 100%; font-family: 'Urbanist', sans-serif; } .font-select-header { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #E0E0E0; cursor: pointer; font-size: 14px; color: #232323; } .font-select-header:hover { border-bottom-color: #aaa; } .custom-font-select.open .font-select-header { border-bottom-color: #159C2A; } .custom-font-select.open .font-select-header svg { transform: rotate(180deg); } .font-options-list { display: none; position: absolute; top: 100%; left: 0; width: 100%; background: #fff; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border-radius: 6px; z-index: 100; margin-top: 5px; padding: 5px 0; max-height: 200px; overflow-y: auto; } .custom-font-select.open .font-options-list { display: block; } .font-option-item { padding: 10px 15px; cursor: pointer; font-size: 14px; color: #232323; } .font-option-item:hover { background-color: #F5F5F5; } .font-option-item.selected { color: #159C2A; font-weight: 600; background-color: #E8F6EA; }`;
            document.head.appendChild(style);
        }
    }
    initCustomFontSelect();

    // ===========================================
    // 5. BUILDER LOGIC
    // ===========================================

    saveHistory();

    const sidebarTabs = document.querySelectorAll('.sb-tab');
    const accHeaders = document.querySelectorAll('.sb-accordion-header');

    accHeaders.forEach(header => {
        header.addEventListener('click', () => {
            header.classList.toggle('active');
            const body = document.getElementById(header.dataset.target);
            if (body) body.classList.toggle('open');
        });
    });

    function openAccordion(id) {
        const body = document.getElementById(id);
        const header = document.querySelector(`.sb-accordion-header[data-target="${id}"]`);
        if (body && !body.classList.contains('open')) body.classList.add('open');
        if (header && !header.classList.contains('active')) header.classList.add('active');
    }

    if (sidebarTabs.length > 0) {
        sidebarTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                sidebarTabs.forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.sb-panel').forEach(p => p.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById(tab.dataset.target).classList.add('active');
            });
        });
    }

    const draggables = document.querySelectorAll('.draggable-item');
    draggables.forEach(item => {
        item.addEventListener('dragstart', (e) => e.dataTransfer.setData('type', item.dataset.type));
    });

    if (dropzone) {
        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (isPreviewMode) return;
            if (!e.dataTransfer.types.includes('sort/type')) {
                dropzone.classList.add('drag-active');
                return;
            }
            const draggingEl = document.querySelector('.dragging');
            if (draggingEl) {
                const afterElement = getDragAfterElement(dropzone, e.clientY);
                if (afterElement == null) dropzone.appendChild(draggingEl);
                else dropzone.insertBefore(draggingEl, afterElement);
            }
        });

        dropzone.addEventListener('dragleave', () => dropzone.classList.remove('drag-active'));

        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.classList.remove('drag-active');
            if (isPreviewMode) return;
            if (!e.dataTransfer.types.includes('sort/type')) {
                const type = e.dataTransfer.getData('type');
                if (type) addBlock(type);
            }
        });
    }

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.canvas-block:not(.dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) return { offset: offset, element: child };
            else return closest;
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    function reorderBlocksData() {
        const currentIds = Array.from(document.querySelectorAll('.canvas-block')).map(el => parseInt(el.dataset.id));
        const newBlocksData = [];
        currentIds.forEach(id => {
            const block = blocksData.find(b => b.id === id);
            if (block) newBlocksData.push(block);
        });
        blocksData = newBlocksData;
        saveHistory();
    }

    function addBlock(type) {
        const newBlock = {
            id: Date.now(),
            type: type,
            content: getDefaultContent(type),
            isList: false,
            styles: getDefaultStyles(type)
        };
        blocksData.push(newBlock);
        saveHistory();
        renderBlocks();
        selectBlock(newBlock.id);
    }

    window.insertBlock = function (type, prevIndex) {
        const newBlock = {
            id: Date.now(),
            type: type,
            content: getDefaultContent(type),
            isList: false,
            styles: getDefaultStyles(type)
        };
        blocksData.splice(prevIndex + 1, 0, newBlock);
        saveHistory();
        renderBlocks();
        selectBlock(newBlock.id);
        document.querySelectorAll('.quick-add-menu').forEach(m => m.classList.remove('active'));
    };

    function getDefaultContent(type) {
        if (type === 'text') return 'My new text block\nSecond line';
        if (type === 'image') return { url: '../assets/images/logo_placeholder.svg', alt: 'Sample product', link: '' };
        if (type === 'button') return { text: 'Button', link: 'https://example.com' };
        return '';
    }

    function getDefaultStyles(type) {
        const base = { paddingTop: '10px', paddingBottom: '10px', paddingLeft: '20px', paddingRight: '20px', align: 'left', fontFamily: 'inherit', fontSize: '16', fontWeight: 'normal', color: '#232323', bgColor: 'transparent' };
        if (type === 'button') {
            return { ...base, align: 'center', buttonColor: '#808080', color: '#FFFFFF', widthMode: 'auto', btnSize: 'md', btnStyle: 'rounded', paddingTop: '10px', paddingBottom: '10px', bgColor: 'transparent' };
        }
        if (type === 'image') {
            return { ...base, align: 'center', width: 'auto', height: 'auto', verticalAlign: 'middle', objectFit: 'fill', bgColor: 'transparent' };
        }
        return base;
    }

    function renderBlocks() {
        if (!dropzone) return;
        if (document.querySelector('.dragging')) return;
        dropzone.innerHTML = '';

        if (blocksData.length === 0) {
            dropzone.innerHTML = `<div class="empty-state-message"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#159C2A" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg><p>Drop content here</p></div>`;
            return;
        }

        blocksData.forEach((block, index) => {
            const el = document.createElement('div');
            el.classList.add('canvas-block');
            if (block.id === selectedBlockId) el.classList.add('selected');
            el.dataset.id = block.id;
            el.dataset.index = index;

            el.style.padding = `${block.styles.paddingTop} ${block.styles.paddingRight} ${block.styles.paddingBottom} ${block.styles.paddingLeft}`;
            el.style.textAlign = block.styles.align;
            el.style.backgroundColor = block.styles.bgColor;

            if (block.type === 'text') {
                const s = block.styles;
                const textStyles = `font-family: ${s.fontFamily === 'inherit' ? 'inherit' : s.fontFamily}; font-size: ${s.fontSize}px; font-weight: ${s.fontWeight}; color: ${s.color}; line-height: 1.5; margin: 0;`;
                if (block.isList) {
                    const lines = block.content.split('\n').filter(line => line.trim() !== '');
                    const listItems = lines.map(line => `<li>${line}</li>`).join('');
                    el.innerHTML = `<ul style="${textStyles}; padding-left: 30px; margin-left: 0; text-align: ${s.align}; list-style-type: disc; list-style-position: inside;">${listItems}</ul>`;
                } else {
                    const formattedContent = block.content.replace(/\n/g, '<br>');
                    el.innerHTML = `<div class="inner-text" style="${textStyles}">${formattedContent}</div>`;
                }
            } else if (block.type === 'image') {
                let objPos = 'center';
                if (block.styles.verticalAlign === 'top') objPos = 'top';
                if (block.styles.verticalAlign === 'bottom') objPos = 'bottom';
                const imgStyle = `max-width: 100%; width: ${block.styles.width}; height: ${block.styles.height}; display: inline-block; vertical-align: ${block.styles.verticalAlign || 'middle'}; object-fit: ${block.styles.objectFit || 'fill'}; object-position: ${objPos};`;
                let imgHtml = `<img src="${block.content.url}" alt="${block.content.alt}" style="${imgStyle}">`;
                if (block.content.link) el.innerHTML = `<a href="${block.content.link}" target="_blank" style="display: inline-block;">${imgHtml}</a>`;
                else el.innerHTML = imgHtml;
            } else if (block.type === 'button') {
                let btnPad = '12px 24px';
                if (block.styles.btnSize === 'xs') btnPad = '6px 12px';
                if (block.styles.btnSize === 'sm') btnPad = '8px 16px';
                if (block.styles.btnSize === 'md') btnPad = '12px 24px';
                if (block.styles.btnSize === 'lg') btnPad = '16px 32px';
                let borderRadius = '4px';
                if (block.styles.btnStyle === 'rectangle') borderRadius = '0px';
                if (block.styles.btnStyle === 'rounded') borderRadius = '4px';
                if (block.styles.btnStyle === 'pill') borderRadius = '50px';
                const displayType = block.styles.widthMode === 'full' ? 'block' : 'inline-block';
                const widthStyle = block.styles.widthMode === 'full' ? '100%' : 'auto';
                const btnStyle = `display: ${displayType}; width: ${widthStyle}; background-color: ${block.styles.buttonColor}; color: ${block.styles.color}; padding: ${btnPad}; text-decoration: none; border-radius: ${borderRadius}; font-family: ${block.styles.fontFamily === 'inherit' ? 'inherit' : block.styles.fontFamily}; font-size: ${block.styles.fontSize}px; font-weight: ${block.styles.fontWeight}; text-align: ${block.styles.align}; border: none; cursor: pointer; box-sizing: border-box;`;

                // ПРАВКА 1: Прибрано onclick="event.preventDefault();" з HTML рядка нижче
                el.innerHTML = `<a href="${block.content.link}" style="${btnStyle}" target="_blank">${block.content.text}</a>`;
            }

            // ПРАВКА 2: Додана логіка для блокування всіх посилань у режимі редагування
            const links = el.querySelectorAll('a');
            links.forEach(link => {
                link.addEventListener('click', (e) => {
                    // Якщо ми НЕ в режимі перегляду (тобто в режимі редагування)
                    if (!isPreviewMode) {
                        e.preventDefault(); // Забороняємо перехід по посиланню
                        // Ми НЕ робимо stopPropagation(), щоб клік піднявся до el і спрацював selectBlock
                    }
                });
            });

            if (!isPreviewMode && block.id === selectedBlockId) {
                const handle = document.createElement('div');
                handle.className = 'block-handle';
                handle.draggable = true;
                handle.innerHTML = `<svg width="4" height="16" viewBox="0 0 4 16" fill="none"><circle cx="2" cy="2" r="2" fill="white"/><circle cx="2" cy="8" r="2" fill="white"/><circle cx="2" cy="14" r="2" fill="white"/></svg>`;
                handle.addEventListener('dragstart', (e) => {
                    e.stopPropagation();
                    e.dataTransfer.setData('sort/type', 'block-sort');
                    e.dataTransfer.effectAllowed = 'move';
                    setTimeout(() => el.classList.add('dragging'), 0);
                });
                handle.addEventListener('dragend', (e) => {
                    el.classList.remove('dragging');
                    reorderBlocksData();
                });
                el.appendChild(handle);

                const addBtn = document.createElement('div');
                addBtn.className = 'block-add-trigger';
                addBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1V11M1 6H11" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>`;
                const menu = document.createElement('div');
                menu.className = 'quick-add-menu';
                menu.innerHTML = `
                    <div class="quick-add-item" onclick="window.insertBlock('image', ${index})"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg><span>Image</span></div>
                    <div class="quick-add-item" onclick="window.insertBlock('text', ${index})"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="15" y2="12"></line><line x1="3" y1="18" x2="18" y2="18"></line></svg><span>Text</span></div>
                    <div class="quick-add-item" onclick="window.insertBlock('button', ${index})"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="8" width="16" height="8" rx="2"></rect></svg><span>Button</span></div>
                `;
                addBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    document.querySelectorAll('.quick-add-menu').forEach(m => m.classList.remove('active'));
                    menu.classList.toggle('active');
                });
                menu.addEventListener('click', (e) => e.stopPropagation());
                el.appendChild(addBtn);
                el.appendChild(menu);
            }

            el.addEventListener('click', (e) => {
                if (isPreviewMode) return;
                e.stopPropagation();
                document.querySelectorAll('.quick-add-menu').forEach(m => m.classList.remove('active'));
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

    function renderInspectorControls(id) {
        const blockId = parseInt(id);
        const block = blocksData.find(b => b.id === blockId);
        const controlsContainer = document.getElementById('inspector-controls');
        if (!block || !controlsContainer) return;

        let html = '';
        const padSlider = (labelIcon, prop, val) => `<div class="slider-row compact"><span class="icon-label-img">${labelIcon}</span><input type="range" min="0" max="100" value="${parseInt(val)}" oninput="document.getElementById('p-${prop}-${blockId}').textContent = this.value + 'px'; window.updateBlock('${blockId}', 'styles.${prop}', this.value + 'px', false)" class="style-range"><span class="val-label" id="p-${prop}-${blockId}">${val}</span></div>`;
        const iconTop = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1H11M6 3V11" stroke="#232323" stroke-width="1.5"/><path d="M1 1H11" stroke="#232323" stroke-width="2"/></svg>`;
        const iconBottom = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 11H11M6 9V1" stroke="#232323" stroke-width="1.5"/><path d="M1 11H11" stroke="#232323" stroke-width="2"/></svg>`;
        const iconLeft = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1V11M3 6H11" stroke="#232323" stroke-width="1.5"/><path d="M1 1V11" stroke="#232323" stroke-width="2"/></svg>`;
        const iconRight = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M11 1V11M9 6H1" stroke="#232323" stroke-width="1.5"/><path d="M11 1V11" stroke="#232323" stroke-width="2"/></svg>`;

        const renderAlignControl = (alignVal) => `<div class="insp-group"><label class="insp-label">Alignment</label><div class="segmented-control icon-mode"><button class="${alignVal === 'left' ? 'active' : ''}" onclick="window.updateBlock('${blockId}', 'styles.align', 'left')"><svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M0 1H14M0 5H10M0 9H14" stroke="currentColor" stroke-width="1.5"/></svg></button><button class="${alignVal === 'center' ? 'active' : ''}" onclick="window.updateBlock('${blockId}', 'styles.align', 'center')"><svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M0 1H14M2 5H12M0 9H14" stroke="currentColor" stroke-width="1.5"/></svg></button><button class="${alignVal === 'right' ? 'active' : ''}" onclick="window.updateBlock('${blockId}', 'styles.align', 'right')"><svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M0 1H14M4 5H14M0 9H14" stroke="currentColor" stroke-width="1.5"/></svg></button></div></div>`;

        const renderBgColor = (bgVal) => {
            const hasBgColor = bgVal && bgVal !== 'transparent';
            const bgPlusClass = hasBgColor ? '' : 'plus-swatch';
            const bgSvg = hasBgColor ? '' : `<svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 1V9M1 5H9" stroke="#808080" stroke-linecap="round"/></svg>`;
            const bgDisplayColor = bgVal === 'transparent' ? '#fff' : bgVal;
            return `<div class="insp-group"><label class="insp-label">Background color</label><div class="color-swatch-wrapper" data-target="inp-bg-color-${blockId}"><input type="text" id="inp-bg-color-${blockId}" class="color-input-hidden" value="${bgVal}" oninput="window.updateBlock('${blockId}', 'styles.bgColor', this.value, false)" hidden><div class="color-swatch ${bgPlusClass}" style="background-color: ${bgDisplayColor}">${bgSvg}</div></div></div>`;
        };

        const renderColorPicker = (label, propName, colorVal) => {
            const hasColor = colorVal && colorVal !== 'transparent';
            const plusClass = hasColor ? '' : 'plus-swatch';
            const svgIcon = hasColor ? '' : `<svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 1V9M1 5H9" stroke="#808080" stroke-linecap="round"/></svg>`;
            const displayColor = colorVal === 'transparent' ? '#fff' : colorVal;
            return `<div class="insp-group"><label class="insp-label">${label}</label><div class="color-swatch-wrapper" data-target="inp-${propName}-${blockId}"><input type="text" id="inp-${propName}-${blockId}" class="color-input-hidden" value="${colorVal}" oninput="window.updateBlock('${blockId}', 'styles.${propName}', this.value, false)" hidden><div class="color-swatch ${plusClass}" style="background-color: ${displayColor}">${svgIcon}</div></div></div>`;
        };

        if (block.type === 'text') {
            html += `<div class="insp-section-title">TEXT BLOCK</div>`;
            html += `<div class="insp-group"><label class="insp-label">Content</label><textarea class="insp-textarea" rows="4" oninput="window.updateBlock('${blockId}', 'content', this.value, false)">${block.content}</textarea></div>`;
            html += `<div class="insp-group flex-row-center"><label class="switch"><input type="checkbox" ${block.isList ? 'checked' : ''} onchange="window.updateBlock('${blockId}', 'isList', this.checked)"><span class="slider round"></span></label><span class="insp-label-inline">Markdown (List)</span></div>`;
            html += renderColorPicker('Text color', 'color', block.styles.color);
            html += renderBgColor(block.styles.bgColor);
            html += `<div class="insp-group"><label class="insp-label">Font family</label><select class="insp-select" onchange="window.updateBlock('${blockId}', 'styles.fontFamily', this.value)"><option value="inherit">Match email settings</option><option value="'Urbanist', sans-serif">Urbanist</option><option value="'Open Sans', sans-serif">Open Sans</option><option value="'Times New Roman', serif">Serif</option></select></div>`;
            html += `<div class="insp-group"><label class="insp-label">Font size</label><div class="slider-row"><span class="icon-label">Tt</span><input type="range" min="10" max="60" value="${block.styles.fontSize}" oninput="document.getElementById('fs-val-${blockId}').textContent = this.value + 'px'; window.updateBlock('${blockId}', 'styles.fontSize', this.value, false)" class="style-range"><span class="val-label" id="fs-val-${blockId}">${block.styles.fontSize}px</span></div></div>`;
            html += `<div class="insp-group"><label class="insp-label">Font weight</label><div class="segmented-control"><button class="${block.styles.fontWeight === 'normal' ? 'active' : ''}" onclick="window.updateBlock('${blockId}', 'styles.fontWeight', 'normal')">Regular</button><button class="${block.styles.fontWeight === 'bold' ? 'active' : ''}" onclick="window.updateBlock('${blockId}', 'styles.fontWeight', 'bold')">Bold</button></div></div>`;
            html += renderAlignControl(block.styles.align);
            html += `<div class="insp-group"><label class="insp-label">Padding</label>${padSlider(iconTop, 'paddingTop', block.styles.paddingTop)}${padSlider(iconLeft, 'paddingLeft', block.styles.paddingLeft)}${padSlider(iconRight, 'paddingRight', block.styles.paddingRight)}${padSlider(iconBottom, 'paddingBottom', block.styles.paddingBottom)}</div>`;
        } else if (block.type === 'image') {
            html += `<div class="insp-section-title">IMAGE BLOCK</div>`;
            html += `<div class="insp-group"><label class="insp-label">Source URL</label><input type="text" class="insp-input" value="${block.content.url}" oninput="window.updateBlock('${blockId}', 'content.url', this.value, false)"></div>`;
            html += `<div class="insp-group"><label class="insp-label">Alt text</label><input type="text" class="insp-input" value="${block.content.alt}" oninput="window.updateBlock('${blockId}', 'content.alt', this.value, false)"></div>`;
            html += `<div class="insp-group"><label class="insp-label">Click through URL</label><input type="text" class="insp-input" value="${block.content.link}" oninput="window.updateBlock('${blockId}', 'content.link', this.value, false)"></div>`;
            html += `<div class="insp-half-row"><div class="insp-half-col"><label class="insp-label">Width</label><div class="input-wrapper-suffix"><input type="text" class="insp-input insp-input-with-suffix" placeholder="auto" value="${block.styles.width === 'auto' ? '' : block.styles.width.replace('px', '')}" oninput="window.updateBlock('${blockId}', 'styles.width', this.value ? this.value + 'px' : 'auto', false)"><span class="input-suffix">px</span></div></div><div class="insp-half-col"><label class="insp-label">Height</label><div class="input-wrapper-suffix"><input type="text" class="insp-input insp-input-with-suffix" placeholder="auto" value="${block.styles.height === 'auto' ? '' : block.styles.height.replace('px', '')}" oninput="window.updateBlock('${blockId}', 'styles.height', this.value ? this.value + 'px' : 'auto', false)"><span class="input-suffix">px</span></div></div></div>`;
            html += `<div class="insp-group" style="margin-top:15px;"><label class="insp-label">Alignment (Vertical)</label><div class="segmented-control icon-mode"><button class="${block.styles.verticalAlign === 'top' ? 'active' : ''}" onclick="window.updateBlock('${blockId}', 'styles.verticalAlign', 'top')" title="Top"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 5h14M12 5v14m-4-4 4 4 4-4"/></svg></button><button class="${block.styles.verticalAlign === 'middle' ? 'active' : ''}" onclick="window.updateBlock('${blockId}', 'styles.verticalAlign', 'middle')" title="Middle"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18" /><path d="M12 2v10m-4-4 4 4 4-4" /><path d="M12 22v-10m-4 4 4-4 4 4" /></svg></button><button class="${block.styles.verticalAlign === 'bottom' ? 'active' : ''}" onclick="window.updateBlock('${blockId}', 'styles.verticalAlign', 'bottom')" title="Bottom"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 19h14M12 5v14m-4-10 4-4 4 4"/></svg></button></div></div>`;
            html += `<div class="insp-group"><label class="insp-label">Image Fit</label><div class="segmented-control"><button class="${block.styles.objectFit === 'fill' ? 'active' : ''}" onclick="window.updateBlock('${blockId}', 'styles.objectFit', 'fill')">Fill</button><button class="${block.styles.objectFit === 'contain' ? 'active' : ''}" onclick="window.updateBlock('${blockId}', 'styles.objectFit', 'contain')">Contain</button><button class="${block.styles.objectFit === 'cover' ? 'active' : ''}" onclick="window.updateBlock('${blockId}', 'styles.objectFit', 'cover')">Cover</button></div></div>`;
            html += renderBgColor(block.styles.bgColor);
            html += renderAlignControl(block.styles.align);
            html += `<div class="insp-group"><label class="insp-label">Padding</label>${padSlider(iconTop, 'paddingTop', block.styles.paddingTop)}${padSlider(iconLeft, 'paddingLeft', block.styles.paddingLeft)}${padSlider(iconRight, 'paddingRight', block.styles.paddingRight)}${padSlider(iconBottom, 'paddingBottom', block.styles.paddingBottom)}</div>`;
        } else if (block.type === 'button') {
            html += `<div class="insp-section-title">BUTTON BLOCK</div>`;
            html += `<div class="insp-group"><label class="insp-label">Text</label><input type="text" class="insp-input" value="${block.content.text}" oninput="window.updateBlock('${blockId}', 'content.text', this.value, false)"></div>`;
            html += `<div class="insp-group"><label class="insp-label">Url</label><input type="text" class="insp-input" value="${block.content.link}" oninput="window.updateBlock('${blockId}', 'content.link', this.value, false)"></div>`;
            html += `<div class="insp-group"><label class="insp-label">Width</label><div class="segmented-control"><button class="${block.styles.widthMode === 'full' ? 'active' : ''}" onclick="window.updateBlock('${blockId}', 'styles.widthMode', 'full')">Full</button><button class="${block.styles.widthMode === 'auto' ? 'active' : ''}" onclick="window.updateBlock('${blockId}', 'styles.widthMode', 'auto')">Auto</button></div></div>`;
            html += `<div class="insp-group"><label class="insp-label">Size</label><div class="segmented-control"><button class="${block.styles.btnSize === 'xs' ? 'active' : ''}" onclick="window.updateBlock('${blockId}', 'styles.btnSize', 'xs')">Xs</button><button class="${block.styles.btnSize === 'sm' ? 'active' : ''}" onclick="window.updateBlock('${blockId}', 'styles.btnSize', 'sm')">Sm</button><button class="${block.styles.btnSize === 'md' ? 'active' : ''}" onclick="window.updateBlock('${blockId}', 'styles.btnSize', 'md')">Md</button><button class="${block.styles.btnSize === 'lg' ? 'active' : ''}" onclick="window.updateBlock('${blockId}', 'styles.btnSize', 'lg')">Lg</button></div></div>`;
            html += `<div class="insp-group"><label class="insp-label">Style</label><div class="segmented-control"><button class="${block.styles.btnStyle === 'rectangle' ? 'active' : ''}" onclick="window.updateBlock('${blockId}', 'styles.btnStyle', 'rectangle')">Rectangle</button><button class="${block.styles.btnStyle === 'rounded' ? 'active' : ''}" onclick="window.updateBlock('${blockId}', 'styles.btnStyle', 'rounded')">Rounded</button><button class="${block.styles.btnStyle === 'pill' ? 'active' : ''}" onclick="window.updateBlock('${blockId}', 'styles.btnStyle', 'pill')">Pill</button></div></div>`;
            html += renderColorPicker('Text color', 'color', block.styles.color);
            html += renderColorPicker('Button color', 'buttonColor', block.styles.buttonColor);
            html += renderColorPicker('Background color', 'bgColor', block.styles.bgColor);
            html += `<div class="insp-group"><label class="insp-label">Font family</label><select class="insp-select" onchange="window.updateBlock('${blockId}', 'styles.fontFamily', this.value)"><option value="inherit">Match email settings</option><option value="'Urbanist', sans-serif">Urbanist</option><option value="'Open Sans', sans-serif">Open Sans</option><option value="'Times New Roman', serif">Serif</option></select></div>`;
            html += `<div class="insp-group"><label class="insp-label">Font size</label><div class="slider-row"><span class="icon-label">Tt</span><input type="range" min="10" max="60" value="${block.styles.fontSize}" oninput="document.getElementById('fs-val-${blockId}').textContent = this.value + 'px'; window.updateBlock('${blockId}', 'styles.fontSize', this.value, false)" class="style-range"><span class="val-label" id="fs-val-${blockId}">${block.styles.fontSize}px</span></div></div>`;
            html += `<div class="insp-group"><label class="insp-label">Font weight</label><div class="segmented-control"><button class="${block.styles.fontWeight === 'normal' ? 'active' : ''}" onclick="window.updateBlock('${blockId}', 'styles.fontWeight', 'normal')">Regular</button><button class="${block.styles.fontWeight === 'bold' ? 'active' : ''}" onclick="window.updateBlock('${blockId}', 'styles.fontWeight', 'bold')">Bold</button></div></div>`;
            html += renderAlignControl(block.styles.align);
            html += `<div class="insp-group"><label class="insp-label">Padding</label>${padSlider(iconTop, 'paddingTop', block.styles.paddingTop)}${padSlider(iconLeft, 'paddingLeft', block.styles.paddingLeft)}${padSlider(iconRight, 'paddingRight', block.styles.paddingRight)}${padSlider(iconBottom, 'paddingBottom', block.styles.paddingBottom)}</div>`;
        }

        html += `<div style="margin-top:20px; padding-top:15px; border-top:1px solid #eee;"><button onclick="window.deleteBlock(${blockId})" style="width:100%; color:#d32f2f; background:#FFF5F5; border:1px solid #FFCDCD; padding:8px; border-radius:4px; cursor:pointer; font-size:12px; font-weight:600;">Delete Block</button></div>`;
        controlsContainer.innerHTML = html;
    }

    window.updateBlock = function (id, path, value, save = true) {
        const blockId = parseInt(id);
        const block = blocksData.find(b => b.id === blockId);
        if (!block) return;
        if (path.includes('.')) { const [p, c] = path.split('.'); block[p][c] = value; } else { block[path] = value; }
        renderBlocks();
        if (save) saveHistory();
        const needsRender = ['isList', 'styles.align', 'styles.fontWeight', 'styles.verticalAlign', 'styles.objectFit', 'styles.widthMode', 'styles.btnSize', 'styles.btnStyle'].some(k => path.includes(k));
        if (needsRender) renderInspectorControls(blockId);
    };

    window.deleteBlock = function (id) {
        blocksData = blocksData.filter(b => b.id !== id);
        saveHistory();
        const c = document.getElementById('inspector-controls');
        if (c) c.innerHTML = '<div class="empty-state-inspect">Element deleted. Select another.</div>';
        selectedBlockId = null;
        renderBlocks();
    };

    // Save history on input changes
    document.addEventListener('change', (e) => {
        if (e.target.matches('.style-range, .color-input-hidden, .insp-input, .insp-select') || e.target.tagName === 'TEXTAREA') saveHistory();
    });

    // ===========================================
    // 6. STYLE PANEL LISTENER LOGIC
    // ===========================================
    const backdropInput = document.getElementById('style-backdrop');
    const canvasInput = document.getElementById('style-canvas');
    const borderColorInput = document.getElementById('style-border-color');
    const radiusInput = document.getElementById('style-radius');
    const radiusVal = document.getElementById('radius-val');
    const fontInput = document.getElementById('style-font');
    const textColorInput = document.getElementById('style-text-color');

    function updateSwatch(input, swatchEl) {
        if (swatchEl) {
            swatchEl.style.backgroundColor = input.value;
            if (swatchEl.id === 'swatch-border-color') { swatchEl.innerHTML = ''; swatchEl.classList.remove('plus-swatch'); }
        }
    }

    // Fix: Use the global canvasContainer defined at top (section 0)
    if (backdropInput && canvasContainer) {
        backdropInput.addEventListener('input', (e) => {
            updateSwatch(e.target, document.getElementById('swatch-backdrop'));
            canvasContainer.style.backgroundColor = e.target.value;
        });
    }

    if (canvasInput && paperElement) canvasInput.addEventListener('input', (e) => { updateSwatch(e.target, document.getElementById('swatch-canvas')); paperElement.style.backgroundColor = e.target.value; });
    if (borderColorInput && paperElement) borderColorInput.addEventListener('input', (e) => { updateSwatch(e.target, document.getElementById('swatch-border-color')); paperElement.style.border = `1px solid ${e.target.value}`; });
    if (radiusInput && paperElement) { radiusInput.value = 0; radiusInput.addEventListener('input', (e) => { document.getElementById('radius-val').textContent = e.target.value + 'px'; paperElement.style.borderRadius = e.target.value + 'px'; }); }
    if (fontInput && paperElement) fontInput.addEventListener('change', (e) => paperElement.style.fontFamily = e.target.value);
    if (textColorInput && paperElement) textColorInput.addEventListener('input', (e) => { updateSwatch(e.target, document.getElementById('swatch-text-color')); paperElement.style.color = e.target.value; paperElement.querySelectorAll('.static-header, .static-footer, .footer-details p').forEach(el => el.style.color = e.target.value); });

    const burger = document.getElementById('burger');
    const closeBurger = document.getElementById('close_burger');
    const sideBar = document.querySelector('.left_cp_bar');
    const mainOverlay = document.querySelector('.overlay');
    if (burger && closeBurger && sideBar && mainOverlay) {
        burger.addEventListener('click', () => { sideBar.style.transform = 'translateX(0)'; mainOverlay.style.display = 'flex'; });
        closeBurger.addEventListener('click', () => { sideBar.style.transform = 'translateX(-120%)'; mainOverlay.style.display = 'none'; });
    }
});