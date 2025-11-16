import React, { useContext} from 'react';
import {Routes, Route } from 'react-router-dom';
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
  const { isLoggedIn, setIsLoggedIn } = useContext(Context)

  return (
    <div>
      {!isLoggedIn ? (
        <Routes>
          <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/signup" element={<SignUpPage setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="*" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
        </Routes>
      ) : (
        <>
          <Navbar setIsLoggedIn={setIsLoggedIn} />
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
      )}
    </div>
  );
}

export default App;
