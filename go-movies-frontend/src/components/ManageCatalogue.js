import React from 'react';
import {Link, useOutletContext, useNavigate} from 'react-router-dom';
import {useState,useEffect} from 'react';

const ManageCatalogue = () => {

  const [movies,setMovies] = useState([]);
  const {jwtToken} = useOutletContext();
  const navigate = useNavigate();
  useEffect(() => {
    if(jwtToken===""){
      console.log(jwtToken);
      navigate("/login");
     }
    const headers = new Headers();
    headers.append("Content-Type","application/json");
    headers.append("Authorization","Bearer " + jwtToken);

    const requestOptions = {
      method: "Get",
      headers: headers,
    }
    fetch(`/admin/movies`,requestOptions).then(
      (res)=>res.json()
    ).then(
      (data)=>{
        console.log(data);
        setMovies(data);
      }
    ).catch((err)=>console.log(err));
  
    
  }, [jwtToken, navigate]);

  return (
    <div className="text-center">
    <h1>Manage Catalogue</h1>
    <hr/>
    <table className="table table-striped table-hover">
      <thead>
        <tr>
          <th>Movie</th>
          <th>Release Date</th>
          <th>Rating</th>
        </tr>
      </thead>
    <tbody>
      {
        movies.map((m)=>(
         <tr key={m.id}>
          <td>
          <Link to={`/admin/movies/${m.id}`}>{m.title}</Link>
          </td>
          <td>
            {m.release_date}
          </td>
          <td>
            {m.imdb_rating}
          </td>
         </tr>
         ))
      }
    </tbody>
    </table>

</div>
  )
}

export default ManageCatalogue;