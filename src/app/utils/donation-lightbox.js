import "./confetti";
export class DonationLightbox {
  constructor() {
    console.log("DonationLightbox: constructor");
    window.dataLayer = window.dataLayer || [];
    this.defaultOptions = {
      image: "",
      logo: "",
      title: "",
      paragraph: "",
      footer: "",
      bg_color: "#FFFFFF",
      txt_color: "#252525",
      form_color: "#252525",
      url: null,
      cookie_hours: 24,
      cookie_name: "HideDonationLightbox",
      trigger: 0, // int-seconds, px-scroll location, %-scroll location, exit-mouse leave
      gtm_open_event_name: "donation_lightbox_display",
      gtm_close_event_name: "donation_lightbox_closed",
      gtm_suppressed_event_name: "donation_lightbox_supressed",
    };
    this.donationinfo = {};
    this.options = { ...this.defaultOptions };
    this.animationEnd = false;
    this.triggered = false;
    this.init();
  }
  setOptions(options) {
    this.options = Object.assign(this.options, options);
  }
  loadOptions(element = null) {
    if (typeof window.DonationLightboxOptions !== "undefined") {
      this.setOptions(
        Object.assign(this.defaultOptions, window.DonationLightboxOptions)
      );
    } else {
      this.setOptions(this.defaultOptions);
    }
    if (!element) {
      return;
    }
    // Get Data Attributes
    let data = element.dataset;
    console.log("DonationLightbox: loadOptions: data: ", data);
    // Set Options
    if ("image" in data) {
      this.options.image = data.image;
    }
    if ("logo" in data) {
      this.options.logo = data.logo;
    }
    if ("title" in data) {
      this.options.title = data.title;
    }
    if ("paragraph" in data) {
      this.options.paragraph = data.paragraph;
    }
    if ("footer" in data) {
      this.options.footer = data.footer;
    }
    if ("bg_color" in data) {
      this.options.bg_color = data.bg_color;
    }
    if ("txt_color" in data) {
      this.options.txt_color = data.txt_color;
    }
    if ("form_color" in data) {
      this.options.form_color = data.form_color;
    }
  }
  init() {
    console.log("DonationLightbox: init");
    document.querySelectorAll("[data-donation-lightbox]").forEach((e) => {
      e.addEventListener(
        "click",
        (event) => {
          event.preventDefault();
          // Get clicked element
          let element = event.target;
          console.log("DonationLightbox: init: clicked element: " + element);
          this.build(event);
        },
        false
      );
    });
    window.addEventListener("message", this.receiveMessage.bind(this), false);
    if (
      typeof window.DonationLightboxOptions !== "undefined" &&
      window.DonationLightboxOptions.hasOwnProperty("url")
    ) {
      this.loadOptions();
      const triggerType = this.getTriggerType(this.options.trigger);
      console.log("Trigger type: ", triggerType);
      if (!this.getCookie()) {
        if (triggerType === false) {
          this.options.trigger = 2000;
        }
        if (triggerType === "seconds") {
          this.options.trigger = Number(this.options.trigger) * 1000;
        }
        if (triggerType === "seconds" || triggerType === false) {
          window.setTimeout(() => {
            this.build(window.DonationLightboxOptions.url);
          }, this.options.trigger);
        }
        if (triggerType === "exit") {
          document.body.addEventListener("mouseout", (e) => {
            if (e.clientY < 0 && !this.triggered) {
              this.build(window.DonationLightboxOptions.url);
              this.triggered = true;
            }
          });
        }
        if (triggerType === "pixels") {
          document.addEventListener(
            "scroll",
            this.scrollTriggerPx.bind(this),
            true
          );
        }
        if (triggerType === "percent") {
          document.addEventListener(
            "scroll",
            this.scrollTriggerPercent.bind(this),
            true
          );
        }
      } else {
        window.dataLayer.push({
          event: this.options.gtm_suppressed_event_name,
        });
      }
    }
  }
  build(event) {
    console.log("DonationLightbox: build", typeof event);
    let href = null;
    if (typeof event === "object") {
      // Get clicked element
      let element = event.target;
      this.loadOptions(element);
      href = new URL(element.href);
    } else {
      href = new URL(event);
    }
    // Delete overlay if exists
    if (this.overlay) {
      this.overlay.parentNode.removeChild(this.overlay);
    }
    this.overlayID = "foursite-" + Math.random().toString(36).substring(7);
    href.searchParams.append("color", this.options.form_color);
    // Append current URL params to the href
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    for (const [key, value] of Object.entries(params)) {
      href.searchParams.set(key, value);
    }
    const markup = `
      <div class="foursiteDonationLightbox-container">
        ${
          this.options.logo
            ? `<img class="dl-mobile-logo" src="${this.options.logo}" alt="${this.options.title}">`
            : ""
        }
        <div class="dl-content">
          <div class="left" style="background-color: ${
            this.options.bg_color
          }; color: ${this.options.txt_color}">
            ${
              this.options.logo
                ? `<img class="dl-logo" src="${this.options.logo}" alt="${this.options.title}">`
                : ""
            }
            <div class="dl-container">
              <img class="dl-hero" src="${this.options.image}" alt="${
      this.options.title
    }" />
              <div class="dl-container-inner">
                <h1 class="dl-title" style="color: ${this.options.txt_color}">${
      this.options.title
    }</h1>
                <p class="dl-paragraph" style="color: ${
                  this.options.txt_color
                }">${this.options.paragraph}</p>
              </div>
              <div class="dl-celebration">
                <div class="frame frame1">
                    <h3>THANK YOU,</h3>
                    <h2 class="name">Fernando!</h2>
                </div>
              </div>
            </div>
          </div>
          <div class="right">
            <a href="#" class="dl-button-close"></a>
            <div class="dl-loading" style="background-color: #252525">
              <div class="spinner">
                <div class="double-bounce1"></div>
                <div class="double-bounce2"></div>
              </div>
            </div>
            <iframe loading='lazy' id='dl-iframe' width='100%' scrolling='no' class='dl-iframe' src='${href}' frameborder='0' allowfullscreen></iframe>
          </div>
        </div>
        <div class="dl-footer">
          <p>${this.options.footer}</p>                    
        </div>
      </div>
            `;
    let overlay = document.createElement("div");
    overlay.id = this.overlayID;
    overlay.classList.add("is-hidden");
    overlay.classList.add("foursiteDonationLightbox");
    overlay.innerHTML = markup;
    const closeButton = overlay.querySelector(".dl-button-close");
    closeButton.addEventListener("click", this.close.bind(this));
    overlay.addEventListener("click", (e) => {
      if (e.target.id == this.overlayID) {
        this.close(e);
      }
    });
    document.addEventListener("keyup", (e) => {
      if (e.key === "Escape") {
        closeButton.click();
      }
    });
    this.overlay = overlay;
    document.body.appendChild(overlay);
    this.open();
  }
  open() {
    window.dataLayer.push({ event: this.options.gtm_open_event_name });
    this.overlay.classList.remove("is-hidden");
    document.body.classList.add("has-DonationLightbox");
  }

