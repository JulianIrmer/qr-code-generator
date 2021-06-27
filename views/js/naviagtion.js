function handleEvents() {
    const mobileNav = document.querySelector('.mobile-nav');
    const burgerMenu = document.querySelector('.burger-menu');
    const bar1 = document.querySelector('.bar1');
    const bar2 = document.querySelector('.bar2');
    const bar3 = document.querySelector('.bar3');

    burgerMenu.addEventListener('click', () => {
        mobileNav.classList.toggle('hidden');
        bar1.classList.toggle('left-to-right');
        bar2.classList.toggle('no-opacity');
        bar3.classList.toggle('right-to-left');
    });
}

function adaptNavigation() {
    const isLoggedIn = localStorage.getItem('status');
    if (isLoggedIn === 'false') return;

    const login = document.querySelectorAll('.js-login-link');

    login.forEach((link) => link.classList.add('d-none'));
    document.querySelectorAll('.js-register-link').forEach((link) => link.classList.add('d-none'));
    document.querySelectorAll('.js-overview-link').forEach((link) => link.classList.remove('d-none'));
}

handleEvents();
// adaptNavigation();