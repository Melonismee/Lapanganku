"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { sendSupportMessage } from "@/features/support/supportService";
import MembershipPromoCard from "@/features/dashboard/MembershipPromoCard";

const initialMessages = [
    {
        role: "assistant",
        content: "Halo! Aku bisa bantu soal booking, membership, atau info lapangan. Tanyakan apa saja.",
    },
];

const WHATSAPP_NUMBER = "62895340719657";

const buildWhatsAppUrl = (message) => {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

export default function SupportPage() {
    const [messages, setMessages] = useState(initialMessages);
    const [input, setInput] = useState("");
    const [isSending, setIsSending] = useState(false);

    const handleSubmit = async event => {
        event.preventDefault();

        const trimmed = input.trim();
        if (!trimmed || isSending) {
            return;
        }

        setInput("");
        setMessages(prev => [...prev, { role: "user", content: trimmed }]);
        setIsSending(true);

        try {
            const response = await sendSupportMessage(trimmed);
            const reply = response?.reply || "Maaf, aku belum bisa menjawab sekarang.";

            setMessages(prev => [...prev, { role: "assistant", content: reply }]);
        } catch (error) {
            setMessages(prev => [
                ...prev,
                {
                    role: "assistant",
                    content: "Maaf, terjadi kendala. Coba lagi beberapa saat ya.",
                },
            ]);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="max-w-5xl mx-auto px-6 py-10">
                <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                    <p className="text-green-600 font-bold text-sm">Support</p>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mt-2">
                        Chat Bantuan
                    </h1>
                    <p className="text-gray-600 mt-3">
                        Tanyakan apa saja seputar booking dan layanan Lapanganku.
                    </p>

                    <div className="mt-8 border border-gray-100 rounded-2xl bg-slate-50 p-6">
                        <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
                            {messages.map((message, index) => (
                                <div
                                    key={`${message.role}-${index}`}
                                    className={
                                        message.role === "user"
                                            ? "flex justify-end"
                                            : "flex justify-start"
                                    }
                                >
                                    <div
                                        className={
                                            message.role === "user"
                                                ? "bg-green-500 text-white rounded-2xl px-4 py-3 text-sm max-w-[80%] whitespace-pre-wrap break-words"
                                                : "bg-white text-slate-800 rounded-2xl border border-gray-100 px-4 py-3 text-sm max-w-[80%] whitespace-pre-wrap break-words"
                                        }
                                    >
                                        {message.content}
                                    </div>
                                </div>
                            ))}

                            {isSending && (
                                <div className="flex justify-start">
                                    <div className="bg-white text-slate-800 rounded-2xl border border-gray-100 px-4 py-3 text-sm">
                                        Mengetik...
                                    </div>
                                </div>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="mt-6 flex gap-3">
                            <input
                                type="text"
                                value={input}
                                onChange={event => setInput(event.target.value)}
                                placeholder="Tulis pertanyaan..."
                                className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                            <button
                                type="submit"
                                disabled={isSending || !input.trim()}
                                className="rounded-xl bg-green-500 px-6 py-3 text-sm font-bold text-white hover:bg-green-600 disabled:opacity-50"
                            >
                                Kirim
                            </button>
                        </form>
                    </div>
                </section>

                <section className="mt-8">
                    <MembershipPromoCard />
                </section>

                <section className="mt-8 bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                    <p className="text-green-600 font-bold text-sm">
                        Contact Perusahaan
                    </p>

                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 mt-2">
                        Untuk Owner Lapangan
                    </h2>

                    <p className="text-gray-600 mt-3">
                        Jika kamu pemilik lapangan dan ingin menambahkan lapangan ke
                        Lapanganku atau ingin mempromosikan lapangan di bagian
                        Recommendation, silakan hubungi admin perusahaan.
                    </p>

                    <div className="mt-8 border border-gray-100 rounded-2xl bg-slate-50 p-6">
                        <div className="rounded-2xl bg-white text-slate-800 border border-gray-100 px-4 py-3 text-sm">
                            Kami membuka kerja sama untuk owner lapangan yang ingin
                            mendaftarkan lapangannya ke Lapanganku atau mempromosikan
                            lapangannya agar tampil di dashboard user.
                        </div>

                        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="rounded-2xl bg-white border border-gray-100 px-5 py-4">
                                <p className="text-sm font-bold text-green-600">
                                    Tambahkan Lapangan
                                </p>

                                <p className="mt-2 text-sm text-gray-600">
                                    Hubungi admin untuk mendaftarkan lapangan agar bisa
                                    tampil dan dibooking melalui Lapanganku.
                                </p>
                            </div>

                            <div className="rounded-2xl bg-white border border-gray-100 px-5 py-4">
                                <p className="text-sm font-bold text-green-600">
                                    Promosi Lapangan
                                </p>

                                <p className="mt-2 text-sm text-gray-600">
                                    Ajukan promosi agar lapangan tampil di bagian
                                    Recommendation pada dashboard user. Harga promosi
                                    mulai dari Rp 39.900 per hari.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 rounded-2xl bg-white border border-gray-100 px-5 py-4">
                            <p className="text-sm font-bold text-gray-500">
                                Kontak Admin
                            </p>

                            <p className="mt-2 font-black text-slate-900">
                                admin@lapanganku.com
                            </p>

                            <p className="mt-1 text-gray-600">
                                WhatsApp: 895-3407-19657
                            </p>
                        </div>

                        <div className="mt-6 flex flex-col gap-3 md:flex-row">
                            <a
                                href={buildWhatsAppUrl(
                                    "Halo Admin Lapanganku, saya dari [nama usaha/owner] ingin menambahkan lapangan ke platform Lapanganku.\n\nNama lapangan:\nLokasi:\nJenis olahraga:\nJumlah lapangan:\nKontak owner:\n\nMohon informasi langkah pendaftarannya. Terima kasih."
                                )}
                                target="_blank"
                                rel="noreferrer"
                                className="flex-1 rounded-xl bg-green-500 px-6 py-3 text-center text-sm font-bold text-white hover:bg-green-600"
                            >
                                Tambahkan Lapangan
                            </a>

                            <a
                                href={buildWhatsAppUrl(
                                    "Halo Admin Lapanganku, saya dari [nama usaha/owner] ingin mengajukan promosi lapangan di Lapanganku.\n\nNama lapangan:\nLokasi:\nJenis promosi yang diinginkan:\nPeriode promosi:\nBudget promosi: Rp 39.900 per hari\nKontak owner:\n\nMohon informasi paket dan ketentuannya. Terima kasih."
                                )}
                                target="_blank"
                                rel="noreferrer"
                                className="flex-1 rounded-xl bg-slate-900 px-6 py-3 text-center text-sm font-bold text-white hover:bg-green-600"
                            >
                                Ajukan Promosi
                            </a>
                        </div>
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    );
}
