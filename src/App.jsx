import { useState, useEffect } from 'react'
import './App.css'
import placeholder from './assets/placeholder.jpeg'

function App() {

  const apiKey = import.meta.env.VITE_API_KEY;
  const baseUrl = 'http://www.omdbapi.com/';

  const [search, setSearch] = useState({
    movie: '',
  })
  const [movies, setMovies] = useState([]);

  const [flagResult, setFlagResult] =useState(false);

  const clearInput = (id) => {
    document.getElementById(id).value = '';
  };

  const handleChange = (e) => {
    setSearch({
      ...search,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = async (movieTitle) => {

    if (!movieTitle) {
        console.error("Por favor escribe un nombre de película.");
        return;
    }

    try {
      const params = new URLSearchParams({
        apiKey,
        s: movieTitle
      });
      const fullURL = `${baseUrl}?${params.toString()}`;
      
      const response = await fetch(fullURL);
      if (!response.ok) {
        throw new Error(`Error en la red: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      if (data.Response === "False") {
        console.error(data.Error);
        setFlagResult(true);
        return;
      }
      setMovies(data.Search || []);
      setFlagResult(false);
      console.log(data);
    }
    catch (error) {
      console.error("Error en la petición:", error.message);
    }
  };
  
  return (
    <>
      <div className='main-container'>
        <h1 className='title'>Movie Finder</h1>
        <form>
          <div className='input-wrapper'>
            <input 
              type="text" 
              name="movie" 
              id="movie-search" 
              className='movie-input'
              placeholder='Write movie name...'
              value={search.movie}
              onChange={handleChange}
            />
            <button 
                type="button" 
                className="clear-button"
                onClick={() => clearInput('movie-search')}
            >×</button>
          </div>
        </form>
        <button 
          className='search-button'
          onClick={() => handleSearch(search.movie)}
        >
          Find Movie
        </button>
        <div className='results-container'>
          {flagResult ? (
            <p className='not-found'> Movie not found </p>
          ) : ( movies.length === 0 ? (
              <p></p>
            ) : (
              <>
                {movies.map((movie, index) => (
                  <div key={index} className='movie-container'>
                    <img 
                      className="movie-poster"
                      src={(movie.Poster !== "N/A" )? movie.Poster : placeholder}
                      alt={movie.Title}
                    />
                    <div className="movie-info">
                      <p className="movie-title">{movie.Title}</p>
                      <p className="movie-year">{movie.Year}</p>
                    </div>
                  </div>
                ))}
              </>
            )
          )}
        </div>
      </div>
    </>
  )
}

export default App
