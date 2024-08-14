import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Chip from "./Chip";
import { MemoryRouter } from "react-router-dom";

describe("Chip Component Additional Tests", () => {
  test("renders with custom label", () => {
    render(
      <MemoryRouter>
        <Chip label="Custom Label" />
      </MemoryRouter>
    );
    expect(screen.getByText("Custom Label")).toBeInTheDocument();
  });

  test("renders children instead of label when both are provided", () => {
    render(
      <MemoryRouter>
        <Chip label="Label">
          <span>Child Content</span>
        </Chip>
      </MemoryRouter>
    );
    expect(screen.getByText("Child Content")).toBeInTheDocument();
    expect(screen.queryByText("Label")).not.toBeInTheDocument();
  });

  test("applies active styles when isActive is true", () => {
    render(
      <MemoryRouter>
        <Chip isActive>Active Chip</Chip>
      </MemoryRouter>
    );
    const chip = screen.getByText("Active Chip");
    expect(chip).toHaveStyle("background-color: var(--textMaroonColor-500)");
    expect(chip).toHaveStyle("color: white");
  });

  test("applies inactive styles when isActive is false", () => {
    render(
      <MemoryRouter>
        <Chip isActive={false}>Inactive Chip</Chip>
      </MemoryRouter>
    );
    const chip = screen.getByText("Inactive Chip");
    expect(chip).toHaveStyle("background-color: var(--primary-100)");
    expect(chip).toHaveStyle("color: black");
  });

  test("passes additional props to Box component", () => {
    render(
      <MemoryRouter>
        <Chip data-testid="custom-chip">Test Chip</Chip>
      </MemoryRouter>
    );
    expect(screen.getByTestId("custom-chip")).toBeInTheDocument();
  });

  test("applies correct padding and margin", () => {
    render(
      <MemoryRouter>
        <Chip>Padding Test</Chip>
      </MemoryRouter>
    );
    const chip = screen.getByText("Padding Test");
    expect(chip).toHaveStyle("padding-top: 1px");
    expect(chip).toHaveStyle("padding-bottom: 1px");
    expect(chip).toHaveStyle("padding-left: 2px");
    expect(chip).toHaveStyle("padding-right: 2px");
    expect(chip).toHaveStyle("margin: 1px");
  });

  test("renders with rounded corners", () => {
    render(
      <MemoryRouter>
        <Chip>Rounded Chip</Chip>
      </MemoryRouter>
    );
    const chip = screen.getByText("Rounded Chip");
    expect(chip).toHaveStyle("border-radius: 9999px");
  });
});
