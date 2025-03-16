export const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user"));
};

export const getAuthHeaderValue = () => {
    const user = getCurrentUser();

    if (user && user.token) {
        return `Bearer ${user.token}`;
    } else {
        return "";
    }
};

export const signup = async (username, password) => {
    await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: username,
            password: password,
            roles: ["USER"],
        }),
    });
};

export const signin = async (username, password) => {
    const request = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: username,
            password: password,
        }),
    });

    const response = await request.json();

    if (response.token) {
        localStorage.setItem("user", JSON.stringify(response));
    }
};

export const signout = () => {
    localStorage.removeItem("user");
};
