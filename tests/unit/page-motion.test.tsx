import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PageMotion } from "@/components/shared/page-motion";

describe("PageMotion", () => {
  it("renders hydration-stable markup without client-derived inline styles", () => {
    render(<PageMotion className="test-page">Content</PageMotion>);

    const page = screen.getByText("Content");
    expect(page).toHaveClass("page-enter", "test-page");
    expect(page).not.toHaveAttribute("style");
  });
});
