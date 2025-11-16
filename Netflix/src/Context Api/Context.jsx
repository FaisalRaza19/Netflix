import { createContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"

export const Context = createContext();

export const ContextProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return localStorage.getItem("token") !== null;
    });
    const navigate = useNavigate()
    const location = useLocation()

    // Popular movies & Tv Shows
    const [Popular, setPopular] = useState([]);
    const [popularMovies, setPopularMovies] = useState([]);
    const [populraSeries, setPopularSeries] = useState([]);

    // TV show data
    const [tvShows, setTvShows] = useState([]);
    const [TopTvShows, setTopTvShows] = useState([]);
    // Movie data
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [movies, setMovies] = useState([]);
    const [topRated, setTopRated] = useState([]);
    const [upComing, setUpComing] = useState([]);

    useEffect(() => {
        const publicRoutes = ["/login", "/signup"];

        if (publicRoutes.includes(location.pathname)) {
            return;
        }

        const verifyJwt = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    navigate("/login");
                    return;
                }

                const response = await fetch("http://localhost:3000/user/userVerifyJWT", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                const json = await response.json();

                if (json.statusCode !== 200) {
                    localStorage.removeItem("token");
                    setIsLoggedIn(false)
                    navigate("/login");
                }
            } catch (error) {
                console.log("JWT error", error.message);
                localStorage.removeItem("token");
                navigate("/login");
            }
        };

        verifyJwt();

    }, [location.pathname]);


    const fetchData = async (currentPage) => {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMDY1OWU0ZmFjNTY5ZjE4NGY4ZGRkMzA0ZTVjYTAxMiIsIm5iZiI6MTcyNDIzMDkyOS43MzQwMDAyLCJzdWIiOiI2NmM1YWQxMWY3Zjk4NzI5YzJkMWIzMTUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.wOAs91y9h-nrJHMHF2wD1Gu7ksJYGtyxewyE-AOzHTY'
            }
        };

        try {
            const [moviesResponse, topRatedResponse, upComingResponse, tvShowsResponse,
                TopShow, popular, popularMovies, populraSeries] = await Promise.all([
                    // movies 
                    fetch(`https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=${currentPage}`, options),
                    fetch(`https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${currentPage}`, options),
                    fetch(`https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=${currentPage}`, options),

                    // tv shows 
                    fetch(`https://api.themoviedb.org/3/tv/airing_today?language=en-US&page=${currentPage}`, options),
                    fetch(`https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=${currentPage}`, options),

                    // popular movies and tv series 
                    fetch(`https://api.themoviedb.org/3/trending/all/day?language=en-US&page=${currentPage}`, options),
                    fetch(`https://api.themoviedb.org/3/trending/movie/day?language=en-US&page=${currentPage}`, options),
                    fetch(`https://api.themoviedb.org/3/trending/tv/day?language=en-US&page=${currentPage}`, options),
                ]);

            // movies 
            const moviesData = await moviesResponse.json();
            const topRatedData = await topRatedResponse.json();
            const upComingData = await upComingResponse.json();
            // tv series 
            const tvShowsData = await tvShowsResponse.json();
            const topShowData = await TopShow.json();
            // popular of all time 
            const populraData = await popular.json();
            const popularMoviesData = await popularMovies.json();
            const populraSeriesData = await populraSeries.json();

            // Append new data to the existing state arrays
            setMovies(prevMovies => [...prevMovies, ...moviesData.results]);
            setTopRated(prevTopRated => [...prevTopRated, ...topRatedData.results]);
            setUpComing(prevUpComing => [...prevUpComing, ...upComingData.results]);
            // tv series 
            setTvShows(prevTvShows => [...prevTvShows, ...tvShowsData.results]);
            setTopTvShows(prevTvShows => [...prevTvShows, ...topShowData.results]);
            // popular of all time 
            setPopular(prevpopular => [...prevpopular, ...populraData.results]);
            setPopularMovies(prevpopular => [...prevpopular, ...popularMoviesData.results]);
            setPopularSeries(prevpopular => [...prevpopular, ...populraSeriesData.results]);



            // Update total pages if available
            setTotalPages(moviesData.total_pages, topRatedData.total_pages, upComingData.total_pages, tvShowsData.total_pages,
                topShowData.total_pages, populraData.total_pages, popularMoviesData.total_pages, populraSeriesData.total_pages);
        } catch (error) {
            console.error("Failed to fetch data: ", error);
        }
    };

    useEffect(() => {
        if (page <= totalPages) {
            fetchData(page);
        }
    }, [page]);

    const loadMoreMovies = () => {
        if (page < totalPages) {
            setPage(prevPage => prevPage + 1);
        }
    };

    return (
        <Context.Provider value={{isLoggedIn, setIsLoggedIn,
            movies, topRated, upComing, loadMoreMovies, tvShows, TopTvShows, Popular,
            popularMovies, populraSeries
        }}>
            {children}
        </Context.Provider>
    );
};
