"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { sendSupportMessage } from "@/features/support/supportService";

const initialMessages = [
    {
        role: "assistant",
        content: "Halo! Aku bisa bantu soal booking, membership, atau info lapangan. Tanyakan apa saja.",
    },
];

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
                                                ? "bg-green-500 text-white rounded-2xl px-4 py-3 text-sm max-w-[80%]"
                                                : "bg-white text-slate-800 rounded-2xl border border-gray-100 px-4 py-3 text-sm max-w-[80%]"
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
            </main>

            <Footer />
        </div>
    );
}
