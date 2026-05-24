import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { JwtPayload } from "../types/url";
import { jwtDecode } from "jwt-decode";
import { authService } from "../services/authService";

interface AuthContextType {
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  userId: string | null;
  email: string | null;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        setUserId(decoded.userId);
        setEmail(decoded.sub);
        setIsAdmin(decoded.role === "ROLE_ADMIN");
      } catch {
        logout();
      }
    }

    setIsInitialized(true);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authService.login(email, password);

    localStorage.setItem("accessToken", res.accessToken);
    localStorage.setItem("refreshToken", res.token);

    const decoded = jwtDecode<JwtPayload>(res.accessToken);

    setEmail(decoded.sub);
    setUserId(decoded.userId);
    setIsAdmin(decoded.role === "ROLE_ADMIN");
  };

  const signup = async (email: string, password: string, name: string) => {
    const res = await authService.signup(email, password, name);

    localStorage.setItem("accessToken", res.accessToken);
    localStorage.setItem("refreshToken", res.token);

    const decoded = jwtDecode<JwtPayload>(res.accessToken);

    setEmail(decoded.sub);
    setUserId(decoded.userId);
    setIsAdmin(decoded.role === "ROLE_ADMIN");
  };

  const logout = () => {
    localStorage.clear();
    setEmail(null);
    setUserId(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!email,
        isInitialized,
        login,
        signup,
        logout,
        userId,
        email,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
