import "./globals.css";
import Providers from "./components/Provider/Providers";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "OKM บริการจองคิวออนไลน์ ",
  description: "ระบบบริการจองคิวออนไลน์สำหรับลูกค้า",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <Providers suppressHydrationWarning>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
