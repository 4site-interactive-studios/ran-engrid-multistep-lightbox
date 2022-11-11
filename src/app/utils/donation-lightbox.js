import "./confetti";
export class DonationLightbox {
  constructor() {
    console.log("DonationLightbox: constructor");
    window.dataLayer = window.dataLayer || [];
    this.defaultOptions = {
      image: "",
      video: "",
      autoplay: false,
      divider: "",
      logo: "",
      logo_position_top: "25px",
      logo_position_left: "25px",
      logo_position_right: 0,
      logo_position_bottom: 0,
      title: "",
      paragraph: "",
      footer: "",
      bg_color: "#0a0a0a",
      txt_color: "#ffffff",
      form_color: "#0a0a0a",
      url: null,
      cookie_hours: 24,
      cookie_name: "HideDonationLightbox",
      trigger: 0, // int-seconds, px-scroll location, %-scroll location, exit-mouse leave
      gtm_open_event_name: "donation_lightbox_display",
      gtm_close_event_name: "donation_lightbox_closed",
      gtm_suppressed_event_name: "donation_lightbox_supressed",
      confetti: ["#0a0a0a", "#FFFFFF", "#6a9913"],
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
                ? `<img class="dl-logo" src="${this.options.logo}" alt="${this.options.title}" style="top: ${this.options.logo_position_top}; left: ${this.options.logo_position_left}; bottom: ${this.options.logo_position_bottom}; right: ${this.options.logo_position_right}; filter: brightness(0) invert(1);">`
                : ""
            }
            <a href="#" class="dl-close-viewmore">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
                <path fill="currentColor" d="M7.214.786c.434-.434 1.138-.434 1.572 0 .433.434.433 1.137 0 1.571L4.57 6.572h10.172c.694 0 1.257.563 1.257 1.257s-.563 1.257-1.257 1.257H4.229l4.557 4.557c.433.434.433 1.137 0 1.571-.434.434-1.138.434-1.572 0L0 8 7.214.786z"></path>
              </svg>
            </a>
            <div class="dl-container" style="background-color: ${
              this.options.bg_color
            }; color: ${this.options.txt_color}">
              ${this.loadHero()}
              ${
                this.options.divider
                  ? `<img class="dl-divider" src="${this.options.divider}" alt="Divider">`
                  : ""
              }
              <div class="dl-container-inner" style="background-color: ${
                this.options.bg_color
              }; color: ${this.options.txt_color}">
                <h1 class="dl-title" style="color: ${this.options.txt_color}">${
      this.options.title
    }</h1>
                <p class="dl-paragraph" style="color: ${
                  this.options.txt_color
                }">${this.options.paragraph}</p>
                <a class="dl-viewmore" href="#"style="color: ${
                  this.options.txt_color
                }; border-color: ${this.options.txt_color}">View More</a>
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
            <div class="dl-loading">
              <div class="spinner">
                <div class="double-bounce1"></div>
                <div class="double-bounce2"></div>
              </div>
            </div>
            <iframe allow='payment' loading='lazy' id='dl-iframe' width='100%' scrolling='no' class='dl-iframe' src='${href}' frameborder='0' allowfullscreen></iframe>
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

    const closeViewMore = overlay.querySelector(".dl-close-viewmore");
    closeViewMore.addEventListener("click", (e) => {
      e.preventDefault();
      overlay.querySelector(".left").classList.remove("view-more");
    });

    const viewmore = overlay.querySelector(".dl-viewmore");
    viewmore.addEventListener("click", (e) => {
      e.preventDefault();
      overlay.querySelector(".left").classList.add("view-more");
    });

    const videoElement = overlay.querySelector("video");
    if (videoElement) {
      const playButton = overlay.querySelector(".btn-play");
      if (playButton) {
        playButton.addEventListener("click", () => {
          if (videoElement) {
            if (videoElement.paused) {
              videoElement.play();
            } else {
              videoElement.pause();
            }
          }
        });
      }
      videoElement.addEventListener("play", (event) => {
        overlay.querySelector(".dl-container").classList.add("playing");
        overlay.querySelector(".dl-container").classList.remove("paused");
      });
      videoElement.addEventListener("pause", (event) => {
        overlay.querySelector(".dl-container").classList.remove("playing");
        overlay.querySelector(".dl-container").classList.add("paused");
      });
      videoElement.addEventListener("ended", (event) => {
        overlay.querySelector(".dl-container").classList.remove("playing");
        overlay.querySelector(".dl-container").classList.remove("paused");
        videoElement.load();
      });
    }

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
      colors: this.options.confetti,
    };

    const randomInRange = (min, max) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      if (this.options.confetti.length > 0) {
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
      }
    }, 250);
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
  loadHero() {
    if (!this.options.video) {
      return `<img class="dl-hero" src="${this.options.image}" alt="${this.options.title}" />`;
    }
    const autoplay = this.options.autoplay || false;
    let markup = autoplay
      ? `<video autoplay muted loop playsinline`
      : `<video playsinline`;
    markup += ` poster="${this.options.image}">`;
    markup += `<source src="${this.options.video}" type="video/mp4">`;
    markup += `</video>`;
    return `<div class="dl-hero">
    ${markup}
    ${
      !autoplay
        ? `<div class="btn-play">
              <svg class="play-svg" xmlns="http://www.w3.org/2000/svg" width="26" height="31" viewBox="0 0 55.127 61.182"><g id="Group_38215" data-name="Group 38215" transform="translate(30 35)" fill="currentColor"><g id="play-button-arrowhead_1_" data-name="play-button-arrowhead (1)" transform="translate(-30 -35)"><path id="Path_18" data-name="Path 18" d="M18.095,1.349C12.579-1.815,8.107.777,8.107,7.134v46.91c0,6.363,4.472,8.952,9.988,5.791l41-23.514c5.518-3.165,5.518-8.293,0-11.457Z" transform="translate(-8.107 0)"/></g></g></svg>
              <svg class="pause-svg" xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31"><path d="M10 31h-6v-31h6v31zm15-31h-6v31h6v-31z" fill="currentColor" /></svg>
            </div>`
        : ""
    }
    </div>`;
  }
}
