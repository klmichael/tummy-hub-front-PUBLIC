import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { login } from "../lib/auth";
import AppContext from "../components/context";
import AuthForm from "../components/authForm";

function Login(props) {
  const [data, setData] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();
  const appContext = useContext(AppContext);
  const [disabled, setDisabled] = useState(true);

  if (appContext.user !== null) {
      setTimeout(() => router.push("/"), 5000);  
    };
  
  //User unable to submit form unless all fields filled.
  useEffect(() => {
    if (data.identifier === "" || data.password === "") {
      setDisabled(true);
    } else if (data.identifier !== "" && data.password !== "") {
      setDisabled(false);
    } else {
      return;
    }
  }, [data]);

  function onChange(event) {
    setData({ ...data, [event.target.name]: event.target.value });
  }

  function submit() {
    setLoading(true);
    login(data.identifier, data.password)
      .then((res) => {
        setLoading(false);
        appContext.login(res.data.user); 
        appContext.authenticate(true);                         
      })
      .catch((rejectedError) => {
        let string = rejectedError.response.data.data[0].messages[0].message;
        setError(string);
        setLoading(false);
      });
  }

  return (
    <AuthForm
      formName = "login"
      formTitle = "Sign In"
      fieldDisabled = {loading}
      onChange = {onChange}
      emailInputName = "identifier"
      href = "/register"
      smallMemo = "Need to register?"
      buttonDisabled = {disabled}
      onClick = {submit}
      loading = {loading}
      error =  {error}   
      />
  );
}

export default Login;