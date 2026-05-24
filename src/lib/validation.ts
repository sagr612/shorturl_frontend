export const validation = {
  isValidUrl: (url: string): boolean => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  },

  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isValidPassword: (password: string): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (password.length < 6) {
      errors.push("Password must be at least 6 characters");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  isValidName: (name: string): boolean => {
    return name.trim().length >= 2 && name.trim().length <= 100;
  },
};

export function getValidationErrorMessage(
  field: string,
  type: string
): string {
  const messages: Record<string, Record<string, string>> = {
    email: {
      invalid: "Please enter a valid email address",
      required: "Email is required",
    },
    password: {
      invalid: "Password must be at least 6 characters",
      required: "Password is required",
      mismatch: "Passwords do not match",
    },
    url: {
      invalid: "Please enter a valid HTTPS URL",
      required: "URL is required",
    },
    name: {
      invalid: "Name must be between 2 and 100 characters",
      required: "Name is required",
    },
  };

  return messages[field]?.[type] || "Invalid input";
}
