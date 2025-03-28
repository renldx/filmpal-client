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

import { fetchRequest } from "./helpers/fetchHelpers";

const WatchedMovie = () => {
    const { code } = useParams();

    const [isLoading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        release: "",
        errors: {},
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (code) {
            setLoading(true);

            fetchRequest("GET", `/api/watched/movie?code=${code}`, true)
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
    }, [code]);

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
            errors.release = "Release year is required";
        }

        setFormData((prevState) => ({ ...prevState, errors }));

        return Object.keys(errors).length === 0;
    };

    const createMovie = async () => {
        await fetchRequest("POST", "/api/watched/movie", true, {
            title: formData.title,
            release: formData.release,
        });

        navigate("/old-movies");
    };

    const updateMovie = async () => {
        await fetchRequest("PUT", `/api/watched/movie?code=${code}`, true, {
            title: formData.title,
            release: formData.release,
        });

        navigate("/old-movies");
    };

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <Container className="watched-movie">
            <h2>{code ? "Edit" : "Add"} Movie</h2>
            <Form aria-label="form" onSubmit={handleSubmit}>
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
                        type="number"
                        min="1890"
                        max="2100"
                        step="1"
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
