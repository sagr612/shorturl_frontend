import {
  BarChart3,
  Users,
  Link2,
  Globe,
  ShieldAlert,
  Search,
  ChevronLeft,
  ChevronRight,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import type { AdminStats, AdminUrlsResponse, AdminUser } from "../types/admin";
import { adminService } from "../services/adminService";
import { URL } from "../services/api";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import UrlItem from "../UrlItem";
import { Badge } from "./ui/badge";

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [urlData, setUrlData] = useState<AdminUrlsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);

  // URL filters
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [visibility, setVisibility] = useState<"all" | "public" | "private">(
    "all",
  );
  const [sortBy, setSortBy] = useState<"createdAt" | "clickCount">("createdAt");
  const [direction, setDirection] = useState<"asc" | "desc">("desc");

  // Bulk delete
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleting, setDeleting] = useState(false);

  // ── fetch stats + users once
  useEffect(() => {
    (async () => {
      try {
        setStatsLoading(true);
        const [s, u] = await Promise.all([
          adminService.getStats(),
          adminService.getUsers(),
        ]);
        setStats(s);
        setUsers(u);
      } catch (e) {
        console.error(e);
      } finally {
        setStatsLoading(false);
      }
    })();
  }, []);

  // ── fetch URLs on filter change
  const fetchUrls = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAllUrls({
        page,
        search,
        sortBy,
        direction,
        isPrivate: visibility === "all" ? undefined : visibility === "private",
      });
      setUrlData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, [page, search, visibility, sortBy, direction]);

  const handleBulkDelete = useCallback(async () => {
    if (!selectedIds.length) return;
    const originalData = urlData;
    try {
      setDeleting(true);
      setUrlData(
        urlData
          ? {
              ...urlData,
              data: urlData.data.filter((u) => !selectedIds.includes(u.id)),
            }
          : null
      );
      setSelectedIds([]);
      await adminService.deleteUrls(selectedIds);
      toast.success("URLs deleted!");
    } catch (e) {
      setUrlData(originalData);
      toast.error("Failed to delete URLs");
    } finally {
      setDeleting(false);
    }
  }, [selectedIds, urlData]);

  const toggleSelect = (id: string) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const statCards = stats
    ? [
        {
          label: "Total URLs",
          value: stats.totalUrls,
          icon: Link2,
          color: "text-primary",
          bg: "bg-primary/10",
        },
        {
          label: "Total Users",
          value: stats.totalUsers,
          icon: Users,
          color: "text-emerald-500",
          bg: "bg-emerald-500/10",
        },
        {
          label: "Total Clicks",
          value: stats.totalClicks,
          icon: BarChart3,
          color: "text-sky-500",
          bg: "bg-sky-500/10",
        },
        {
          label: "Public URLs",
          value: stats.publicUrls,
          icon: Globe,
          color: "text-violet-500",
          bg: "bg-violet-500/10",
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12 space-y-8">
        {/* ── Page Header ── */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Full system overview and controls
            </p>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        {statsLoading ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {statCards.map((s) => (
              <Card
                key={s.label}
                className="border-muted/60 hover:border-primary/20 transition-colors"
              >
                <CardContent className="p-4 sm:p-5">
                  <div
                    className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center mb-3`}
                  >
                    <s.icon className={`w-4 h-4 ${s.color}`} />
                  </div>
                  <p className="text-xl sm:text-2xl font-bold tabular-nums">
                    {s.value}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                    {s.label}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* ── Tabs ── */}
        <Tabs defaultValue="urls">
          <TabsList className="bg-muted/50 border border-border/60 h-10">
            <TabsTrigger value="urls" className="text-sm gap-1.5">
              <Link2 className="w-3.5 h-3.5" /> All URLs
            </TabsTrigger>
            <TabsTrigger value="users" className="text-sm gap-1.5">
              <Users className="w-3.5 h-3.5" /> Users
            </TabsTrigger>
          </TabsList>

          {/* ── URLs Tab ── */}
          <TabsContent value="urls" className="space-y-4 mt-4">
            {/* Filter bar */}
            <div className="rounded-2xl border border-border/60 bg-card shadow-sm p-4 space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Filters
              </p>
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
                    className="pl-9 pr-8 h-9 text-sm bg-muted/40 border-muted-foreground/20"
                  />
                  {search && (
                    <button
                      onClick={() => {
                        setSearch("");
                        setPage(1);
                      }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <Select
                  value={visibility}
                  onValueChange={(v: any) => {
                    setPage(1);
                    setVisibility(v);
                  }}
                >
                  <SelectTrigger className="h-9 text-sm bg-muted/40 border-muted-foreground/20">
                    <SelectValue placeholder="Visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All links</SelectItem>
                    <SelectItem value="public">Public only</SelectItem>
                    <SelectItem value="private">Private only</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                  <SelectTrigger className="h-9 text-sm bg-muted/40 border-muted-foreground/20">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">Date created</SelectItem>
                    <SelectItem value="clickCount">Click count</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={direction}
                  onValueChange={(v: any) => setDirection(v)}
                >
                  <SelectTrigger className="h-9 text-sm bg-muted/40 border-muted-foreground/20">
                    <SelectValue placeholder="Order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Newest first</SelectItem>
                    <SelectItem value="asc">Oldest first</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Bulk delete toolbar */}
            {selectedIds.length > 0 && (
              <div className="flex items-center justify-between rounded-xl bg-destructive/5 border border-destructive/20 px-4 py-2.5">
                <span className="text-sm font-medium text-destructive">
                  {selectedIds.length} selected
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs border-destructive/20 text-destructive hover:bg-destructive/10"
                    onClick={() => setSelectedIds([])}
                  >
                    Clear
                  </Button>
                  <Button
                    size="sm"
                    className="h-7 text-xs bg-destructive hover:bg-destructive/90 gap-1.5"
                    onClick={handleBulkDelete}
                    disabled={deleting}
                  >
                    {deleting ? (
                      <Spinner />
                    ) : (
                      <>
                        <Trash2 className="w-3 h-3" /> Delete selected
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Results info */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {loading ? "Loading..." : `${urlData?.data.length ?? 0} links`}
              </p>
              {urlData && (
                <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                  Page {urlData.pageNumber} of {urlData.totalPages}
                </span>
              )}
            </div>

            {/* URL list */}
            <div className="space-y-3">
              {loading ? (
                <div className="flex flex-col items-center py-20 gap-3">
                  <Spinner />
                  <p className="text-sm text-muted-foreground">
                    Loading links…
                  </p>
                </div>
              ) : !urlData?.data.length ? (
                <div className="flex flex-col items-center py-20 rounded-2xl border border-dashed border-border/60 bg-muted/20 space-y-2">
                  <Link2 className="w-8 h-8 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">No URLs found</p>
                </div>
              ) : (
                urlData.data.map((url) => (
                  <div key={url.id} className="flex items-start gap-2">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(url.id)}
                      onChange={() => toggleSelect(url.id)}
                      className="mt-4 ml-1 accent-primary w-4 h-4 rounded shrink-0 cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <UrlItem
                        id={url.id}
                        shortKey={url.shortKey}
                        shortUrl={`${URL}/s/${
                          url.isPrivate
                            ? url.shortKey
                            : `public/${url.shortKey}`
                        }`}
                        longUrl={url.originalUrl}
                        createdAt={url.createdAt}
                        clicks={url.clickCount}
                        isPrivate={url.isPrivate}
                        createdBy={url.createdBy?.name || "Unknown"}
                        status={url.status}
                        onDelete={async () => {
                          const originalData = urlData;
                          setUrlData(
                            urlData
                              ? {
                                  ...urlData,
                                  data: urlData.data.filter(
                                    (u) => u.id !== url.id
                                  ),
                                }
                              : null
                          );
                          try {
                            await adminService.deleteUrls([url.id]);
                            toast.success("URL deleted!");
                          } catch {
                            setUrlData(originalData);
                            toast.error("Failed to delete URL");
                          }
                        }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {urlData && urlData.totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!urlData.hasPrevious || loading}
                  onClick={() => setPage((p) => p - 1)}
                  className="h-9 px-4 border-border/60 gap-1.5"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Prev
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: urlData.totalPages }, (_, i) => i + 1)
                    .filter(
                      (p) =>
                        p === 1 ||
                        p === urlData.totalPages ||
                        Math.abs(p - page) <= 1,
                    )
                    .reduce<(number | "…")[]>((acc, p, i, arr) => {
                      if (i > 0 && p - (arr[i - 1] as number) > 1)
                        acc.push("…");
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, i) =>
                      p === "…" ? (
                        <span
                          key={`e-${i}`}
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
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:bg-muted"
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
                  disabled={!urlData.hasNext || loading}
                  onClick={() => setPage((p) => p + 1)}
                  className="h-9 px-4 border-border/60 gap-1.5"
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            )}
          </TabsContent>

          {/* ── Users Tab ── */}
          <TabsContent value="users" className="mt-4">
            <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-3 sm:grid-cols-4 px-4 py-3 bg-muted/40 border-b border-border/60">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Name
                </p>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:block">
                  Email
                </p>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Role
                </p>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Joined
                </p>
              </div>

              {statsLoading ? (
                <div className="flex justify-center py-12">
                  <Spinner />
                </div>
              ) : !users.length ? (
                <div className="flex flex-col items-center py-16 space-y-2">
                  <Users className="w-8 h-8 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">
                    No users found
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border/40">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="grid grid-cols-3 sm:grid-cols-4 px-4 py-3.5 items-center hover:bg-muted/30 transition-colors"
                    >
                      {/* Name + avatar */}
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                          <span className="text-xs font-semibold text-primary">
                            {user.name?.[0]?.toUpperCase() ?? "?"}
                          </span>
                        </div>
                        <span className="text-sm font-medium truncate">
                          {user.name}
                        </span>
                      </div>

                      {/* Email */}
                      <span className="text-sm text-muted-foreground truncate hidden sm:block">
                        {user.email}
                      </span>

                      {/* Role badge */}
                      <div>
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-semibold ${
                            user.role === "ADMIN"
                              ? "border-destructive/30 text-destructive bg-destructive/5"
                              : "border-primary/20 text-primary bg-primary/5"
                          }`}
                        >
                          {user.role}
                        </Badge>
                      </div>

                      {/* Joined date */}
                      <span className="text-xs text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
