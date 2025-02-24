import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router-dom";
import { expect, test, vi } from "vitest";

import WatchedMovie from "../WatchedMovie";

const mockMovie = {
    title: "MockMovie",
    release: "2001",
    code: "MockMovie_2001",
};

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

        expect(screen.getByLabelText("Title")).toHaveValue("");
        expect(screen.getByLabelText("Release")).toHaveValue(null);

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

        await screen.findByRole("heading");

        expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();

        expect(screen.getByLabelText("Title")).toHaveValue("MockMovie");
        expect(screen.getByLabelText("Release")).toHaveValue(2001);

        expect(screen.getByRole("button", { name: "Confirm" }));
        expect(screen.getByRole("button", { name: "Back" }));
    });

    test("back button redirects", async () => {
        vi.mock(import("react-router-dom"), async (importOriginal) => {
            const actual = await importOriginal();
            return {
                ...actual,
                useNavigate: () => mockUseNavigate,
            };
        });

        render(<WatchedMovie />, { wrapper: BrowserRouter });

        const user = userEvent.setup();

        await screen.findByRole("button", { name: "Back" });

        await user.click(screen.getByRole("button", { name: "Back" }));

        expect(mockUseNavigate).toHaveBeenCalledWith(-1);
    });

    //test("form validates", async () => {});

    //test("creates movie", async () => {});

    //test("updates movie", async () => {});
});
