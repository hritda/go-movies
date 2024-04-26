import React from 'react'

const Select = () => {
  return (
    <div className = "mb-3">
     <label htmlfor={props.name} className="form-label">
            {props.title}
     </label>
     <select 
       className = "form-select"
       id = {props.name}
       name = {props.name}
       value = {props.value} 
       onChange = {props.onChange}
     >
        <option value="">{props.placeHolder}</option>
        {props.option.map((option)=>{
          return (
            <option
            id = {option.id}
            value = {option.id}
            >
            {option.value}
            </option>
          )

        })}
     </select>
     <div className = {props.errorDiv}>{props.errorMsg}</div>
    </div>
  )
}

export default Select