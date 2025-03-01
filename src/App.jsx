import React, { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import "./index.css";

import Header from "./Header";
import Home from "./Home";
import NavigationMenu from "./NavigationMenu";
import Signin from "./Signin";
import Signup from "./Signup";
import SuggestedMovies from "./SuggestedMovies";
import WatchedMovie from "./WatchedMovie";
import WatchedMovies from "./WatchedMovies";
import authService from "./services/authService";

const App = () => {
    const [user, setUser] = useState(undefined);

    useEffect(() => {
        const currentUser = authService.getCurrentUser();

        if (currentUser) {
            setUser(currentUser);
        }
    }, []);

    const signout = () => {
        authService.signout();
        setUser(undefined);
    };

    return (
        <>
            <NavigationMenu user={user} signoutHandler={signout} />
            <Header />
            <Router>
                <Routes>
                    <Route exact path="/signup" element={<Signup />} />
                    <Route exact path="/signin" element={<Signin />} />
                    <Route exact path="/" element={<Home />} />
                    <Route
                        exact
                        path="/new-movies/:genre"
                        element={<SuggestedMovies />}
                    />
                    <Route
                        exact
                        path="/old-movies"
                        element={<WatchedMovies />}
                    />
                    <Route
                        exact
                        path="/old-movies/add"
                        element={<WatchedMovie />}
                    />
                    <Route
                        exact
                        path="/old-movies/edit/:code"
                        element={<WatchedMovie />}
                    />
                </Routes>
            </Router>
        </>
    );
};

export default App;
