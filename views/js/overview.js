const SERVER_URL = window.location.protocol + '//' + window.location.host;

async function init() {
    const data = await getData();
    generateHTML(data.data);
    handleBtnEvents();
}

function handleBtnEvents() {
    const deleteBtn = document.querySelectorAll('.js-delete');
    deleteBtn.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            console.log('hello');
            deleteCode(e.target);
        });
    });

    const modifyBtn = document.querySelectorAll('.js-modify');
    modifyBtn.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            console.log(e);
            modifyCode(e.target);
        });
    });
}

async function deleteCode(target) {
    const id = target.dataset.id;
    const container = document.querySelector(`.js-code-container[data-id="${id}"]`);
    const url = `${SERVER_URL}/url/api/delete?id=${id}`;
    
    let response = await fetch(url);
    response = await response.json();
    container.innerHTML = '';
    container.className = 'd-flex justify-content-center';
    const msgElement = document.createElement('h2');
    msgElement.className = 'success-msg';
    msgElement.innerText = response.message;
    container.appendChild(msgElement);

    setTimeout(() => {
        // container.remove();
    }, 1000);
}

async function modifyCode(target) {
    const id = target.dataset.id;
    const urlInput = document.querySelector(`.js-modify-input[data-id="${id}"]`);
    const url = `${SERVER_URL}/url/api/update`;
    const value = urlInput.value;
    const oldValue = urlInput.dataset.old;
    if (oldValue === value) {
        return;
    }
    const data = { value, id }

    let response = await fetch(url,{
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        },
    });
    response = response.json();
    urlElement.innerHTML = response.data.url;
}

async function getData() {
    const url = SERVER_URL + '/url/api/getuserdata';

    let data = await fetch(url);
    data = await data.json();
    return data;
}

function generateHTML(data) {
    const container = document.querySelector('.js-content');
    if (data.length === 0) {
        const headline = document.createElement('h3');
        headline.innerHTML = 
        `
        No QR Codes found!
        <br>
        <a href="/">Generate your first QR Code!</a>
        `;
        container.appendChild(headline);
        return;
    }

    data.forEach((element) => {
        const div = document.createElement('div');
        const id = element._id;
        div.className = 'js-code-container mb-5 d-flex';
        div.dataset.id = id;
        const html = 
        `
        <div class="img-container" data-id="${id}">
            <img class="img-qr" src="${element.code}" alt="">
        </div>
        <div class="d-flex info-container w-100">
            <div class="url d-flex">
                <input class="js-modify-input input-field" data-id="${id}" data-old="${element.url}" type="text" value="${element.url}">
                <button class="js-modify btn w-100" data-id="${id}">Modify</button>
            </div>
            <div class="action-container">
                <button class="js-delete btn" data-id="${id}">Delete</button>
            </div>
        </div>
        `
        div.innerHTML = html;
        container.appendChild(div);
    });
}

init();