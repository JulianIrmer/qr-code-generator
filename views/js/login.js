const SERVER_URL = window.location.protocol + '//' + window.location.host;
const loginBtn = document.querySelector('.js-login');
const emailInput = document.querySelector('.js-email');
const passwordInput = document.querySelector('.js-password');

loginBtn.addEventListener('click', login);

function login() {
    const url = SERVER_URL + '/user/login';
    window.location.href = url;
}