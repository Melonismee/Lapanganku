import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Lapanganku",
  description: "Court booking app",
};

export default function RootLayout({ children }) {
  return (
      <html lang="en">
      <body className={jakarta.className}>
      {children}
      </body>
      </html>
  );
}