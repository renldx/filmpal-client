import { useEffect, useState } from "react";
import { Card, CardBody, CardSubtitle, CardTitle } from "reactstrap";

const SuggestedMovie = ({ movie, toggleModal }) => {
    const [movieData, setMovieData] = useState(null);
    const [retriedFetch, setRetriedFetch] = useState(false);

    useEffect(() => {
        fetchMovieDetails(movie.code);
    }, [movie.code]);

    const retryFetch = () => {
        setRetriedFetch(true);
        let codeWithoutYear = movie.code.slice(0, -4) + "????";
        fetchMovieDetails(codeWithoutYear);
    };

    const fetchMovieDetails = (code) => {
        fetch(`/api/details/movie?code=${code}`)
            .then((response) => response.json())
            .then((data) => {
                setMovieData(data);
            });
    };

    if (!movieData) {
        return <></>;
    } else if (
        !retriedFetch &&
        (movieData.response === "False" ||
            movie.title !== movieData.title ||
            movieData.poster === "N/A")
    ) {
        retryFetch();
    } else if (movieData.response === "True") {
        return (
            <div className="col-sm-12 col-md-6 col-lg-3 col-xl-2 d-flex">
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
                        <CardTitle tag="h4">{movieData.title}</CardTitle>
                        <CardSubtitle tag="h5" className="mb-2 text-muted">
                            {movieData.year}
                        </CardSubtitle>
                    </CardBody>
                </Card>
            </div>
        );
    }
};

export default SuggestedMovie;
