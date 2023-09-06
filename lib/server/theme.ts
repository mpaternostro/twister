"use server";
import { cookies } from "next/headers";

export type Theme = "light" | "dark";

const cookieNamePrefersColorScheme = "CH-prefers-color-scheme";
const cookieNameSelectedTheme = "en_theme";

export async function getTheme(): Promise<Theme> {
  const value =
    cookies().get(cookieNameSelectedTheme)?.value ??
    cookies().get(cookieNamePrefersColorScheme)?.value;
  if (value === "light" || value === "dark") {
    return value;
  }
  return "light";
}

export async function setTheme(theme: Theme | "system") {
  if (theme === "system") {
    // set empty to choose theme according to prefers color scheme
    cookies().set(cookieNameSelectedTheme, "", { path: "/", maxAge: -1 });
  } else {
    cookies().set(cookieNameSelectedTheme, theme, { path: "/" });
  }
}

export async function setPrefersColorScheme(theme: Theme) {
  cookies().set(cookieNamePrefersColorScheme, theme, { path: "/" });
}
