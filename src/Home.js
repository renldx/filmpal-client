import React from "react";
import { Container } from "reactstrap";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Genres from "./Genres";

const Home = () => {
    return (
        <Container>
            <h2>Genre Suggestions</h2>
            <h3>Pick a genre:</h3>
            <Genres />
        </Container>
    );
};

export default Home;
