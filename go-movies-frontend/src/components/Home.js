import React from 'react';
import {Link} from 'react-router-dom';
import Ticket from './../images/movie_tickets.jpg';

const Home = () => {
  return (
    <>
    <div className="text-center">
        <h1>Find a movie to watch!</h1>
        <hr/>
        <Link to="/movies" >
        <img src = {Ticket} alt="movie ticket"></img>
        </Link>

    </div>
    </>
  )
}

export default Home