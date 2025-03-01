import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Button,
    Container,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Spinner,
} from "reactstrap";

import "bootstrap/dist/css/bootstrap.min.css";

import SuggestedMovie from "./SuggestedMovie";
import authHeader from "./services/authHeader";

const SuggestedMovies = () => {
    const { genre } = useParams();

    const [loading, setLoading] = useState(false);
    const [movies, setMovies] = useState([]);

    const [modal, setModal] = useState(false);
    const [movie, setMovie] = useState(null);

    const toggleModal = (event, movie) => {
        setMovie(movie);
        setModal(!modal);
    };

    const navigate = useNavigate();

    const selectMovie = () => {
        (async () => {
            await fetch("/api/watched/movie", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: movie.title,
                    release: movie.release,
                }),
            });
        })();

        toggleModal();
        navigate("/");
    };

    useEffect(() => {
        setLoading(true);

        fetch(`/api/suggested/${genre}`, {
            method: "GET",
            headers: authHeader(),
        })
            .then((response) => response.json())
            .then((data) => {
                setMovies(data);
                setLoading(false);
            });
    }, [genre]);

    if (loading) {
        return <Spinner />;
    }

    return (
        <Container fluid>
            <h2>Movie Suggestions</h2>
            <h3>Pick a movie:</h3>
            <div className="row gy-3">
                {movies.map((m) => (
                    <SuggestedMovie
                        key={m.code}
                        movie={m}
                        toggleModal={toggleModal}
                    />
                ))}
            </div>

            <Modal isOpen={modal} toggle={toggleModal}>
                <ModalHeader toggle={toggleModal}>
                    Confirm Selected Movie
                </ModalHeader>
                <ModalBody>
                    Are you sure you want to watch {movie?.title} (
                    {movie?.release})?
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={selectMovie}>
                        Yes
                    </Button>{" "}
                    <Button color="secondary" onClick={toggleModal}>
                        No
                    </Button>
                </ModalFooter>
            </Modal>
        </Container>
    );
};

export default SuggestedMovies;
