(() => {
  const toggle = document.querySelector(".site-menu-toggle");
  const navigation = document.getElementById("site-navigation");
  if (!toggle || !navigation) return;

  toggle.hidden = false;
  document.documentElement.classList.add("navigation-ready");
  const closeMenu = () => toggle.setAttribute("aria-expanded", "false");
  toggle.addEventListener("click", () => {
    toggle.setAttribute("aria-expanded", String(toggle.getAttribute("aria-expanded") !== "true"));
  });
  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      closeMenu();
      toggle.focus();
    }
  });
  window.matchMedia("(min-width: 48rem)").addEventListener("change", closeMenu);
})();
