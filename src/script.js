window.addEventListener("load", () => {
  console.log("dark mode on/off");
  let checkbox = document.getElementById("ChangeTheme");

  //check storage if dark mode was on or off
  if (sessionStorage.getItem("mode") == "dark") enableDarkMode();
  else noDarkMode();

  //if the checkbox state is changed, act accordingly
  checkbox.addEventListener("change", function () {
    if (checkbox.checked) enableDarkMode();
    else noDarkMode();
  });

  function enableDarkMode() {
    document.body.classList.add("dark-mode");
    checkbox.checked = true;
    sessionStorage.setItem("mode", "dark");
  }

  function noDarkMode() {
    document.body.classList.remove("dark-mode");
    checkbox.checked = false;
    sessionStorage.setItem("mode", "light");
  }
});
