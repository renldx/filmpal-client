import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Button,
    Container,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Spinner,
    Table,
} from "reactstrap";

const WatchedMovies = () => {
    const [loading, setLoading] = useState(false);
    const [movies, setMovies] = useState([]);

    const [modal, setModal] = useState(false);
    const [movie, setMovie] = useState(undefined);

    const toggleModal = (event, movie) => {
        setMovie(movie);
        setModal(!modal);
    };

    const releaseYear = (date) => new Date(date).getFullYear();

    let navigate = useNavigate();

    useEffect(() => {
        setLoading(true);

        fetch("api/watched/movies")
            .then((response) => response.json())
            .then((data) => {
                setMovies(data);
                setLoading(false);
            });
    }, []);

    const updateMovie = (event, code) => {
        navigate(`edit/${code}`);
    };

    const deleteMovie = async () => {
        await fetch(`api/watched/movie?code=${movie.code}`, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        }).then(() => {
            let updatedMovies = [...movies].filter(
                (i) => i.code !== movie.code,
            );
            setMovies(updatedMovies);
            toggleModal();
        });
    };

    if (loading) {
        return <Spinner></Spinner>;
    }

    const movieList = movies.map((movie) => {
        return (
            <tr key={movie.code}>
                <td>{movie.title}</td>
                <td>{movie.release}</td>
                <td>
                    <Button
                        color="primary"
                        onClick={(event) => updateMovie(event, movie.code)}>
                        Edit
                    </Button>
                    <Button
                        color="danger"
                        onClick={(event) => toggleModal(event, movie)}>
                        Delete
                    </Button>
                </td>
            </tr>
        );
    });

    return (
        <Container className="watched-movies">
            <h2>Watch History</h2>
            <Table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Release</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>{movieList}</tbody>
            </Table>

            <Button color="success" onClick={() => navigate("add")}>
                Add
            </Button>

            <Modal isOpen={modal} toggle={toggleModal}>
                <ModalHeader toggle={toggleModal}>
                    Confirm Selected Movie
                </ModalHeader>
                <ModalBody>
                    Are you sure you want to delete {movie?.title} (
                    {releaseYear(movie?.release)})?
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={deleteMovie}>
                        Yes
                    </Button>{" "}
                    <Button color="danger" onClick={toggleModal}>
                        No
                    </Button>
                </ModalFooter>
            </Modal>
        </Container>
    );
};

export default WatchedMovies;
