import React from 'react'
import {forwardRef} from 'react';
const Input = forwardRef((props,ref) => {
  return (
    <div className="mb-4">
       <label htmlFor={props.name} className="form-label" style = {{fontSize : "1.1rem"}}>
        {props.title}
       </label>
       <input type = {props.type}
       className = {props.className}
       id = {props.name}
       ref = {ref}
       name = {props.name}
       placeholder = {props.placeholder}
       onChange = {props.onChange}
       autoComplete = {props.autocomplete}
       value = {props.value}
       />
       <div className = {props.errorDiv}>{props.errormsg}</div>
    </div>
  )
})

export default Input;