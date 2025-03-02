import React from "react";
import { Link } from "react-router-dom";
import { Spinner } from "reactstrap";

import { useFetch } from "./helpers/fetchHelpers";

const Genres = () => {
    const { isPending: isLoading, data: genres } = useFetch(
        "GET",
        "/api/genres",
        true,
    );

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

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div>
            {genres?.map((genre) => (
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
