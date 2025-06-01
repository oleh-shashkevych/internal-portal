function openNav() {
    const menu = document.getElementById("demoMenu");
    const menuButton = document.querySelector(".menu-button");

    if (menu) {
        menu.style.width = "250px";
    }
}

function closeNav() {
    const menu = document.getElementById("demoMenu");
    const menuButton = document.querySelector(".menu-button");

    if (menu) {
        menu.style.width = "0";
    }
}

async function loadMenu(menuFile, targetElementId) {
    try {
        const response = await fetch(menuFile);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const menuHTML = await response.text();
        const targetElement = document.getElementById(targetElementId);
        if (targetElement) {
            targetElement.innerHTML = menuHTML;
        } else {
            console.error(`Element with id "${targetElementId}" not found.`);
        }
    } catch (error) {
        console.error("Could not load the menu:", error);
    }
}