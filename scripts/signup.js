const span = document.querySelector('.toggle-password');
const password = document.querySelector('#password');

span.addEventListener('click', () => {
    if(password.type === 'password'){
        password.type ='text';
    }else{
        password.type ='password';
    }
})