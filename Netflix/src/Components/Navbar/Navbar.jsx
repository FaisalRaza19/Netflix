import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ setIsLoggedIn }) => {
    const [searchValue, setSearchValue] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const navigate = useNavigate();
    const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

    // Logout Logic
    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/logOut`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            });

            const json = await response.json();

            if (response.ok && (json.statusCode === 200 || json.success)) {
                localStorage.removeItem("token");
                setIsLoggedIn(false);
                navigate("/login");
            } else {
                alert(json.message || "Invalid Token. Please try again.");
            }
        } catch (error) {
            console.error("Error during logOut:", error);
            alert("LogOut failed. Please try again later.");
        }
    };

    // 🔍 Live Search With Debounce
    useEffect(() => {
        if (!searchValue.trim()) {
            setResults([]);
            setShowDropdown(false);
            return;
        }

        setLoading(true);

        const timeout = setTimeout(async () => {
            try {
                const response = await fetch(
                    `https://api.themoviedb.org/3/search/multi?query=${searchValue}&include_adult=false&language=en-US&page=1`,
                    {
                        method: 'GET',
                        headers: {
                            accept: 'application/json',
                            Authorization: `Bearer ${TMDB_TOKEN}`,
                        },
                    }
                );

                const data = await response.json();
                setResults(data.results || []);
                setShowDropdown(true);
            } catch (error) {
                console.error("Search error:", error);
            } finally {
                setLoading(false);
            }
        }, 500); // 0.5 sec debounce

        return () => clearTimeout(timeout);
    }, [searchValue]);

    // Navigate to watch page
    const handleWatch = (item) => {
        navigate(`/watch/movie/${item.id}`);
        setShowDropdown(false);
        setSearchValue("");
    };


    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
            <div className="container-fluid">
                <Link className="navbar-brand ms-5" to="/home">
                    <img src="src/assets/logo.png" alt="Logo" />
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-5">
                        <li className="nav-item"><Link className="nav-link ms-3" to="/home">Home</Link></li>
                        <li className="nav-item"><Link className="nav-link ms-3" to="/tvShows">TV Shows</Link></li>
                        <li className="nav-item"><Link className="nav-link ms-3" to="/movies">Movies</Link></li>
                        <li className="nav-item"><Link className="nav-link ms-3" to="/popular">New & Popular</Link></li>
                    </ul>

                    {/* 🔍 Search Box */}
                    <div className="position-relative me-4" style={{ width: "250px" }}>
                        <input
                            className="form-control"
                            type="search"
                            placeholder="Search movies..."
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onFocus={() => searchValue && setShowDropdown(true)}
                        />

                        {/* 🔄 Loading spinner */}
                        {loading && (
                            <div className="spinner-border spinner-border-sm text-light position-absolute"
                                style={{ top: "50%", right: "10px", transform: "translateY(-50%)" }}>
                            </div>
                        )}

                        {/* 🔽 Dropdown Search Results */}
                        {showDropdown && results.length > 0 && (
                            <ul className="dropdown-menu show w-100 mt-2 p-2" style={{ maxHeight: "300px", overflowY: "auto" }}>
                                {results.map((item) => (
                                    <li
                                        key={item.id}
                                        className="dropdown-item d-flex align-items-center gap-3"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => handleWatch(item)}
                                    >
                                        <img
                                            src={
                                                item.poster_path
                                                    ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
                                                    : "https://via.placeholder.com/50x70?text=No+Image"
                                            }
                                            alt={item.title || item.name}
                                            style={{ width: "50px", height: "70px", objectFit: "cover", borderRadius: "4px" }}
                                        />

                                        <div>
                                            <strong>{item.title || item.name}</strong>
                                            <div className="text-muted" style={{ fontSize: "12px" }}>
                                                {item.media_type === "movie" ? "Movie" : "TV Show"}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <button className="btn btn-success ms-3" onClick={handleLogout}>Log Out</button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
