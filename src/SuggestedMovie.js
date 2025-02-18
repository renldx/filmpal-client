import { useEffect, useState } from "react";
import { Card, CardBody, CardSubtitle, CardTitle } from "reactstrap";

const SuggestedMovie = ({ movie, toggleModal }) => {
    const [movieData, setMovieData] = useState(null);

    useEffect(() => {
        fetch(`/api/details/movie?code=${movie.code}`)
            .then((response) => response.json())
            .then((data) => {
                setMovieData(data);
            });
    }, [movie.code]);

    return (
        <Card
            onClick={(event) => {
                toggleModal(event, movie);
            }}
            className="suggested-movie flex-fill">
            <img
                className="poster"
                alt="🎥"
                src={
                    movieData?.poster === "N/A" ? "" : movieData?.poster
                }></img>
            <CardBody>
                <CardTitle tag="h4">{movie.title}</CardTitle>
                <CardSubtitle tag="h5" className="mb-2 text-muted">
                    {movie.release}
                </CardSubtitle>
            </CardBody>
        </Card>
    );
};

export default SuggestedMovie;
