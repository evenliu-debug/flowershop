import "./globals.css";

/** Root passes through; `[locale]/layout` provides `<html>` / `<body>` (next-intl). */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
