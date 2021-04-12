function init() {
    handleInput();
}

function handleInput() {
    const button = document.querySelector('.js-generate');
    
    button.addEventListener('click', async () => {
        const input = document.querySelector('.js-input').value.trim();
        if (input.length === 0) return;

        const sanitizedInput = getSanitizedInput(input);

        const url = window.location.href + 'api/generate';

        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({data: sanitizedInput})
        });
        response = await response.json();
        console.log(response.data);
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
    let result = '';
    if (data.indexOf('www.') > -1 && data.indexOf('https://') === -1 && data.indexOf('http://') === -1) {
        result = data.replace('www.', 'http://');
    }
    return result;
}

init();