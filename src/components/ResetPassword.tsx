import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Zap, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { authService } from "../services/authService";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  // Validation checks
  const passwordLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const passwordsMatch = password && password === confirmPassword;

  const isFormValid =
    passwordLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumber &&
    passwordsMatch &&
    !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid reset link. Please try again.");
      navigate("/login");
      return;
    }

    if (!isFormValid) {
      toast.error("Please fix validation errors");
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(token, password, confirmPassword);
      toast.success("Password reset successfully!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to reset password"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background px-4 py-8">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="w-full max-w-md relative">
          <Card className="border-muted/60 shadow-2xl shadow-black/10 backdrop-blur-sm">
            <CardContent className="pt-8">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Invalid Link</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    This password reset link is invalid or has expired.
                  </p>
                </div>
                <Button
                  onClick={() => navigate("/login")}
                  className="w-full mt-4"
                >
                  Back to Login
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background px-4 py-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">ShortURL</span>
        </div>

        <Card className="border-muted/60 shadow-2xl shadow-black/10 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold">Create new password</CardTitle>
            <CardDescription className="text-base">
              Enter a strong password to secure your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Password Field */}
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="h-11 bg-muted/40 border-muted-foreground/20 focus:border-primary/50 transition-colors pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                {/* Password Validation Checks */}
                <div className="space-y-1.5 mt-3">
                  <p className="text-xs font-medium text-muted-foreground">
                    Password must contain:
                  </p>
                  <div className="space-y-1.5">
                    <div
                      className={`flex items-center gap-2 text-xs transition-colors ${
                        passwordLength
                          ? "text-emerald-600"
                          : "text-muted-foreground/60"
                      }`}
                    >
                      <CheckCircle2
                        className={`w-3.5 h-3.5 ${
                          passwordLength
                            ? "text-emerald-600"
                            : "text-muted-foreground/30"
                        }`}
                      />
                      At least 8 characters
                    </div>
                    <div
                      className={`flex items-center gap-2 text-xs transition-colors ${
                        hasUpperCase
                          ? "text-emerald-600"
                          : "text-muted-foreground/60"
                      }`}
                    >
                      <CheckCircle2
                        className={`w-3.5 h-3.5 ${
                          hasUpperCase
                            ? "text-emerald-600"
                            : "text-muted-foreground/30"
                        }`}
                      />
                      One uppercase letter
                    </div>
                    <div
                      className={`flex items-center gap-2 text-xs transition-colors ${
                        hasLowerCase
                          ? "text-emerald-600"
                          : "text-muted-foreground/60"
                      }`}
                    >
                      <CheckCircle2
                        className={`w-3.5 h-3.5 ${
                          hasLowerCase
                            ? "text-emerald-600"
                            : "text-muted-foreground/30"
                        }`}
                      />
                      One lowercase letter
                    </div>
                    <div
                      className={`flex items-center gap-2 text-xs transition-colors ${
                        hasNumber ? "text-emerald-600" : "text-muted-foreground/60"
                      }`}
                    >
                      <CheckCircle2
                        className={`w-3.5 h-3.5 ${
                          hasNumber
                            ? "text-emerald-600"
                            : "text-muted-foreground/30"
                        }`}
                      />
                      One number
                    </div>
                  </div>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-1.5">
                <Label htmlFor="confirm-password" className="text-sm font-medium">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    className={`h-11 bg-muted/40 border-muted-foreground/20 focus:border-primary/50 transition-colors pr-10 ${
                      confirmPassword && !passwordsMatch
                        ? "border-destructive/50 focus:border-destructive/50"
                        : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors"
                  >
                    {showConfirm ? "Hide" : "Show"}
                  </button>
                </div>
                {confirmPassword && !passwordsMatch && (
                  <p className="text-xs text-destructive mt-1">
                    Passwords do not match
                  </p>
                )}
                {confirmPassword && passwordsMatch && (
                  <p className="text-xs text-emerald-600 mt-1">Passwords match</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={!isFormValid}
                className="w-full h-11 font-semibold shadow-lg shadow-primary/20 mt-4"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>

            <div className="flex items-center gap-2 mt-6">
              <Button
                variant="ghost"
                onClick={() => navigate("/login")}
                className="p-0 h-auto font-medium text-primary hover:underline underline-offset-4"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Back to login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
