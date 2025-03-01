import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Form, FormGroup, Input, Label } from "reactstrap";

import authService from "./services/authService";

const Signin = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        errors: {},
    });

    const navigate = useNavigate();

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

            authService.signin(formData.username, formData.password);
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.username) {
            errors.username = "Username is required";
        }

        if (!formData.password) {
            errors.password = "Password is required";
        }

        setFormData((prevState) => ({ ...prevState, errors }));

        return Object.keys(errors).length === 0;
    };

    return (
        <Container className="signin">
            <h2>Signin</h2>
            <Form aria-label="form" onSubmit={handleSubmit}>
                <FormGroup>
                    <Label>
                        Username
                        {formData.errors.username && (
                            <span className="error">
                                {formData.errors.username}
                            </span>
                        )}
                    </Label>
                    <Input
                        onChange={handleChange}
                        id="username"
                        name="username"
                        value={formData?.username}
                    />
                    <Label>
                        Password
                        {formData.errors.password && (
                            <span className="error">
                                {formData.errors.password}
                            </span>
                        )}
                    </Label>
                    <Input
                        onChange={handleChange}
                        id="password"
                        name="password"
                        value={formData?.password}
                    />
                </FormGroup>
                <Button color="primary" type="submit">
                    Signin
                </Button>
                <Button color="secondary" onClick={() => navigate(-1)}>
                    Back
                </Button>
            </Form>
        </Container>
    );
};

export default Signin;
