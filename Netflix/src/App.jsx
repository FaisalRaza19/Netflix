import React, { useContext, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from "./Components/Navbar/Navbar.jsx";
import Shows from "./Components/Other Pages/Tv Shows/Shows";
import Movies from "./Components/Other Pages/Movies/Movies";
import Home from "./Components/Other Pages/Home Page/Home";
import Footer from "./Components/Footer/Foter.jsx";
import Popular from "./Components/Other Pages/New & Popular/Popular.jsx";
import Watch from "./Components/Watch Video/Watch.jsx";
import SearchResults from "./Components/Other Pages/Serach Data/SearchData.jsx";
import LoginPage from "./Components/Other Pages/Login & SignUp/Login.jsx";
import SignUpPage from "./Components/Other Pages/Login & SignUp/SignUp.jsx";
import { Context } from './Context Api/Context.jsx';

function App() {
  const { isLoggedIn, setIsLoggedIn } = useContext(Context);
  const navigate = useNavigate();

  // Persist login across refresh
  useEffect(() => {
    const storedLogin = localStorage.getItem("isLoggedIn");
    if (storedLogin === "true") {
      setIsLoggedIn(true);
      navigate("/home");
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
    navigate("/home");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage setIsLoggedIn={handleLogin} />} />
        <Route path="/signup" element={<SignUpPage setIsLoggedIn={handleLogin} />} />
        <Route path="*" element={<LoginPage setIsLoggedIn={handleLogin} />} />
      </Routes>
    );
  }

  return (
    <>
      <Navbar setIsLoggedIn={handleLogout} />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/tvShows" element={<Shows />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/popular" element={<Popular />} />
        <Route path="/watch/:type/:id" element={<Watch />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
