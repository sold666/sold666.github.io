const themeToggleBtn = document.getElementById('theme-toggle-button');
const themeIcon = document.querySelector('.theme-icon');
let theme = window.localStorage.getItem("theme");
const sun = new URL(
    '../assets/main_icons/sun.svg',
    import.meta.url
);
const moon = new URL(
    '../assets/main_icons/moon.svg',
    import.meta.url
);

if (theme === null) {
    theme = "light";
    window.localStorage.setItem("theme", theme);
} else if (theme === "dark") {
    document.body.classList.add("dark");
    themeIcon.src = moon;
}

themeToggleBtn.addEventListener('click', function () {
    document.body.classList.toggle("dark");
    if (document.body.classList.contains("dark")) {
        theme = "dark";
        window.localStorage.setItem("theme", theme);
        themeIcon.src = moon;
        document.body.style.transition = "0.5s";
    } else {
        theme = "light";
        window.localStorage.setItem("theme", theme);
        themeIcon.src = sun;
        document.body.style.transition = "0.5s";
    }
});

themeToggleBtn.addEventListener('focus', function () {
    this.blur();
});

document.querySelector('.return-button').addEventListener('click', () => {
    window.history.back();
});
