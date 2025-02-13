import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Button,
    Container,
    Form,
    FormGroup,
    Input,
    Label,
    Spinner,
} from "reactstrap";

const WatchedMovie = () => {
    const { code } = useParams();

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        release: "",
        errors: {},
    });

    let navigate = useNavigate();

    useEffect(() => {
        if (code) {
            setLoading(true);

            fetch(`/api/watched/movie?code=${code}`)
                .then((response) => response.json())
                .then((data) => {
                    setFormData({
                        title: data.title,
                        release: data.release,
                        errors: {},
                    });
                    setLoading(false);
                });
        }
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (validateForm()) {
            setFormData({
                ...formData,
            });

            if (code) {
                updateMovie();
            } else {
                createMovie();
            }
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.title) {
            errors.title = "Title is required";
        }

        if (!formData.release) {
            errors.release = "Release date is required";
        }

        setFormData((prevState) => ({ ...prevState, errors }));

        return Object.keys(errors).length === 0;
    };

    const createMovie = () => {
        (async () => {
            const rawResponse = await fetch("/api/watched/movie", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: formData.title,
                    release: formData.release,
                }),
            });

            navigate("/old-movies");
        })();
    };

    const updateMovie = () => {
        (async () => {
            const rawResponse = await fetch(`/api/watched/movie?code=${code}`, {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: formData.title,
                    release: formData.release,
                }),
            });

            navigate("/old-movies");
        })();
    };

    if (loading) {
        return <Spinner></Spinner>;
    }

    return (
        <Container className="watched-movie">
            <h2>{code ? "Edit" : "Add"} Movie</h2>
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label for="title">
                        Title
                        {formData.errors.title && (
                            <span className="error">
                                {formData.errors.title}
                            </span>
                        )}
                    </Label>
                    <Input
                        onChange={handleChange}
                        id="title"
                        name="title"
                        value={formData?.title}
                    />
                    <Label for="release">
                        Release
                        {formData.errors.release && (
                            <span className="error">
                                {formData.errors.release}
                            </span>
                        )}
                    </Label>
                    <Input
                        onChange={handleChange}
                        id="release"
                        name="release"
                        type="date"
                        value={formData?.release}
                    />
                </FormGroup>
                <Button color="primary" type="submit">
                    Confirm
                </Button>
                <Button color="secondary" onClick={() => navigate(-1)}>
                    Back
                </Button>
            </Form>
        </Container>
    );
};

export default WatchedMovie;
