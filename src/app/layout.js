import Navbar from "./component/Navbar";
import Footer from "./component/footer";
import "./globals.css";

export const metadata = {
  title: "MovieApp",
  description: "Watch trending and popular movies",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
