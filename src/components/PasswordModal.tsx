import { Lock } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetPath: string;
}

const PasswordModal = ({ isOpen, onClose, targetPath }: PasswordModalProps) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // The correct password - in a real app, this would be stored securely
  const correctPassword = "admin123";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password === correctPassword) {
      // Store authentication status in localStorage
      localStorage.setItem("chat_auth_timestamp", Date.now().toString());

      // Navigate to the target path
      navigate(targetPath);

      // Close modal and reset state
      onClose();
      setPassword("");
      setError("");
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Password Protected
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-gray-600">
            Please enter the password to access the chats.
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
  );
};

export default PasswordModal;
