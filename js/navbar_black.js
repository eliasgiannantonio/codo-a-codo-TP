

document.addEventListener("scroll", () => {
    const navbar = document.querySelector(".header--container");
    if(window.scrollY > 0) {
        navbar.classList.add("scroll")
    } else {
        navbar.classList.remove("scroll")
    }

})
