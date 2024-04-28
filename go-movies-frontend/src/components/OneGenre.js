import {React, useState, useEffect} from 'react'
import {useLocation, useParams, Link} from 'react-router-dom';

const OneGenre = () => {
    //get prop passed to this component 
    const location = useLocation();
    const {genreName} = location.state ;
    //get stateful variables 
   const [movies, setMovies] = useState([]);

    //get the id from the url 
   let {id} = useParams();
    //useEffect to get the list of movies 

    useEffect(() => {
      const headers = new Headers();
      headers.append("Content-Type","application/json");
      
      const requestOptions = {
        method: "GET",
        headers: headers,
      }
      fetch(`/movies/genres/${id}`, requestOptions)
      .then((response)=>response.json())
      .then((data)=>{
        if(data.error){
            console.log(data.message);
        } else {
            if(data ==null){
            setMovies([]);
            } else {
                setMovies(data);
            }
        }
      })
      .catch(err => console.log(err))
    }, [id])
    
  return (
   <>
   <h2>Genre: {genreName}</h2>
   <hr/>
   { movies.length!==0 ? (<table className = "table table-striped table-hover">
    <thead>
        <tr>
        <th>Movie</th>
        <th>Release Date</th>
        <th>IMDB Rating</th>    
        </tr>
    </thead>
    <tbody>
        {
            movies.map((m)=>{
             return <tr key = {m.id}>
               <td>
                <Link to={`/movies/${m.id}`}>
                    {m.title}
                </Link>
               </td>
               <td>{m.release_date}</td>
               <td>{m.imdb_rating}</td>
             </tr>
})
            
        }
    </tbody>
   </table>)
   :(
    <p>No movies in this genre yet!</p>
   )  
   }
   </>
  )
}

export default OneGenre