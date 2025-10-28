import Footer from "@/components/utility/Footer";
import Navbar from "@/components/utility/Navbar";
import { AuthProvider } from "@/providers/auth-provider";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "@ant-design/v5-patch-for-react-19";
import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Dr. Md. Zohurul Islam - Professor of Mathematics",
  description:
    "Associate Professor in the Department of Mathematics at Jashore University of Science and Technology (JUST), Bangladesh. Specializing in Fluid Dynamics and Computational Mathematics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${merriweather.variable} font-sans antialiased`}
      >
        <AntdRegistry>
          <AuthProvider>
            <Navbar />
            {children}
            <Footer />
          </AuthProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
