import { useUsersSignupGoogleMutation } from "../../redux/users/apiUsers";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { toast } from "react-toastify";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { motion } from "framer-motion";

interface GoogleSignupProps {
  onClose: () => void;
}

/**
 * GoogleSignup: Handles OAuth2 authentication flow for Google accounts.
 * تسجيل جوجل: معالجة تدفق مصادقة OAuth2 لحسابات جوجل.
 */
export default function GoogleSignup({ onClose }: GoogleSignupProps) {
  const [signupGoogle] = useUsersSignupGoogleMutation();
  const { setUser } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    const idToken = credentialResponse?.credential;
    if (!idToken) return toast.error("Google login failed");

    setIsLoading(true);
    try {
      const response = await signupGoogle({ token_google: idToken }).unwrap();
      if (response) {
        setUser(response);
        onClose();
        toast.success("Logged in successfully with Google!");
      }
    } catch {
      toast.error("Failed to login with Google");
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = () => {
    toast.error("Google login failed");
  };

  return (
    <div className="relative w-full">
      {/* Custom styled overlay button */}
      <motion.div
        whileHover={!isLoading ? { backgroundColor: "#f9fafb" } : {}}
        whileTap={!isLoading ? { scale: 0.98 } : {}}
        className={`w-full py-4 border border-gray-100 bg-white text-(--color-dark) font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 pointer-events-none text-[10px]
        ${isLoading ? "opacity-50" : ""}`}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-gray-200 border-t-(--color-dark) rounded-full animate-spin"></div>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sync via Google
          </>
        )}
      </motion.div>

      {/* Hidden GoogleLogin component for functionality */}
      <div className="absolute inset-0 opacity-0">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          text="continue_with"
          shape="rectangular"
          width="100%"
        />
      </div>
    </div>
  );
}
