"use strict";

document.addEventListener("DOMContentLoaded", function () {
   const tabheaderItem = document.querySelectorAll(".tabheader__item"),
      tabcontent = document.querySelectorAll(".tabcontent"),
      tabheaderItems = document.querySelector(".tabheader__items"),
      days = document.querySelector("#days"),
      hours = document.querySelector("#hours"),
      minutes = document.querySelector("#minutes"),
      seconds = document.querySelector("#seconds");

   // Tab uchun
   function heddin() {
      tabcontent.forEach((item) => {
         item.classList.add("heddin");
         item.classList.remove("fade");
      });

      tabheaderItem.forEach((item) => {
         item.classList.remove("tabheader__item_active");
      });
   }

   function block(i = 0) {
      tabcontent[i].classList.remove("heddin");
      tabcontent[i].classList.add("fade");
      tabheaderItem[i].classList.add("tabheader__item_active");
   }
   heddin();
   block();

   tabheaderItems.addEventListener("click", (event) => {
      let target = event.target;

      if (target.classList.contains("tabheader__item")) {
         tabheaderItem.forEach((item, i) => {
            if (target == item) {
               heddin();
               block(i);
            }
         });
      }
   });

   // timer uchun

   const deadline = "2022-02-01";

   function getTimeRemaining(endtime) {
      let t = Date.parse(endtime) - Date.parse(new Date());

      const days = Math.floor(t / (1000 * 60 * 60 * 24)),
         hours = Math.floor((t / (1000 * 60 * 60)) % 24),
         minutes = Math.floor((t / 1000 / 60) % 60),
         seconds = Math.floor((t / 1000) % 60);

      return {
         total: t,
         days: days,
         hours: hours,
         minutes: minutes,
         seconds: seconds,
      };
   }

   function getZero(num) {
      if (num <= 0 && num < 10) {
         return `0${num}`;
      } else {
         return num;
      }
   }

   function setClock(selector, endtime) {
      const timer = document.querySelector(selector),
         days = timer.querySelector("#days"),
         hours = timer.querySelector("#hours"),
         minutes = timer.querySelector("#minutes"),
         seconds = timer.querySelector("#seconds"),
         timeInterval = setInterval(updateClock, 1000);

      updateClock();

      function updateClock() {
         const t = getTimeRemaining(endtime);

         days.textContent = getZero(t.days);
         hours.textContent = getZero(t.hours);
         minutes.textContent = getZero(t.minutes);
         seconds.textContent = getZero(t.seconds);

         if (t.total <= 0) {
            clearInterval(timeInterval);
         }
      }
   }

   setClock(".timer", deadline);

   // Modal uchun

   const modalTrigger = document.querySelectorAll("[data-modal]"),
      modal = document.querySelector(".modal"),
      modalCloseBtn = document.querySelector("[data-close]");

   function openModal() {
      modal.classList.add("block");
      // clearInterval(modalTimerId);
   }

   function closeModal() {
      modal.classList.remove("block");
   }

   modalTrigger.forEach((btn) => {
      btn.addEventListener("click", openModal);
   });

   modalCloseBtn.addEventListener("click", function () {
      closeModal();
   });

   modal.addEventListener("click", function (e) {
      console.log(e.target);
      if (e.target === modal || e.target.getAttribute("data-close") == "") {
         closeModal();
      }
   });

   document.addEventListener("keydown", function (e) {
      if (e.keyCode === 27 && modal.classList.contains("block")) {
         closeModal();
      }
   });

   // const modalTimerId = setTimeout(openModal, 3000);

   function showModalByScroll() {
      if (window.scrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
         openModal();
         window.removeEventListener("scroll", showModalByScroll);
      }
   }

   window.addEventListener("scroll", showModalByScroll);

   // Используем классы для создание карточек меню

   class MenuCard {
      constructor(src, alt, titel, descr, price, parentSelector, ...classes) {
         this.src = src;
         this.alt = alt;
         this.titel = titel;
         this.descr = descr;
         this.price = price;
         this.classes = classes;
         this.parent = document.querySelector(parentSelector);
      }

      render() {
         const div = document.createElement("div");

         if (this.classes.length === 0) {
            this.classes = "menu__item";
            div.classList.add(this.classes);
         } else {
            this.classes.forEach((className) => div.classList.add(className));
         }

         div.innerHTML = `
				<div class="menu__item">
					<img src=${this.src} alt=${this.alt}>
					<h3 class="menu__item-subtitle">${this.titel}</h3>
					<div class="menu__item-descr">${this.descr}</div>
					<div class="menu__item-divider"></div>
					<div class="menu__item-price">
						<div class="menu__item-cost">Цена:</div>
						<div class="menu__item-total"><span>${this.price}</span> сум/день</div>
					</div>
				</div>
			`;

         this.parent.append(div);
      }
   }

   const getResource = async (url) => {
      const res = await fetch(url);

      if (!res.ok) {
         throw new Error(`Could not fetch ${url}, status: ${res.status}`);
      }

      return await res.json();
   };

   getResource("http://localhost:1337/api/blog-service-1s?populate=*").then((data) => {
      data.data.forEach((item) => {
         // console.log(item);
         let aa = {
            altimg: item.attributes.altimg,
            titel: item.attributes.titel,
            descr: item.attributes.descr,
            price: item.attributes.price,
            img: `http://localhost:1337${item.attributes.img.data[0].attributes.formats.thumbnail.url}`,
         };

         new MenuCard(aa.img, aa.altimg, aa.titel, aa.descr, aa.price, ".menu .container").render();
      });
   });

   // Forms

   const forms = document.querySelectorAll("form");
   const message = {
      loading: "img/form/spinner.svg",
      success: "Raxmat! Yaqin orada biz siz bilan bog'lanamiz",
      failure: "Nimadir notug'ri buldi...",
   };

   forms.forEach((item) => {
      bindPostData(item);
   });

   const postData = async (url, data) => {
      const res = await fetch(url, {
         method: "POST",
         headers: {
            "Content-type": "application/json",
         },
         body: JSON.stringify(data),
      });

      return await res.json();
   };

   function bindPostData(form) {
      form.addEventListener("submit", (e) => {
         e.preventDefault();
         let statusMessage = document.createElement("img");
         statusMessage.src = message.loading;
         statusMessage.style.cssText = `
				display: block;
				margin: 0 auto;
			`;
         form.insertAdjacentElement("afterend", statusMessage);

         const formData = new FormData(form);

         const inputInfo = Object.fromEntries(formData.entries());
         console.log(e.target);

         postData("http://localhost:1337/api/blog-service-2s", {
            data: {
               name: inputInfo.name,
               phone: inputInfo.phone,
            },
         })
            .then((data) => {
               console.log(data);
               showThanksModal(message.success);
               statusMessage.remove();
            })
            .catch(() => {
               showThanksModal(message.failure);
            })
            .finally(() => {
               form.reset();
            });
      });
   }

   function showThanksModal(message) {
      const prevModalDialog = document.querySelector(".modal__dialog");

      prevModalDialog.classList.add("heddin");
      openModal();

      const thanksModal = document.createElement("div");
      thanksModal.classList.add("modal__dialog");
      thanksModal.innerHTML = `
			<div class="modal__content">
				<div class="modal__close" data-close>×</div>
				<div class="modal__title">${message}</div>
			</div>
		`;
      console.log("xdzczs");
      document.querySelector(".modal").append(thanksModal);
      setTimeout(() => {
         thanksModal.remove();
         prevModalDialog.classList.add("block");
         prevModalDialog.classList.remove("heddin");
         closeModal();
      }, 4000);
   }

   // Modal buyurtmalar

   const modalBuyurtOpen = document.querySelector(".modal-buyurt__open");
   const modalBuyurtma = document.querySelector(".modal__buyurtma");
   const inputPass = document.querySelector(".input__pass");
   const modalLoginInput = document.querySelector(".modal__login-input");
   const modalPassInput = document.querySelector(".modal__pass-input");
   const btn1 = document.querySelector(".btn-1");
   const modal1W = document.querySelector(".modal-1__w");
   let p = document.createElement("p");

   modalBuyurtOpen.addEventListener("click", () => {
      inputPass.classList.add("block");

      btn1.addEventListener("click", () => {
         if (modalLoginInput.value == "Farxod" && modalPassInput.value == "123") {
            modalBuyurtma.classList.add("block");
            inputPass.classList.remove("block");
         } else {
            p.textContent = "Notug'ri ma'lumot kirittingiz";
            modal1W.append(p);
         }
         modalLoginInput.value = "";
         modalPassInput.value = "";
      });
      p.textContent = "";
   });

   modalBuyurtma.addEventListener("click", function (e) {
      console.log(e.target);
      if (e.target === modalBuyurtma || (e.target.getAttribute("data-close") == "" && e.target.className !== "modal__titel")) {
         modalBuyurtma.classList.remove("block");
      }
   });

   document.addEventListener("keydown", function (e) {
      if (e.keyCode === 27 && modalBuyurtma.classList.contains("block")) {
         modalBuyurtma.classList.remove("block");
      }
   });

   inputPass.addEventListener("click", function (e) {
      console.log(e.target);
      if (e.target === inputPass || (e.target.getAttribute("data-close") == "" && e.target.className !== "modal-1__w modal__content")) {
         inputPass.classList.remove("block");
      }
   });

   document.addEventListener("keydown", function (e) {
      if (e.keyCode === 27 && inputPass.classList.contains("block")) {
         inputPass.classList.remove("block");
      }
   });

   class MenuModalB {
      constructor(name, phone, parentSection1, parentSection2) {
         this.name = name;
         this.phone = phone;
         this.parentModalB1 = document.querySelector(parentSection1);
         this.parentModalB2 = document.querySelector(parentSection2);
      }

      renderModalB() {
         const li1 = document.createElement("li");
         const li2 = document.createElement("li");

         li1.innerHTML = `${this.name}`;
         li2.innerHTML = `${this.phone}`;

			console.log(li1,li2);
         this.parentModalB1.append(li1);
         this.parentModalB2.append(li2);
      }
   }

   const getModalResource = async (url) => {
      const resModal = await fetch(url);

      if (!resModal.ok) {
         throw new Error(`Could not fetch ${url}, status: ${resModal.status}`);
      }

      return await resModal.json();
   };

   getModalResource("http://localhost:1337/api/blog-service-2s").then((data) => {
      console.log(data);
      data.data.forEach((item) => {
         let bb = {
            name: item.attributes.name,
            phone: item.attributes.phone,
         };
				
         new MenuModalB(bb.name, bb.phone, ".info-1", ".info-2").renderModalB();
      });
   });

   // Slider

   let offset = 0;
   let slideIndex = 1;

   const slides = document.querySelectorAll(".offer__slide"),
      prev = document.querySelector(".offer__slider-prev"),
      next = document.querySelector(".offer__slider-next"),
      total = document.querySelector("#total"),
      current = document.querySelector("#current"),
      slidesWrapper = document.querySelector(".offer__slider-wrapper"),
      width = window.getComputedStyle(slidesWrapper).width,
      slidesField = document.querySelector(".offer__slider-inner");

   if (slides.length < 10) {
      total.textContent = `0${slides.length}`;
      current.textContent = `0${slideIndex}`;
   } else {
      total.textContent = slides.length;
      current.textContent = slideIndex;
   }

   slidesField.style.width = 100 * slides.length + "%";
   slidesField.style.display = "flex";
   slidesField.style.transition = "0.5s all";

   slidesWrapper.style.overflow = "hidden";

   slides.forEach((slide) => {
      slide.style.width = width;
   });

   next.addEventListener("click", () => {
      if (offset == +width.slice(0, width.length - 2) * (slides.length - 1)) {
         offset = 0;
      } else {
         offset += +width.slice(0, width.length - 2);
      }

      slidesField.style.transform = `translateX(-${offset}px)`;

      if (slideIndex == slides.length) {
         slideIndex = 1;
      } else {
         slideIndex++;
      }

      if (slides.length < 10) {
         current.textContent = `0${slideIndex}`;
      } else {
         current.textContent = slideIndex;
      }
   });

   prev.addEventListener("click", () => {
      if (offset == 0) {
         offset = +width.slice(0, width.length - 2) * (slides.length - 1);
      } else {
         offset -= +width.slice(0, width.length - 2);
      }

      slidesField.style.transform = `translateX(-${offset}px)`;

      if (slideIndex == 1) {
         slideIndex = slides.length;
      } else {
         slideIndex--;
      }

      if (slides.length < 10) {
         current.textContent = `0${slideIndex}`;
      } else {
         current.textContent = slideIndex;
      }
   });

   // Calculator

   const result = document.querySelector(".calculating__result span");

   let sex, height, weight, age, ratio;

   if (localStorage.getItem("sex")) {
      sex = localStorage.getItem("sex");
   } else {
      sex = "female";
      localStorage.setItem("sex", "female");
   }

   if (localStorage.getItem("ratio")) {
      ratio = localStorage.getItem("ratio");
   } else {
      ratio = 1.375;
      localStorage.setItem("ratio", 1.375);
   }

   function calcTotal() {
      if (!sex || !height || !weight || !age || !ratio) {
         result.textContent = "____";
         return;
      }
      if (sex === "female") {
         result.textContent = Math.round((447.6 + 9.2 * weight + 3.1 * height - 4.3 * age) * ratio);
      } else {
         result.textContent = Math.round((88.36 + 13.4 * weight + 4.8 * height - 5.7 * age) * ratio);
      }
   }

   calcTotal();

   function initLocalSettings(selector, activeClass) {
      const elements = document.querySelectorAll(selector);

      elements.forEach((elem) => {
         elem.classList.remove(activeClass);
         if (elem.getAttribute("id") === localStorage.getItem("sex")) {
            elem.classList.add(activeClass);
         }
         if (elem.getAttribute("data-ratio") === localStorage.getItem("ratio")) {
            elem.classList.add(activeClass);
         }
      });
   }

   initLocalSettings("#gender div", "calculating__choose-item_active");
   initLocalSettings(".calculating__choose_big div", "calculating__choose-item_active");

   function getStaticInformation(selector, activeClass) {
      const elements = document.querySelectorAll(selector);

      elements.forEach((elem) => {
         elem.addEventListener("click", (e) => {
            if (e.target.getAttribute("data-ratio")) {
               ratio = +e.target.getAttribute("data-ratio");
               localStorage.setItem("ratio", +e.target.getAttribute("data-ratio"));
            } else {
               sex = e.target.getAttribute("id");
               localStorage.setItem("sex", e.target.getAttribute("id"));
            }

            elements.forEach((elem) => {
               elem.classList.remove(activeClass);
            });

            e.target.classList.add(activeClass);

            calcTotal();
         });
      });
   }

   getStaticInformation("#gender div", "calculating__choose-item_active");
   getStaticInformation(".calculating__choose_big div", "calculating__choose-item_active");

   function getDynamicInformation(selector) {
      const input = document.querySelector(selector);

      input.addEventListener("input", () => {
         if (input.value.match(/\D/g)) {
            input.style.border = "1px solid red";
         } else {
            input.style.border = "none";
         }
         switch (input.getAttribute("id")) {
            case "height":
               height = +input.value;
               break;
            case "weight":
               weight = +input.value;
               break;
            case "age":
               age = +input.value;
               break;
         }

         calcTotal();
      });
   }

   getDynamicInformation("#height");
   getDynamicInformation("#weight");
   getDynamicInformation("#age");
});
