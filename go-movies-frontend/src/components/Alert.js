import React from 'react'

const Alert = (props) => {
  return (
    <div className={"alert "+ props.alertClassName+" alert-dismissible fade show"} role="alert">
        {props.alertMessage}
        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  )
}

export default Alert;