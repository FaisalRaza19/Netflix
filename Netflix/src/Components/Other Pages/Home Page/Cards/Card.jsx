import React, { useEffect, useState, useContext } from "react";
import "./Card.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Context } from "../../../../Context Api/Context.jsx";
import { Link } from "react-router-dom";

const Card = () => {
    const [movie, setMovie] = useState([]);
    const [topMovie, setTopMovie] = useState([]);
    const [upComingMovies, setUpComing] = useState([]);
    const { movies, topRated, loadMoreMovies, upComing } = useContext(Context);

    useEffect(() => {
        setMovie(movies);
        setTopMovie(topRated);
        setUpComing(upComing);
    }, [movies, topRated]);


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
        <>
            <div className="card-slider">
                <h2>Popular On Netflix</h2>
                <Slider {...settings}>
                    {movie.map((movie) => (
                        <div key={movie.id} className="card">
                            <Link to= {`/watch/movie/${movie.id}`}>
                                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}` || `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`} alt={movie.title} />
                                <h3>{movie.original_title}</h3>
                            </Link>
                        </div>
                    ))}
                </Slider>
            </div>

            {/* BlockBuster */}
            <div className="card-slider">
                <h2>BlockBuster</h2>
                <Slider {...settings}>
                    {topMovie.map((movie) => (
                        <div key={movie.id} className="card">
                            <Link to= {`/watch/movie/${movie.id}`}>
                                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}` || `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`} alt={movie.title} />
                                <h3>{movie.original_title}</h3>
                            </Link>
                        </div>
                    ))}
                </Slider>
            </div>

            {/* upComing */}
            <div className="card-slider">
                <h2>UpComing</h2>
                <Slider {...settings}>
                    {upComingMovies.map((movie) => (
                        <div key={movie.id} className="card">
                            <Link to= {`/watch/movie/${movie.id}`}>
                                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}` || `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`} alt={movie.title} />
                                <h3>{movie.original_title}</h3>
                            </Link>
                        </div>
                    ))}
                </Slider>
            </div>
        </>
    );
};

export default Card;