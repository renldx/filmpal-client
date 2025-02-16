import { useEffect, useState } from "react";
import { Card, CardBody, CardSubtitle, CardText, CardTitle } from "reactstrap";

const SuggestedMovie = ({ movie, releaseYear, toggleModal }) => {
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
            className="suggested-movie">
            <img
                className="poster"
                alt="Movie Poster"
                src={movieData?.poster}></img>
            <CardBody>
                <CardTitle tag="h4">{movie.title}</CardTitle>
                <CardSubtitle tag="h5" className="mb-2 text-muted">
                    {releaseYear(movie.release)}
                </CardSubtitle>
                <CardText></CardText>
            </CardBody>
        </Card>
    );
};

export default SuggestedMovie;
