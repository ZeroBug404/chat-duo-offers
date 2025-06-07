
import { ArrowLeft, MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";

interface ChatHeaderProps {
  name: string;
  status: string;
  backLink: string;
  showMenu?: boolean;
}

const ChatHeader = ({ name, status, backLink, showMenu = false }: ChatHeaderProps) => {
  return (
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
      {showMenu && (
        <button className="p-2">
          <MoreHorizontal className="w-6 h-6 text-gray-600" />
        </button>
      )}
    </div>
  );
};

export default ChatHeader;
