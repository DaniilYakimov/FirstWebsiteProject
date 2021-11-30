function setAnimationDelayAll(items, delay, stepDelay = 0) {
	for (let i = 0; i < items.length; i++) {
		items[i].style.transitionDelay = delay + "s";
		delay += stepDelay;
	}
	return stepDelay;
}

function offset(elem) {
	const rect = elem.getBoundingClientRect(),
		scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
		scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}

function scrollAnimation(classMame) {

	let isScrolling = false;
	let queueItems = new Array();
	let animItems = Array.prototype.slice.call(document.querySelectorAll(classMame));

	animOnScroll();

	if (animItems.length > 0) {
		window.addEventListener("scroll", throttleScrollAnimation, false);
	}

	function throttleScrollAnimation(event) {
		if (!isScrolling) {
			window.requestAnimationFrame(function () {
				animOnScroll();
				isScrolling = false;
			});
		}
		isScrolling = true;
	}

	function animOnScroll() {
		for (let i = 0; i < animItems.length; i++) {
			const item = animItems[i];
			if (item.classList.contains("_active")) {
				continue;
			}
			const itemHeight = item.offsetHeight;
			const itemOffset = offset(item).top;
			const start = 5;

			let itemPoint = window.innerHeight - itemHeight / start;
			if (itemHeight > window.innerHeight) {
				itemPoint = window.innerHeight - window.innerHeight / start;
			}

			if ((scrollY > itemOffset - itemPoint) && (scrollY < itemOffset + itemHeight)) {
				if (item.classList.contains("queue") && !item.classList.contains("_active")) {
					queueItems.push(item);
				}
				else {
					item.classList.add("_active");
				}
				animItems.splice(i, 1);
				i--;
			} else {
				// item.classList.remove("_active");
			}
		}

		if (queueItems.length > 0) {
			setAnimationDelayAll(queueItems, 0, 0.3);
			for (let i = 0; i < queueItems.length; i++) {
				queueItems[i].classList.add("_active");
			}
			queueItems = new Array();
		}

		if (animItems.length === 0) {
			window.removeEventListener("scroll", throttleScrollAnimation);
		}
	}
}

function maxWidthImages(elem) {
	const imgs = elem.querySelectorAll("img");

	let maxWidth = 0;
	for (let i = 0; i < imgs.length; i++) {
		maxWidth = Math.max(maxWidth, imgs[i].width);
	}
	return maxWidth;
}

function bodyScrollLock(classMame, elements=[]) {
	scrollbarWidth = (window.innerWidth - document.body.offsetWidth);
	document.body.classList.toggle(classMame);
	for (let i = 0; i < elements.length; i++) {
		elements[i].style.paddingRight = scrollbarWidth + "px";
	}
}



const swiper = new Swiper('.main .image-slider', {
	navigation: {
		nextEl: '.main .swiper-button-next',
		prevEl: '.main .swiper-button-prev',
	},
	pagination: {
		el: '.main .swiper-pagination',
		clickable: true,
	},
	loop: true,
	autoplay: {
		delay: 3000,
		disableOnInteraction: false,
	},
	watchOverlflow: true,
});

function createSlide(srcImage) {
	const image = document.createElement("img");
	image.src = srcImage;
	image.alt = "Картинка";

	const imageDiv = document.createElement("div");
	imageDiv.classList.add("image-slider__image");
	imageDiv.classList.add("_load");
	imageDiv.appendChild(image);

	const slide = document.createElement("div");
	slide.classList.add("image-slider__slide")
	slide.classList.add("swiper-slide");
	slide.appendChild(imageDiv);

	return slide;
}

function clickMainItem(event) {
	if (event.target.closest(".image-slider") && event.target.tagName === "IMG") {
		const wrappers = event.target.closest(".image-slider__wrapper")
			.querySelectorAll(".image-slider__slide");
		const targetIndex = event.target.closest(".image-slider__slide")
			.getAttribute("data-swiper-slide-index");

		let sources = new Map();
		for (let i = 0; i < wrappers.length; i++) {
			sources.set(wrappers[i].getAttribute("data-swiper-slide-index"),
				wrappers[i].querySelector("img").src);
		}

		if (sources.size > 0) {
			for (i = 0; i < sources.size; i++) {
				const slide = createSlide(sources.get(i.toString()));
				this.popupSwiper.appendSlide(slide);
			}
			this.popupSwiper.slideTo(targetIndex, 0, false);
			this.popupSwiper.updateSize();

			popup.addEventListener("click", clickPopup);
			document.querySelector(".popup").classList.add("_active");
			WaitLoadImages(this.popupWrapper);
			bodyScrollLock("lock-scroll", containers);
			document.querySelector(".header__menu-list").style.paddingRight = "0px";
		}
	}
}

