import { render, screen } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import { describe, expect, vi } from "vitest";

import SuggestedMovie from "../SuggestedMovie";

const mockMovie = {
    title: "MockMovie",
    release: "2001",
    code: "MockMovie_2001",
};

const mockMovieDetails = {
    response: "True",
    title: "MockMovie",
    year: "2001",
    poster: "mockPoster.img",
};

const server = setupServer(
    http.get("/api/details/movie", ({ request }) => {
        const url = new URL(request.url);
        const code = url.searchParams.get("code");

        if (code === mockMovie.code) {
            return HttpResponse.json(mockMovieDetails);
        }
    }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("SuggestedMovie", () => {
    test("component renders", async () => {
        render(<SuggestedMovie movie={mockMovie} toggleModal={vi.fn} />);

        await screen.findByText("MockMovie");

        expect(screen.getByAltText("🎥")).toBeInTheDocument();
        expect(screen.getByText("MockMovie")).toBeInTheDocument();
        expect(screen.getByText("2001")).toBeInTheDocument();
    });
});
