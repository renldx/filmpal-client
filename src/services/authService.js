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
        const request = await fetch("/api/auth/signin", {
            method: "POST",
            headers: {
                Accept: "application/json",
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
    }

    signout() {
        localStorage.removeItem("user");
    }
}

const authService = new AuthService();

export default authService;
