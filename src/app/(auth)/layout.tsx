import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Auth - Idea Tracker",
  description: "Authenticate to access Idea Tracker",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex items-center justify-center min-h-screen bg-gray-100 ${inter.className}`}
    >
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
