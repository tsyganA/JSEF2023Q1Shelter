const header = document.querySelector(".header");
const burger = document.querySelector("#burger");
const popup = document.querySelector("#popup");
const headul = document.querySelector(".headul");
const navmenu = document.querySelector("#abohcnav").cloneNode(1);
const navmenunt = navmenu.querySelectorAll(".lin");
const body = document.body;
const links = Array.from(navmenunt);
const background = document.querySelector(".blackout");

// BURGER

burger.addEventListener("click", openMenu);

function openMenu(event) {
    event.preventDefault();
    popup.classList.toggle("open");
    header.classList.toggle("open");
    burger.classList.toggle("active");
    body.classList.toggle("stop-scrolling");
    background.classList.toggle("unactive");
    menuPopup();
}

function menuPopup() {
    popup.append(navmenu);
    navmenu.classList.toggle("burger");
}

links.forEach((link) => {
    link.addEventListener("click", closeMenu);
});

background.addEventListener("click", (e) => {
    if (header.classList.contains("open")) {
        popup.classList.remove("open");
        header.classList.remove("open");
        burger.classList.remove("active");
        body.classList.remove("stop-scrolling");
        navmenu.classList.remove("burger");
        background.classList.toggle("unactive");
    }
});

function closeMenu() {
    popup.classList.remove("open");
    header.classList.remove("open");
    burger.classList.remove("active");
    body.classList.remove("stop-scrolling");
    navmenu.classList.remove("burger");
    background.classList.toggle("unactive");
}

// CAROUSEL implementation

const BTN_LEFT = document.querySelector("#btn-left");
const BTN_RIGHT = document.querySelector("#btn-right");
const CAROUSEL = document.querySelector("#carousel");
const ITEM_LEFT = document.querySelector("#item-left");
const ITEM_RIGHT = document.querySelector("#item-right");
const ITEM_ACTIVE = document.querySelector("#item-active");

let itemActiveIndex = [];
let itemLeftIndex = [];
let itemRightIndex = [];
const overlayModal = document.querySelector(".overlay-modal");
const modal = document.querySelector(".modal");
const modalClose = document.querySelector(".modal__close");

async function getPetsList() {
    const response = await fetch("./pets.json");
    const petsList = await response.json();
    return petsList;
}

function createCardItem(img, name) {
    const card = document.createElement("div");
    card.classList.add("our-friends__card");
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

async function getPet(index, changedItem) {
    let quotes = `./pets.json`;
    const res = await fetch(quotes);
    const pets = await res.json();
    const imgPet = pets[index].img;
    const namePet = pets[index].name;
    const petsHTML = createCardItem(imgPet, namePet);
    changedItem.appendChild(petsHTML);
}

async function createCardBlock(item, itemIndex) {
    const petsListData = await getPetsList();
    if (item === ITEM_ACTIVE) {
        for (let i = 0; i < 3; i++) {
            const indexPet = Math.floor(Math.random() * petsListData.length);
            if (itemIndex.indexOf(indexPet) < 0) {
                getPet(indexPet, item);
                itemIndex.push(indexPet);
            } else {
                i--;
            }
        }
    } else {
        for (let i = 0; i < 3; i++) {
            const indexPet = Math.floor(Math.random() * petsListData.length);
            if (
                itemActiveIndex.indexOf(indexPet) < 0 &&
                itemIndex.indexOf(indexPet) < 0
            ) {
                getPet(indexPet, item);
                itemIndex.push(indexPet);
            } else {
                i--;
            }
        }
    }
}

function createStartCards() {
    createCardBlock(ITEM_ACTIVE, itemActiveIndex);
    createCardBlock(ITEM_LEFT, itemLeftIndex);
    createCardBlock(ITEM_RIGHT, itemRightIndex);
}

createStartCards();

const moveLeft = () => {
    CAROUSEL.classList.add("transition-left");
    BTN_LEFT.removeEventListener("click", moveLeft);
    BTN_RIGHT.removeEventListener("click", moveRight);
};

const moveRight = () => {
    CAROUSEL.classList.add("transition-right");
    BTN_LEFT.removeEventListener("click", moveLeft);
    BTN_RIGHT.removeEventListener("click", moveRight);
};

BTN_LEFT.addEventListener("click", moveLeft);
BTN_RIGHT.addEventListener("click", moveRight);

CAROUSEL.addEventListener("animationend", (animationEvent) => {
    if (animationEvent.animationName === "move-left") {
        CAROUSEL.classList.remove("transition-left");

        document.querySelector("#item-right").innerHTML = ITEM_ACTIVE.innerHTML;
        document.querySelector("#item-active").innerHTML = ITEM_LEFT.innerHTML;

        itemRightIndex = [...itemActiveIndex];
        itemActiveIndex = [...itemLeftIndex];
        itemLeftIndex = [];

        ITEM_LEFT.innerHTML = "";
        createCardBlock(ITEM_LEFT, itemLeftIndex);
    } else {
        CAROUSEL.classList.remove("transition-right");

        document.querySelector("#item-left").innerHTML = ITEM_ACTIVE.innerHTML;
        document.querySelector("#item-active").innerHTML = ITEM_RIGHT.innerHTML;

        itemLeftIndex = [...itemActiveIndex];
        itemActiveIndex = [...itemLeftIndex];
        itemRightIndex = [];

        ITEM_RIGHT.innerHTML = "";
        createCardBlock(ITEM_RIGHT, itemRightIndex);
    }

    BTN_LEFT.addEventListener("click", moveLeft);
    BTN_RIGHT.addEventListener("click", moveRight);
});

// MODAL WINDOW implementation

function createModalContent(
    img,
    name,
    type,
    breed,
    description,
    age,
    inoculations,
    diseases,
    parasites
) {
    const modalContent = document.createElement("div");
    modalContent.classList.add("modal__content");
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
    const inoculationsPet = pets[index].inoculations.join(", ");
    const diseasesPet = pets[index].diseases.join(", ");
    const parasitesPet = pets[index].parasites.join(", ");
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

carousel.addEventListener("click", async function (event) {
    const isCard = event.target.closest(".our-friends__card");
    if (isCard) {
        if (document.querySelector(".modal__content")) {
            modal.removeChild(document.querySelector(".modal__content"));
        }
        const idCard = event.target.closest(".our-friends__card").id;
        const petsListData = await getPetsList();
        petsListData.forEach((value, index) => {
            if (value.name === idCard) {
                idPet = index;
                getPetModal(idPet);
            }
        });
        overlayModal.classList.add("overlay-modal_active");
        modal.classList.add("modal_active");
        document.body.classList.add("stop-scrolling-modal");
    }
});

modalClose.addEventListener("click", () => {
    overlayModal.classList.remove("overlay-modal_active");
    modal.classList.remove("modal_active");
    document.body.classList.remove("stop-scrolling-modal");
});

modal.addEventListener("click", (event) => {
    event._isClickWithModal = true;
});

overlayModal.addEventListener("click", (event) => {
    if (event._isClickWithModal) return;
    overlayModal.classList.remove("overlay-modal_active");
    modal.classList.remove("modal_active");
    document.body.classList.remove("stop-scrolling-modal");
});
