// lista de presentes
const container = document.querySelector("#gift-container");
let gifts = [];





// nome do convidade e do acompanhante
const name = document.querySelector("#name")
const company = document.querySelector("#company")

// pÃ¡ginas
const invPage = document.querySelector("#invite-page")
const signInPage = document.querySelector("#signIn-page")
const giftPage = document.querySelector("#gift-page")
const confirmPage = document.querySelector("#confirm-page")
const endPage = document.querySelector("#end-page")
const pages = document.querySelectorAll("section");

// botÃµes
const signInBtn = document.querySelector("#signInBtn");
const nextBtn = document.querySelector("#nextBtn");
const confirmBtn = document.querySelector("#confirmBtn")
const finishBtn = document.querySelector("#finishBtn")

// botÃµes de voltar

const backToSignInBtn = document.querySelector("#backToSignInBtn");
const backToGiftBtn = document.querySelector("#backToGiftBtn");

const confirmationBox = document.querySelector("#confirmation-box")

// dados

const guest = {
    name: "",
    company: "",
    giftId: "",
    giftName: ""
}

async function loadGifts() {
    try {
        const response = await fetch("/gifts");

        if (!response.ok) {
            throw new Error("Erro ao carregar presentes");
        }

        gifts = await response.json();

        renderGifts(gifts);
    } catch (error) {
        console.error(error);
        container.innerHTML = "<p>Nao foi possivel carregar a lista de presentes.</p>";
    }
}
function showPage(pageToShow) {
    pages.forEach((page) => {
        page.style.display = "none"
    })
    pageToShow.style.display = "flex"
}
signInBtn.onclick = () => {
    showPage(signInPage)
    console.log("clicado")
};
nextBtn.onclick = () => {

    if (name.value.trim() === "") {
        alert("Por favor, digite um nome!")
        return;
    }
    guest.name = name.value.trim()
    guest.company = company.value.trim()
    showPage(giftPage)
};
confirmBtn.onclick = () => {
    renderConfirmation();
    showPage(confirmPage)
}

finishBtn.onclick = async () => {
    try {
        const userResponse = await fetch("/usuarios", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(guest)
        });

        if (!userResponse.ok) {
            throw new Error("Erro ao salvar usuario");
        }

        if (guest.giftId !== "") {
            const giftResponse = await fetch(`/gifts/${guest.giftId}`, {
                method: "PUT"
            });

            if (!giftResponse.ok) {
                throw new Error("Erro ao atualizar presente");
            }

            await loadGifts();
        }

        showPage(endPage);
    } catch (error) {
        console.error(error);
        alert("Nao foi possivel confirmar sua presenca. Tente novamente.");
    }
}
backToSignInBtn.onclick = () => {
    showPage(signInPage);
};
backToGiftBtn.onclick = () => {
    showPage(giftPage);
};


function renderGifts(gifts) {

    container.innerHTML = "";

    gifts.forEach((gift) => {
        const card = document.createElement("div");

        card.classList.add("gift-card");

        card.innerHTML = `
            <div class="gift-box">
                <div class="gift-info">
                    <h3>${gift.name}</h3>
                    <p class="${gift.available ? "" : "indisponivel"}">${gift.available ? "Disponível" : "Indisponível"}</p>
                    <button 
                    ${gift.available ? "" : "disabled"} data-id="${gift.id}">
                        Escolher
                    </button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

container.addEventListener("click", (event) => {
    if (event.target.tagName !== "BUTTON") return;
    if (event.target.disabled) return;

    const id = event.target.dataset.id;
    const selectedGift = gifts.find(gift => gift.id === id);

    guest.giftId = selectedGift.id;
    guest.giftName = selectedGift.name;
    document.querySelectorAll(".gift-card").forEach((card) => {
        card.classList.remove("selected");
    });
    event.target.closest(".gift-card").classList.add("selected");
});

function renderConfirmation() {

    let html = `
    <div class="confirmation-box">
    <h1>Confirme suas informaçoes:</h1>
    
    <p><strong>Nome:</strong> ${guest.name}</p>
    `;

    if (guest.company !== "") {
        html += `<p><strong>Acompanhante:</strong> ${guest.company}</p>`;
    }

    if (guest.giftName !== "") {
        html += `<p><strong>Presente:</strong> ${guest.giftName}</p>`;
    }


    html += `</div>`
    confirmationBox.innerHTML = html;
}




loadGifts();