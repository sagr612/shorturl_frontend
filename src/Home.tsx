import { Zap, LinkIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useCallback } from "react";
import UrlItem from "./UrlItem";
import { Card, CardContent } from "./components/ui/card";
import { Spinner } from "./components/ui/spinner";
import { Button } from "./components/ui/button";
import { shortUrlService } from "./services/shortUrlService";
import CreateShortUrlForm from "./components/CreateShortUrlForm";
import { useUrls } from "./hooks/useMyUrls";
import type { ShortUrlResponse, ShortUrl } from "./types/url";
import { URL } from "./services/api";
import { toast } from "sonner";

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const [localUrls, setLocalUrls] = useState<ShortUrl[]>([]);
  const {
    data,
    loading: urlsLoading,
    error: urlsError,
    refetch,
  } = useUrls({
    fetcher: shortUrlService.getPublicUrls,
    params: {
      page: currentPage,
    },
  });

  const pagination = data as ShortUrlResponse | null;
  const urls = localUrls.length > 0 ? localUrls : (pagination?.data || []);
  const totalClicks = urls.reduce((acc, u) => acc + u.clickCount, 0);

  const handleDelete = useCallback(
    async (id: string) => {
      const originalUrls = urls;
      const updatedUrls = urls.filter((u) => u.id !== id);
      setLocalUrls(updatedUrls);

      try {
        await shortUrlService.deleteUrls([id]);
        toast.success("URL deleted!");
      } catch (err) {
        setLocalUrls(originalUrls);
        toast.error("Failed to delete URL. Please try again.");
      }
    },
    [urls]
  );

  const handleSuccess = useCallback(() => {
    setLocalUrls([]);
    refetch();
  }, [refetch]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 mb-2">
            <Zap className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Shorten Your{" "}
            <span className="text-primary relative">
              Links
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary/40 rounded-full" />
            </span>
          </h1>
          <p className="text-muted-foreground max-w-sm mx-auto text-sm sm:text-base">
            Create short, memorable links and track their performance in real
            time.
          </p>
        </div>

        <CreateShortUrlForm onSuccess={handleSuccess} />

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <Card className="border-muted/60 hover:border-primary/20 transition-colors">
            <CardContent className="p-4 sm:p-5">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <LinkIcon className="w-4 h-4 text-primary" />
              </div>
              <p className="text-xl sm:text-2xl font-bold tabular-nums">
                {urls.length}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Total Links
              </p>
            </CardContent>
          </Card>
          <Card className="border-muted/60 hover:border-primary/20 transition-colors">
            <CardContent className="p-4 sm:p-5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-3">
                <LinkIcon className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-xl sm:text-2xl font-bold tabular-nums">
                {totalClicks}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Total Clicks
              </p>
            </CardContent>
          </Card>
          <Card className="border-muted/60 hover:border-primary/20 transition-colors">
            <CardContent className="p-4 sm:p-5">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center mb-3">
                <LinkIcon className="w-4 h-4 text-sky-500" />
              </div>
              <p className="text-xl sm:text-2xl font-bold tabular-nums">
                {urls.filter((u) => !u.isPrivate).length}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Public Links
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Results header */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-muted-foreground">
            {urlsLoading
              ? "Loading..."
              : `${urls.length} link${urls.length !== 1 ? "s" : ""} found`}
          </h2>
          {pagination && (
            <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
              Page {pagination.pageNumber} of {pagination.totalPages}
            </span>
          )}
        </div>

        {/* URL List */}
        <div className="space-y-3">
          {urlsLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Spinner />
              <p className="text-sm text-muted-foreground">Fetching links…</p>
            </div>
          ) : urlsError ? (
            <div className="text-destructive text-center py-8 text-sm bg-destructive/5 rounded-xl border border-destructive/10">
              {urlsError}
            </div>
          ) : urls.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3 rounded-2xl border border-dashed border-border/60 bg-muted/20">
              <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
                <LinkIcon className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="font-medium text-muted-foreground">
                No links found
              </p>
              <p className="text-xs text-muted-foreground/60">
                Create your first short URL above
              </p>
            </div>
          ) : (
            urls.map((item) => (
              <UrlItem
                key={item.id}
                id={item.id}
                shortKey={item.shortKey}
                shortUrl={`${URL}/${item.shortKey}`}
                longUrl={item.originalUrl}
                createdAt={item.createdAt}
                clicks={item.clickCount}
                isPrivate={item.isPrivate}
                createdBy={item.createdBy?.name}
                onDelete={() => handleDelete(item.id)}
                onSuccess={refetch}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasPrevious || urlsLoading}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="h-9 px-4 border-border/60 hover:bg-muted/60 gap-1.5"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Prev
            </Button>

            {/* Page pills */}
            <div className="flex items-center gap-1">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 ||
                    p === pagination.totalPages ||
                    Math.abs(p - currentPage) <= 1,
                )
                .reduce<(number | "…")[]>((acc, p, i, arr) => {
                  if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("…");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === "…" ? (
                    <span
                      key={`ellipsis-${i}`}
                      className="w-8 text-center text-xs text-muted-foreground"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p as number)}
                      className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                        currentPage === p
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {p}
                    </button>
                  ),
                )}
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasNext || urlsLoading}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="h-9 px-4 border-border/60 hover:bg-muted/60 gap-1.5"
            >
              Next
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
