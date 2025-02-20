import { render, screen } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import { MemoryRouter } from "react-router-dom";
import { expect } from "vitest";

import Genres from "../Genres";

const server = setupServer(
    http.get("/api/genres", () => {
        return HttpResponse.json(["GENRE1", "GENRE2", "GENRE3"]);
    }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("Genres", () => {
    test("component renders buttons", async () => {
        render(
            <MemoryRouter>
                <Genres></Genres>
            </MemoryRouter>,
        );

        await screen.findAllByRole("button");

        expect(screen.getAllByRole("button"), {
            name: /GENRE1/i,
        }).toBeDefined();

        expect(screen.getAllByRole("button"), {
            name: /GENRE2/i,
        }).toBeDefined();

        expect(screen.getAllByRole("button"), {
            name: /GENRE3/i,
        }).toBeDefined();
    });
});