  close(e) {
    window.dataLayer.push({ event: this.options.gtm_close_event_name });
    e.preventDefault();
    this.overlay.classList.add("is-hidden");
    document.body.classList.remove("has-DonationLightbox");
    if (this.options.url) {
      this.setCookie(this.options.cookie_hours);
    }
  }
  // Receive a message from the child iframe
  receiveMessage(event) {
    console.log("DonationLightbox: receiveMessage: event: ", event);
    const message = event.data;
    if (message.key === "status") {
      this.status(message.value, event);
    }
    if (message.key === "error") {
      this.error(message.value, event);
    }
    if (message.key === "class") {
      document
        .querySelector(".foursiteDonationLightbox")
        .classList.add(message.value);
    }
    if (message.key === "donationinfo") {
      this.donationinfo = JSON.parse(message.value);
      console.log(
        "DonationLightbox: receiveMessage: donationinfo: ",
        this.donationinfo
      );
    }
    if (message.key === "firstname") {
      const firstname = message.value;
      const nameHeading = document.querySelector(".dl-celebration h2.name");
      if (nameHeading) {
        nameHeading.innerHTML = firstname + "!";
        if (firstname.length > 12) {
          nameHeading.classList.add("big-name");
        }
      }
    }
  }
  status(status, event) {
    if (status === "loading") {
      document.querySelector(".dl-loading").classList.remove("is-loaded");
    }
    if (status === "loaded") {
      document.querySelector(".dl-loading").classList.add("is-loaded");
    }
    if (status === "submitted") {
      this.donationinfo.frequency =
        this.donationinfo.frequency == "no" ? "" : this.donationinfo.frequency;
      let iFrameUrl = new URL(document.getElementById("dl-iframe").src);
      for (const key in this.donationinfo) {
        iFrameUrl.searchParams.append(key, this.donationinfo[key]);
      }
      document.getElementById("dl-iframe").src = iFrameUrl
        .toString()
        .replace("/donate/1", "/donate/2");
    }
    if (status === "close") {
      this.close(event);
    }
    if (status === "celebrate") {
      this.celebrate();
    }
  }
  error(error, event) {
    this.shake();
    // console.error(error);
    const container = document.querySelector(
      ".foursiteDonationLightbox .right"
    );
    const errorMessage = document.createElement("div");
    errorMessage.classList.add("error-message");
    errorMessage.innerHTML = `<p>${error}</p><a class="close" href="#">Close</a>`;
    errorMessage.querySelector(".close").addEventListener("click", (e) => {
      e.preventDefault();
      errorMessage.classList.remove("dl-is-visible");
      // One second after close animation ends, remove the error message
      setTimeout(() => {
        errorMessage.remove();
      }, 1000);
    });
    container.appendChild(errorMessage);
    // 300ms after error message is added, show the error message
    setTimeout(() => {
      errorMessage.classList.add("dl-is-visible");
      // Five seconds after error message is shown, remove the error message
      setTimeout(() => {
        errorMessage.querySelector(".close").click();
      }, 5000);
    }, 300);
  }
  celebrate() {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 100000,
      useWorker: false,
    };

