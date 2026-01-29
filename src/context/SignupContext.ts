import { createContext } from "react";

export type SignupContextType = {
  showSignup: boolean;
  openSignup: () => void;
  closeSignup: () => void;
};

export const SignupContext = createContext<SignupContextType>({
  showSignup: false,
  openSignup: () => {},
  closeSignup: () => {},
});
