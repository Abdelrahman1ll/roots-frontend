import { useState } from "react";
import { SignupContext } from "../../context/SignupContext";

export function SignupProvider({ children }: { children: React.ReactNode }) {
  const [showSignup, setShowSignup] = useState(false);

  const openSignup = () => setShowSignup(true);
  const closeSignup = () => setShowSignup(false);

  return (
    <SignupContext.Provider value={{ showSignup, openSignup, closeSignup }}>
      {children}
    </SignupContext.Provider>
  );
}
