import { render, screen } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import { describe, expect, vi } from "vitest";

import SuggestedMovie from "../SuggestedMovie";

const mockMovieValid = {
    title: "MockMovie",
    release: "2001",
    code: "MockMovie_2001",
};

const mockMovieInvalid = {
    title: "xyz",
    release: "0000",
    code: "xyz_0000",
};

const mockMovieValidDetails = {
    response: "True",
    title: "MockMovie",
    year: "2001",
    poster: "mockPoster.img",
};

const mockMovieInvalidDetails = {
    response: "False",
    title: null,
    year: null,
    poster: null,
};

const mockMovieRetryDetails = {
    response: "True",
    title: "xyz",
    year: "0000",
    poster: "mockPoster.img",
};

const server = setupServer(
    http.get("/api/details/movie", ({ request }) => {
        const url = new URL(request.url);
        const code = url.searchParams.get("code");

        if (code === mockMovieValid.code) {
            return HttpResponse.json(mockMovieValidDetails);
        } else if (code === mockMovieInvalid.code) {
            return HttpResponse.json(mockMovieInvalidDetails);
        } else if (code === "xyz_????") {
            return HttpResponse.json(mockMovieRetryDetails);
        }
    }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("SuggestedMovie", () => {
    test("component renders", async () => {
        render(<SuggestedMovie movie={mockMovieValid} toggleModal={vi.fn} />);

        await screen.findByText("MockMovie");

        expect(screen.getByAltText("🎥")).toBeInTheDocument();
        expect(screen.getByText("MockMovie")).toBeInTheDocument();
        expect(screen.getByText("2001")).toBeInTheDocument();
    });

    test("retry fetch called", async () => {
        const spy = vi.spyOn(global, "fetch");

        render(<SuggestedMovie movie={mockMovieInvalid} toggleModal={vi.fn} />);

        await screen.findByText("xyz");

        expect(spy).toHaveBeenCalledTimes(2);
    });
});
