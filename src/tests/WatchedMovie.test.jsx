import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router-dom";
import { expect } from "vitest";

import WatchedMovie from "../WatchedMovie";

const mockMovie = {
    title: "MockMovie",
    release: "2001",
    code: "MockMovie_2001",
};

const server = setupServer(
    http.get("/api/watched/movie", ({ request }) => {
        const url = new URL(request.url);
        const code = url.searchParams.get("code");

        if (code === mockMovie.code) {
            return HttpResponse.json(mockMovie);
        }
    }),
    http.post("/api/watched/movie", () => {
        return HttpResponse.json(mockMovie);
    }),
    http.put("/api/watched/movie", () => {
        return HttpResponse.json(mockMovie);
    }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("WatchedMovie", () => {
    test("component renders without existing movie", async () => {
        render(<WatchedMovie />, { wrapper: BrowserRouter });

        await screen.findByRole("heading");

        expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Confirm" }));
        expect(screen.getByRole("button", { name: "Back" }));
    });

    test("component renders with existing movie", async () => {
        render(
            <MemoryRouter
                initialEntries={[`/old-movies/edit/${mockMovie.code}`]}>
                <Routes>
                    <Route
                        exact
                        path="/old-movies/edit/:code"
                        element={<WatchedMovie />}
                    />
                </Routes>
            </MemoryRouter>,
        );

        await screen.findByRole("form");

        expect(screen.getByLabelText("Title")).toBeInTheDocument();
        expect(screen.getByDisplayValue("MockMovie")).toBeInTheDocument();

        expect(screen.getByLabelText("Release")).toBeInTheDocument();
        expect(screen.getByDisplayValue("2001")).toBeInTheDocument();
    });

    test("back button redirects", async () => {
        render(
            <MemoryRouter
                initialEntries={["/old-movies", "/old-movies/add"]}
                initialIndex={1}>
                <Routes>
                    <Route
                        exact
                        path="/old-movies"
                        element={<>Watched Movies</>}
                    />
                    <Route
                        exact
                        path="/old-movies/add"
                        element={<WatchedMovie />}
                    />
                </Routes>
            </MemoryRouter>,
        );

        const user = userEvent.setup();

        await screen.findByRole("button", { name: "Back" });

        await user.click(screen.getByRole("button", { name: "Back" }));

        expect(screen.getByText("Watched Movies")).toBeInTheDocument();
    });

    //test("creates movie", async () => {});

    //test("updates movie", async () => {});
});
