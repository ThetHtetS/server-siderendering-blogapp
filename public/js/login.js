/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';


export const signup = async (name, email, password, passwordConfirm) => {
  try {
   
    // var url;
    // if(process.env.NODE_ENV == "production") {
    //    url =  '/api/v1/users/signup'
    // }
    // else {
    //    url = 'http://localhost:4000/api/v1/users/signup'
    // }
   
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      // url: ,
      data: {
        name,
        email,
        password,
        passwordConfirm
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'registered successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const login = async (email, password) => {
  try { 
    //var url 
    // if(process.env.NODE_ENV == "production") {
    //    url =  '/api/v1/users/login'
    // }
    // else {
    //    url = 'http://localhost:4000/api/v1/users/login'
    // }
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      url,
      data: {
        email,
        password
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout'
    });
    if ((res.data.status = 'success')) location.reload(true);
  } catch (err) {
    showAlert('error', 'Error logging out! Try again.');
  }
};


export const forgotPassword = async (email) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/forgotPassword',
      // url: 'http://localhost:4000/api/v1/users/forgotPassword',
      data: {
        email
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Password reset link has been sent to your email!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};


export const resetPassword = async (password,passwordConfirm, token) => {
  try {
    const res = await axios({
      method: 'patch',
      url: '/api/v1/users/login',
      // url: `http://localhost:4000/api/v1/users/resetPassword/${token}`,
      data: {
        password,
        passwordConfirm
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'your password has been reset successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

