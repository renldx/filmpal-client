import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, vi } from "vitest";

import WatchedMovies from "../WatchedMovies";
import mocks from "./mocks";

const mockWatchedMovie = mocks.movies[0];

const mockUseNavigate = vi.fn();

const server = setupServer(
    http.get("/api/watched/movies", () => {
        return HttpResponse.json(mocks.movies);
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

describe("WatchedMovies", () => {
    test("component renders", async () => {
        render(<WatchedMovies />, { wrapper: BrowserRouter });

        expect(
            await screen.findByRole("heading", {
                level: 2,
                name: "Watch History",
            }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole("rowheader", { name: "Title" }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole("rowheader", { name: "Release" }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole("rowheader", { name: "Actions" }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole("cell", { name: mockWatchedMovie.title }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole("cell", { name: mockWatchedMovie.release }),
        ).toBeInTheDocument();

        expect(screen.getAllByRole("button", { name: "Edit" })).toBeDefined();
        expect(screen.getAllByRole("button", { name: "Delete" })).toBeDefined();

        expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
    });

    test("add button navigates", async () => {
        render(<WatchedMovies />, { wrapper: BrowserRouter });

        const user = userEvent.setup();

        const addButton = await screen.findByRole("button", { name: "Add" });

        expect(addButton).toBeInTheDocument();

        await user.click(addButton);

        expect(mockUseNavigate).toHaveBeenCalledWith("add");
    });

    test("update button navigates", async () => {
        render(<WatchedMovies />, { wrapper: BrowserRouter });

        const user = userEvent.setup();

        const firstRow = await screen.findByRole("row", {
            name: new RegExp(mockWatchedMovie.title, "i"),
        });

        const firstEditButton = await within(firstRow).findByRole("button", {
            name: "Edit",
        });

        await user.click(firstEditButton);

        expect(mockUseNavigate).toHaveBeenCalledWith(
            `edit/${mockWatchedMovie.code}`,
        );
    });

    test("delete button toggles modal", async () => {
        render(<WatchedMovies />, { wrapper: BrowserRouter });

        const user = userEvent.setup();

        const firstRow = await screen.findByRole("row", {
            name: new RegExp(mockWatchedMovie.title, "i"),
        });

        const firstDeleteButton = await within(firstRow).findByRole("button", {
            name: "Delete",
        });

        await user.click(firstDeleteButton);

        expect(screen.findByText(/Confirm Selected Movie/i)).toBeDefined();

        expect(
            screen.getByText(/Are you sure you want to delete/i),
        ).toBeInTheDocument();

        expect(screen.getByRole("button", { name: "Yes" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "No" })).toBeInTheDocument();
    });
});
