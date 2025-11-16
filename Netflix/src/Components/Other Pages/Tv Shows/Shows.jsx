import React, { useEffect, useState, useContext } from "react";
import "./Shows.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Context } from "../../../Context Api/Context.jsx";
import { Link } from "react-router-dom";

const Shows = () => {
  const { loadMoreMovies, tvShows, TopTvShows } = useContext(Context);  // Destructure tvShows from context

  const [tvShowList, setTvShowList] = useState([]);
  const [topShow, setTopShow] = useState([]);

  useEffect(() => {
    setTvShowList(tvShows || []);  // Fallback to an empty array if tvShows is not available
    setTopShow(TopTvShows || []);
  }, [tvShows]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 100 >=
        document.documentElement.offsetHeight
      ) {
        loadMoreMovies();
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loadMoreMovies]);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
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
    <>
      <div className="card-slider">
        <h2 className="mt-3">Top Rated Tv Series</h2>
        <Slider {...settings}>
          {tvShowList.map((show) => (
            <div key={show.id} className="card">
              <Link to={`/watch/tv/${show.id}`}>
                <img
                  src={show.poster_path
                    ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : `https://image.tmdb.org/t/p/w500${show.backdrop_path}`
                  }
                  alt={show.name || "TV Show"}
                />
                <h3>{show.name}</h3>
              </Link>
            </div>
          ))}
        </Slider>
      </div>

      {/* top show  */}
      <div className="card-slider">
        <h2 className="mt-3">Popular TV Series</h2>
        <Slider {...settings}>
          {topShow.map((show) => (
            <div key={show.id} className="card">
              <Link to={`/watch/tv/${show.id}`}>
                <img
                  src={show.poster_path
                    ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : `https://image.tmdb.org/t/p/w500${show.backdrop_path}`
                  }
                  alt={show.name || "TV Show"}
                />
                <h3>{show.name}</h3>
              </Link>
            </div>
          ))}
        </Slider>
      </div>
    </>
  );
};

export default Shows;