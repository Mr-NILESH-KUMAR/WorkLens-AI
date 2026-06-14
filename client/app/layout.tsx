import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Worklens AI",
  description: "Enterprise Workforce Risk Analytics Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: "#0B0F19", margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}