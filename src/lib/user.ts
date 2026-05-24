export const getInitials = (name?: string) => {
  if (!name) return "U";

  return name
    .trim()
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};
