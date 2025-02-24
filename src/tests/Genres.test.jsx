import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { expect } from "vitest";

import Genres from "../Genres";
import mocks from "./mocks";

const server = setupServer(
    http.get("/api/genres", () => {
        return HttpResponse.json(mocks.genres);
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
            name: new RegExp(mocks.genres[0], "i"),
        }).toBeDefined();

        expect(screen.getAllByRole("link"), {
            name: new RegExp(mocks.genres[1], "i"),
        }).toBeDefined();

        expect(screen.getAllByRole("link"), {
            name: new RegExp(mocks.genres[2], "i"),
        }).toBeDefined();
    });

    test("links navigate", async () => {
        const mockGenre = mocks.genres[0];

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

        const link = screen.getByRole("link", {
            name: new RegExp(mockGenre, "i"),
        });

        expect(link).toBeInTheDocument();

        await user.click(link);

        expect(window.location.pathname).toBe(`/new-movies/${mockGenre}`);
    });
});
