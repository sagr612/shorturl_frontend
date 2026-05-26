import { publicApi } from "./api";

export const authService = {
  login: async (email: string, password: string) => {
    try {
      const res = await publicApi.post("/api/v1/auth/login", {
        email,
        password,
      });
      return res.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  signup: async (email: string, password: string, name: string) => {
    try {
      const res = await publicApi.post("/api/v1/auth/signup", {
        email,
        password,
        name,
      });
      return res.data;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  },

  forgotPassword: async (email: string) => {
    try {
      const res = await publicApi.post("/api/v1/auth/forgot-password", {
        email,
      });
      return res.data;
    } catch (error) {
      console.error("Forgot password error:", error);
      throw error;
    }
  },

  resetPassword: async (
    token: string,
    password: string,
  ) => {
    try {
      const res = await publicApi.post("/api/v1/auth/reset-password", {
        token,
        newPassword: password,
      });
      return res.data;
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
    }
  },
};
