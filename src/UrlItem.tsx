import {
  Copy,
  Trash2,
  Pencil,
  Lock,
  Globe,
  ExternalLink,
  MousePointerClick,
  Calendar,
  User,
} from "lucide-react";
import { useState } from "react";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import { privateApi } from "./services/api";
import EditUrlModal from "./components/EditUrlModal";

interface UrlItemProps {
  id: string;
  shortKey: string;
  shortUrl: string;
  longUrl: string;
  createdAt: string;
  clicks: number;
  isPrivate: boolean;
  createdBy: string;
  status?: "ACTIVE" | "EXPIRED" | "DELETED";
  onDelete: () => Promise<void> | void;
  onSuccess?: () => void;
}

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

const UrlItem = ({
  id,
  shortKey,
  shortUrl,
  longUrl,
  createdAt,
  clicks,
  isPrivate,
  createdBy,
  status = "ACTIVE",
  onDelete,
  onSuccess,
}: UrlItemProps) => {
  const [copied, setCopied] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isValidUrl = (url: string): boolean => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  const handleOpenUrl = async () => {
    if (isPrivate) {
      try {
        const response = await privateApi.get(`/s/${shortKey}`);
        const url = response.data;
        if (isValidUrl(url)) {
          window.open(url, "_blank");
        } else {
          console.error("Invalid URL protocol:", url);
        }
      } catch (error) {
        console.error("Failed to open private URL", error);
      }
    } else {
      window.open(`${API_BASE}/s/public/${shortKey}`, "_blank");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <EditUrlModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        urlId={id} // ✅ item.id — used by updateUrl(id, url)
        currentUrl={longUrl}
        onSuccess={onSuccess}
      />

      <Card className="group hover:shadow-md transition-all duration-200 border-muted/60 hover:border-primary/25 overflow-hidden">
        <CardContent className="p-0">
          <div className="flex">
            <div
              className={`w-1 shrink-0 ${isPrivate ? "bg-amber-500" : "bg-primary"}`}
            />

            <div className="flex-1 p-4 space-y-3 min-w-0">
              {/* Top row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${isPrivate ? "bg-amber-500/10" : "bg-primary/10"}`}
                  >
                    {isPrivate ? (
                      <Lock className="w-3.5 h-3.5 text-amber-500" />
                    ) : (
                      <Globe className="w-3.5 h-3.5 text-primary" />
                    )}
                  </div>
                  <button
                    onClick={handleOpenUrl}
                    className="font-semibold text-sm text-primary hover:underline underline-offset-2 truncate text-left"
                  >
                    {shortUrl}
                  </button>
                </div>

                {/* Actions */}
                <div className="flex gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity shrink-0">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={copyToClipboard}
                    className="h-7 w-7"
                  >
                    {copied ? (
                      <span className="text-xs text-emerald-500 font-bold">
                        ✓
                      </span>
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setEditOpen(true)}
                    disabled={isDeleting}
                    className="h-7 w-7"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={async () => {
                      setIsDeleting(true);
                      try {
                        await onDelete();
                      } finally {
                        setIsDeleting(false);
                      }
                    }}
                    disabled={isDeleting}
                    className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Long URL */}
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <ExternalLink className="w-3 h-3 shrink-0" />
                <span className="truncate">{longUrl}</span>
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-2.5 border-t border-muted/40">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MousePointerClick className="w-3 h-3" /> {clicks} clicks
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />{" "}
                  {new Date(createdAt).toLocaleDateString()}
                </span>
                {createdBy && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <User className="w-3 h-3" /> {createdBy}
                  </span>
                )}
                <div className="ml-auto flex items-center gap-2">
                  {/* Visibility badge */}
                  <span
                    className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${
                      isPrivate
                        ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                        : "bg-primary/10 text-primary border-primary/20"
                    }`}
                  >
                    {isPrivate ? "Private" : "Public"}
                  </span>

                  {/* Status badge */}
                  <span
                    className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${
                      status === "ACTIVE"
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : status === "EXPIRED"
                          ? "bg-orange-500/10 text-orange-600 border-orange-500/20"
                          : "bg-destructive/10 text-destructive border-destructive/20"
                    }`}
                  >
                    {status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default UrlItem;
