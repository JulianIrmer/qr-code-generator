function init() {
    handleInput();
}

function handleInput() {
    const button = document.querySelector('.js-generate');
    
    button.addEventListener('click', async () => {
        const input = document.querySelector('.js-input').value;
        if (input.length === 0) return;

        const url = window.location.href + 'api/generate';

        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({data: input})
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
    container.appendChild(qrcode);
}

init();