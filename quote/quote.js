const openChatBTN = document.getElementById('open_chat');
const openNotesBTN = document.getElementById('open_notes');
const chat = document.querySelector('.chat');
const notes = document.querySelector('.quote_item-comments');
// NEW NOTIFICATION LEADS CODE START
const openContactsBTN = document.getElementById('open_contacts');
const contacts = document.querySelector('.contacts_panel');
// NEW NOTIFICATION LEADS CODE END

// Функция для обновления бордеров (старая версия закомментирована)
// function updateBorders() {
//  // Если оба элемента не активны
//  if (
//      !openChatBTN.classList.contains('active') &&
//      !openNotesBTN.classList.contains('active')
//  ) {
//      openChatBTN.classList.add('no-active');
//      openNotesBTN.classList.add('no-active');
//  } else {
//      openChatBTN.classList.remove('no-active');
//      openNotesBTN.classList.remove('no-active');
//  }
// }

// NEW NOTIFICATION LEADS CODE START
function updateBorders() {
    // Проверяем состояние active только если кнопки существуют
    const chatBtnActive = openChatBTN ? openChatBTN.classList.contains('active') : false;
    const notesBtnActive = openNotesBTN ? openNotesBTN.classList.contains('active') : false;
    const contactsBtnActive = openContactsBTN ? openContactsBTN.classList.contains('active') : false;

    if (!chatBtnActive && !notesBtnActive && !contactsBtnActive) {
        if (openChatBTN) openChatBTN.classList.add('no-active');
        if (openNotesBTN) openNotesBTN.classList.add('no-active');
        if (openContactsBTN) openContactsBTN.classList.add('no-active');
    } else {
        if (openChatBTN) openChatBTN.classList.remove('no-active');
        if (openNotesBTN) openNotesBTN.classList.remove('no-active');
        if (openContactsBTN) openContactsBTN.classList.remove('no-active');
    }
}
// NEW NOTIFICATION LEADS CODE END

// Старые обработчики событий (закомментированы)
// openChatBTN.addEventListener('click', () => {
//  if (chat.classList.contains('active')) {
//      chat.classList.remove('active'); // Якщо чат вже відкритий – закриваємо його
//      openChatBTN.classList.remove('active');
//  } else {
//      chat.classList.add('active'); // Інакше відкриваємо чат
//      notes.classList.remove('active'); // Закриваємо notes
//      openChatBTN.classList.add('active');
//      openNotesBTN.classList.remove('active');
//  }
//  updateBorders(); // Обновляем бордеры
// });

// openNotesBTN.addEventListener('click', () => {
//  if (notes.classList.contains('active')) {
//      notes.classList.remove('active'); // Якщо notes вже відкриті – закриваємо їх
//      openNotesBTN.classList.remove('active');
//  } else {
//      notes.classList.add('active'); // Інакше відкриваємо notes
//      chat.classList.remove('active'); // Закриваємо chat
//      openNotesBTN.classList.add('active');
//      openChatBTN.classList.remove('active');
//  }
//  updateBorders(); // Обновляем бордеры
// });

// NEW NOTIFICATION LEADS CODE START
if (openChatBTN) {
    openChatBTN.addEventListener('click', () => {
        const isActive = chat ? chat.classList.contains('active') : false;
        resetAll();
        if (!isActive) {
            if (chat) chat.classList.add('active');
            openChatBTN.classList.add('active'); // openChatBTN здесь точно существует
        }
        updateBorders();
    });
}

if (openNotesBTN) {
    openNotesBTN.addEventListener('click', () => {
        const isActive = notes ? notes.classList.contains('active') : false;
        resetAll();
        if (!isActive) {
            if (notes) notes.classList.add('active');
            openNotesBTN.classList.add('active'); // openNotesBTN здесь точно существует
        }
        updateBorders();
    });
}

