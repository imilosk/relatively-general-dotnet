const lightModePref = window.matchMedia("(prefers-color-scheme: light)");

function getUserPref() {
    const storedTheme = typeof localStorage !== "undefined" && localStorage.getItem("theme");
    return storedTheme || (lightModePref.matches ? "light" : "dark");
}

function setTheme(newTheme) {
    if (newTheme !== "light" && newTheme !== "dark") {
        return console.warn(
            `Invalid theme value '${newTheme}' received. Expected 'light' or 'dark'.`,
        );
    }

    const root = document.documentElement;

    // root already set to newTheme, exit early
    if (newTheme === root.getAttribute("data-theme")) {
        return;
    }

    root.setAttribute("data-theme", newTheme);

    const colorThemeMetaTag = document.querySelector("meta[name='theme-color']");
    const bgColour = getComputedStyle(document.body).getPropertyValue("--theme-bg");
    colorThemeMetaTag.setAttribute("content", `hsl(${bgColour})`);
    if (typeof localStorage !== "undefined") {
        localStorage.setItem("theme", newTheme);
    }
}

// initial setup
setTheme(getUserPref());

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("theme-toggle").addEventListener("click", () => {
        const theme = localStorage.getItem("theme");

        if (theme === "dark") {
            setTheme("light");
        } else {
            setTheme("dark");
        }
    });

    document.getElementById("toggle-navigation-menu").addEventListener("click", (e) => {
        const button = e.target;
        const ariaExpanded = button.getAttribute("aria-expanded");
        const header = document.getElementById("main-header");

        if (ariaExpanded === "true") {
            button.setAttribute("aria-expanded", "false");
            header.classList.remove("menu-open");
        } else {
            button.setAttribute("aria-expanded", "true");
            header.classList.add("menu-open");
        }
    });

    function openDialog(dialog) {
        dialog.showModal();
        dialog.querySelector("input")?.focus();
    }

    function closeDialog(dialog) {
        dialog.close();
    }

    const openBtn = document.getElementById("open-search");
    const closeBtn = document.getElementById("close-search");
    const dialog = document.getElementsByTagName("dialog")[0];

    // Enable the search button
    openBtn.disabled = false;

    // Open modal when search button is clicked
    openBtn.addEventListener("click", function (event) {
        openDialog(dialog);
        event.stopPropagation();
    });

    // Close modal when close button is clicked
    closeBtn.addEventListener("click", function () {
        closeDialog(dialog);
    });

    // Close modal if clicked outside the modal frame
    document.addEventListener('click', function (event) {
        const dialogDimensions = dialog.getBoundingClientRect();

        if (
            event.clientX < dialogDimensions.left ||
            event.clientX > dialogDimensions.right ||
            event.clientY < dialogDimensions.top ||
            event.clientY > dialogDimensions.bottom
        ) {
            dialog.close();
        }
    });

    // Keyboard shortcut to open the modal ("/" key)
    document.addEventListener("keydown", function (event) {
        if (event.key === "/" && !dialog.open) {
            openDialog(dialog);
            event.preventDefault();
        }

        if (event.key === "Escape" && dialog.open) {
            closeDialog(dialog);
            event.preventDefault();
        }
    });

    new PagefindUI({
        element: "#cactus__search",
        showSubResults: true,
        showImages: false,
        autofocus: true
    });
});