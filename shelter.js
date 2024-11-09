const header = document.querySelector('.header');
const burger = document.querySelector('#burger');
const popup = document.querySelector('#popup');
const headul = document.querySelector('.headul');
const navmenu = document.querySelector('#abohcnav').cloneNode(1);
const navmenunt = navmenu.querySelectorAll('.lin');
const body = document.body;
const links = Array.from(navmenunt);
const background = document.querySelector('.blackout');

// BURGER

burger.addEventListener('click', openMenu);

function openMenu(event) {
    event.preventDefault();
    popup.classList.toggle('open');
    header.classList.toggle('open');
    burger.classList.toggle('active');
    body.classList.toggle('stop-scrolling');
    background.classList.toggle('unactive');
    menuPopup();
}

function menuPopup() {
    popup.append(navmenu);
    navmenu.classList.toggle('burger');
}

links.forEach(link => {
    link.addEventListener('click', closeMenu);
});

background.addEventListener('click', e => {
    if (header.classList.contains('open')) {
        popup.classList.remove('open');
        header.classList.remove('open');
        burger.classList.remove('active');
        body.classList.remove('stop-scrolling');
        navmenu.classList.remove('burger');
        background.classList.toggle('unactive');
    }
});

function closeMenu() {
    popup.classList.remove('open');
    header.classList.remove('open');
    burger.classList.remove('active');
    body.classList.remove('stop-scrolling');
    navmenu.classList.remove('burger');
    background.classList.toggle('unactive');
}

// CAROUSEL implementation
// Кнопки для навигации и элементы карусели
const BTN_LEFT = document.querySelector('#btn-left');
const BTN_RIGHT = document.querySelector('#btn-right');
const CAROUSEL = document.querySelector('#carousel');
const ITEM_LEFT = document.querySelector('#item-left');
const ITEM_RIGHT = document.querySelector('#item-right');
const ITEM_ACTIVE = document.querySelector('#item-active');

// Индексы активных карточек
let itemActiveIndex = [];
let itemLeftIndex = [];
let itemRightIndex = [];

// Загружаем список питомцев только один раз
let petsListData = null;
async function getPetsList() {
    if (!petsListData) {
        const response = await fetch('./pets.json');
        petsListData = await response.json();
    }
    return petsListData;
}

// Функция для создания карточки
function createCardItem(img, name) {
    const card = document.createElement('div');
    card.classList.add('our-friends__card');
    card.id = `${name}`;
    card.innerHTML = `
    <img
      src=${img}
      alt=${name}
      class="our-friends__card__img"
    />
    <h3 class="our-friends__card__title">${name}</h3>
    <button class="our-friends__card__btn">Learn more</button>`;
    return card;
}

// Получаем данные питомца и добавляем их в элемент
async function getPet(index, changedItem) {
    const pets = await getPetsList();
    const imgPet = pets[index].img;
    const namePet = pets[index].name;
    const petsHTML = createCardItem(imgPet, namePet);
    changedItem.appendChild(petsHTML);
}

// Создаем блок карточек для активного и соседних элементов
async function createCardBlock(item, itemIndex, excludeIndices = []) {
    const petsListData = await getPetsList();
    item.innerHTML = ''; // очищаем элемент перед добавлением карточек
    itemIndex.length = 0; // очищаем массив индексов

    for (let i = 0; i < 3; i++) {
        let indexPet;
        do {
            indexPet = Math.floor(Math.random() * petsListData.length);
        } while (itemIndex.includes(indexPet) || excludeIndices.includes(indexPet));

        await getPet(indexPet, item);
        itemIndex.push(indexPet);
    }
}

// Инициализируем начальные карточки
async function createStartCards() {
    await createCardBlock(ITEM_ACTIVE, itemActiveIndex);
    await createCardBlock(ITEM_LEFT, itemLeftIndex, itemActiveIndex);
    await createCardBlock(ITEM_RIGHT, itemRightIndex, itemActiveIndex);
}

createStartCards();

// Функции для перемещения влево и вправо
const moveLeft = () => {
    CAROUSEL.classList.add('transition-left');
    BTN_LEFT.removeEventListener('click', moveLeft);
    BTN_RIGHT.removeEventListener('click', moveRight);
};

const moveRight = () => {
    CAROUSEL.classList.add('transition-right');
    BTN_LEFT.removeEventListener('click', moveLeft);
    BTN_RIGHT.removeEventListener('click', moveRight);
};