function clickBurger() {
	headerMenu.classList.toggle("_active");
	burger.classList.toggle("_active");
	bodyScrollLock("lock-scroll", containers);
}

function clickMenuArrow(className) {
	scrollHeaderWidth = (window.innerWidth - headerMenuList.offsetWidth);
	menuArrow.classList.toggle("_active");
	subMenu.classList.toggle("_active");

	if (headerMenu.classList.contains("_active") && header.offsetWidth < 970) {
		headerMenuList.style.paddingRight = scrollHeaderWidth + "px";
		headerMenu.classList.toggle(className);
	}
}

function clickNotMenuArrow(event, className) {
	if (menuArrow.classList.contains("_active")) {
		if (header.offsetWidth < 970) {
			scrollHeaderWidth = (window.innerWidth - headerMenuList.offsetWidth);
			headerMenuList.style.paddingRight = scrollHeaderWidth + "px";
			headerMenu.classList.toggle(className);
		}
		else {
			headerMenu.classList.remove(className);
		}
		menuArrow.classList.remove("_active");
		subMenu.classList.remove("_active");
	}
}

function scrollAnimationHeader(className) {
	let isScrolling = false;

	if (header && scrollY > 0) {
		header.classList.add("_active");
	}

	animOnScrollHeader();
	if (header.classList.contains(className)){
		window.addEventListener("scroll", throttleScrollHeader, false);
	}

	function throttleScrollHeader(event) {
		if (!isScrolling) {
			window.requestAnimationFrame(function () {
				animOnScrollHeader();
				isScrolling = false;
			});
		}
		isScrolling = true;
	}

	function animOnScrollHeader() {
		if (scrollY === 0) {
			header.classList.remove("_active");
		}
		else {
			header.classList.add("_active");
		}
	}
}
function clickOnWindow(event) {
	if (event.target.closest(".header__menu-arrow")) {
		clickMenuArrow("scrollY-visible");
	}
	else {
		if (event.target.closest(".header__burger")) {
			clickBurger();
		}
		if(!event.target.closest(".header__menu")){
			clickNotMenuArrow(event, "scrollY-visible");
		}
	}
	
}

const popupSwiper = new Swiper(`.popup .image-slider`, {
	navigation: {
		nextEl: `.popup .swiper-button-next`,
		prevEl: `.popup .swiper-button-prev`,
	},
	pagination: {
		el: `.popup .swiper-pagination`,
		clickable: true,
	},
	watchOverlflow: true,
	effect: "fade",
	allowTouchMove: false,
	fadeEffect: {
		crossFade: true,
	}
});

function autoScrollLeftPopup(){
	window.requestAnimationFrame(function(){
		if (!stopScrolling) autoScrollLeftPopup();
		popup.scrollLeft += 50;
	});
}

function WaitLoadImages(elem) {
	const imgs = elem.querySelectorAll("img");

	function imgLoaded(event) {
		event.target.closest("div").classList.remove("_load");
	}

	for (let i = 0; i < imgs.length; i++) {
		imgs[i].addEventListener("load", imgLoaded, {"once":true});
	}
}

function mouseMovePopup(event) {
	x = (popupWrapper.clientWidth - popup.clientWidth)
		* (event.pageX / popup.clientWidth * 2 - 1/5);
	y = (popupWrapper.clientHeight - popup.clientHeight)
		* ((event.pageY - window.pageYOffset) / popup.clientHeight * 2 - 1/5);
	
	popup.scrollLeft = x;
	popup.scrollTop = y;
}

