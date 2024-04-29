import {React, useState} from 'react';
import Input from './form/Input';
import Swal from 'sweetalert2';
import {useNavigate} from 'react-router-dom';

const Register = () => {
    const [user,setUser] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
    });
   // const [error, setError] = useState(null);
    const [errors,setErrors] = useState([]);
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();
    
        const handleSubmit = (event) => {
            event.preventDefault();
        
            let errors = [];
            let required = [
              {field: user.first_name, name : "first_name"},
              {field: user.last_name, name : "last_name"},
              {field: user.email, name : "email"},
              {field: user.password, name : "password"},
              {field: confirmPassword, name : "confirmPassword"},

            ];
            required.forEach(function(obj){
              if((obj.name === "confirmPassword" && (confirmPassword!==user.password)) || obj.field === "" ){
                errors.push(obj.name);
              }
            })
     
            setErrors(errors);
            if(errors.length > 0){
                return false ;
            }
            const headers = new Headers();
            headers.append("Content-Type","application/json");

            const requestBody = user ;
            let requestOptions = {
                body: JSON.stringify(requestBody),
                method: "PUT" ,
                headers: headers,
              }

              fetch(`/register`,requestOptions)
              .then((response)=>response.json())
              .then((data)=>{
                if(data.error){
                    console.log(data.error);
                    Swal.fire(
                        {
                          title: 'User already exists!',
                          text: 'Please login to continue...',
                          icon: 'warning',
                          confirmTextButton: "OK",
                        });
                        navigate("/login");
                }
                else {
                    Swal.fire(
                        {
                          title: 'Accout created!',
                          text: 'Please login to continue...',
                          icon: 'success',
                          confirmTextButton: "OK",
                        });
                    navigate("/login");
                }
                }
              )
              .catch((err)=>{console.log(err)})

            
    }
    const handleChange = () => (event) => {
        let value = event.target.value ;
        let name = event.target.name ;
        if(name === "confirmPassword"){
            console.log("updating hte confirm passwrod value")
            setConfirmPassword(value);
        }
       else {

        setUser({
          ...user,
          [name]:value,
        });
    }
    
      }
    const hasError = (key)=>{
        return errors.indexOf(key) !== -1 ;
       }
  return (
    <div className="col-md-6 offset-md-3">
      <h2>Create your account</h2>
      <pre>{JSON.stringify(user,null,3)}</pre>
      <hr />
      <form onSubmit={handleSubmit}>
        <Input
        className="form-control"
        title = "First Name"
        value = {user.first_name}
        type = "text"
        name = "first_name"
        onChange = {handleChange("first_name")}
        errorDiv = {hasError("first_name") ? "text-danger":"d-none"}
        errormsg = {"Please enter your first name"}
       />
       <Input
        className="form-control"
        title = "Last Name"
        value = {user.last_name}
        type = "text"
        name = "last_name"
        onChange = {handleChange("last_name")}
        errorDiv = {hasError("last_name") ? "text-danger":"d-none"}
        errormsg = {"Please enter your last name"}
       />
      <Input
          type="email"
          title="Email address"
          value = {user.email}
          className = "form-control"
          name="email"
          autocomplete="email-new"
          onChange = {handleChange("first_name")}
          errorDiv = {hasError("first_name") ? "text-danger":"d-none"}
          errormsg = {"Please enter your email"}
        />
         <Input
          type="password"
          value = {user.password}
          title="Password"
          className = "form-control"
          name="password"
          onChange = {handleChange("password")}
          errorDiv = {hasError("password") ? "text-danger":"d-none"}
          errormsg = {"Please enter a password"}
        />
        <Input
          type="password"
          title="Confirm Password"
          className = "form-control"
          value = {confirmPassword}
          name="confirmPassword"
          onChange = {handleChange("confirmPassword")}
          errorDiv = {hasError("confirmPassword") ? "text-danger":"d-none"}
          errormsg = {"Confirm password should match with the password entered above"}
        />
       
       <button  className="btn btn-primary mb-3">Submit</button>
      </form>
    </div>
  )
}

export default Register;