import { render, screen, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import { describe, expect, vi } from "vitest";

import SuggestedMovie from "../SuggestedMovie";
import mocks from "./mocks";

const mockValidMovie = mocks.movies[0];

const server = setupServer(
    http.get("/api/details/movie", ({ request }) => {
        const url = new URL(request.url);
        const code = url.searchParams.get("code");

        if (code === mockValidMovie.code) {
            return HttpResponse.json(mocks.movieDetails);
        } else if (code === mocks.invalidMovie.code) {
            return HttpResponse.json(mocks.invalidMovieDetails);
        } else if (code === "xyz_????") {
            return HttpResponse.json(mocks.retriedMovieDetails);
        }
    }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("SuggestedMovie", () => {
    test("component renders", async () => {
        render(<SuggestedMovie movie={mockValidMovie} toggleModal={vi.fn} />);

        await screen.findByAltText("🎥");

        expect(
            screen.getByRole("heading", {
                level: 4,
                name: mockValidMovie.title,
            }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole("heading", {
                level: 5,
                name: mockValidMovie.release,
            }),
        ).toBeInTheDocument();
    });

    test("retry fetch called", async () => {
        const spy = vi.spyOn(global, "fetch");

        render(
            <SuggestedMovie movie={mocks.invalidMovie} toggleModal={vi.fn} />,
        );

        await waitFor(() => {
            expect(spy).toHaveBeenCalledTimes(2);
        });
    });
});
