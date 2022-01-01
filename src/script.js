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

  // Check storage if dark mode was on or off
  if (sessionStorage.getItem("mode") == "dark") enableDarkMode();
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
      document.body.classList.add("dark-mode");
      content.classList.add("dark-mode-body");
      languageDiv.classList.add("lang-dark");
      toBeChanged.forEach(function (element) {
        element.classList.add("dark-mode-text");
      });
      logo.src = "assets/images/uop.png";

      checkbox.checked = true;
      sessionStorage.setItem("mode", "dark");
    } catch (error) {
      console.log("error: " + error);
    }
  }

  function noDarkMode() {
    try {
      document.body.classList.remove("dark-mode");
      content.classList.remove("dark-mode-body");
      languageDiv.classList.remove("lang-dark");
      toBeChanged.forEach(function (element) {
        element.classList.remove("dark-mode-text");
      });
      logo.src = "assets/images/v110_3.png";

      checkbox.checked = false;
      sessionStorage.setItem("mode", "light");
    } catch (error) {
      console.log("error: " + error);
    }
  }
});
