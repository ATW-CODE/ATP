import { Button } from "@/app/components/ui/button";
import { motion } from "motion/react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      if (!credentialResponse.credential) {
        throw new Error("ID token missing from Google response");
      }

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/google`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idToken: credentialResponse.credential,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("atp_token", data.token);
      onLogin();
    } catch (err) {
      console.error("Login error:", err);
      alert("Google login failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-neutral-900">
      <div className="w-full max-w-md">

        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <span className="text-4xl">🖨️</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            ATP Print Kiosk
          </h1>
          <p className="text-neutral-400">
            Fast & Secure Document Printing
          </p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <h2 className="text-2xl font-bold text-neutral-900 mb-2 text-center">
            Welcome Back
          </h2>
          <p className="text-neutral-600 text-center mb-8">
            Sign in to continue printing
          </p>

          {/* Google Login */}
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => alert("Google login failed")}
            width="100%"
          />

          <p className="text-xs text-neutral-500 text-center mt-6">
            By continuing, you agree to our Terms & Privacy Policy
          </p>
        </motion.div>
      </div>
    </div>
  );
}
