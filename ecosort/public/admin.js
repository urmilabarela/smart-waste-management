
const menu = document.getElementById("admin-sidebar");
const overlay = document.getElementById("admin-overlay");

const openBtn = document.getElementById("menu-toggle");
const closeBtn = document.getElementById("menu-close");

// Open sidebar
openBtn.addEventListener("click", () => {
    menu.classList.add("active");
    overlay.classList.add("active");
});

// Close sidebar
function closeMenu() {
    menu.classList.remove("active");
    overlay.classList.remove("active");
}

closeBtn.addEventListener("click", closeMenu);
overlay.addEventListener("click", closeMenu);