if (openContactsBTN) {
    openContactsBTN.addEventListener('click', () => {
        const isActive = contacts ? contacts.classList.contains('active') : false;
        resetAll();
        if (!isActive) {
            if (contacts) contacts.classList.add('active');
            openContactsBTN.classList.add('active'); // openContactsBTN здесь точно существует
        }
        updateBorders();
    });
}

function resetAll() {
    if (chat) chat.classList.remove('active');
    if (notes) notes.classList.remove('active');
    if (contacts) contacts.classList.remove('active');

    if (openChatBTN) openChatBTN.classList.remove('active');
    if (openNotesBTN) openNotesBTN.classList.remove('active');
    if (openContactsBTN) openContactsBTN.classList.remove('active');
}
// NEW NOTIFICATION LEADS CODE END

const changeChatOpened = document.querySelector('.opened_chat-head--back');
const chatDetailsBTNs = document.querySelectorAll('.chat_item');

// Проверяем существование changeChatOpened перед добавлением обработчика
if (changeChatOpened) {
    changeChatOpened.addEventListener('click', () => {
        if (chat) chat.classList.toggle('open'); // Проверяем chat перед использованием
    });
}

chatDetailsBTNs.forEach(btn => {
    btn.addEventListener('click', () => {
        if (chat) chat.classList.toggle('open'); // Проверяем chat перед использованием
    });
});

// const chatContainer = document.querySelector('.chat_items');
// const messageContainer = document.querySelector('.opened_chat-body');
// const chatHeader = document.querySelector('.opened_chat-head h4');
// const chatStatus = document.querySelector('.opened_chat-head--online');
// const chatBox = document.querySelector('.chat');

// // Данные с сервера
// const chatData = {
//  status: true,
//  currentUser: {
//      id: 1,
//      name: 'Max',
//      position: 'Frontend Developer',
//      isOnline: true,
//  },
//  data: [
//      {
//          id: 2,
//          chatUser: 'Michael Killian',
//          chatPos: 'TechSolutions LCC',
//          isOnline: true,
//          messages: [
//              {
//                  sender: 2,
//                  isLiked: true,
//                  messageText: 'Hello Max! How are you?',
//                  timestamp: '2025-02-05T12:30:00Z',
//              },
//              {
//                  sender: 1,
//                  isLiked: false,
//                  messageText: 'Hey Michael! I am good, how about you?',
//                  timestamp: '2025-02-05T12:31:00Z',
//              },
//          ],
//      },
//  ],
// };

// // Функция рендера списка чатов
// function renderChatList() {
//  chatContainer.innerHTML = '';
//  chatData.data.forEach(chat => {
//      const chatItem = document.createElement('div');
//      chatItem.classList.add('chat_item');
//      chatItem.innerHTML = `
//             <div class="chat_item-info">
//                 <div class="chat_user">
//                     <span class="chat_user-name">${chat.chatUser}</span>
//                     <span class="chat_user-pos">${chat.chatPos}</span>
//                 </div>
//             </div>
//         `;
//      chatItem.addEventListener('click', () => openChat(chat));
//      chatContainer.appendChild(chatItem);
//  });
// }

// // Функция открытия чата
// function openChat(chat) {
//  chatHeader.textContent = chat.chatUser;
//  chatStatus.textContent = chat.isOnline ? 'Online' : 'Offline';
//  renderMessages(chat.messages);
//  chatBox.classList.add('open');
// }

// // Функция рендера сообщений
// function renderMessages(messages) {
//  messageContainer.innerHTML = '';
//  messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
//  messages.forEach(msg => {
//      const isCurrentUser = msg.sender === chatData.currentUser.id;
//      const messageItem = document.createElement('div');
//      messageItem.classList.add(isCurrentUser ? 'chat_out' : 'chat_from');
//      messageItem.innerHTML = `
//             <div class="chat_${isCurrentUser ? 'out' : 'from'}-textBlock">
//                 <p class="chat_from-text">${msg.messageText}</p>
//                 <span class="chat_from-time">${new Date(
//                                  msg.timestamp
//                              ).toLocaleTimeString()}</span>
//             </div>
//         `;
//      messageContainer.appendChild(messageItem);
//  });
// }

