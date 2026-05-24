import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function DashboardLayout({ children }) {
    return (
        <div className="bg-[#f5f8f6] min-h-screen">
            <Navbar />
            {children}
            <Footer />
        </div>
    );
}