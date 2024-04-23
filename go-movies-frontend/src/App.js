
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Alert from './components/Alert';

function App() {
  const [jwtToken, setjwtToken] = useState("");
  const [alertMessage, setalertMessage] = useState("");
  const [alertClassName, setalertClassName] = useState("d-none");
  const location = useLocation();
  console.log(location.pathname);
  const navigate = useNavigate();
  const logOut = () => {
  
    const requestOptions = {
      method: "GET",
      credentials: "include",
    }
    fetch(`/logout`, requestOptions)
    .catch(error => console.log("error logging out", error))
    .finally(()=>{
      setjwtToken("");
    })
    navigate("/login");
  }
  useEffect(() => {
     if(jwtToken === ""){
      const requestOptions = {
        method: "Get",
        credentials: "include",
      }
      fetch(`/refresh`, requestOptions).then(
        (response)=>response.json()
      ).then(
        (data)=>{
          if(data.access_token){
            setjwtToken(data.access_token);
          }
        }
      ).catch((error)=>{
        console.log("user is not logged in", error);
      })
     }
  }, [jwtToken])

  return (
    <div className="container">
      <div className="row align-items-center">
        <div className="col">
          <h1 className="mt-3">Go watch a movie</h1>
        </div>
        <div className="col text-end ">
          {jwtToken === ""
            ? <> {location.pathname !== "/login" ? <Link to="/login"><span className="btn btn-primary "> Login </span></Link> : ""}</>
            : <span className="btn btn-danger " onClick={logOut}> Logout </span>
          }
        </div>
        <hr className="mb-3"></hr>
      </div>
      <div className="row">
        <div className="col-md-2">
          <nav>
            <div className="list-group">
              <Link to="/" className="list-group-item list-group-item-action">Home</Link>
              <Link to="/movies" className="list-group-item list-group-item-action">Movies</Link>
              <Link to="/genres" className="list-group-item list-group-item-action">Genres</Link>
              {jwtToken !== "" && <>
                <Link to="/admin/movies/0" className="list-group-item list-group-item-action">Add movie</Link>
                <Link to="/manage-catalogue" className="list-group-item list-group-item-action">Manage movies</Link>
                <Link to="/graphql" className="list-group-item list-group-item-action">GraphQL</Link>
              </>
              }
            </div>
          </nav>
        </div>
        <div className="col-md-10">
          <Alert
            alertClassName={alertClassName}
            alertMessage={alertMessage}
          />
          <Outlet context={{
            jwtToken, setjwtToken,
            setalertClassName, setalertMessage
          }} />
        </div>
      </div>

    </div>
  );
}

export default App;
