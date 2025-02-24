import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router-dom";
import { expect, test, vi } from "vitest";

import WatchedMovie from "../WatchedMovie";
import mocks from "./mocks";

const mockMovie = mocks.movies[0];

const mockUseNavigate = vi.fn();

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
    http.put("/api/watched/movie", ({ request }) => {
        const url = new URL(request.url);
        const code = url.searchParams.get("code");

        if (code === mockMovie.code) {
            return HttpResponse.json(mockMovie);
        }
    }),
);

beforeAll(() => {
    vi.mock(import("react-router-dom"), async (importOriginal) => {
        const actual = await importOriginal();
        return {
            ...actual,
            useNavigate: () => mockUseNavigate,
        };
    });

    server.listen();
});

afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("WatchedMovie", () => {
    test("component renders without existing movie", async () => {
        render(<WatchedMovie />, { wrapper: BrowserRouter });

        expect(
            await screen.findByRole("heading", { level: 2 }),
        ).toBeInTheDocument();

        expect(screen.getByLabelText("Title")).toHaveValue("");
        expect(screen.getByLabelText("Release")).toHaveValue(null);

        expect(screen.getByRole("button", { name: "Confirm" }));
        expect(screen.getByRole("button", { name: "Back" }));
    });

    test("component renders with existing movie", async () => {
        const mockMovie = mocks.movies[0];

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

        expect(
            await screen.findByRole("heading", { level: 2 }),
        ).toBeInTheDocument();

        expect(screen.getByLabelText("Title")).toHaveValue(mockMovie.title);
        expect(screen.getByLabelText("Release")).toHaveValue(mockMovie.release);

        expect(screen.getByRole("button", { name: "Confirm" }));
        expect(screen.getByRole("button", { name: "Back" }));
    });

    test("back button navigates", async () => {
        render(<WatchedMovie />, { wrapper: BrowserRouter });

        const user = userEvent.setup();

        const button = await screen.findByRole("button", { name: "Back" });

        await user.click(button);

        expect(mockUseNavigate).toHaveBeenCalledWith(-1);
    });

    test("form validates", async () => {
        render(<WatchedMovie />, { wrapper: BrowserRouter });

        const user = userEvent.setup();

        await screen.findByRole("heading");

        await user.type(
            screen.getByLabelText("Title"),
            mocks.invalidMovie.title,
        );

        await user.type(
            screen.getByLabelText("Release"),
            mocks.invalidMovie.release.toString(),
        );

        await user.click(screen.getByRole("button", { name: "Confirm" }));

        expect(screen.getByLabelText("Release")).toBeInvalid();
    });

    test("form creates movie", async () => {
        render(<WatchedMovie />, { wrapper: BrowserRouter });

        const user = userEvent.setup();

        await screen.findByRole("form");

        await user.type(screen.getByLabelText("Title"), mockMovie.title);

        await user.type(
            screen.getByLabelText("Release"),
            mockMovie.release.toString(),
        );

        await user.click(screen.getByRole("button", { name: "Confirm" }));

        expect(mockUseNavigate).toHaveBeenCalledWith("/old-movies");
    });

    test("form updates movie", async () => {
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

        const user = userEvent.setup();

        await screen.findByRole("form");

        await user.type(screen.getByLabelText("Title"), mockMovie.title);

        await user.type(
            screen.getByLabelText("Release"),
            mockMovie.release.toString(),
        );

        await user.click(screen.getByRole("button", { name: "Confirm" }));

        expect(mockUseNavigate).toHaveBeenCalledWith("/old-movies");
    });
});
