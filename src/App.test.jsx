import { render } from "@testing-library/react";
import { expect } from "vitest";

import App from "./App";

describe("App", () => {
    it("main page renders", () => {
        render(<App />);
        expect(true).toBeTruthy();
    });
});
