import { render, screen } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, vi } from "vitest";

import SuggestedMovies from "../SuggestedMovies";

const mockGenre = "GENRE1";

const mockSuggestedMovies = [
    {
        title: "MockMovie1",
        release: "2001",
        code: "MockMovie1_2001",
    },
    {
        title: "MockMovie2",
        release: "2002",
        code: "MockMovie2_2002",
    },
    {
        title: "MockMovie3",
        release: "2003",
        code: "MockMovie3_2003",
    },
];

vi.mock("../SuggestedMovie", () => ({
    default: vi.fn(),
}));

const server = setupServer(
    http.get(`/api/suggested/${mockGenre}`, () => {
        return HttpResponse.json(mockSuggestedMovies);
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
                            path="/new-movies/:genre"
                            element={<SuggestedMovies />}
                        />
                    </Route>
                </Routes>
            </MemoryRouter>,
        );

        await screen.findAllByRole("heading");

        expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
        expect(screen.getByRole("heading", { level: 3 })).toBeInTheDocument();

        expect(spy).toHaveBeenCalledWith(`/api/suggested/${mockGenre}`);
    });
});
