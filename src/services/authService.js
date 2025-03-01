class AuthService {
    getCurrentUser() {
        return JSON.parse(localStorage.getItem("user"));
    }

    async signup(username, password) {
        await fetch("/api/auth/signup", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                password: password,
                roles: ["USER"],
            }),
        });
    }

    async signin(username, password) {
        await fetch("/api/auth/signin", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.token) {
                    localStorage.setItem("user", JSON.stringify(data));
                }
            });
    }

    signout() {
        localStorage.removeItem("user");
    }
}

const authService = new AuthService();

export default authService;
