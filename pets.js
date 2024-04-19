const header = document.querySelector(".head");
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

// PAGINATION implementation

const petsList = document.querySelector(".our-friends-pets__card-list");
const firstPageBtn = document.querySelector("#first-page-btn");
const previousPageBtn = document.querySelector("#previous-page-btn");
const nextPageBtn = document.querySelector("#next-page-btn");
const lastPageBtn = document.querySelector("#last-page-btn");

async function getPetsList() {
    const response = await fetch("./pets.json");
    const petsList = await response.json();
    return petsList;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

async function getArrPets() {
    const petsListData = await getPetsList();
    let petsArr = [];
    for (i = 0; i < 6; i++) {
        petsArr = [...petsArr, ...shuffle(petsListData)];
    }
    return petsArr;
}

async function ourFriends() {
    const arrPetsListData = await getArrPets();
    let currentPage = 1;
    let petsPerPage = 8;

    function windowSizeCheck() {
        if (window.matchMedia("(max-width: 767.98px)").matches) {
            petsPerPage = 3;
        } else if (window.matchMedia("(max-width: 1279.98px)").matches) {
            petsPerPage = 6;
        } else {
            petsPerPage = 8;
        }
    }

    function displayList(arrData, elementsPerPage, page) {
        petsList.innerHTML = "";
        page--;
        const start = elementsPerPage * page;
        const end = start + elementsPerPage;
        const paginatedPetsListData = arrPetsListData.slice(start, end);
        paginatedPetsListData.forEach((element) => {
            const petElement = document.createElement("div");
            petElement.classList.add("our-friends__card");
            petElement.dataset.name = element.name;
            petElement.innerHTML = `
  <img
    src=${element.img}
    alt=${element.name}
    class="our-friends__card__img"
  />
  <h3 class="our-friends__card__title">${element.name}</h3>
  <button class="our-friends__card__btn">Learn more</button>`;
            petsList.appendChild(petElement);
        });
    }

    function displayPagination(arrData, elementsPerPage) {
        const paginationElement = document.querySelector(".btn__arrow-active");
        paginationElement.textContent = currentPage;
        const pageCount = Math.ceil(arrData.length / elementsPerPage);

        function btnPaginationClassToggle(btn, boolean) {
            boolean
                ? btn.classList.add("btn__arrow-inactive")
                : btn.classList.remove("btn__arrow-inactive");
            btn.disabled = boolean;
        }

        function pageNumberCheck() {
            if (currentPage === 1) {
                btnPaginationClassToggle(firstPageBtn, true);
                btnPaginationClassToggle(previousPageBtn, true);
            } else {
                btnPaginationClassToggle(firstPageBtn, false);
                btnPaginationClassToggle(previousPageBtn, false);
            }
            if (currentPage === pageCount) {
                btnPaginationClassToggle(lastPageBtn, true);
                btnPaginationClassToggle(nextPageBtn, true);
            } else {
                btnPaginationClassToggle(lastPageBtn, false);
                btnPaginationClassToggle(nextPageBtn, false);
            }
        }

        function clickBtnAction() {
            paginationElement.textContent = currentPage;
            displayList(arrPetsListData, petsPerPage, currentPage);
            pageNumberCheck();
        }

        firstPageBtn.addEventListener("click", () => {
            currentPage = 1;
            clickBtnAction();
        });

        previousPageBtn.addEventListener("click", () => {
            currentPage = currentPage - 1;
            clickBtnAction();
        });

        nextPageBtn.addEventListener("click", () => {
            currentPage = currentPage + 1;
            clickBtnAction();
        });

        lastPageBtn.addEventListener("click", () => {
            currentPage = pageCount;
            clickBtnAction();
        });

        pageNumberCheck();
    }

    window.addEventListener("resize", () => {
        windowSizeCheck();
        displayList(arrPetsListData, petsPerPage, currentPage);
        displayPagination(arrPetsListData, petsPerPage);
    });

    windowSizeCheck();
    displayList(arrPetsListData, petsPerPage, currentPage);
    displayPagination(arrPetsListData, petsPerPage);
}

ourFriends();

// MODAL WINDOW implementation

const overlayModal = document.querySelector(".overlay-modal");
const modal = document.querySelector(".modal");
const modalClose = document.querySelector(".modal__close");

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
    if (document.querySelector(".modal__content")) {
        modal.removeChild(document.querySelector(".modal__content"));
    }
    modal.appendChild(modalContentHTML);
}

petsList.addEventListener("click", async function (event) {
    const isCard = event.target.closest(".our-friends__card");
    if (isCard) {
        if (document.querySelector(".modal__content")) {
            modal.removeChild(document.querySelector(".modal__content"));
        }
        const idCard = event.target.closest(".our-friends__card").dataset.name;
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
