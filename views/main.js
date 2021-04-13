// const SERVER_URL = 'https://link2qr.herokuapp.com/';
const SERVER_URL = window.location.host + '/';
function init() {
    checkForQR();
    handleInput();
}

function handleInput() {
    const button = document.querySelector('.js-generate');
    
    button.addEventListener('click', async () => {
        const input = document.querySelector('.js-input').value.trim();
        if (input.length === 0) return;

        const sanitizedInput = getSanitizedInput(input);

        const url = SERVER_URL + 'api/generate';

        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({data: sanitizedInput})
        });
        response = await response.json();
        showCode(response.data);
    });
}

function showCode(data) {
    const container = document.querySelector('.js-result');
    container.innerHTML = '';
    const qrcode = document.createElement('img');
    const link = document.querySelector('.js-save');
    qrcode.src = data;
    link.download = 'your_qr_code';
    link.href = data;
    link.classList.remove('hidden');
    container.appendChild(qrcode);
}

function getSanitizedInput(data) {
    let result = data;
    if (data.indexOf('www.') > -1 && data.indexOf('https://') === -1 && data.indexOf('http://') === -1) {
        result = data.replace('www.', 'http://');
    }
    return result;
}

async function checkForQR() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (!id) {
        window.location.href = 'https://qr-code.me';
    };

    let response = await fetch(SERVER_URL + 'api/open?id=' + id);

    response = await response.json();
    console.log(response);
    window.location.href = response.data;
}

init();