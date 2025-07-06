import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../supabase/supabase";
import { LoadingScreen } from "@/components/ui/loading-spinner";

export default function AuthCallback() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Wait for Supabase to process the OAuth callback and set the session
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          setError("Authentication failed. Please try again.");
          setTimeout(() => navigate("/login"), 3000);
          return;
        }
        // Wait a moment for session propagation (sometimes needed)
        if (data.session) {
          navigate("/hi");
        } else {
          // Try to refresh session (optional, for edge cases)
          setTimeout(async () => {
            const { data: refreshed } = await supabase.auth.getSession();
            if (refreshed.session) {
              navigate("/hi");
            } else {
              setError("No session found after authentication. Please try logging in again.");
              setTimeout(() => navigate("/login"), 3000);
            }
          }, 1000);
        }
      } catch (err) {
        setError("An unexpected error occurred. Please try again.");
        setTimeout(() => navigate("/login"), 3000);
      }
    };
    handleAuthCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-md mx-auto text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return <LoadingScreen text="Completing authentication..." />;
} 