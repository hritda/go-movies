import {useEffect, useState} from 'react'
import {useNavigate, useOutletContext, useParams} from 'react-router-dom';
import Input from './form/Input';
import TextArea from './form/TextArea';
const EditMovie = () => {

  const navigate = useNavigate();
  const {jwtToken} = useOutletContext();

  const [error, setError] = useState(null);
  const [errors,setErrors] = useState([]);
  const [movie, setMovie] = useState({
    id:0 ,
    title:"",
    release_date:"",
    runtime:"",
    imdb_rating:"",
    description:"",
    genres: [],
    genres_array: [Array(13).fill(false)]
  })
  //get id from the params
  let {id} = useParams();
  if(id === undefined){
    id = 0;
  }
  useEffect(() => {
    
   if(jwtToken===""){
    navigate("/login");
    return ;
   }

   if(id===0){
  //adding a movie
  setMovie({
    id:0 ,
    title:"",
    release_date:"",
    runtime:"",
    imdb_rating:"",
    description:"",
    genres: [],
    genres_array: [Array(13).fill(false)]
  })
  const headers = new Headers();
  headers.append("Content-Type","application/json");
  const requestOptions = {
    method: "GET",
    headers: headers
  }
  fetch("/genres", requestOptions)
  .then((response)=>response.json())
  .then((data)=>{
    const checks = [];

    data.forEach(g => {
      checks.push({id: g.id, checked:false, genre: g.genre});
    });

    setMovie(m=>({
     ...movie,
     genres: checks,
     genres_array: []
    }))
  })
  .catch(err=> console.log(err))
   } else {
   //editing an existing movie
   }
  }, [id, jwtToken,navigate])

  const handleSubmit = (event) => {
    event.preventDefault();
  }
 const hasError = (key)=>{
  return errors.indexOf(key) !== -1 ;
 }
  const handleChange = () => (event) => {
    let value = event.target.value ;
    let name = event.target.name ;
    setMovie({
      ...movie,
      [name]:value,
    })
  }
  
  return (
    <div>
      
      <h2>Add/Edit Movie</h2>
      <hr/>
      <pre>{JSON.stringify(movie,null,3)}</pre>
      <form onSubmit={handleSubmit}>
        <input name="id" id = "id" type="hidden" value = {movie.id}></input>
        <Input
        className={"form-control"}
        title = {"Title"}
        value={movie.title}
        type = {"text"}
        name = {"title"}
        onChange = {handleChange("title")}
        errorDiv = {hasError("title") ? "text-danger":"d-none"}
        errorMsg = {"Please enter a title"}
       />
       <Input
        className={"form-control"}
        title = {"Release Date"}
        value={movie.release_date}
        type = {"date"}
        name = {"release_date"}
        onChange = {handleChange("release_date")}
        errorDiv = {hasError("release_date") ? "text-danger":"d-none"}
        errorMsg = {"Please enter a release date"}
       />
       <Input
        className={"form-control"}
        title = {"Runtime"}
        value={movie.runtime}
        type = {"text"}
        name = {"runtime"}
        onChange = {handleChange("runtime")}
        errorDiv = {hasError("runtime") ? "text-danger":"d-none"}
        errorMsg = {"Please enter a runtime"}
       />
       <Input
        className={"form-control"}
        title = {"IMDB Rating"}
        value={movie.imdb_rating}
        type = {"text"}
        name = {"imdb_rating"}
        onChange = {handleChange("imdb_rating")}
        errorDiv = {hasError("imdb_rating") ? "text-danger":"d-none"}
        errorMsg = {"Please enter a valid IMDB rating"}
       />
       <TextArea
        title={"Description"}
        name={"description"}
        value={movie.description}
        rows={"3"}
        onChange={handleChange("description")}
        errorDiv = {hasError("description") ? "text-danger":"d-none"}
        errorMsg = {"Please enter a description"}
       />
       <h2>Genres</h2>
      </form>

    </div>
  )
}

export default EditMovie;