    const randomInRange = (min, max) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        })
      );
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        })
      );
    }, 250);
    // Left Animation
    const leftContainer = document.querySelector(
      `#${this.overlayID} .dl-content .left`
    );
    if (leftContainer) {
      leftContainer.classList.add("celebrating");
      const logo = leftContainer.querySelector(".dl-logo");
      this.loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.2.0/gsap.min.js",
        () => {
          const tl = gsap.timeline();
          if (logo) {
            tl.to(logo, {
              duration: 1,
              x: "-50%",
              left: "50%",
              top: "155px",
              maxWidth: "185px",
              scale: 1.5,
              ease: "power1.inOut",
            });
          }
          tl.to(
            ".frame1",
            {
              bottom: "200px",
              duration: 1,
              ease: "power1.inOut",
            },
            ">-1"
          );
        }
      );
    }
  }
  startBunny() {
    this.loadScript(
      "https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.7.14/lottie.min.js",
      () => {
        const tl2 = gsap.timeline();
        tl2.set([...document.querySelectorAll(".frame3 .phrase")].slice(1), {
          right: "10000vw",
        });
        tl2.to(".frame2", {
          opacity: "1",
          duration: 1,
          ease: "power1.inOut",
        });
        tl2.add(() => {
          const anim = bodymovin.loadAnimation({
            container: document.querySelector("#bunnyAnimation"),
            renderer: "svg",
            loop: false,
            autoplay: true,
            path: "https://000665513.codepen.website/data.json",
          });
          anim.addEventListener("complete", () => {
            anim.goToAndPlay(130, true);
            this.startSlider();
          });
        }, "+=0.5");
        // Make the text grow
        tl2.fromTo(".frame3", 1, { scale: 0 }, { scale: 1 }, "+=6.5");
      }
    );
  }
  startSlider() {
    // return;
    if (this.animationEnd) {
      return;
    }
    let $slides = [...document.querySelectorAll(".frame3 .phrase")];
    let currentSlide = 0;

    TweenLite.set($slides.slice(1), { right: "600px" }); // Hide all but the first slide

    const nextSlide = function () {
      TweenLite.to($slides[currentSlide], 1, { right: "-600px" });

      if (currentSlide < $slides.length - 1) {
        currentSlide++;
      } else {
        currentSlide = 0;
      }

      TweenLite.fromTo(
        $slides[currentSlide],
        1,
        { right: "600px" },
        { right: "0px" }
      );
      TweenLite.delayedCall(3, nextSlide);
    };
    TweenLite.delayedCall(0.1, nextSlide); // Start the timer

    this.animationEnd = true;
  }
  shake() {
    const element = document.querySelector(".dl-content");
    if (element) {
      element.classList.add("shake");
      // Remove class after 1 second
      setTimeout(() => {
        element.classList.remove("shake");
      }, 1000);
    }
  }
  setCookie(hours = 24, path = "/") {
    const expires = new Date(Date.now() + hours * 36e5).toUTCString();
    document.cookie =
      this.options.cookie_name +
      "=" +
      encodeURIComponent(true) +
      "; expires=" +
      expires +
      "; path=" +
      path;
  }

  getCookie() {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${this.options.cookie_name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  deleteCookie(path = "/") {
    setCookie(this.options.cookie_name, "", -1, path);
  }
  loadScript(url, callback) {
    const script = document.createElement("script");
    script.src = url;
    document.body.appendChild(script);

    script.onload = () => {
      if (callback) callback();
    };
  }

  // Trigger Functions
  getTriggerType(trigger) {
    /**
     * Any integer (e.g., 5) -> Number of seconds to wait before triggering the lightbox
     * Any pixel (e.g.: 100px) -> Number of pixels to scroll before trigger the lightbox
     * Any percentage (e.g., 30%) -> Percentage of the height of the page to scroll before triggering the lightbox
     * The word exit -> Triggers the lightbox when the mouse leaves the DOM area (exit intent).
     * With 0 as default, the lightbox will trigger as soon as the page finishes loading.
     */
    console.log("Trigger Value: ", trigger);

    if (!isNaN(trigger)) {
      return "seconds";
    } else if (trigger.includes("px")) {
      return "pixels";
    } else if (trigger.includes("%")) {
      return "percent";
    } else if (trigger.includes("exit")) {
      return "exit";
    } else {
      return false;
    }
  }
  scrollTriggerPx(e) {
    const triggerValue = Number(this.options.trigger.replace("px", ""));
    if (window.scrollY >= triggerValue && !this.triggered) {
      this.build(window.DonationLightboxOptions.url);
      this.triggered = true;
    }
  }
  scrollTriggerPercent(e) {
    const triggerValue = Number(this.options.trigger.replace("%", ""));
    const clientHeight = document.documentElement.clientHeight;
    const scrollHeight = document.documentElement.scrollHeight - clientHeight;
    const target = (triggerValue / 100) * scrollHeight;
    if (window.scrollY >= target && !this.triggered) {
      this.build(window.DonationLightboxOptions.url);
      this.triggered = true;
    }
  }
}
