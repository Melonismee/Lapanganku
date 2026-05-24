"use client";

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-100">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">

                {/* LOGO */}
                <h1 className="font-black text-xl tracking-tight text-slate-900">
                    LAPANGANKU
                </h1>

                {/* MENU */}
                <nav className="flex gap-8 text-sm font-semibold">
                    <a className="text-green-500 border-b-2 border-green-500 pb-1">
                        Explore
                    </a>
                    <a className="text-gray-500 hover:text-black">
                        Bookings
                    </a>
                    <a className="text-gray-500 hover:text-black">
                        Support
                    </a>
                </nav>

                {/* RIGHT */}
                <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-gray-200" />
                </div>

            </div>
        </header>
    );
}