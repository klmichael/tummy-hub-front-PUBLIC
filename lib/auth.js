import Router from "next/router";
import Cookie from "js-cookie";
import axios from "axios";


const API_URL = 'YOUR_API_URL.com';


//register a new user
export const registerUser = (username, email, password) => {
  //prevent function from being ran on the server
  if (typeof window === "undefined") {
    return;
  }

  return new Promise((resolve, reject) => {
    axios
      .post(`${API_URL}/auth/local/register`, { username, email, password })
      .then((res) => {
        //set token response from Strapi for server validation
        Cookie.set("token", res.data.jwt);

        //resolve the promise to set loading to false in SignUp form
        resolve(res);

      })
      .catch((error) => {
        //reject the promise and pass the error object back to the form
        reject(error);
      });
  });
};

export const login = (identifier, password) => {
  //prevent function from being run on the server
  if (typeof window === "undefined") {
    return;
  }

  return new Promise((resolve, reject) => {
    axios
      .post(`${API_URL}/auth/local/`, { identifier, password })
      .then((res) => {
        console.log(res);
        //set token response from Strapi for server validation
        Cookie.set("token", res.data.jwt);
        //resolve the promise to set loading to false in SignUp form
        resolve(res);

      })
      .catch((error) => {
        //reject the promise and pass the error object back to the form
        reject(error);
      });
  });
};

export const logout = () => {

  //remove token and user cookie
  Cookie.remove("token");
  delete window.__user;

  // sync logout between multiple windows
  window.localStorage.setItem("logout", Date.now());

  //redirect to the home page
  Router.push("/");
};