// // Инициализация списка чатов
// renderChatList();

// NEW NOTIFICATION LEADS CODE START
document.addEventListener('DOMContentLoaded', () => {
    const popupOverlay = document.getElementById('popupOverlay');

    const popups = {
        email: {
            trigger: 'contactsPanelPopupEmail',
            popup: 'emailPopup',
            form: 'emailForm',
            borrower: 'emailBorrower',
            note: 'emailNote',
            counter: 'emailNoteCounter',
        },
        call: {
            trigger: 'contactsPanelPopuPhone',
            popup: 'callPopup',
            form: 'callForm',
            borrower: 'callBorrower',
            note: 'callNote',
            counter: 'callNoteCounter',
        },
        sms: {
            trigger: 'contactsPanelPopuNote',
            popup: 'smsPopup',
            form: 'smsForm',
            borrower: 'smsBorrower',
            note: 'smsNote',
            counter: 'smsNoteCounter',
        },
    };

    // Open popup on trigger
    Object.values(popups).forEach(({ trigger, popup, borrower, note, counter }) => {
        const triggerElement = document.getElementById(trigger);
        if (triggerElement) {
            triggerElement.addEventListener('click', () => {
                resetForm(popup); // popup - ID попапа
                populateBorrowers(borrower); // borrower - ID селекта

                const noteTextarea = document.getElementById(note); // note - ID текстового поля
                const counterDisplay = document.getElementById(counter); // counter - ID счетчика
                if (noteTextarea && counterDisplay) {
                    updateNoteCounter(note, counterDisplay); // Передаем ID текстового поля и ЭЛЕМЕНТ счетчика
                }

                const popupElement = document.getElementById(popup);
                if (popupElement) popupElement.classList.add('active');
                if (popupOverlay) popupOverlay.classList.add('active');
            });
        }
    });

    // Close popups
    document.querySelectorAll('.popup-close').forEach(btn => {
        btn.addEventListener('click', () => {
            const popupId = btn.getAttribute('data-close');
            const popupToClose = document.getElementById(popupId);
            if (popupToClose) popupToClose.classList.remove('active');
            if (popupOverlay) popupOverlay.classList.remove('active');
        });
    });

    document.querySelectorAll('.popup form').forEach(form => {
        form.querySelectorAll('input, textarea, select').forEach(field => {
            ['input', 'change'].forEach(eventType => {
                field.addEventListener(eventType, () => {
                    const group = field.closest('.form-group');
                    if (group?.classList.contains('invalid')) { // Optional chaining for group
                        group.classList.remove('invalid');
                    }
                });
            });
        });
    });

    // Validation and submission
    Object.values(popups).forEach(({ form, borrower, note, popup, counter }) => {
        const formEl = document.getElementById(form);
        if (formEl) { // Проверяем существование формы
            formEl.addEventListener('submit', e => {
                e.preventDefault();
                const fieldsToValidate = [];
                // Добавляем поля для валидации, только если они существуют
                if (document.getElementById(borrower)) fieldsToValidate.push(borrower);
                if (document.getElementById(note)) fieldsToValidate.push(note);

                if (form === 'callForm') {
                    // Убедимся, что элемент 'callType' существует, прежде чем добавить его для валидации
                    if (document.getElementById('callType')) {
                        fieldsToValidate.push('callType');
                    } else {
                        console.warn("Элемент с ID 'callType' не найден для валидации в форме 'callForm'.");
                    }
                }
                
                const valid = validateFields(fieldsToValidate);
                if (valid) {
                    console.log(`${popup} submitted successfully.`);
                    const popupToClose = document.getElementById(popup);
                    if (popupToClose) popupToClose.classList.remove('active');
                    if (popupOverlay) popupOverlay.classList.remove('active');
                }
            });
        }

        // Live character counter
        const noteEl = document.getElementById(note);
        const counterEl = document.getElementById(counter); // Используем counter ID из конфигурации popups
        if (noteEl && counterEl) { // Проверяем существование обоих элементов
            noteEl.addEventListener('input', () => updateNoteCounter(note, counterEl)); // note - ID, counterEl - ЭЛЕМЕНТ
        }
    });

    function resetForm(popupId) {
        const popupElement = document.getElementById(popupId);
        if (!popupElement) return; // Если сам попап не найден

        const form = popupElement.querySelector('form');
        if (form) form.reset(); // Проверяем, есть ли форма

        popupElement.querySelectorAll('.form-group.invalid').forEach(g => g.classList.remove('invalid'));
    
        const noteTextarea = popupElement.querySelector('textarea');
        const counterDisplay = popupElement.querySelector('.char-counter');
        if (noteTextarea && counterDisplay) { // Проверяем существование обоих
            const maxLengthAttr = noteTextarea.getAttribute('maxlength');
            if (maxLengthAttr) {
                const max = parseInt(maxLengthAttr, 10);
                if (!isNaN(max)) { // Проверяем, что max - это число
                    counterDisplay.textContent = `${max} characters left`;
                }
            }
        }
    }  

    function populateBorrowers(selectId) {
        const select = document.getElementById(selectId);
        if (!select) { // Проверяем существование селекта
            console.warn(`Select element with ID '${selectId}' not found for populating borrowers.`);
            return;
        }
        select.innerHTML = '<option value="" disabled selected>Select borrower...</option>';
        for (let i = 0; i < 5; i++) {
            const option = document.createElement('option');
            const id = Math.floor(Math.random() * 1000);
            option.value = `borrower_${id}`;
            option.textContent = `Borrower ${id}`;
            select.appendChild(option);
        }
    }

    function validateFields(ids) {
        let allValid = true; // Переименовал переменную во избежание путаницы с global valid
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (!el) { // Если элемент не найден
                console.warn(`Validation: Element with ID '${id}' not found.`);
                allValid = false; // Считаем невалидным, если обязательное поле отсутствует
                return; // Переходим к следующему ID
            }

            const group = el.closest('.form-group');
            const value = el.value ? el.value.trim() : '';
            const isNote = id.toLowerCase().includes('note');
            let fieldIsValid = true;

            if (!value) { // Пустое значение
                fieldIsValid = false;
            } else if (isNote) { // Для заметок дополнительная проверка по regex
                if (!/^[\w\s.,;:!?()'"-а-яА-ЯіїєґІЇЄҐ]{1,100}$/.test(value)) {
                    fieldIsValid = false;
                }
            }
            // Для других полей (не заметок) достаточно проверки !value

            if (!fieldIsValid) {
                if (group) group.classList.add('invalid');
                allValid = false;
            } else {
                if (group) group.classList.remove('invalid');
            }
        });
        return allValid;
    }

    function updateNoteCounter(noteId, counterElement) { // counterElement - это уже DOM-элемент
        const noteTextarea = document.getElementById(noteId);
        // Проверяем существование текстового поля и элемента счетчика
        if (!noteTextarea || !counterElement) {
            // console.warn("Note textarea or Counter element not found for updateNoteCounter", noteId, counterElement);
            return;
        }
        const maxLengthAttr = noteTextarea.getAttribute('maxlength');
        if (maxLengthAttr) {
            const max = parseInt(maxLengthAttr, 10);
            if (!isNaN(max)) { // Проверяем, что max - это число
                 counterElement.textContent = `${max - noteTextarea.value.length} characters left`;
            } else {
                // console.warn(`maxlength attribute on ${noteId} is not a valid number.`);
            }
        } else {
            // console.warn(`maxlength attribute not found on ${noteId}.`);
        }
    }
});
// NEW NOTIFICATION LEADS CODE END