import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { RewardProvider } from "@/contexts/RewardContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Edu-Space",
  description: "Your Space to Learn, Play & Build.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <RewardProvider>
            {children}
          </RewardProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
