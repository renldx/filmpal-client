import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Spinner } from "reactstrap";

import authService from "./services/authService";

const Genres = () => {
    const [loading, setLoading] = useState(false);
    const [genres, setGenres] = useState([]);

    useEffect(() => {
        setLoading(true);

        fetch("/api/genres", {
            method: "GET",
            headers: { Authorization: authService.getAuthHeaderValue() },
        })
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
        return <Spinner />;
    }

    return (
        <div>
            {genres.map((genre) => (
                <Link
                    key={genre}
                    value={genre}
                    to={`/new-movies/${genre}`}
                    size="lg"
                    className="btn btn-secondary genre">
                    <span className="icon">{getIcon(genre)}</span>{" "}
                    {genre.toLowerCase()}
                </Link>
            ))}
        </div>
    );
};

export default Genres;
