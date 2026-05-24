import { useState } from "react";
import { Link2, CheckCircle2, ArrowDown, ExternalLink } from "lucide-react";
import { shortUrlService } from "../services/shortUrlService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { toast } from "sonner";
import { getErrorMessage } from "../lib/error";

interface EditUrlModalProps {
  open: boolean;
  onClose: () => void;
  urlId: string;
  currentUrl: string;
  onSuccess?: () => void;
}

export default function EditUrlModal({
  open,
  onClose,
  urlId,
  currentUrl,
  onSuccess,
}: EditUrlModalProps) {
  const [newUrl, setNewUrl] = useState(currentUrl);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const hasChanged = newUrl.trim() !== currentUrl;

  const handleSubmit = async () => {
    setError("");
    if (!newUrl.trim()) {
      toast.error("URL is required");
      return;
    }
    if (!isValidUrl(newUrl)) {
      toast.error("Please enter a valid URL starting with https://");
      return;
    }
    try {
      setLoading(true);
      await shortUrlService.updateUrl(urlId, newUrl);
      setSuccess(true);
      toast.success("Short URL updated!");

      setTimeout(() => {
        onSuccess?.();
        handleClose();
      }, 1000);
    } catch (err: any) {
      const message = getErrorMessage(err);
      toast.error(message);

      // setError(
      //   err.response?.data?.message || err.message || "Failed to update URL",
      // );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setNewUrl(currentUrl);
    setError("");
    setSuccess(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-md rounded-xl p-6 flex flex-col gap-5">
        {/* Header */}
        <DialogHeader className="space-y-0 p-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <Link2 className="w-4 h-4 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-sm font-semibold leading-snug">
                Edit Destination URL
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Update where this short link redirects to
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Body — all in one block, no extra wrappers */}
        <div className="flex flex-col gap-3">
          {/* Current URL pill */}
          <div className="rounded-lg border border-border bg-muted/50 px-3 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50 mb-1">
              Currently points to
            </p>
            <div className="flex items-center gap-1.5 min-w-0">
              <ExternalLink className="w-3 h-3 text-muted-foreground/40 shrink-0" />
              <span className="text-xs font-mono text-muted-foreground truncate block">
                {currentUrl}
              </span>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center items-center gap-1.5 text-muted-foreground/30">
            <div className="h-px flex-1 bg-border/60" />
            <ArrowDown className="w-3 h-3 shrink-0" />
            <div className="h-px flex-1 bg-border/60" />
          </div>

          {/* New URL */}
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="edit-url"
              className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
            >
              New destination URL
            </Label>
            <Input
              id="edit-url"
              type="url"
              value={newUrl}
              onChange={(e) => {
                setNewUrl(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && !loading && handleSubmit()}
              placeholder="https://example.com/new-url"
              disabled={loading || success}
              autoFocus
              className="h-10 text-sm font-mono bg-background border-border focus-visible:ring-1 focus-visible:ring-primary/40 focus-visible:border-primary/60 placeholder:font-sans placeholder:text-muted-foreground/30"
            />
            {error && (
              <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">
                {error}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="p-0 flex-col-reverse sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading || success}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || success || !hasChanged}
            className="w-full sm:w-auto min-w-[120px]"
          >
            {success ? (
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Updated!
              </span>
            ) : loading ? (
              <Spinner />
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
