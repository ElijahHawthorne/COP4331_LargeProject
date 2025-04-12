/// <reference types="@testing-library/jest-dom" />
import { render, screen } from "@testing-library/react";
import ViewIncome from "./ViewIncome";

describe("ViewIncome Component", () => {
  it("displays the correct income amount", () => {
    const income = 420.69;

    render(<ViewIncome income={income} />);

    //Check income appears
    expect(screen.getByText(`$${income.toFixed(2)}`)).toBeInTheDocument();
  });
});
