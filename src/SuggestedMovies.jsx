import React, { useState } from "react";
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
import { fetchRequest, useFetch } from "./helpers/fetchHelpers";

const SuggestedMovies = () => {
    const { genre } = useParams();

    const [modal, setModal] = useState(false);
    const [movie, setMovie] = useState(null);

    const toggleModal = (event, movie) => {
        setMovie(movie);
        setModal(!modal);
    };

    const navigate = useNavigate();

    const { isPending: isLoading, data: movies } = useFetch(
        "GET",
        `/api/suggested/${genre}`,
        true,
    );

    const selectMovie = async () => {
        await fetchRequest("POST", "/api/watched/movie", true, {
            title: movie.title,
            release: movie.release,
        });

        toggleModal();
        navigate("/");
    };

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <Container>
            <h2>Movie Suggestions</h2>
            <h3>Pick a movie:</h3>
            <div className="row gy-3">
                {movies?.map((m) => (
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
