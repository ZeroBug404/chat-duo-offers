import { messageService } from "@/utils/messageService";
import { ArrowLeft, Copy, MoreHorizontal, Share2 } from "lucide-react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

interface ChatHeaderProps {
  name: string;
  status: string;
  backLink: string;
  showMenu?: boolean;
  chatId?: string;
  role?: "admin" | "buyer" | "seller";
}

const ChatHeader = ({
  name,
  status,
  backLink,
  showMenu = false,
  chatId,
  role,
}: ChatHeaderProps) => {
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareableLink, setShareableLink] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const linkInputRef = useRef<HTMLInputElement>(null);

  const handleShare = () => {
    if (!chatId) {
      // Use active chat ID if none provided
      chatId = messageService.getActiveChatId() || "";
    }

    if (chatId) {
      // Generate shareable link (assume we're in admin view)
      const link = messageService.getShareableLink(chatId, "admin");
      setShareableLink(link);
      setShowShareDialog(true);
    }
  };

  const handleCopyLink = () => {
    if (linkInputRef.current) {
      linkInputRef.current.select();
      document.execCommand("copy");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link to={backLink} className="p-1">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </Link>
          <div>
            <h1 className="font-semibold text-gray-900 text-lg">{name}</h1>
            {status && <p className="text-sm text-gray-500">{status}</p>}
          </div>
        </div>
        <div className="flex items-center">
          {role !== "admin" && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleShare}
              className="p-2 mr-2"
            >
              <Share2 className="w-6 h-6 text-gray-600" />
            </Button>
          )}
          {/* {showMenu && (
            <button className="p-2">
              <MoreHorizontal className="w-6 h-6 text-gray-600" />
            </button>
          )} */}
        </div>
      </div>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Share Chat Link
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Share this link with others to let them join this chat.
            </p>
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <input
                  ref={linkInputRef}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={shareableLink}
                  readOnly
                />
              </div>
              <Button type="button" size="icon" onClick={handleCopyLink}>
                {copied ? (
                  <span className="text-green-500 text-xs">Copied!</span>
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChatHeader;
