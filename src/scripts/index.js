import "../styles/style.scss";
import "../scripts/animate.js";
const BASE_URL =
    "https://6nrr6n9l50.execute-api.us-east-1.amazonaws.com/default/front-plantTest-service?";
const petselecet = document.getElementById("pet");
const sunlightselecet = document.getElementById("sunlight");
const sprinkleselecet = document.getElementById("sprinkle");
const containerNoResult = document.getElementById("container-no-result");
const containerItens = document.getElementById("container-itens");
const closeButton = document.getElementById("button-close");
const goTopButton = document.getElementById("go-top");

// MODAL
// -----
const modal = (function() {
    let openedModal;

    return {
        open: open,
        close: close,
        change: change,
        alert: alert,
    };

    function open(target, callback) {
        document.documentElement.classList.add("is-scroll-disabled");
        openedModal = document.querySelector(target);
        openedModal.dataset.opened = "true";
        callback && callback(openedModal);

        // Add youtube iframe video src or video src
        if (openedModal.dataset.video) {
            if (openedModal.dataset.video.includes("youtube")) {
                let vParam = openedModal.dataset.video.split("v=");
                let videoId = vParam[1].includes("&") ?
                    vParam[1].substr(0, vParam[1].indexOf("&")) :
                    vParam[1];
                let embed =
                    "https://www.youtube.com/embed/" +
                    videoId +
                    "?rel=0&amp;controls=1&amp;showinfo=0&amp;autoplay=1";
                openedModal.querySelector("iframe").src = embed;
            } else {
                openedModal.querySelector("video").src = openedModal.dataset.video;
            }
        }
        // Add iframe src
        if (openedModal.dataset.iframe) {
            openedModal.querySelector("iframe").src = openedModal.dataset.iframe;
        }
    }

    function close(event, callback) {
        if (event) {
            event.preventDefault(), event.stopPropagation();
            if (!event.target.dataset.hasOwnProperty("modalClose")) return false;
        }

        document.documentElement.classList.remove("is-scroll-disabled");
        openedModal.dataset.opened = "false";

        // Remove video iframe url or iframe src
        if (openedModal.dataset.iframe) {
            openedModal.querySelector("iframe").src = "";
        }

        // Remove video iframe src or video src
        if (openedModal.dataset.video) {
            if (openedModal.dataset.video.includes("youtube"))
                openedModal.querySelector("iframe").src = "";
            else openedModal.querySelector("video").pause();
        }

        callback && callback(openedModal);
    }

    function change(target, event) {
        event && (event.preventDefault(), event.stopPropagation());
        openedModal.dataset.opened = "false";
        openedModal = document.querySelector(target);
        openedModal.dataset.opened = "true";
    }

    function alert(element, text) {
        open(element, function(element) {
            text && (element.querySelector(".modal--content").innerHTML = text);
        });
    }
})();

const mountList = (list) => {
    let itemToEmbend = "";
    let listContainer = document.getElementById("itens");
    containerNoResult.classList.add("no-show");
    containerItens.classList.remove("no-show");
    listContainer.innerHTML = "";

    list.forEach((item) => {
        let sunIcon, waterIcon;
        let toxiIcon = item.toxicity ? "Toxic.svg" : "Pet.svg";
        switch (item.sun) {
            case "high":
                sunIcon = "HighSun.svg";
                break;
            case "low":
                sunIcon = "LowSun.svg";
                break;
            case "no":
                sunIcon = "NoSun.svg";
                break;
        }

        switch (item.water) {
            case "daily":
                waterIcon = "fill3.svg";
                break;
            case "regularly":
                waterIcon = "fill2.svg";
                break;
            case "rarely":
                waterIcon = "fill1.svg";
                break;
        }

        itemToEmbend += `<div class="cell slideInLeft" data-animation data-cell-md="3" >
                    <div class="card">
                        <div class="photo">
                            <img class="img" src="${item.url}" alt="">
                        </div>
                        <div class="title">${item.name}</div>
                        <div class="footer">
                            <div class="value">
                                $${item.price}
                            </div>
                            <div class="icons">
                                <img src="../public/images/${sunIcon}" alt="${sunIcon}">                               
                                <img src="../public/images/${waterIcon}" alt="${waterIcon}">
                                <img src="../public/images/${toxiIcon}" alt="${toxiIcon}">
                                
                               
                            </div>
                        </div>

                    </div>
                </div>`;

        listContainer.innerHTML = itemToEmbend;
    });
};
const callApi = () => {
    if (
        petselecet.value != "" &&
        sunlightselecet.value != "" &&
        sprinkleselecet.value != ""
    ) {
        fetch(
                `${BASE_URL}sun=${sunlightselecet.value}&water=${sprinkleselecet.value}&pets=${petselecet.value}`
            )
            .then((body) => body.json())
            .then((data) => {
                mountList(data);
            })
            .catch((error) => {
                modal.alert("#alert", "No plants found, please choose again.");
            });
    }
};

const goTop = () => {
    window.scrollTo(0, 0);
};
sunlightselecet.addEventListener("change", callApi);
sprinkleselecet.addEventListener("change", callApi);
petselecet.addEventListener("change", callApi);
closeButton.addEventListener("click", modal.close);
goTopButton.addEventListener("click", goTop);