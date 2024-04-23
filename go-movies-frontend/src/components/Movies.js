import React from 'react';
import {Link} from 'react-router-dom';
import {useState,useEffect} from 'react';
const Movies = () => {
  const [movies,setMovies] = useState([]);

  useEffect(() => {
    const headers = new Headers();
    headers.append("Content-Type","application/json");

    const requestOptions = {
      method: "Get",
      headers: headers,
    }
    fetch(`/movies`,requestOptions).then(
      (res)=>res.json()
    ).then(
      (data)=>{
        console.log(data);
        setMovies(data);
      }
    ).catch((err)=>console.log(err));
  
    
  }, []);
  
  return (
    <div className="text-center">
    <h1>Movies</h1>
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
          <Link to={`/movies/${m.id}`}>{m.title}</Link>
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

export default Movies;