console.log("dark mode on/off");

/* UserWay Accessibility Widget used for WCAG 
 * This script dynamically loads the UserWay widget for accessibility features. 
*/
(function(d){
  var s = d.createElement("script");
  /* uncomment the following line to override default position*/
  // s.setAttribute("data-position", 4);
  /* uncomment the following line to override default size (values: small, large)*/
  /* s.setAttribute("data-size", "small");*/
  /* uncomment the following line to override default language (e.g., fr, de, es, he, nl, etc.)*/
  /* s.setAttribute("data-language", "language");*/
  /* uncomment the following line to override color set via widget (e.g., #053f67)*/
  s.setAttribute("data-color", "#224957");
  /* uncomment the following line to override type set via widget (1=person, 2=chair, 3=eye, 4=text)*/
  /* s.setAttribute("data-type", "1");*/
  /* s.setAttribute("data-statement_text:", "Our Accessibility Statement");*/
  /* s.setAttribute("data-statement_url", "http://www.example.com/accessibility")";*/
  /* uncomment the following line to override support on mobile devices*/
  /* s.setAttribute("data-mobile", true);*/
  /* uncomment the following line to set custom trigger action for accessibility menu*/
  /* s.setAttribute("data-trigger", "triggerId")*/
  /* uncomment the following line to override widget's z-index property*/
  /* s.setAttribute("data-z-index", 10001);*/
  /* uncomment the following line to enable Live site translations (e.g., fr, de, es, he, nl, etc.)*/
  /* s.setAttribute("data-site-language", "null");*/
  s.setAttribute("data-widget_layout", "full")
  s.setAttribute("data-account", "EZkQTVpKI0");
  s.setAttribute("src", "https://cdn.userway.org/widget.js");
  (d.body || d.head).appendChild(s);
})(document)

window.addEventListener("load", () => {
  console.log("dark mode on/off");

  let checkbox = document.getElementById("ChangeTheme") || null;
  let darkModeButton = document.getElementById("darkmodeBtn") || null;
  let languageButton = document.getElementById("langSelectBox") || null;
  let languageDiv = document.getElementById("languageDiv") || null;
  let mainHeading = document.getElementById("mainHeading") || null;
  let minorHeading = document.getElementById("minorHeading") || null;
  let content = document.getElementById("content") || null;
  let logo = document.getElementById("uopLogo") || null;
  let toBeChanged =
    [checkbox, languageButton, mainHeading, minorHeading] || null;
  let navbar = document.getElementById("nav-bar");

  // Check storage if dark mode was on or off
  // Can use sessionStorage instead of localStorage too
  if (localStorage.getItem("mode") == "dark") enableDarkMode();
  else noDarkMode();

  // If the checkbox state is changed, act accordingly
  checkbox.addEventListener("change", function () {
    if (checkbox.checked) enableDarkMode();
    else noDarkMode();
  });

  darkModeButton?.addEventListener("click", function () {
    checkbox.checked = !checkbox.checked;
    if (checkbox.checked) enableDarkMode();
    else noDarkMode();
  });

  function enableDarkMode() {
    try {
      checkbox.checked = true;
      localStorage.setItem("mode", "dark");

      document.body.classList.add("dark-mode");
      content?.classList.add("dark-mode-body");
      languageDiv?.classList.add("lang-dark");
      toBeChanged.forEach(function (element) {
        element?.classList.add("dark-mode-text");
      });
      if (logo) logo.src = "assets/images/uop.png";

      navbar?.classList.add("navbar-dark");
      navbar?.classList.remove("navbar-light", "navbar-white");
    } catch (error) {
      console.log("error: " + error);
    }
  }

  function noDarkMode() {
    try {
      checkbox.checked = false;
      localStorage.setItem("mode", "light");

      document.body.classList.remove("dark-mode");
      content?.classList.remove("dark-mode-body");
      languageDiv?.classList.remove("lang-dark");
      toBeChanged.forEach(function (element) {
        element?.classList.remove("dark-mode-text");
      });
      if (logo) logo.src = "assets/images/pelopas.png";

      navbar?.classList.remove("navbar-dark");
      navbar?.classList.add("navbar-light", "navbar-white");
    } catch (error) {
      console.log("error: " + error);
    }
  }
});

$(() => {
  console.log("dark mode on/off");

  let checkbox = document.getElementById("ChangeTheme") || null;
  let darkModeButton = document.getElementById("darkmodeBtn") || null;
  let languageButton = document.getElementById("langSelectBox") || null;
  let languageDiv = document.getElementById("languageDiv") || null;
  let mainHeading = document.getElementById("mainHeading") || null;
  let minorHeading = document.getElementById("minorHeading") || null;
  let content = document.getElementById("content") || null;
  let logo = document.getElementById("uopLogo") || null;
  let toBeChanged =
    [checkbox, languageButton, mainHeading, minorHeading] || null;
  let navbar = document.getElementById("nav-bar");

  // Check storage if dark mode was on or off
  // Can use sessionStorage instead of localStorage too
  if (localStorage.getItem("mode") == "dark") enableDarkMode();
  else noDarkMode();

  // If the checkbox state is changed, act accordingly
  checkbox.addEventListener("change", function () {
    if (checkbox.checked) enableDarkMode();
    else noDarkMode();
  });

  darkModeButton?.addEventListener("click", function () {
    checkbox.checked = !checkbox.checked;
    if (checkbox.checked) enableDarkMode();
    else noDarkMode();
  });

  function enableDarkMode() {
    try {
      checkbox.checked = true;
      localStorage.setItem("mode", "dark");

      document.body.classList.add("dark-mode");
      content?.classList.add("dark-mode-body");
      languageDiv?.classList.add("lang-dark");
      toBeChanged.forEach(function (element) {
        element?.classList.add("dark-mode-text");
      });
      if (logo) logo.src = "assets/images/uop.png";

      navbar?.classList.add("navbar-dark");
      navbar?.classList.remove("navbar-light", "navbar-white");
    } catch (error) {
      console.log("error: " + error);
    }
  }

  function noDarkMode() {
    try {
      checkbox.checked = false;
      localStorage.setItem("mode", "light");

      document.body.classList.remove("dark-mode");
      content?.classList.remove("dark-mode-body");
      languageDiv?.classList.remove("lang-dark");
      toBeChanged.forEach(function (element) {
        element?.classList.remove("dark-mode-text");
      });
      if (logo) logo.src = "assets/images/pelopas.png";

      navbar?.classList.remove("navbar-dark");
      navbar?.classList.add("navbar-light", "navbar-white");
    } catch (error) {
      console.log("error: " + error);
    }
  }
});
