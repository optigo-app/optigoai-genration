import { Poppins } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import ThemeRegistry from "@/components/ThemeRegistry";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";

const poppins = Poppins({
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  fallback: [
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Helvetica Neue",
    "sans-serif",
  ],
});

export const metadata = {
  title: "Optigo Ai Genration",
  description: "Optigo Ai Genration",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.svg" },
      { url: "/icon1.png", type: "image/png" },
    ],
    shortcut: "/favicon.svg",
    apple: "/apple-icon.png",
  },
  other: {
    "theme-color": "#7367f0",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var mode = localStorage.getItem('theme-mode') || 'light';
                  var bg = mode === 'light' ? '#f4f4f6' : '#0f0f0f';
                  document.body.style.backgroundColor = bg;
                  document.body.setAttribute('data-theme', mode);
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <AuthProvider>
          <ThemeRegistry>
            <ToastProvider>
              <Suspense fallback={null}>
                {children}
              </Suspense>
            </ToastProvider>
          </ThemeRegistry>
        </AuthProvider>
      </body>
    </html>
  );
}
