import { render, screen } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import { expect } from "vitest";

import TestComp from "../TestComp";

const server = setupServer(
    http.get("/api/genres", () => {
        return HttpResponse.json(["GENRE1", "GENRE2", "GENRE3"]);
    }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("TestComp", () => {
    test("test component renders button", async () => {
        render(<TestComp></TestComp>);

        await screen.findByRole("button");

        expect(screen.getByRole("button")).toBeInTheDocument();
        expect(screen.getByText("GENRE1")).toBeDefined();
    });
});
