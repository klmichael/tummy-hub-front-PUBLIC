import React, { useState, useContext, useEffect } from "react";
import Link from "next/link";
import router from "next/router";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Container, Row, Col, Button, Form, FormGroup, Label, Input} from "reactstrap";
import { registerUser } from "../lib/auth";
import { logout } from "../lib/auth";
import AppContext from "../components/context";
import AuthForm from "../components/authForm";


const Register = () => {
  const [data, setData] = useState({ email: "", username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const appContext = useContext(AppContext);
  const [disabled, setDisabled] = useState(true);

  if (appContext.user !== null) {
    setTimeout(() => router.push("/"), 5000);  
  };

  //User unable to submit form unless all fields filled.
  useEffect(() => {
    if (data.username === "" || data.email === "" || data.password === "") {
      setDisabled(true);
    } else if (data.username !== "" && data.email !== "" && data.password !== "") {
      setDisabled(false);
    } else {
      return;
    }
  }, [data]);

  function onChange(event) {
    setData({ ...data, [event.target.name]: event.target.value });
  }

  //Known Strapi 3.0 issue with validating username and password at registration. This validation function works around that bug by requiring the same character length as Strapi.
  function validate (username, password) {
    if (username.length < 3) {
      setError("Username must contain at least 3 characters.")
      return false;
    }
    if (password.length < 6) {
      setError("Password must contain at least 6 characters.")
      return false;
    }
    return true;
  }

  function submit() {
    setLoading(true);
    if (validate(data.username, data.password) === true) {
      registerUser(data.username, data.email, data.password)
      .then((res) => {
        appContext.login(res.data.user);
        appContext.authenticate(true);
        setLoading(false);
      })
      .catch((rejectedError) => {
        let string = rejectedError.response.data.data[0].messages[0].message;
        setError(string);
        setLoading(false);
      }); 
    } else {
      setLoading(false);
    } 
  }


  return (
    <AuthForm 
      formName = "register"
      formTitle= "Sign Up"
      fieldDisabled = {loading}
      onChange = {onChange}
      emailInputName = "email"
      href = "/login"
      smallMemo = "Already have an account?"
      buttonDisabled = {disabled}
      onClick = {submit}
      loading = {loading}
      error =  {error}
    />
  );
};
export default Register;