function changeWidthSlide(zoom) {	
	const currentSlide = popupSwiper.wrapperEl.querySelector(".swiper-slide-active img");
	const widthSlide = zoom ? 0 : Math.min(currentSlide.naturalWidth, popup.clientWidth * 2);
	
	if (currentSlide.naturalWidth < popup.clientWidth && !zoom){
		return false;
	}
	popupWrapper.style.width = popup.clientWidth > (widthSlide + 60) ? "" : `${widthSlide + 60}px`;

	popupWrapper.addEventListener("transitionstart", function(){
		stopScrolling = false;
		autoScrollLeftPopup();
	}, {"once": true});
	popupWrapper.addEventListener("transitionend", function(){
		stopScrolling = true;
		popup.scrollLeft += popupWrapper.clientWidth - window.innerWidth;
	}, {"once": true});
	popupWrapper.addEventListener("transitioncancel", function(){
		stopScrolling = true;
		popup.scrollLeft += (popupWrapper.clientWidth - window.innerWidth);
	}, {"once": true});


	return true;
}


function clickPopupZoom() {
	zoom.classList.toggle("fa-compress");
	zoom.classList.toggle("fa-expand");

	if (changeWidthSlide(isZoom)){
		window.addEventListener("resize", defaultWidthPopupWrapper, {"once":true});
		window.addEventListener("mousemove", mouseMovePopup, {"capture":true});
		isZoom = !isZoom;
	}
	else{
		window.removeEventListener("resize", defaultWidthPopupWrapper, {"once":true});
		window.removeEventListener("mousemove", mouseMovePopup, {"capture":true});
	}
}

function defaultWidthPopupWrapper() {
	popupWrapper.style.width = "";
	isZoom = false;
}

function clickPopupClose() {
	clickChangeSlide();
	popup.classList.remove("_active");
	bodyScrollLock("lock-scroll", containers);
	popupSwiper.removeAllSlides();
	popup.removeEventListener("click", clickPopup);
}

function clickChangeSlide() {
	zoom.classList.remove("fa-compress");
	zoom.classList.add("fa-expand");
	isZoom = false;
	popupWrapper.style.width = "";
}

function clickPopup(event) {
	if (event.target.closest(".popup__zoom")) {
		clickPopupZoom();
	}
	else if (event.target.closest(".popup__close")) {
		clickPopupClose();
	}
	else if(event.target.closest(".swiper-button-prev")){
		clickChangeSlide();
	}
	else if(event.target.closest(".swiper-button-next")){
		clickChangeSlide();
	}
		
	else if(!event.target.closest(".popup .image-slider")){
		if (isZoom){
			zoom.classList.toggle("fa-compress");
			zoom.classList.toggle("fa-expand");
			window.removeEventListener("mousemove", mouseMovePopup, {"capture":true});
			isZoom = false;
			popupWrapper.style.width = "";
		}
		else{
			clickPopupClose();
		}
	}
}


const popup = document.querySelector(".popup");
const popupWrapper = popup.querySelector(".popup__wrapper");
const popupSlider = popupWrapper.querySelector(".image-slider");
const zoom = popupWrapper.querySelector(".popup__zoom");
const popupWidth = getComputedStyle(popupWrapper).width;
let maxWidthImage;
let stopScrolling = true, isClick = false, isZoom = false;
let x, y;



window.addEventListener("click", clickOnWindow);

const header = document.querySelector(".header");
const headerMenu = header.querySelector(".header__menu");
const headerMenuList = headerMenu.querySelector(".header__menu-list");
const burger = header.querySelector(".header__burger-wrapper");
const menuArrow = headerMenuList.querySelector(".header__menu-arrow");
const subMenu = headerMenuList.querySelector(".header-sub-menu");
const phoneBtn = header.querySelector(".header__phone-btn");

phoneBtn.onclick = function () {
	navigator.clipboard.writeText(phoneBtn.querySelector(".number").textContent);
	phoneBtn.querySelector(".number").classList.add("_active");
	phoneBtn.querySelector(".msg").classList.add("_active");
	setTimeout(function() {
		phoneBtn.querySelector(".number").classList.remove("_active");
		phoneBtn.querySelector(".msg").classList.remove("_active");
	}, 1500);
}

scrollAnimationHeader("_animation");
const containers = document.querySelectorAll(".padding-scroll");
const main = document.querySelector(".main");
main.addEventListener("click", {handleEvent: clickMainItem, popupSwiper, popupWrapper});

let scrollbarWidth;
let scrollHeaderWidth = (window.innerWidth - document.body.offsetWidth);


scrollAnimation("._anim-item");