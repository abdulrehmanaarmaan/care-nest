import { Geist, Geist_Mono} from "next/font/google";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/Footer";
import { Suspense } from "react";
import Loader from "./loading";
import AIAssistantButton from "../components/ai/AIAssistantButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Care Nest",
  description: "CareNest caregiving platform",
};

export default function RootLayout({ children }) {
  return (
    <div>
      <header>
        <Navbar />
      </header>

      <main className="bg-slate-50">
        <Suspense fallback={<Loader />}>
          {children}
        </Suspense>
      </main>

      <AIAssistantButton />

      <Footer />
    </div>
  );
}
