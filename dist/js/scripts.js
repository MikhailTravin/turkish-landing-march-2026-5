const modules_flsModules = {};

let bodyLockStatus = true;
let bodyUnlock = (delay = 500) => {
    if (bodyLockStatus) {
        const lockPaddingElements = document.querySelectorAll("[data-lp]");
        setTimeout((() => {
            lockPaddingElements.forEach((lockPaddingElement => {
                lockPaddingElement.style.paddingRight = "";
            }));
            document.body.style.paddingRight = "";
            document.documentElement.classList.remove("lock");
        }), delay);
        bodyLockStatus = false;
        setTimeout((function () {
            bodyLockStatus = true;
        }), delay);
    }
};
let bodyLock = (delay = 500) => {
    if (bodyLockStatus) {
        const lockPaddingElements = document.querySelectorAll("[data-lp]");
        const lockPaddingValue = window.innerWidth - document.body.offsetWidth + "px";
        lockPaddingElements.forEach((lockPaddingElement => {
            lockPaddingElement.style.paddingRight = lockPaddingValue;
        }));
        document.body.style.paddingRight = lockPaddingValue;
        document.documentElement.classList.add("lock");
        bodyLockStatus = false;
        setTimeout((function () {
            bodyLockStatus = true;
        }), delay);
    }
};
function functions_FLS(message) {
    setTimeout((() => {
        if (window.FLS) console.log(message);
    }), 0);
}

let _slideUp = (target, duration = 500, showmore = 0) => {
    if (!target.classList.contains("_slide")) {
        target.classList.add("_slide");
        target.style.transitionProperty = "height, margin, padding";
        target.style.transitionDuration = duration + "ms";
        target.style.height = `${target.offsetHeight}px`;
        target.offsetHeight;
        target.style.overflow = "hidden";
        target.style.height = showmore ? `${showmore}px` : `0px`;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        window.setTimeout((() => {
            target.hidden = !showmore ? true : false;
            !showmore ? target.style.removeProperty("height") : null;
            target.style.removeProperty("padding-top");
            target.style.removeProperty("padding-bottom");
            target.style.removeProperty("margin-top");
            target.style.removeProperty("margin-bottom");
            !showmore ? target.style.removeProperty("overflow") : null;
            target.style.removeProperty("transition-duration");
            target.style.removeProperty("transition-property");
            target.classList.remove("_slide");
            document.dispatchEvent(new CustomEvent("slideUpDone", {
                detail: {
                    target
                }
            }));
        }), duration);
    }
};
let _slideDown = (target, duration = 500, showmore = 0) => {
    if (!target.classList.contains("_slide")) {
        target.classList.add("_slide");
        target.hidden = target.hidden ? false : null;
        showmore ? target.style.removeProperty("height") : null;
        let height = target.offsetHeight;
        target.style.overflow = "hidden";
        target.style.height = showmore ? `${showmore}px` : `0px`;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        target.offsetHeight;
        target.style.transitionProperty = "height, margin, padding";
        target.style.transitionDuration = duration + "ms";
        target.style.height = height + "px";
        target.style.removeProperty("padding-top");
        target.style.removeProperty("padding-bottom");
        target.style.removeProperty("margin-top");
        target.style.removeProperty("margin-bottom");
        window.setTimeout((() => {
            target.style.removeProperty("height");
            target.style.removeProperty("overflow");
            target.style.removeProperty("transition-duration");
            target.style.removeProperty("transition-property");
            target.classList.remove("_slide");
            document.dispatchEvent(new CustomEvent("slideDownDone", {
                detail: {
                    target
                }
            }));
        }), duration);
    }
};
let _slideToggle = (target, duration = 500) => {
    if (target.hidden) return _slideDown(target, duration); else return _slideUp(target, duration);
};

function getHash() {
    if (location.hash) { return location.hash.replace('#', ''); }
}

function dataMediaQueries(array, dataSetValue) {
    const media = Array.from(array).filter(function (item) {
        return item.dataset[dataSetValue];
    });

    if (media.length) {
        const breakpointsArray = media.map(item => {
            const params = item.dataset[dataSetValue];
            const paramsArray = params.split(",");
            return {
                value: paramsArray[0],
                type: paramsArray[1] ? paramsArray[1].trim() : "max",
                item: item
            };
        });

        const mdQueries = uniqArray(
            breakpointsArray.map(item => `(${item.type}-width: ${item.value}px),${item.value},${item.type}`)
        );

        const mdQueriesArray = mdQueries.map(breakpoint => {
            const [query, value, type] = breakpoint.split(",");
            const matchMedia = window.matchMedia(query);
            const itemsArray = breakpointsArray.filter(item => item.value === value && item.type === type);
            return { itemsArray, matchMedia };
        });

        return mdQueriesArray;
    }
}

