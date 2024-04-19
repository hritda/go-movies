import React from 'react'
import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';

const Movie = () => {
    const [movie, setMovie] = useState({});
    let {id} = useParams();

    useEffect(() => {
       let movie =  {
            id:1,
            title:"Sholay",
            release_date:"1975-01-10",
            runtime:158,
            imdb_rating: 8.1,
            description: "some long description",
          }
          setMovie(movie);
    
      
    }, [id])
    
  return (
    <div>
        <h2>Movie : {movie.title}</h2>
        <div className = "container">
        <div className="md-5">
        <small >
            <em>
            Release Date: {movie.release_date}            
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
        <hr/>
        <p>{movie.description}</p>
    </div>
  )
}

export default Movie;