// Восстанавливаем событие анимации и обновляем индексы после анимации
CAROUSEL.addEventListener('animationend', async animationEvent => {
    if (animationEvent.animationName === 'move-left') {
        CAROUSEL.classList.remove('transition-left');
        ITEM_RIGHT.innerHTML = ITEM_ACTIVE.innerHTML;
        ITEM_ACTIVE.innerHTML = ITEM_LEFT.innerHTML;

        // Обновляем индексы
        itemRightIndex = [...itemActiveIndex];
        itemActiveIndex = [...itemLeftIndex];
        itemLeftIndex = [];

        // Создаем новые уникальные карточки для ITEM_LEFT
        await createCardBlock(ITEM_LEFT, itemLeftIndex, itemActiveIndex);
    } else if (animationEvent.animationName === 'move-right') {
        CAROUSEL.classList.remove('transition-right');
        ITEM_LEFT.innerHTML = ITEM_ACTIVE.innerHTML;
        ITEM_ACTIVE.innerHTML = ITEM_RIGHT.innerHTML;

        itemLeftIndex = [...itemActiveIndex];
        itemActiveIndex = [...itemRightIndex];
        itemRightIndex = [];

        // Создаем новые уникальные карточки для ITEM_RIGHT
        await createCardBlock(ITEM_RIGHT, itemRightIndex, itemActiveIndex);
    }

    // Возвращаем обработчики событий
    BTN_LEFT.addEventListener('click', moveLeft);
    BTN_RIGHT.addEventListener('click', moveRight);
});

// Назначаем обработчики
BTN_LEFT.addEventListener('click', moveLeft);
BTN_RIGHT.addEventListener('click', moveRight);

// MODAL WINDOW implementation

const overlayModal = document.querySelector('.overlay-modal');
const modal = document.querySelector('.modal');
const modalClose = document.querySelector('.modal__close');

function createModalContent(img, name, type, breed, description, age, inoculations, diseases, parasites) {
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal__content');
    modalContent.innerHTML = `
  <img src="${img}" alt="pets-${name}" class="modal__img">
  <div class="modal__desk">
    <h3 class="modal__title">${name}</h3>
    <p class="modal_subtitle">${type} - ${breed}</p>
    <p class="modal__text">${description}</p>
    <ul class="modal__list">
      <li class="modal__list__item"><span><strong>Age:</strong> ${age}</span></li>
      <li class="modal__list__item"><span><strong>Inoculations:</strong> ${inoculations}</span></li>
      <li class="modal__list__item"><span><strong>Diseases:</strong> ${diseases}</span></li>
      <li class="modal__list__item"><span><strong>Parasites:</strong> ${parasites}</span></li>
    </ul>
  </div>`;
    return modalContent;
}

async function getPetModal(index) {
    let quotes = `./pets.json`;
    const res = await fetch(quotes);
    const pets = await res.json();
    const imgPet = pets[index].img;
    const namePet = pets[index].name;
    const typePet = pets[index].type;
    const breedPet = pets[index].breed;
    const descriptionPet = pets[index].description;
    const agePet = pets[index].age;
    const inoculationsPet = pets[index].inoculations.join(', ');
    const diseasesPet = pets[index].diseases.join(', ');
    const parasitesPet = pets[index].parasites.join(', ');
    const modalContentHTML = createModalContent(
        imgPet,
        namePet,
        typePet,
        breedPet,
        descriptionPet,
        agePet,
        inoculationsPet,
        diseasesPet,
        parasitesPet
    );
    modal.appendChild(modalContentHTML);
}

carousel.addEventListener('click', async function (event) {
    const isCard = event.target.closest('.our-friends__card');
    if (isCard) {
        if (document.querySelector('.modal__content')) {
            modal.removeChild(document.querySelector('.modal__content'));
        }
        const idCard = event.target.closest('.our-friends__card').id;
        const petsListData = await getPetsList();
        petsListData.forEach((value, index) => {
            if (value.name === idCard) {
                idPet = index;
                getPetModal(idPet);
            }
        });
        overlayModal.classList.add('overlay-modal_active');
        modal.classList.add('modal_active');
        document.body.classList.add('stop-scrolling-modal');
    }
});

modalClose.addEventListener('click', () => {
    overlayModal.classList.remove('overlay-modal_active');
    modal.classList.remove('modal_active');
    document.body.classList.remove('stop-scrolling-modal');
});

modal.addEventListener('click', event => {
    event._isClickWithModal = true;
});

overlayModal.addEventListener('click', event => {
    if (event._isClickWithModal) return;
    overlayModal.classList.remove('overlay-modal_active');
    modal.classList.remove('modal_active');
    document.body.classList.remove('stop-scrolling-modal');
});
