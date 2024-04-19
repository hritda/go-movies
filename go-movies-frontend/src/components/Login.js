import React from 'react'
import { useState } from 'react';
import {useOutletContext, useNavigate} from 'react-router-dom';
import Input from './form/Input';
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {setjwtToken,setalertMessage,setalertClassName} = useOutletContext();
  const navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();
    if(email==="admin@example.com"){
      setjwtToken("abc");
      setalertClassName("alert-success");
      setalertMessage("Successfully logged in!");
      navigate("/");
        }else{
      setalertClassName("alert-danger");
      setalertMessage("Invalid credentials, please try again");
    }

  }
  return (
    <div className="col-md-6 offset-md-3">
      <h2>Login to your account</h2>
      <hr />
      <form onSubmit={handleSubmit}>
        <Input
          type="email"
          title="Email address"
          className = "form-control"
          name="email"
          autocomplete="email-new"
          onChange={(event) => { setEmail(event.target.value) }}
        />

        <Input
          type="password"
          title="Password"
          className = "form-control"
          name="password"
          autocomplete="password-new"
          onChange={(event) => { setPassword(event.target.value) }}
        />
        <Input
        type = "submit"
        className = "btn btn-primary px-3"
        value = "login"
        />
      </form>
    </div>
  )
}

export default Login;