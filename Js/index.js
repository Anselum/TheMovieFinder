const filterMenu = document.getElementById("filterMenu");



function menuOnClick() {
    filterMenu.style.right = "0";
}

function closeOnClick() {
    filterMenu.style.right = "-300px";
}


document.addEventListener("mousedown", () => {
    filterMenu.style.right = "-300px";
})
