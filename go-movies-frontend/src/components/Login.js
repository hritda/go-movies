import React from 'react'
import Swal from 'sweetalert2';
import { useState } from 'react';
import {useOutletContext, useNavigate} from 'react-router-dom';
import Input from './form/Input';
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {setjwtToken,setalertMessage,setalertClassName,toggleRefresh} = useOutletContext();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    let payload = {
      email: email,
      password: password,
    }

    let requestOptions = {
      method : "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(payload)
    }
    
    fetch(`/authenticate`,requestOptions).then(
      (response)=> response.json()
    ).then((data)=>{
     if(data.error){
      Swal.fire(
        {
          title: 'Error!',
          text: `${data.message}`,
          icon: 'error',
          confirButtonText: 'OK',
        })
     }else{
      setjwtToken(data.access_token);
      Swal.fire(
        {
          title: 'Yay!',
          text: 'You are logged in!',
          icon: 'success',
          showConfirmButton: false,
          timer: 1300,
        }
      )
      toggleRefresh(true);
      navigate("/");
     }
    }).catch((error)=>{
      
    })
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