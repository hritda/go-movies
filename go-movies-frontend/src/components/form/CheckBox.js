import React from 'react'


const CheckBox = () => {
  return (
    <div className = "form-check">
    <input
     id = {props.name}
     className = "form-check-input"
     type = "checkbox"
     value = {props.value}
     name = {props.name}
     checked = {props.checked}
     onChange = {props.onChange}
     />
    <label 
    className="form-check-label"
    htmlFor = {props.name}
    >
    {props.title}
    </label>
    </div>
  )
}

export default CheckBox;