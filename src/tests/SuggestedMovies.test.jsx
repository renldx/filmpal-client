import { render, screen } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, vi } from "vitest";

import SuggestedMovies from "../SuggestedMovies";
import mocks from "./mocks";

const mockGenre = mocks.genres[0];

vi.mock("../SuggestedMovie", () => ({
    default: vi.fn(),
}));

const server = setupServer(
    http.get(`/api/suggested/${mockGenre}`, () => {
        return HttpResponse.json(mocks.movies);
    }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("SuggestedMovies", () => {
    test("component renders", async () => {
        const spy = vi.spyOn(global, "fetch");

        render(
            <MemoryRouter initialEntries={[`/new-movies/${mockGenre}`]}>
                <Routes>
                    <Route>
                        <Route
                            exact
                            path="/new-movies/:genre"
                            element={<SuggestedMovies />}
                        />
                    </Route>
                </Routes>
            </MemoryRouter>,
        );

        await screen.findAllByRole("heading");

        expect(
            screen.getByRole("heading", {
                level: 2,
                name: /Movie Suggestions/i,
            }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole("heading", {
                level: 3,
                name: /Pick a movie:/i,
            }),
        ).toBeInTheDocument();

        expect(spy).toHaveBeenCalledWith(`/api/suggested/${mockGenre}`);
    });
});
