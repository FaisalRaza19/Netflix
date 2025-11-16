import React, { useContext, useEffect, useState } from 'react';
import "./Home.css";
import Card from './Cards/Card';
import { Context } from '../../../Context Api/Context';
import {Link} from "react-router-dom"

const Home = () => {
    const { movies } = useContext(Context);
    const [hero, setHero] = useState(null);

    useEffect(() => {
        const fetchRandomMovie = async () => {
            const totalPages = 100; // TMDB allows up to 500 pages, adjust as needed
            const randomPage = Math.floor(Math.random() * totalPages) + 1;
            const options = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMDY1OWU0ZmFjNTY5ZjE4NGY4ZGRkMzA0ZTVjYTAxMiIsIm5iZiI6MTcyNDgyMzg5OC43NTM3NCwic3ViIjoiNjZjNWFkMTFmN2Y5ODcyOWMyZDFiMzE1Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.M4Y0-PnIf5hw1lgZl_ZdG-FcCDmfv84kH2EFy85YLMA'
                }
            };

            try {
                const response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=${randomPage}`, options);
                const data = await response.json();
                if (data.results && data.results.length > 0) {
                    const randomMovie = data.results[Math.floor(Math.random() * data.results.length)];
                    setHero(randomMovie);
                }
            } catch (error) {
                console.error("Failed to fetch random movie:", error);
            }
        };

        fetchRandomMovie();
    }, []);

    return (
        <>
            {hero && (
                <div className="hero-section">
                    <div className="banner">
                        <img
                            src={`https://image.tmdb.org/t/p/w500${hero.poster_path}`|| `https://image.tmdb.org/t/p/w500${hero.backdrop_path}`}
                            alt={hero.title || "Hero Banner"}
                        />
                    </div>
                    <div className="banner-info">
                        <h2 className='hero-title ml-5'>{hero.original_name || hero.original_title}</h2>
                        <p className="banner-description">
                            {hero.overview || "Discovering his ties to a secret ancient order, a young man living in modern Istanbul embarks on a quest to save the city from an immortal enemy."}
                        </p>
                        <div className="buttons">
                            <Link to={`/watch/movie/${hero.id}`}><button className="btn play-btn"><img src="src/assets/play_icon.png" alt="Play Icon" /> Play</button></Link>
                            <a href="/"><button className="btn info-btn"><img src="src/assets/info_icon.png" alt="Info Icon" /> More Info</button></a>
                        </div>
                    </div>
                </div>
            )}
            <Card />
        </>
    );
}

export default Home;