function uniqArray(array) {
    return array.filter(function (item, index, self) {
        return self.indexOf(item) === index;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Класс для создания таймера
    class CountdownTimer {
        constructor(element, targetDate) {
            this.element = element;
            this.targetDate = new Date(targetDate);

            this.daysVal = element.querySelector('.time-count__days .time-count__val');
            this.hoursVal = element.querySelector('.time-count__hours .time-count__val');
            this.minutesVal = element.querySelector('.time-count__minutes .time-count__val');

            this.update();
            this.interval = setInterval(() => this.update(), 1000);
        }

        normalize(n) {
            return n <= 9 ? `0${n}` : n;
        }

        update() {
            const now = new Date();
            let leftUntil = this.targetDate - now;

            // Если время истекло
            if (leftUntil <= 0) {
                clearInterval(this.interval);
                this.daysVal.textContent = '00';
                this.hoursVal.textContent = '00';
                this.minutesVal.textContent = '00';
                return;
            }

            const days = this.normalize(Math.floor(leftUntil / 1000 / 60 / 60 / 24));
            const hours = this.normalize(Math.floor(leftUntil / 1000 / 60 / 60) % 24);
            const minutes = this.normalize(Math.floor(leftUntil / 1000 / 60) % 60);

            this.daysVal.innerHTML = days.toString().replace(/\d/gi, (d) => `<span>${d}</span>`);
            this.hoursVal.innerHTML = hours.toString().replace(/\d/gi, (d) => `<span>${d}</span>`);
            this.minutesVal.innerHTML = minutes.toString().replace(/\d/gi, (d) => `<span>${d}</span>`);
        }
    }

    // Инициализация всех таймеров на странице
    document.querySelectorAll('.time-count').forEach(timerElement => {
        const targetDate = timerElement.getAttribute('data-target-date');
        if (targetDate) {
            new CountdownTimer(timerElement, targetDate);
        }
    });
});

class Popup {
    constructor(options) {
        let config = {
            logging: true,
            init: true,
            attributeOpenButton: "data-popup",
            attributeCloseButton: "data-close",
            fixElementSelector: "[data-lp]",
            youtubeAttribute: "data-popup-youtube",
            youtubePlaceAttribute: "data-popup-youtube-place",
            setAutoplayYoutube: true,
            classes: {
                popup: "popup",
                popupContent: "popup__content",
                popupActive: "popup_show",
                bodyActive: "popup-show"
            },
            focusCatch: true,
            closeEsc: true,
            bodyLock: true,
            hashSettings: {
                goHash: true
            },
            on: {
                beforeOpen: function () { },
                afterOpen: function () { },
                beforeClose: function () { },
                afterClose: function () { }
            }
        };
        this.youTubeCode;
        this.isOpen = false;
        this.targetOpen = {
            selector: false,
            element: false
        };
        this.previousOpen = {
            selector: false,
            element: false
        };
        this.lastClosed = {
            selector: false,
            element: false
        };
        this._dataValue = false;
        this.hash = false;
        this._reopen = false;
        this._selectorOpen = false;
        this.lastFocusEl = false;
        this._focusEl = ["a[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "button:not([disabled]):not([aria-hidden])", "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "area[href]", "iframe", "object", "embed", "[contenteditable]", '[tabindex]:not([tabindex^="-"])'];
        this.options = {
            ...config,
            ...options,
            classes: {
                ...config.classes,
                ...options?.classes
            },
            hashSettings: {
                ...config.hashSettings,
                ...options?.hashSettings
            },
            on: {
                ...config.on,
                ...options?.on
            }
        };
        this.bodyLock = false;
        this.options.init ? this.initPopups() : null;
    }
    initPopups() {
        this.eventsPopup();
    }
    eventsPopup() {
        document.addEventListener("click", function (e) {
            const buttonOpen = e.target.closest(`[${this.options.attributeOpenButton}]`);
            if (buttonOpen) {
                e.preventDefault();
                this._dataValue = buttonOpen.getAttribute(this.options.attributeOpenButton) ? buttonOpen.getAttribute(this.options.attributeOpenButton) : "error";
                this.youTubeCode = buttonOpen.getAttribute(this.options.youtubeAttribute) ? buttonOpen.getAttribute(this.options.youtubeAttribute) : null;
                if ("error" !== this._dataValue) {
                    if (!this.isOpen) this.lastFocusEl = buttonOpen;
                    this.targetOpen.selector = `${this._dataValue}`;
                    this._selectorOpen = true;
                    this.open();
                    return;
                }
                return;
            }
            const buttonClose = e.target.closest(`[${this.options.attributeCloseButton}]`);
            if (buttonClose || !e.target.closest(`.${this.options.classes.popupContent}`) && this.isOpen) {
                e.preventDefault();
                this.close();
                return;
            }
        }.bind(this));
        document.addEventListener("keydown", function (e) {
            if (this.options.closeEsc && 27 == e.which && "Escape" === e.code && this.isOpen) {
                e.preventDefault();
                this.close();
                return;
            }
            if (this.options.focusCatch && 9 == e.which && this.isOpen) {
                this._focusCatch(e);
                return;
            }
        }.bind(this));
        if (this.options.hashSettings.goHash) {
            window.addEventListener("hashchange", function () {
                if (window.location.hash) this._openToHash(); else this.close(this.targetOpen.selector);
            }.bind(this));
            window.addEventListener("load", function () {
                if (window.location.hash) this._openToHash();
            }.bind(this));
        }
    }
    open(selectorValue) {
        if (bodyLockStatus) {
            this.bodyLock = document.documentElement.classList.contains("lock") && !this.isOpen ? true : false;
            if (selectorValue && "string" === typeof selectorValue && "" !== selectorValue.trim()) {
                this.targetOpen.selector = selectorValue;
                this._selectorOpen = true;
            }
            if (this.isOpen) {
                this._reopen = true;
                this.close();
            }
            if (!this._selectorOpen) this.targetOpen.selector = this.lastClosed.selector;
            if (!this._reopen) this.previousActiveElement = document.activeElement;
            this.targetOpen.element = document.querySelector(this.targetOpen.selector);
            if (this.targetOpen.element) {
                if (this.youTubeCode) {
                    const codeVideo = this.youTubeCode;
                    const urlVideo = `https://www.youtube.com/embed/${codeVideo}?rel=0&showinfo=0&autoplay=1`;
                    const iframe = document.createElement("iframe");
                    iframe.setAttribute("allowfullscreen", "");
                    const autoplay = this.options.setAutoplayYoutube ? "autoplay;" : "";
                    iframe.setAttribute("allow", `${autoplay}; encrypted-media`);
                    iframe.setAttribute("src", urlVideo);
                    if (!this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) {
                        this.targetOpen.element.querySelector(".popup__text").setAttribute(`${this.options.youtubePlaceAttribute}`, "");
                    }
                    this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).appendChild(iframe);
                }
                const videoElement = this.targetOpen.element.querySelector("video");
                if (videoElement) {
                    videoElement.muted = true;
                    videoElement.currentTime = 0;
                    videoElement.play().catch((e => console.error("Autoplay error:", e)));
                }
                if (this.options.hashSettings.location) {
                    this._getHash();
                    this._setHash();
                }
                this.options.on.beforeOpen(this);
                document.dispatchEvent(new CustomEvent("beforePopupOpen", {
                    detail: {
                        popup: this
                    }
                }));
                this.targetOpen.element.classList.add(this.options.classes.popupActive);
                document.documentElement.classList.add(this.options.classes.bodyActive);
                if (!this._reopen) !this.bodyLock ? bodyLock() : null; else this._reopen = false;
                this.targetOpen.element.setAttribute("aria-hidden", "false");
                this.previousOpen.selector = this.targetOpen.selector;
                this.previousOpen.element = this.targetOpen.element;
                this._selectorOpen = false;
                this.isOpen = true;
                this.options.on.afterOpen(this);
                document.dispatchEvent(new CustomEvent("afterPopupOpen", {
                    detail: {
                        popup: this
                    }
                }));
            }
        }
    }
    close(selectorValue) {
        if (selectorValue && "string" === typeof selectorValue && "" !== selectorValue.trim()) this.previousOpen.selector = selectorValue;
        if (!this.isOpen || !bodyLockStatus) return;
        this.options.on.beforeClose(this);
        document.dispatchEvent(new CustomEvent("beforePopupClose", {
            detail: {
                popup: this
            }
        }));
        if (this.youTubeCode) if (this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).innerHTML = "";
        this.previousOpen.element.classList.remove(this.options.classes.popupActive);
        const videoElement = this.previousOpen.element.querySelector("video");
        if (videoElement) videoElement.pause();
        this.previousOpen.element.setAttribute("aria-hidden", "true");
        if (!this._reopen) {
            document.documentElement.classList.remove(this.options.classes.bodyActive);
            !this.bodyLock ? bodyUnlock() : null;
            this.isOpen = false;
        }
        document.dispatchEvent(new CustomEvent("afterPopupClose", {
            detail: {
                popup: this
            }
        }));
    }
    _getHash() {
        if (this.options.hashSettings.location) this.hash = this.targetOpen.selector.includes("#") ? this.targetOpen.selector : this.targetOpen.selector.replace(".", "#");
    }
    _openToHash() {
        let classInHash = document.querySelector(`.${window.location.hash.replace("#", "")}`) ? `.${window.location.hash.replace("#", "")}` : document.querySelector(`${window.location.hash}`) ? `${window.location.hash}` : null;
        const buttons = document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) ? document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) : document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash.replace(".", "#")}"]`);
        if (buttons && classInHash) this.open(classInHash);
    }
    _setHash() {
        history.pushState("", "", this.hash);
    }
    _removeHash() {
        history.pushState("", "", window.location.href.split("#")[0]);
    }
    _focusCatch(e) {
        const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
        const focusArray = Array.prototype.slice.call(focusable);
        const focusedIndex = focusArray.indexOf(document.activeElement);
        if (e.shiftKey && 0 === focusedIndex) {
            focusArray[focusArray.length - 1].focus();
            e.preventDefault();
        }
        if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
            focusArray[0].focus();
            e.preventDefault();
        }
    }
}
modules_flsModules.popup = new Popup({});

function menuOpen() {
    bodyLock();
    document.documentElement.classList.add("menu-open");
}
function menuClose() {
    bodyUnlock();
    document.documentElement.classList.remove("menu-open");
}
