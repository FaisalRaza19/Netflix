import { useParams, Link } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { Context } from "../../Context Api/Context.jsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import "./Watch.css";

const Watch = () => {
    const { type, id } = useParams();
    const [videoKey, setVideoKey] = useState('');
    const [videoTitle, setVideoTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [recommended, setRecommended] = useState([]);
    const { loadMoreMovies } = useContext(Context);

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const response = await fetch(
                    `https://api.themoviedb.org/3/${type}/${id}/videos?language=en-US`,
                    {
                        headers: {
                            accept: 'application/json',
                            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMDY1OWU0ZmFjNTY5ZjE4NGY4ZGRkMzA0ZTVjYTAxMiIsIm5iZiI6MTcyNDgyMzg5OC43NTM3NCwic3ViIjoiNjZjNWFkMTFmN2Y5ODcyOWMyZDFiMzE1Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.M4Y0-PnIf5hw1lgZl_ZdG-FcCDmfv84kH2EFy85YLMA',

                        },
                    }
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch video data');
                }

                const data = await response.json();
                const trailer = data.results.find(
                    video => video.type === 'Trailer' || video.type === 'Teaser'
                );

                if (trailer) {
                    setVideoKey(trailer.key);
                    setVideoTitle(trailer.name || 'Video');
                } else {
                    setError("No trailer found for this ID.");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchVideo();
    }, [id, type]);

    useEffect(() => {
        const fetchRecommended = async () => {
            try {
                const response = await fetch(
                    `https://api.themoviedb.org/3/${type}/${id}/recommendations?language=en-US&page=1`,
                    {
                        method: 'GET',
                        headers: {
                            accept: 'application/json',
                            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMDY1OWU0ZmFjNTY5ZjE4NGY4ZGRkMzA0ZTVjYTAxMiIsIm5iZiI6MTcyNDgyMzg5OC43NTM3NCwic3ViIjoiNjZjNWFkMTFmN2Y5ODcyOWMyZDFiMzE1Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.M4Y0-PnIf5hw1lgZl_ZdG-FcCDmfv84kH2EFy85YLMA',
                        }
                    });

                if (!response.ok) {
                    throw new Error('Failed to fetch recommended data');
                }

                const data = await response.json();
                setRecommended(data.results);
            } catch (error) {
                console.error("Recommended error", error);
                setError("Failed to load recommended content.");
            }
        };

        fetchRecommended();
    }, [id]);

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

    if (loading) {
        return <div style={{ padding: '20px', color: 'white' }}>Loading video...</div>;
    }

    if (error) {
        return <div style={{ padding: '20px', color: 'white' }}>{error}</div>;
    }

    return (
        <>
            <div style={{ padding: '20px', color: 'white' }}>
                <h1>{videoTitle}</h1>
                <iframe
                    width="100%"
                    height="500px"
                    src={`https://www.youtube.com/embed/${videoKey}`}
                    title={videoTitle}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ marginTop: '20px' }}
                ></iframe>
            </div>
            {recommended.length > 0 && (
                <div className="recommended">
                    <div className="card-slider">
                        <h2>Recommended Video/TV Series</h2>
                        <Slider {...settings}>
                            {recommended.map((item) => (
                                <div key={item.id} className="card">
                                    <Link to={`/watch/${type}/${item.id}`}>
                                        <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt={item.title || item.name} />
                                        <h3>{item.title || item.name}</h3>
                                    </Link>
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>
            )}
        </>
    );
};

export default Watch;