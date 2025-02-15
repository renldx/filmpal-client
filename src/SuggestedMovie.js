import { useEffect, useState } from "react";
import { Card, CardBody, CardSubtitle, CardText, CardTitle } from "reactstrap";

const SuggestedMovie = ({ movie, releaseYear, toggleModal }) => {
    const [movieData, setMovieData] = useState(null);

    useEffect(() => {
        let ignore = false;

        setMovieData(null);

        try {
            fetch(`/api/details/movie?imdbId=${movie.imdbId}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(
                            `Failed to fetch movie details for ${movie.title} (${movie.imdbId})`,
                        );
                    } else {
                        response.json();
                    }
                })
                .then((data) => {
                    if (!ignore) {
                        setMovieData(data);
                    }
                });
        } catch (error) {
            return <></>;
        }
        return () => {
            ignore = true;
        };
    }, [movie.imdbId, movie.title]);

    if (movieData) {
        return (
            <Card
                onClick={(event) => {
                    toggleModal(event, movie);
                }}
                className="suggested-movie">
                <img alt="Sample" src="https://picsum.photos/300/200" />
                <CardBody>
                    <CardTitle tag="h4">{movie.title}</CardTitle>
                    <CardSubtitle tag="h5" className="mb-2 text-muted">
                        {releaseYear(movie.release)}
                    </CardSubtitle>
                    <CardText></CardText>
                </CardBody>
            </Card>
        );
    }
};

export default SuggestedMovie;
