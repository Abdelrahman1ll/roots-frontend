import { useContext, useState } from "react";
import {
  useUsersCheckEmailMutation,
  usePostUsersMutation,
} from "../../redux/users/apiUsers";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";

/**
 * useSignup: Logic for email verification, OTP handling, and new user creation.
 * خطاف التسجيل: منطق التحقق من البريد، معالجة رمز التحقق، وإنشاء مستخدم جديد.
 */
export default function useSignup(onClose: () => void) {
  const { setUser } = useContext(AuthContext);
  const [email, setEmail] = useState<string>("");
  const [showCodeInput, setShowCodeInput] = useState<boolean>(false);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [checkEmail, { isLoading }] = useUsersCheckEmailMutation();
  const [postUser, { isLoading: isLoadingUser }] = usePostUsersMutation();
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await checkEmail({ email }).unwrap();
      if (response) {
        await localStorage.setItem("email", email);
        setEmail("");
        setShowCodeInput(true);
      }
    } catch {
      toast.error("Error checking email");
      setShowCodeInput(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const value = e.target.value;

    // Handle normal typing (single digit)
    if (value.length <= 1) {
      if (/^\d?$/.test(value)) {
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // Auto-focus next input
        if (value && index < 5) {
          const nextInput = document.getElementById(
            `code-${index + 1}`,
          ) as HTMLInputElement;
          nextInput?.focus();
        }
      }
      return;
    }

    // Handle paste/autofill (multiple digits) via onChange
    // This catches mobile cases where onPaste might not trigger but value changes
    const numbers = value.replace(/\D/g, "").split("");
    if (numbers.length > 0) {
      setCode((prev) => {
        const newCode = [...prev];
        // Distribute numbers starting from current index
        for (let i = 0; i < numbers.length; i++) {
          if (index + i < 6) {
            newCode[index + i] = numbers[i];
          }
        }
        return newCode;
      });

      // Focus the last filled input
      const nextIndex = Math.min(index + numbers.length, 5);
      const nextInput = document.getElementById(
        `code-${nextIndex}`,
      ) as HTMLInputElement;
      if (nextIndex < 5 && numbers.length > 0) {
        // Focus next empty or the last one if full
        nextInput?.focus();
      } else {
        nextInput?.focus();
      }

      // Specifically for the case where we fill up to the end
      if (index + numbers.length >= 6) {
        const lastInput = document.getElementById("code-5") as HTMLInputElement;
        lastInput?.focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace") {
      // If current field is empty and we hit backspace, move to prev
      if (!code[index] && index > 0) {
        e.preventDefault();
        const prevInput = document.getElementById(
          `code-${index - 1}`,
        ) as HTMLInputElement;
        prevInput?.focus();
        // Optional: delete prev value too on backspace
        /* 
          const newCode = [...code];
          newCode[index - 1] = "";
          setCode(newCode);
          */
      } else if (code[index]) {
        // Standard backspace behavior handles deleting the char normally
        // But we update state via onChange
        const newCode = [...code];
        newCode[index] = "";
        setCode(newCode);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, 6);
    const numbers = pasteData.replace(/\D/g, "").split("");

    if (numbers.length > 0) {
      setCode((prev) => {
        const newCode = [...prev];
        for (let i = 0; i < numbers.length; i++) {
          if (i < 6) newCode[i] = numbers[i];
        }
        return newCode;
      });

      const lastIndex = Math.min(numbers.length, 5);
      // Find the input to focus - usually the one after the last pasted digit
      // But if length is 6, stay on 5
      const targetIndex = numbers.length === 6 ? 5 : lastIndex;

      const lastInput = document.getElementById(
        `code-${targetIndex}`,
      ) as HTMLInputElement;
      lastInput?.focus();
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredCode = code.join("");
    const numericCode = Number(enteredCode);
    if (isNaN(numericCode) || enteredCode.length !== 6)
      return toast.error("Invalid code");
    const emailStorage = localStorage.getItem("email");
    if (!emailStorage) return toast.error("Email not found");

    try {
      const response = await postUser({
        email: emailStorage,
        code: numericCode,
      }).unwrap();

      if (response) {
        setUser(response); // Pass the full response with tokens
        toast.success("Signup successfully");
        onClose();
        setCode(["", "", "", "", "", ""]);
        localStorage.removeItem("email");
      }
    } catch (error: any) {
      const errorMsg = error?.data?.message || error?.message || "Invalid code";
      toast.error(errorMsg);
    }
  };

  return {
    email,
    setEmail,
    showCodeInput,
    code,
    handleChange,
    handleKeyDown,
    handlePaste,
    handleVerifyCode,
    handleSignup,
    isLoading,
    isLoadingUser,
  };
}
