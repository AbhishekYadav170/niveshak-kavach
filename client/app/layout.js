import "./globals.css";
import SwRegister from "./sw-register";

export const metadata = {
  title: "निवेशक कवच | Niveshak Kavach",
  description: "संदिग्ध निवेश संदेश को 10 सेकंड में जाँचें। Check suspicious investment messages in 10 seconds.",
  icons: { icon: "/icon-192.png", apple: "/icon-192.png" },
};

export const viewport = { width: "device-width", initialScale: 1, themeColor: "#7a1020" };

export default function RootLayout({ children }) {
  return (
    <html lang="hi">
      <body>
        <SwRegister />
        {children}
      </body>
    </html>
  );
}
