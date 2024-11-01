// tests/pages/Auth/RegistrationPage.test.tsx
import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import RegistrationPage from "../../../src/Pages/Auth/RegistrationPage";
import { GoogleOAuthProvider } from "@react-oauth/google";

describe("RegistrationPage Component", () => {
  // Set the environment variable directly in the test file
  beforeAll(() => {
    process.env.REACT_APP_GOOGLE_CLIENT_ID = "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";
  });

  const renderWithProviders = () => {
    return render(
      <MemoryRouter>
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
          <RegistrationPage />
        </GoogleOAuthProvider>
      </MemoryRouter>
    );
  };

  test("google authentication functioning", () => {
    const { asFragment } = renderWithProviders();
    expect(asFragment()).toMatchSnapshot();
  });
});
