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
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Zap } from "lucide-react";
import { Spinner } from "./ui/spinner";
import { toast } from "sonner";
import { getErrorMessage } from "../lib/error";
import { validation, getValidationErrorMessage } from "../lib/validation";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { signup } = useAuth();
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name) {
      newErrors.name = getValidationErrorMessage("name", "required");
    } else if (!validation.isValidName(name)) {
      newErrors.name = getValidationErrorMessage("name", "invalid");
    }

    if (!email) {
      newErrors.email = getValidationErrorMessage("email", "required");
    } else if (!validation.isValidEmail(email)) {
      newErrors.email = getValidationErrorMessage("email", "invalid");
    }

    if (!password) {
      newErrors.password = getValidationErrorMessage("password", "required");
    } else {
      const passwordValidation = validation.isValidPassword(password);
      if (!passwordValidation.valid) {
        newErrors.password = passwordValidation.errors[0];
      }
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = getValidationErrorMessage(
        "password",
        "required"
      );
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = getValidationErrorMessage(
        "password",
        "mismatch"
      );
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await signup(email, password, name);
      toast.success("Account created successfully!");
      navigate("/");
    } catch (err: any) {
      const message = getErrorMessage(err);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

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
            <CardTitle className="text-2xl font-bold">Create account</CardTitle>
            <CardDescription className="text-base">
              Start shortening links in seconds
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: "" });
                  }}
                  disabled={loading}
                  className="h-11 bg-muted/40 border-muted-foreground/20 focus:border-primary/50 transition-colors"
                />
                {errors.name && (
                  <p className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-lg border border-destructive/20">
                    {errors.name}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: "" });
                  }}
                  disabled={loading}
                  className="h-11 bg-muted/40 border-muted-foreground/20 focus:border-primary/50 transition-colors"
                />
                {errors.email && (
                  <p className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-lg border border-destructive/20">
                    {errors.email}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: "" });
                  }}
                  disabled={loading}
                  className="h-11 bg-muted/40 border-muted-foreground/20 focus:border-primary/50 transition-colors"
                />
                {errors.password && (
                  <p className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-lg border border-destructive/20">
                    {errors.password}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium"
                >
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword)
                      setErrors({ ...errors, confirmPassword: "" });
                  }}
                  disabled={loading}
                  className="h-11 bg-muted/40 border-muted-foreground/20 focus:border-primary/50 transition-colors"
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-lg border border-destructive/20">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 font-semibold shadow-lg shadow-primary/20 mt-2"
              >
                {loading ? <Spinner /> : "Create Account"}
              </Button>
            </form>
            <p className="text-sm text-center text-muted-foreground mt-6">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary font-medium hover:underline underline-offset-4"
              >
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
