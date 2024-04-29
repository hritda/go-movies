import React from 'react'
import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';

const Movie = () => {
    const [movie, setMovie] = useState({});
    let {id} = useParams();

    useEffect(() => {
      const headers = new Headers();
      headers.append("Content-Type","application/json");
      const requestOptions = {
        method: "GET",
        headers: headers
      }
      fetch(`/movies/${id}`, requestOptions)
      .then((response)=>response.json())
      .then((data)=>setMovie(data))
      .catch((error)=>{
        console.log(error);
      })
    }, [id])
    
    if(movie.genres){
     movie.genres = Object.values(movie.genres);
    } else {
      movie.genres = [] ;
    }
  return (
    <div>
        <h2>Movie : {movie.title}</h2>
        <div className = "container">
        <div className="md-5">
        <small >
            <em>
            Release Date: { new Date(movie.release_date).toLocaleDateString()}            
            </em>
        </small>
        </div>
        <div className="md-5">
        <small >
            <em>
            Runtime: {movie.runtime}
            </em>
        </small>
        </div>
        <div className="md-5">
        <small >
            <em>
            IMDB Rating: {movie.imdb_rating}
            </em>
        </small>
        </div>
        </div>
        {movie.genres.map((g)=>{
          return <span key = {g.genre} className="badge bg-secondary me-4 mt-2">{g.genre}</span>
        })}
        <hr/>
        {movie.image !== "" &&
        <div className="mb-3"> 
         <img src={`https://image.tmdb.org/t/p/w200/${movie.image}`} alt="poster"/>
        </div>
        }
        <p>{movie.description}</p>
    </div>
  )
}

export default Movie;