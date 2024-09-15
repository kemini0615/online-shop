const mobileMenuBtnEl = document.getElementById("mobile-menu-btn");
const mobileMenuEl = document.getElementById("mobile-menu");

function toggleMobileMenu() {
  mobileMenuEl.classList.toggle("open");
}

mobileMenuBtnEl.addEventListener("click", toggleMobileMenu);
