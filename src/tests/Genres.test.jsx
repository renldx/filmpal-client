import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { expect } from "vitest";

import Genres from "../Genres";

const mockGenres = ["GENRE1", "GENRE2", "GENRE3"];

const server = setupServer(
    http.get("/api/genres", () => {
        return HttpResponse.json(mockGenres);
    }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("Genres", () => {
    test("component renders", async () => {
        render(<Genres />, { wrapper: BrowserRouter });

        await screen.findAllByRole("link");

        expect(screen.getAllByRole("link"), {
            name: new RegExp(mockGenres[0], "i"),
        }).toBeDefined();

        expect(screen.getAllByRole("link"), {
            name: new RegExp(mockGenres[1], "i"),
        }).toBeDefined();

        expect(screen.getAllByRole("link"), {
            name: new RegExp(mockGenres[2], "i"),
        }).toBeDefined();
    });

    test("links navigate", async () => {
        render(
            <BrowserRouter>
                <Genres />
                <Routes>
                    <Route exact path="/" element={<></>} />
                    <Route exact path="/new-movies/:genre" element={<></>} />
                </Routes>
            </BrowserRouter>,
        );

        const user = userEvent.setup();

        await screen.findAllByRole("link");

        expect(screen.getAllByRole("link"), {
            name: new RegExp(mockGenres[0], "i"),
        }).toBeDefined();

        await user.click(screen.getByText(new RegExp(mockGenres[0], "i")));

        expect(window.location.pathname).toBe(`/new-movies/${mockGenres[0]}`);
    });
});
