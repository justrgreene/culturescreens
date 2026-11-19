const menuButton = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");

if (menuButton && siteNav) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    siteNav.classList.toggle("is-open", !isOpen);
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      menuButton.setAttribute("aria-expanded", "false");
      siteNav.classList.remove("is-open");
    }
  });
}

const revealItems = document.querySelectorAll(".reveal");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (reduceMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => revealObserver.observe(item));
}

const driftItems = document.querySelectorAll("[data-drift]");
let frameRequested = false;

function updateDrift() {
  driftItems.forEach((item) => {
    const rect = item.getBoundingClientRect();
    const speed = Number(item.dataset.drift);
    const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * speed;
    item.style.setProperty("--drift-y", `${offset.toFixed(1)}px`);
    item.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
  });
  frameRequested = false;
}

function requestDriftUpdate() {
  if (!frameRequested && !reduceMotion) {
    frameRequested = true;
    window.requestAnimationFrame(updateDrift);
  }
}

if (driftItems.length && !reduceMotion) {
  window.addEventListener("scroll", requestDriftUpdate, { passive: true });
  window.addEventListener("resize", requestDriftUpdate);
  updateDrift();
}

const newsletterForm = document.querySelector(".newsletter-form");
if (newsletterForm) {
  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const note = newsletterForm.querySelector(".form-note");
    if (note) note.textContent = "This demo form isn’t connected yet. Add your email service endpoint to enable subscriptions.";
  });
}
