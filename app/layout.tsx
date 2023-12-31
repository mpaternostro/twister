import "./globals.css";

import { ClientHintCheck } from "#lib/client-hints";
import { getTheme } from "#lib/server/theme";

export const metadata = {
  title: "Twister",
  description: "Twitter clone",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = await getTheme();

  return (
    <html lang="en" className={theme === "dark" ? "dark" : ""}>
      <head>
        <ClientHintCheck nonce="" />
      </head>
      <body>{children}</body>
    </html>
  );
}
