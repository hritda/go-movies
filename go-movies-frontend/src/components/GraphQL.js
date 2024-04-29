import {React, useState,useEffect} from 'react'
import Input from './form/Input'
import {Link} from 'react-router-dom';

const GraphQL = () => {
  //set the stateful variables
  const [movies,setMovies] = useState([]);
  const [SearchTerm, setSearchTerm] = useState("");
  const [fullList,setFullList] = useState([]);

  //perform a search 
  const performSearch = ()=>{
   const payload = `
    {
      search(titleContains: "${SearchTerm}"){
        id
        title
        runtime
        release_date
        imdb_rating
      }
    }
   `;

   const headers = new Headers();
   headers.append("Content-Type","application/graphql");
   const requestOptions = {
    method: "POST",
    headers: headers,
    body: payload,
   }

   fetch(`/graphql`, requestOptions)
   .then((response)=>response.json())
   .then((response)=>{
    let theList = Object.values(response.data.search);
    setMovies(theList);
   })
   .catch(err =>{console.log(err)})


  }

  const handleChange = (event) => {
   event.preventDefault();
   setSearchTerm(event.target.value);

   if(event.target.value.length > 2){
    performSearch();
   }
   else {
    setMovies(fullList);
   }
  }
  //useEffect 
  useEffect(() => {
    const payload = `
     {
      list {
      id
      title
      runtime
      release_date
      imdb_rating
      }
     }`;
  const headers = new Headers();
  headers.append("Content_Type","application/graphql");
  const requestOptions = {
    method : "POST",
    headers: headers,
    body: payload,
  }

  fetch(`/graphql`,requestOptions)
   .then((response)=>response.json())
   .then((response)=>{
    let theList = Object.values(response.data.list);
    setMovies(theList);
    setFullList(theList);
   })
   .catch((err)=>{console.log(err)})

  }, [])
  
  return (
    <div>
      <h2>GraphQL</h2>
      <hr/>
      <form onSubmit = {handleChange}>
        <Input
        title = {"Search"}
        type = {"search"}
        name = {"search"}
        className = "form-control"
        value = {SearchTerm}
        onChange = {handleChange}
        />
       
      </form>
      {movies.length>0 ? (
        <table className = "table table-striped table-hover">
        <thead>
         <tr>
          <th>Movie</th>
          <th>Release_Date</th>
          <th>IMDB Rating</th>
         </tr>
        </thead>
        <tbody>
          {
            movies.map((m)=>{
             return  <tr key = {m.id}>
                <td>
                  <Link to = {`/movies/${m.id}`}>
                    {m.title}
                  </Link>
                </td>
                <td>
                  {new Date(m.release_date).toLocaleDateString()}
                </td>
                <td>
                  {m.imdb_rating}
                </td>

              </tr>
            }
            )
          }
        </tbody>


        </table>

      ):(
        <p> No movies yet! </p>
      )}
    </div>
  )
}

export default GraphQL;