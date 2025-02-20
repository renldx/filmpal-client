import { render, screen } from "@testing-library/react";
import { expect } from "vitest";

import TestComp from "../TestComp";

describe("TestComp", () => {
    test("test component renders button", async () => {
        render(<TestComp url="http://localhost:8080/api/genres"></TestComp>);

        await screen.findByRole("button");

        expect(screen.getByRole("button")).toBeInTheDocument();
        expect(screen.getByText("ACTION")).toBeDefined();
    });
});
