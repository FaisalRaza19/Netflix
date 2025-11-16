import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import "./Search.css"

const SearchResults = () => {
  const location = useLocation();
  const searchData = location.state?.searchData || [];
  const query = new URLSearchParams(location.search).get('query');
  const settings = {
    dots: false, // Show navigation dots
    infinite: false, // Loop through slides
    speed: 500, // Transition speed
    slidesToShow: 4, // Number of slides to show at once
    slidesToScroll: 4, // Number of slides to scroll at Linktime
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };


  return (
    <div className="search-results">
      {searchData.length > 0 ? (
        <div className="card-slider">
          <h2>Search Results {query}</h2>
          <Slider {...settings}>
            {searchData.map((movie) => (
              <div key={movie.id} className="card">
                <Link to={`/watch/movie/${movie.id}`}>
                  <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}` || `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`} alt={movie.title} />
                  <h3>{movie.original_title}</h3>
                </Link>
              </div>
            ))}
          </Slider>
        </div>
      ) : (
        <p>No results found</p>
      )}
    </div>
  );
};

export default SearchResults;