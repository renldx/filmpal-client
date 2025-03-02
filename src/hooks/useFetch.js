import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import authService from "../services/authService";

export const useFetch = (method, url, body) => {
    const [isPending, setIsPending] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setIsPending(true);

            try {
                const request = await fetch(url, {
                    method: method,
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: authService.getAuthHeaderValue(),
                    },
                    body: method === "GET" ? null : JSON.stringify(body),
                });

                if (!request.ok) {
                    if (request.status === 401) {
                        navigate("/signin");
                    } else {
                        throw new Error(request.statusText);
                    }
                }

                const response = await request.json();

                setData(response);

                setError(null);
            } catch (error) {
                setError(error);
            } finally {
                setIsPending(false);
            }
        };

        fetchData();
    }, [method, url, body, navigate]);

    return { isPending, data };
};
