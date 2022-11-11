# Rainforest Action Network ENgrid Multistep Lightbox

This project makes it easy to create links to your Engaging Networks Donation Page as a lightbox with multiple steps.

## How to use

1. Add the script below to the page:

```html
<script
  defer="defer"
  src="https://acb0a5d73b67fccd4bbe-c2d8138f0ea10a18dd4c43ec3aa4240a.ssl.cf5.rackcdn.com/10042/donation-lightbox-parent.js"
></script>
```

2. The script will look for the `data-donation-lightbox` attribute on every `a` tag and make it open as a lightbox, with the options below.

## Options

Every option can be set as a data attribute on the `a` tag, or as a JavaScript object.

<!-- ![Options](options.png "Engrid Multistep Lightbox Options") -->

- **image** - Main Image of the Lightbox.
- **video** - Main Video of the Lightbox. If used, the **image** option will be used as a poster image.
- **autoplay** - If true, the video will autoplay, be muted, and loop.
- **logo** - Logo Image Used on the center of the Lightbox. On mobile, it will be scaled down and moved to the top.
- **logo_position_top** - Position of the Logo Image on the top of the Lightbox.
- **logo_position_left** - Position of the Logo Image on the left of the Lightbox.
- **logo_position_right** - Position of the Logo Image on the right of the Lightbox.
- **logo_position_bottom** - Position of the Logo Image on the bottom of the Lightbox.
- **divider** - Divider Image Used between the Hero Image and Content.
- **title** - Title of the Lightbox.
- **paragraph** - Content of the Lightbox.
- **bg_color** - HEX color of the left column background.
- **text_color** - HEX color of the left column text.
- **form_color** - HEX color for the form theme.
- **footer** - Content of the footer.
- **url** - URL of the donation page - use this option if you want the lightbox to automatically open when the page loads.
- **cookie_hours** - Number of hours to not auto open the lightbox after the user closes it.
- **cookie_name** - Name of the cookie to set.
- **trigger** - Can be set to any `int` value (seconds), any `px` value (scroll position in pixels), any `%` value (scroll position in percentage), or `exit` (on exit intent).
- **gtm_open_event_name** - Name of the Google Tag Manager event to fire when the lightbox opens.
- **gtm_close_event_name** - Name of the Google Tag Manager event to fire when the lightbox closes.
- **gtm_suppressed_event_name** - Name of the Google Tag Manager event to fire when the lightbox is suppressed.
- **confetti** - Can be an array of colors. If empty, no confetti will be shown on the Thank You page.

Because the page can have multiple lightbox links, you can share options between them by creating a `DonationLightboxOptions` object. Example:

```javascript
DonationLightboxOptions = {
  logo: "https://............",
  footer: "This is my Footer text.",
};
```

On the example above, the logo and footer will be used for all links.

**Example of Link Without Lightbox:**

```html
<a href="https://netdonor.net/page/92471/donate/1">Give Now</a>
```

**Example of Link With Lightbox:**

```html
<a
  href="https://netdonor.net/page/92471/donate/1"
  data-donation-lightbox
  data-title="My Title Test"
  data-paragraph="My paragraph test"
  >Give Now
</a>
```

## Default Options Object

```javascript
DonationLightboxOptions = {
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
  bg_color: "#cde4fc",
  txt_color: "#074e92",
  form_color: "#007cf9",
  url: null,
  cookie_hours: 24,
  cookie_name: "HideDonationLightbox",
  trigger: 0, // int-seconds, px-scroll location, %-scroll location, exit-mouse leave
  gtm_open_event_name: "donation_lightbox_display",
  gtm_close_event_name: "donation_lightbox_closed",
  gtm_suppressed_event_name: "donation_lightbox_supressed",
  confetti: ["#007cf9", "#FFFFFF", "#0041a8"],
};
```

### IMPORTANT: This project only works with the Engaging Networks Pages using the [engrid theme](https://github.com/4site-interactive-studios/engrid) or a client fork of ENgrid.

## Development

Your js code must be on the `src/app` folder. Styling changes must be on `src/scss`.

## Install Dependencies

1. `npm install`

## Deploy

1. `npm run build` - Builds the project
2. `npm run watch` - Watch for changes and rebuilds the project

It's going to create a `dist` folder, where you can get the `donation-lightbox-parent.js` file and publish it.

Currently it's published on:  
https://acb0a5d73b67fccd4bbe-c2d8138f0ea10a18dd4c43ec3aa4240a.ssl.cf5.rackcdn.com/10042/donation-lightbox-parent.js
