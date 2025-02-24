import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, vi } from "vitest";

import WatchedMovies from "../WatchedMovies";

const mockWatchedMovies = [
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

const mockUseNavigate = vi.fn();

const server = setupServer(
    http.get("/api/watched/movies", () => {
        return HttpResponse.json(mockWatchedMovies);
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

        await screen.findAllByRole("heading");

        expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();

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
            screen.getByRole("cell", { name: mockWatchedMovies[0].title }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole("cell", { name: mockWatchedMovies[0].release }),
        ).toBeInTheDocument();

        expect(screen.getAllByRole("button", { name: "Edit" })).toBeDefined();
        expect(screen.getAllByRole("button", { name: "Delete" })).toBeDefined();
        expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
    });

    test("add button navigates", async () => {
        render(<WatchedMovies />, { wrapper: BrowserRouter });

        const user = userEvent.setup();

        await screen.findByRole("button", { name: "Add" });

        await user.click(screen.getByRole("button", { name: "Add" }));

        expect(mockUseNavigate).toHaveBeenCalledWith("add");
    });

    test("update button navigates", async () => {
        render(<WatchedMovies />, { wrapper: BrowserRouter });

        const user = userEvent.setup();

        const firstRow = await screen.findByRole("row", {
            name: /MockMovie1/i,
        });

        const firstEditButton = await within(firstRow).findByRole("button", {
            name: "Edit",
        });

        await user.click(firstEditButton);

        expect(mockUseNavigate).toHaveBeenCalledWith(
            `edit/${mockWatchedMovies[0].code}`,
        );
    });

    test("delete button toggles modal", async () => {
        render(<WatchedMovies />, { wrapper: BrowserRouter });

        const user = userEvent.setup();

        const firstRow = await screen.findByRole("row", {
            name: new RegExp(mockWatchedMovies[0].title, "i"),
        });

        const firstDeleteButton = await within(firstRow).findByRole("button", {
            name: "Delete",
        });

        await user.click(firstDeleteButton);

        await screen.findByText("Confirm Selected Movie");

        expect(screen.getByText("Confirm Selected Movie")).toBeInTheDocument();

        expect(
            screen.getByText(/Are you sure you want to delete/i),
        ).toBeInTheDocument();

        expect(screen.getAllByRole("button", { name: "Yes" })).toBeDefined();
        expect(screen.getAllByRole("button", { name: "No" })).toBeDefined();
    });
});
