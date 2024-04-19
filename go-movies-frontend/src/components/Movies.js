import React from 'react';
import {Link} from 'react-router-dom';
import {useState,useEffect} from 'react';
const Movies = () => {
  const [movies,setMovies] = useState([]);

  useEffect(() => {
    let moviesList = [
      {
        id:1,
        title:"Sholay",
        release_date:"1975-01-10",
        runtime:158,
        imdb_rating: 8.1,
        description: "some long description",
      },
      {
        id:2,
        title:"Interstellar",
        release_date:"2013-11-03",
        runtime:128,
        imdb_rating: 8.7,
        description: "some long description",
      }
    ];
    setMovies(moviesList);
  
    
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