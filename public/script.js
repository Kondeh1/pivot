const btn = document.querySelectorAll("#btn");
const formDisplay = document.querySelector(".auth-container");
const blurHover = document.querySelector(".blur");
const login = document.querySelector(".login");
const log = document.querySelectorAll(".log");
const loginForm = document.querySelector(".login-container");
const noAccount = document.querySelector(".no-account");
const menu = document.querySelector(".menu");
const close = document.querySelector(".close");
const fullMenu = document.querySelector("#full-menu");

const openMenu = () => {
  menu.style.display = "none";
  close.style.display = "block";
  fullMenu.classList.add("active");
};

const closeMenu = () => {
  menu.style.display = "block";
  close.style.display = "none";
  fullMenu.classList.remove("active");
};

const showLogin = () => {
  blurHover.style.visibility = "visible";
  loginForm.style.visibility = "visible";
  formDisplay.style.visibility = "hidden";
  fullMenu.classList.remove("active");
  menu.style.display = "block";
  close.style.display = "none";
};

btn.forEach(element => {
  element.addEventListener("click", () => {
    formDisplay.style.visibility = "visible";
    blurHover.style.visibility = "visible";
    closeMenu();
  });
});

log.forEach(element => {
  element.addEventListener("click", showLogin);
});

login.addEventListener("click", showLogin);

menu.addEventListener("click", openMenu);

close.addEventListener("click", closeMenu);

fullMenu.addEventListener("click", closeMenu);

noAccount.addEventListener("click", () => {
  loginForm.style.visibility = "hidden";
  formDisplay.style.visibility = "visible";
});

blurHover.addEventListener("click", () => {
  blurHover.style.visibility = "hidden";
  formDisplay.style.visibility = "hidden";
  loginForm.style.visibility = "hidden";
});