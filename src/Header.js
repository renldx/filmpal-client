import { faFilm } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Header = () => {
    return (
        <h1>
            <FontAwesomeIcon icon={faFilm} /> FilmPal
        </h1>
    );
};

export default Header;
