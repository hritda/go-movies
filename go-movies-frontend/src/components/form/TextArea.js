import React from 'react'

const TextArea = (props) => {
  return (
    <div className="mb-3">
        <label htmlFor={props.name} className="form-label" style = {{fontSize : "1.1rem"}}>
            {props.title}
        </label>
        <textarea
         className = "form-control"
         id = {props.name}
         name = {props.name}
         value = {props.value} 
         rows = {props.rows}
         onChange = {props.onChange}
        />
        <div className = {props.errorDiv}>{props.errormsg}</div>

    </div>
  )
}

export default TextArea