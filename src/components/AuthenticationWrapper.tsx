import { Lock } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

interface AuthenticationWrapperProps {
  children: ReactNode;
}

const AuthenticationWrapper = ({ children }: AuthenticationWrapperProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // The correct password - in a real app, this would be stored securely
  const correctPassword = "admin123";

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = () => {
    const authTimestamp = localStorage.getItem("chat_auth_timestamp");

    if (authTimestamp) {
      const currentTime = Date.now();
      const authTime = parseInt(authTimestamp);

      // Check if authentication is still valid (less than 1 hour old)
      if (currentTime - authTime < 60 * 60 * 1000) {
        setIsAuthenticated(true);
      } else {
        // Authentication expired, remove from localStorage
        localStorage.removeItem("chat_auth_timestamp");
        setShowPasswordModal(true);
      }
    } else {
      // No authentication found, show password modal
      setShowPasswordModal(true);
    }

    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password === correctPassword) {
      // Store authentication status in localStorage
      localStorage.setItem("chat_auth_timestamp", Date.now().toString());

      // Update state
      setIsAuthenticated(true);
      setShowPasswordModal(false);
      setPassword("");
      setError("");
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-4"></div>
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Dialog
        open={showPasswordModal}
        onOpenChange={(open) => {
          // Only allow closing if authenticated (prevent users from dismissing)
          if (isAuthenticated) {
            setShowPasswordModal(open);
          }
        }}
      >
        <DialogContent
          className="sm:max-w-md"
          onEscapeKeyDown={(e) => {
            // Prevent closing with escape key
            if (!isAuthenticated) {
              e.preventDefault();
            }
          }}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Password Protected
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-gray-600">
              Please enter the password to access the application.
            </p>

            <div className="grid gap-2">
              <input
                type="password"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
              {error && <p className="text-xs text-red-500">{error}</p>}
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                Submit
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {isAuthenticated ? children : null}
    </>
  );
};

export default AuthenticationWrapper;
