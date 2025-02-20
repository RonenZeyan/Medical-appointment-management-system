const hamburger = document.getElementById('navbar-hamburger');
const navLinks = document.querySelector('.navbar-hamburger-contant');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});
