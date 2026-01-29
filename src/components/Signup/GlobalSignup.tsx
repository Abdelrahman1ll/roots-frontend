import { useContext } from "react";
import { SignupContext } from "../../context/SignupContext";
import Signup from "./signup";

/**
 * GlobalSignup: Entry point for the application-wide signup modal.
 * التسجيل العام: نقطة الدخول لنافذة التسجيل (Modal) على مستوى التطبيق.
 */
export default function GlobalSignup() {
  const { showSignup, closeSignup } = useContext(SignupContext);

  if (!showSignup) return null;

  return <Signup onClose={closeSignup} />;
}
