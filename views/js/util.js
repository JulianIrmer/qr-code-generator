function showSuccess(action) {
    const label = document.querySelector('.js-error-msg');
    label.classList.add('success-msg');
    label.classList.remove('red-text');
    label.innerHTML = `${action} successful!`;
    label.classList.remove('d-none');
}

function showError(data) {
    const label = document.querySelector('.js-error-msg');
    label.innerHTML = data.error;
    label.classList.remove('d-none');
}

function hideError() {
    const label = document.querySelector('.js-error-msg');
    label.innerHTML = '';
    label.classList.add('d-none');
}

function checkValues(email, password) {
    const regEx = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    const result = {
        success: true,
        error: null
    }

    if (!regEx.test(email)) {
        result.error = 'Please enter a valid email address';
        result.success = false;
        return result;
    }
    
    if (password.length < 8) {
        result.error = 'Please enter a longer password';
        result.success = false;
        return result;
    }

    return result;
}