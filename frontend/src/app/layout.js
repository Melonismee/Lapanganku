import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import AuthGate from "@/components/AuthGate";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Lapanganku",
  description: "Court booking app",
  icons: {
    icon: "/logo-icon.svg",
    shortcut: "/logo-icon.svg",
    apple: "/logo-icon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
      <html lang="en">
      <body className={jakarta.className}>
      <AuthGate>
        {children}
      </AuthGate>
      </body>
      </html>
  );
}
