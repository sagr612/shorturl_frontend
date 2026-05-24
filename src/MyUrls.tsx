import { useEffect, useState, useCallback } from "react";
import UrlItem from "./UrlItem";
import { Input } from "./components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Button } from "./components/ui/button";
import { Spinner } from "./components/ui/spinner";
import type { ShortUrl, ShortUrlResponse } from "./types/url";
import { shortUrlService } from "./services/shortUrlService";
import { URL } from "./services/api";
import { toast } from "sonner";
import {
  Search,
  SlidersHorizontal,
  LinkIcon,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Globe,
  Lock,
  X,
} from "lucide-react";

const MyUrlsPage = () => {
  const [urls, setUrls] = useState<ShortUrl[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [visibility, setVisibility] = useState<"all" | "public" | "private">(
    "all",
  );
  const [sortBy, setSortBy] = useState<"createdAt" | "clickCount">("createdAt");
  const [direction, setDirection] = useState<"asc" | "desc">("desc");
  const [pagination, setPagination] = useState<ShortUrlResponse | null>(null);

  const fetchUrls = useCallback(async () => {
    try {
      setLoading(true);
      const response = await shortUrlService.getMyUrls({
        page,
        search,
        sortBy,
        direction,
        isPrivate: visibility === "all" ? undefined : visibility === "private",
      });
      setUrls(response.data);
      setPagination(response);
    } catch (error) {
      console.error("Failed to fetch URLs", error);
    } finally {
      setLoading(false);
    }
  }, [page, search, visibility, sortBy, direction]);

  useEffect(() => {
    fetchUrls();
  }, [fetchUrls]);

  const clearSearch = () => {
    setSearch("");
    setPage(1);
  };

  const handleOptimisticDelete = useCallback(
    async (urlId: string) => {
      const originalUrls = urls;
      const updatedUrls = urls.filter((u) => u.id !== urlId);
      setUrls(updatedUrls);

      try {
        await shortUrlService.deleteUrls([urlId]);
        toast.success("URL deleted!");
      } catch (error) {
        setUrls(originalUrls);
        toast.error("Failed to delete URL. Please try again.");
      }
    },
    [urls]
  );

  const hasActiveFilters =
    search ||
    visibility !== "all" ||
    sortBy !== "createdAt" ||
    direction !== "desc";

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-12 space-y-8">
        {/* ── Header ── */}
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <LinkIcon className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                My URLs
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage and search your shortened links
              </p>
            </div>
          </div>
        </div>

        {/* ── Filter Bar ── */}
        <div className="rounded-2xl border border-border/60 bg-card shadow-sm p-4 space-y-3">
          {/* Label row */}
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters
            {hasActiveFilters && (
              <span className="ml-auto text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full font-medium normal-case tracking-normal">
                Active
              </span>
            )}
          </div>

          {/* Controls grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search */}
            <div className="relative sm:col-span-2 lg:col-span-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/50 pointer-events-none" />
              <Input
                placeholder="Search URLs..."
                value={search}
                onChange={(e) => {
                  setPage(1);
                  setSearch(e.target.value);
                }}
                className="pl-9 pr-8 h-9 text-sm bg-muted/40 border-muted-foreground/20 focus-visible:border-primary/50 focus-visible:ring-primary/20"
              />
              {search && (
                <button
                  onClick={clearSearch}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Visibility */}
            <Select
              value={visibility}
              onValueChange={(v: any) => {
                setPage(1);
                setVisibility(v);
              }}
            >
              <SelectTrigger className="h-9 text-sm bg-muted/40 border-muted-foreground/20 focus:ring-primary/20">
                <div className="flex items-center gap-2">
                  {visibility === "private" ? (
                    <Lock className="w-3 h-3 text-amber-500" />
                  ) : (
                    <Globe className="w-3 h-3 text-primary" />
                  )}
                  <SelectValue placeholder="Visibility" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All links</SelectItem>
                <SelectItem value="public">Public only</SelectItem>
                <SelectItem value="private">Private only</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort by */}
            <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
              <SelectTrigger className="h-9 text-sm bg-muted/40 border-muted-foreground/20 focus:ring-primary/20">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-3 h-3 text-muted-foreground/60" />
                  <SelectValue placeholder="Sort by" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Date created</SelectItem>
                <SelectItem value="clickCount">Click count</SelectItem>
              </SelectContent>
            </Select>

            {/* Direction */}
            <Select
              value={direction}
              onValueChange={(v: any) => setDirection(v)}
            >
              <SelectTrigger className="h-9 text-sm bg-muted/40 border-muted-foreground/20 focus:ring-primary/20">
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Newest first</SelectItem>
                <SelectItem value="asc">Oldest first</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* ── Results header ── */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-muted-foreground">
            {loading
              ? "Loading..."
              : `${urls.length} link${urls.length !== 1 ? "s" : ""} found`}
          </h2>
          {pagination && (
            <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
              Page {pagination.pageNumber} of {pagination.totalPages}
            </span>
          )}
        </div>

        {/* ── URL List ── */}
        <div className="space-y-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Spinner />
              <p className="text-sm text-muted-foreground">
                Fetching your links…
              </p>
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
                {hasActiveFilters
                  ? "Try adjusting your filters"
                  : "Create your first short URL on the home page"}
              </p>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-1 h-8 text-xs"
                  onClick={() => {
                    setSearch("");
                    setVisibility("all");
                    setSortBy("createdAt");
                    setDirection("desc");
                    setPage(1);
                  }}
                >
                  Clear all filters
                </Button>
              )}
            </div>
          ) : (
            urls.map((url) => (
              <UrlItem
                key={url.id}
                id={url.id}
                shortKey={url.shortKey}
                shortUrl={`${URL}/${url.shortKey}`}
                longUrl={url.originalUrl}
                createdAt={url.createdAt}
                clicks={url.clickCount}
                isPrivate={url.isPrivate}
                createdBy={url.createdBy?.name || "Unknown"}
                onDelete={() => handleOptimisticDelete(url.id)}
                onSuccess={fetchUrls}
              />
            ))
          )}
        </div>

        {/* ── Pagination ── */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.hasPrevious || loading}
              onClick={() => setPage((p) => p - 1)}
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
                    Math.abs(p - page) <= 1,
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
                      onClick={() => setPage(p as number)}
                      className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                        page === p
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
              disabled={!pagination.hasNext || loading}
              onClick={() => setPage((p) => p + 1)}
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
};

export default MyUrlsPage;
