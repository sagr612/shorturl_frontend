import {
  Mail,
  Calendar,
  ShieldAlert,
  Link2,
  Eye,
  EyeOff,
  Mouse,
} from "lucide-react";
import { useUserProfile } from "./hooks/useUserProfile";
import { Card, CardContent } from "./components/ui/card";
import { Spinner } from "./components/ui/spinner";
import { getInitials } from "./lib/user";

export default function Profile() {
  const { profile, stats, loading, error } = useUserProfile();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const statCards = stats
    ? [
        {
          label: "Total Links",
          value: stats.totalUrls,
          icon: Link2,
          color: "text-blue-500",
          bg: "bg-blue-500/10",
        },
        {
          label: "Public Links",
          value: stats.publicUrls,
          icon: Eye,
          color: "text-emerald-500",
          bg: "bg-emerald-500/10",
        },
        {
          label: "Private Links",
          value: stats.privateUrls,
          icon: EyeOff,
          color: "text-amber-500",
          bg: "bg-amber-500/10",
        },
        {
          label: "Total Clicks",
          value: stats.totalClicks,
          icon: Mouse,
          color: "text-purple-500",
          bg: "bg-purple-500/10",
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8">
        {/* Header */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Profile
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Manage your account and view your statistics
          </p>
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <Spinner />
          </div>
        )}

        {error && (
          <div className="text-destructive text-center py-12 text-sm bg-destructive/5 rounded-xl border border-destructive/10 p-6">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {!loading && !error && profile && (
          <>
            {/* Profile Card */}
            <Card className="border-muted/60 overflow-hidden">
              <div className="h-24 bg-gradient-to-r from-primary/20 to-primary/5" />
              <CardContent className="p-6 -mt-12 relative">
                <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 border-4 border-background flex items-center justify-center">
                    {/* <User className="w-10 h-10 text-primary" /> */}
                    <span className="text-2xl font-bold text-primary">
                      {getInitials(profile.name)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl sm:text-3xl font-bold">
                      {profile.name}
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      {profile.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted">
                    <ShieldAlert className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{profile.role}</span>
                  </div>
                </div>

                {/* Profile Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                  {/* Email */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      <span className="text-xs font-medium uppercase tracking-wide">
                        Email
                      </span>
                    </div>
                    <p className="text-lg font-medium break-all">
                      {profile.email}
                    </p>
                  </div>

                  {/* Member Since */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span className="text-xs font-medium uppercase tracking-wide">
                        Member Since
                      </span>
                    </div>
                    <p className="text-lg font-medium">
                      {formatDate(profile.createdAt)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">Your Statistics</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat) => (
                  <Card
                    key={stat.label}
                    className="border-muted/60 hover:border-primary/20 hover:shadow-lg transition-all duration-200"
                  >
                    <CardContent className="p-6">
                      <div
                        className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center mb-4`}
                      >
                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      </div>
                      <p className="text-3xl sm:text-4xl font-bold tabular-nums">
                        {stat.value}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {stat.label}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Summary Card */}
            {stats && (
              <Card className="border-muted/60 bg-gradient-to-br from-primary/5 to-primary/10">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Summary</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center py-2 border-b border-muted/30">
                      <span className="text-muted-foreground">
                        Total links created
                      </span>
                      <span className="font-semibold">{stats.totalUrls}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-muted/30">
                      <span className="text-muted-foreground">
                        Public links
                      </span>
                      <span className="font-semibold">{stats.publicUrls}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-muted/30">
                      <span className="text-muted-foreground">
                        Private links
                      </span>
                      <span className="font-semibold">{stats.privateUrls}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-muted-foreground">
                        Total clicks received
                      </span>
                      <span className="font-semibold">{stats.totalClicks}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
