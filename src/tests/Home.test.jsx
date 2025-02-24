import { render, screen } from "@testing-library/react";
import { describe, expect, vi } from "vitest";

import Home from "../Home";

vi.mock("../Genres", () => ({
    default: vi.fn(),
}));

describe("Home", () => {
    test("component renders", async () => {
        render(<Home />);

        await screen.findAllByRole("heading");

        expect(
            screen.getByRole("heading", {
                level: 2,
                name: /Genre Suggestions/i,
            }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole("heading", {
                level: 3,
                name: /Pick a genre:/i,
            }),
        ).toBeInTheDocument();
    });
});
