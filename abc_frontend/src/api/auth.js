import axios from 'axios';

export const localRegister = ({
    // displayName,
    // email,
    displayName,
    password    
}) => axios.post('http://18.217.245.201:8080/api/v1.0/auth/register/local', {
    displayName,
    // email,
    password
});

export const localLogin = ({displayName, password}) => axios.post('/api/v1.0/auth/login/local', {
    displayName, password
});

