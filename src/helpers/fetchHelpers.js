import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import authService from "../services/authService";

export const fetchRequest = (method, url, secure, body) =>
    fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json",
            Authorization: secure ? authService.getAuthHeaderValue() : null,
        },
        body: method === "GET" ? null : JSON.stringify(body),
    });

export const useFetch = (method, url, secure, body, callback) => {
    const [isPending, setIsPending] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setIsPending(true);

            try {
                const request = await fetchRequest(method, url, secure, body);

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

                if (callback) {
                    callback();
                }
            } catch (error) {
                setError(error);
            } finally {
                setIsPending(false);
            }
        };

        fetchData();
    }, [method, url, secure, body, navigate, callback]);

    return { isPending, data };
};
