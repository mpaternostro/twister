"use server";
import { setTheme } from "#lib/server/theme";

export async function setThemeAction(formData: FormData) {
  const theme = formData.get("theme") as "light" | "dark" | "system";
  return setTheme(theme);
}
