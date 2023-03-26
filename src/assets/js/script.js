console.log("dark mode on/off");
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
