import {useEffect, useState} from 'react'
import {useNavigate, useOutletContext, useParams} from 'react-router-dom';
import Input from './form/Input';
import CheckBox from './form/CheckBox';
import Swal from 'sweetalert2';
import TextArea from './form/TextArea';
const EditMovie = (props) => {

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

    setMovie(m => ({
     ...m,
     genres: checks,
     genres_array: []
    }));
  })
  .catch(err=> console.log(err))
   } else {
   //editing an existing movie
   const headers = new Headers();
   headers.append("Content-Type", "application/json");
   headers.append("Authorization","Bearer "+ jwtToken);
   const requestOptions = {
    method: "GET",
    headers: headers,
    credentials: "include",
   }

   fetch(`/admin/movies/${id}`,requestOptions)
   .then((response)=>{
    if(response.status!==200){
      setError("invalid response code: "+response.status);
    }
    return response.json()
   })
   .then((data)=>{
    //fix release date
    data.movie.release_date = new Date(data.movie.release_date).toISOString().split('T')[0];
    const checks = [];

    data.genres.forEach(g =>{
      if(data.movie.genres_array.indexOf(g.id)!==-1){
        checks.push({ id: g.id, checked: true, genre: g.genre});
      } else {
        checks.push({ id: g.id, checked: false, genre: g.genre});
      }
    })
    //set the movie 
    setMovie({
      ...data.movie,
      genres: checks,
    })
   })
   .catch(err=> console.log(err))
   }
  }, [id, jwtToken,navigate])

  const handleSubmit = (event) => {
    event.preventDefault();

    let errors = [];
    let required = [
      {field: movie.title, name : "title"},
      {field: movie.release_date, name : "release_date"},
      {field: movie.runtime, name : "runtime"},
      {field: movie.description, name : "description"},
      {field: movie.imdb_rating, name : "imdb_rating"},
    ];
    required.forEach(function(obj){
      if(obj.field === "" || (obj.name==="imdb_rating" && (parseFloat(obj.field,10)<1 || parseFloat(obj.field,10)>10 ))){
        errors.push(obj.name);
      }
    })
    if(movie.genres_array.length===0){
      Swal.fire(
        {
          title: 'Error!',
          text: 'You must choose at least one genre',
          icon: 'error',
          confirmButtonText: 'OK',
        }
      )
      errors.push("genres");
    }
    setErrors(errors);
    if(errors.length>0){
      return false ;
    }
    const headers = new Headers();
    headers.append("Content-Type","application/json");
    headers.append("Authorization","Bearer "+ jwtToken);

    //assume we are adding a new movie 

    let method = "PUT";

    if(movie.id > 0){
      method = "PATCH";
    }
    const requestBody = movie ;

    //need to convert the release_date in JSON (to date)
    //and for runtime to int
    requestBody.release_date = new Date(requestBody.release_date);
    requestBody.runtime = parseInt(requestBody.runtime,10);

    let requestOptions = {
      body: JSON.stringify(requestBody),
      method: method ,
      headers: headers,
      credentials: "include",
    }

     fetch(`/admin/movies/${movie.id}`, requestOptions)
    .then((response)=> response.json())
    .then((data)=>{
      if(data.error){
        console.log(data.error);
      } else {
       
        navigate("/manage-catalogue")
      }
    })
    .then(()=>{
      if(id===0){
       Swal.fire(
        {
          title: 'Added!',
          text: 'The movie is added to the catalogue!',
          icon: 'success',
          showConfirmButton: false,
          timer: 1300,
        })
      } else{
        Swal.fire(
          {
            title: 'Updated!',
            text: 'The movie is updated successfully!',
            icon: 'success',
            showConfirmButton: false,
            timer: 1300,
          })
      }
    })
    .catch(err => {
      console.log(err);
    })
    
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
  const handleCheck = (event,position) => {
    console.log("handlecheck clicked");
    console.log("value in handlecheck ", event.target.value);
    console.log("checked status is ", event.target.checked);
    console.log("position of the target is ", position);
    let tmpArr = movie.genres ;
    tmpArr[position].checked = !tmpArr[position].checked ;

    let tmpIDs = movie.genres_array ;
    if(!event.target.checked){
      tmpIDs.splice(tmpIDs.indexOf(event.target.value));
    } else {
      tmpIDs.push(parseInt(event.target.value,10));
    }

    setMovie({
      ...movie,
      genres_array: tmpIDs,
    });
  }
  const confirmDelete = ()=>{
    Swal.fire({
      title: "Do you want to delete this movie?",
      text: "You won't be able to undo this action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        let headers = new Headers()
        headers.append("Authorization", "Bearer "+jwtToken)
        let requestOptions = {
          method: "DELETE",
          headers: headers,
        }

        fetch(`/admin/movies/${movie.id}`, requestOptions)
        .then((response)=>response.json())
        .then((data)=>{
          if(data.error){
            console.log(data.error);
            Swal.fire({
              title: "Oops!",
              text: "There was an error deleting this movie",
              icon: "error",
            confirmButtonText: "OK",
            });
           
          } else {
            navigate("/manage-catalogue");
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
              showConfirmButton: false,
              timer: 1300,
            });
          }
        })
        .catch(err => {
          return false ;
        })
      }
    });
  }
  if(error!==null){
    Swal.fire(
      {
        title: 'Oops!',
        text: 'The server is down, please try again later...',
        icon: 'info',
        confirmButtonText: "OK",
        timer: 1300,
      })
  } else {
  return (
    <div>
      
      <h2>Add/Edit Movie</h2>
      <hr/>
      {/* <pre>{JSON.stringify(movie,null,3)}</pre> */}
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
        errormsg = {"Please enter a title"}
       />
       <Input
        className={"form-control"}
        title = {"Release Date"}
        value={movie.release_date}
        type = {"date"}
        name = {"release_date"}
        onChange = {handleChange("release_date")}
        errorDiv = {hasError("release_date") ? "text-danger":"d-none"}
        errormsg = {"Please enter a release date"}
       />
       <Input
        className={"form-control"}
        title = {"Runtime (in minutes)"}
        value={movie.runtime}
        type = {"text"}
        name = {"runtime"}
        onChange = {handleChange("runtime")}
        errorDiv = {hasError("runtime") ? "text-danger":"d-none"}
        errormsg = {"Please enter a runtime"}
       />
       <Input
        className={"form-control"}
        title = {"IMDB Rating"}
        value={movie.imdb_rating}
        type = {"text"}
        name = {"imdb_rating"}
        onChange = {handleChange("imdb_rating")}
        errorDiv = {hasError("imdb_rating") ? "text-danger":"d-none"}
        errormsg = {"Please enter a valid IMDB rating(range 1 - 10)"}
       />
       <TextArea
        title={"Description"}
        name={"description"}
        value={movie.description}
        rows={"3"}
        onChange={handleChange("description")}
        errorDiv = {hasError("description") ? "text-danger":"d-none"}
        errormsg = {"Please enter a description"}
       />
       <hr/>
       <h3>Genres</h3>
       {
        movie.genres && movie.genres.length > 1 && 
        <>
        {
          Array.from(movie.genres).map((g, index)=>
           <CheckBox
           title = {g.genre}
           name = {"genre"}
           key = {index}
           id = {"genre" + index}
           onChange = {(event)=>handleCheck(event,index)}
           value = {g.id}
           checked = {movie.genres[index].checked}
           />
        )
        }
        </>
       }
       <hr/>
       <button  className="btn btn-primary mb-3">Save</button>
       {movie.id > 0 && 
       <a onClick = {confirmDelete} href="#!" className="btn btn-danger ms-2 mb-3">Delete Movie</a>
       }   
      </form>

    </div>
  )
}
}

export default EditMovie;