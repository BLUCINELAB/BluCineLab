document.documentElement.classList.add("has-js");

const year = document.querySelector("[data-current-year]");
if (year) year.textContent = new Date().getFullYear();

for (const link of document.querySelectorAll('a[target="_blank"]')) {
  if (!link.getAttribute("aria-label")) {
    link.setAttribute("aria-label", `${link.textContent.trim()} (opens in a new tab)`);
  }
}
