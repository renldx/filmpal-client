import { Card, CardBody, CardSubtitle, CardText, CardTitle } from "reactstrap";

const SuggestedMovie = ({ movie, releaseYear, toggleModal }) => {
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
};

export default SuggestedMovie;
