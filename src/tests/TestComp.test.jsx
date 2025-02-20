import { render, screen } from "@testing-library/react";
import { expect } from "vitest";

import TestComp from "../TestComp";

describe("TestComp", () => {
    test("test component renders button", () => {
        render(<TestComp></TestComp>);
        expect(screen.getByRole("button")).toBeInTheDocument();
    });
});
