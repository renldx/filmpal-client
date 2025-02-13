import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Spinner } from "reactstrap";

const Genres = () => {
    const [loading, setLoading] = useState(false);
    const [genres, setGenres] = useState([]);

    const navigate = useNavigate();
    const pickGenre = (event) => {
        navigate(`/new-movies/${event.target.value}`);
    };

    useEffect(() => {
        setLoading(true);

        fetch("api/genres")
            .then((response) => response.json())
            .then((data) => {
                setGenres(data);
                setLoading(false);
            });
    }, []);

    const getIcon = (genre) => {
        switch (genre) {
            case "ACTION":
                return "⚔️";
            case "COMEDY":
                return "🤡";
            case "DRAMA":
                return "🎭";
            case "HORROR":
                return "👻";
            case "ROMANCE":
                return "❤️";
            default:
                return "⁉️";
        }
    };

    if (loading) {
        return <Spinner></Spinner>;
    }

    return (
        <div>
            {genres.map((genre) => (
                <Button
                    key={genre}
                    value={genre}
                    onClick={(event) => pickGenre(event)}
                    size="lg"
                    className="genre">
                    <span className="icon">{getIcon(genre)}</span>{" "}
                    {genre.toLowerCase()}
                </Button>
            ))}
        </div>
    );
};

export default Genres;
