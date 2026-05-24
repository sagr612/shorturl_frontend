import { useState } from "react";
import { shortUrlService } from "../services/shortUrlService";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { Switch } from "./ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Link2, Lock, Clock } from "lucide-react";
import { toast } from "sonner";
import { getErrorMessage } from "../lib/error";
import { validation, getValidationErrorMessage } from "../lib/validation";

export default function CreateShortUrlForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const [originalUrl, setOriginalUrl] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [expirationInDays, setExpirationInDays] = useState<string>("1");
  const [loading, setLoading] = useState(false);
  const [urlError, setUrlError] = useState("");

  const handleUrlChange = (value: string) => {
    setOriginalUrl(value);
    setUrlError("");
  };

  const isValidUrl = (url: string): boolean => {
    return validation.isValidUrl(url);
  };

  const handleSubmit = async () => {
    setUrlError("");

    if (!originalUrl) {
      setUrlError(getValidationErrorMessage("url", "required"));
      return;
    }

    if (!isValidUrl(originalUrl)) {
      setUrlError(getValidationErrorMessage("url", "invalid"));
      return;
    }

    try {
      setLoading(true);

      await shortUrlService.createShortUrl({
        originalUrl,
        isPrivate,
        expirationInDays: Number(expirationInDays),
      });

      toast.success("Short URL created!");

      setOriginalUrl("");
      setUrlError("");
      setIsPrivate(false);
      setExpirationInDays("1");

      onSuccess?.();
    } catch (err: any) {
      const message = getErrorMessage(err);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-xl border-muted/60 overflow-hidden">
      {/* Top gradient bar */}
      <div className="h-1 bg-gradient-to-r from-primary/60 via-primary to-primary/60" />
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Link2 className="w-5 h-5 text-primary" />
          Shorten a URL
        </CardTitle>
        <CardDescription>
          Paste your long link and we'll make it short
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 pt-2">
        {/* URL Input */}
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Original URL</Label>
          <Input
            placeholder="https://example.com/very/long/url"
            value={originalUrl}
            onChange={(e) => handleUrlChange(e.target.value)}
            disabled={loading}
            className="h-11 bg-muted/40 border-muted-foreground/20 focus:border-primary/50 font-mono text-sm transition-colors"
          />
          {urlError && (
            <p className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-lg border border-destructive/20">
              {urlError}
            </p>
          )}
        </div>

        {/* Settings Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Private Toggle */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-muted-foreground/10">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-500" />
              <div>
                <p className="text-sm font-medium">Private URL</p>
                <p className="text-xs text-muted-foreground">
                  Requires auth to visit
                </p>
              </div>
            </div>
            <Switch
              checked={isPrivate}
              onCheckedChange={setIsPrivate}
              disabled={loading}
            />
          </div>

          {/* Expiration Select */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Expires in
            </Label>
            <Select
              value={expirationInDays}
              onValueChange={setExpirationInDays}
              disabled={loading}
            >
              <SelectTrigger className="h-11 bg-muted/40 border-muted-foreground/20">
                <SelectValue placeholder="Select expiration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Day</SelectItem>
                <SelectItem value="7">7 Days</SelectItem>
                <SelectItem value="30">30 Days</SelectItem>
                <SelectItem value="90">90 Days</SelectItem>
                <SelectItem value="365">1 Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full h-11 font-semibold shadow-lg shadow-primary/20"
        >
          {loading ? <Spinner /> : "Create Short URL"}
        </Button>
      </CardContent>
    </Card>
  );
}
