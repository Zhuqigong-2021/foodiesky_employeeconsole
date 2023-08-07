import { screen, waitFor } from "@testing-library/react";

// import { Home } from "./Components";
import { expect, it } from "vitest";

import { Login } from "../../page";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../utils/renderWIthProvider";

beforeEach(() => {
  renderWithProviders(<Login />);
});

interface formProps {
  username?: string;
  password?: string;
}
const typeIntoForm = async ({ username, password }: formProps) => {
  const usernameInputElement = screen.getByRole("textbox") as HTMLInputElement;
  if (username) {
    await userEvent.type(usernameInputElement, username);
  }
  const passwordInputElement = screen.getByLabelText(
    /password/i
  ) as HTMLInputElement;
  if (password) {
    await userEvent.type(passwordInputElement, password);
  }
  return { usernameInputElement, passwordInputElement };
};

const clickOnSubmit = async () => {
  const submitBtnElement = screen.getByRole("button", { name: "Sign in" });
  await userEvent.click(submitBtnElement);
};

describe("default state", () => {
  it("initial render should be empty", () => {
    expect(screen.getByLabelText<HTMLInputElement>(/userName/i).value).toBe("");
    expect(screen.getByLabelText<HTMLInputElement>(/password/i).value).toBe("");
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  });
  it("should be able to type an email", async () => {
    const { usernameInputElement } = await typeIntoForm({
      username: "admin",
    });
    expect(usernameInputElement.value).toBe("admin");
  });
  it("should be able to type an password", async () => {
    const { passwordInputElement } = await typeIntoForm({
      password: "123456",
    });
    expect(passwordInputElement.value).toBe("123456");
  });
});

describe("error handling", () => {
  it("should show error user or password is empty", async () => {
    //validation error is not there

    expect(
      screen.queryByText(/User name or password is incorrect/i)
    ).not.toBeInTheDocument();

    //no input

    await clickOnSubmit();
    expect(screen.queryByText(/user name is empty/i)).toBeInTheDocument();

    //just type email without the password
    await typeIntoForm({ username: "admin" });
    await clickOnSubmit();
    expect(screen.queryByText(/password is empty/i)).toBeInTheDocument();
  });

  it("should show no error if user input is valid", async () => {
    //type legal username and password
    await typeIntoForm({ username: "admin", password: "123456" });

    await clickOnSubmit();

    //suppose error not to be in the doc
    // expect(
    //   screen.queryByText(/Username or password is incorrect/i)
    // ).not.toBeInTheDocument();
    expect(screen.queryByText(/user name is empty/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/password is empty/i)).not.toBeInTheDocument();
  });
});
