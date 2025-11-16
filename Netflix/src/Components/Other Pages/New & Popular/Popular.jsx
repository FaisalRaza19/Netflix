import React, { useEffect, useState, useContext } from "react";
import "./Popular.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Context } from "../../../Context Api/Context";
import { Link } from "react-router-dom";

const Popular = () => {
    const [popular, setPopular] = useState([]);
    const [popularMovie, setPopularMovie] = useState([]);
    const [PopularSeries, setPopularSeries] = useState([]);
    const { Popular, loadMoreMovies, popularMovies, populraSeries } = useContext(Context);  // Destructure the movies from context

    useEffect(() => {
        // Assuming 'movies' from context is the popular movies list
        setPopular(Popular || []);
        setPopularMovie(popularMovies || []);
        setPopularSeries(populraSeries)
    }, [Popular, popularMovies, populraSeries]);

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
        slidesToScroll: 4, // Number of slides to scroll at a time
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
                <h2 className="mt-4">Popular of All Time</h2>
                <Slider {...settings}>
                    {popular.map((movie) => (
                        <div key={movie.id} className="card">
                            <Link to={`/watch/movie/${movie.id}`}>
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}` || `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                                    alt={movie.title || "Movie Poster"}
                                />
                                <h3>{movie.original_title || "Untitled"}</h3>
                            </Link>
                        </div>
                    ))}
                </Slider>
            </div>

            {/* popular of all time movies  */}
            <div className="card-slider">
                <h2 className="mt-4">All Time Popular Movies</h2>
                <Slider {...settings}>
                    {popularMovie.map((movie) => (
                        <div key={movie.id} className="card">
                            <Link to={`/watch/movie/${movie.id}`}>
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}` || `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                                    alt={movie.title || "Movie Poster"}
                                />
                                <h3>{movie.original_title || "Untitled"}</h3>
                            </Link>
                        </div>
                    ))}
                </Slider>
            </div>

            {/* popular of all time Series  */}
            <div className="card-slider">
                <h2 className="mt-4">All Time Popular Tv Series</h2>
                <Slider {...settings}>
                    {PopularSeries.map((movie) => (
                        <div key={movie.id} className="card">
                            <Link to={`/watch/movie/${movie.id}`}>
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}` || `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                                    alt={movie.title || "Movie Poster"}
                                />
                                <h3>{movie.original_title || "Untitled"}</h3>
                            </Link>
                        </div>
                    ))}
                </Slider>
            </div>
        </>
    );
};

export default Popular;

