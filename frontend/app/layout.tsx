import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "../styles/globals.css";
import AuthProvider from "../components/AuthProvider";

const space = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: "OftalmoApp | Consultorio",
  description: "Gestión de pacientes y consultas para un consultorio oftalmológico."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={space.className}>
      <body>
        <div
          style={{
            minHeight: "100vh",
            background:
              "radial-gradient(800px circle at 20% 20%, rgba(124,58,237,0.18), transparent 40%), radial-gradient(600px circle at 80% 0%, rgba(6,182,212,0.12), transparent 35%)"
          }}
        >
          <AuthProvider>{children}</AuthProvider>
        </div>
      </body>
    </html>
  );
}
