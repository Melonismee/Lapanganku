"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AdminNavbar from "@/components/AdminNavbar";
import { getUser } from "@/features/auth/authService";
import { getAdminUsers } from "@/features/admin/adminUserService";

export default function AdminUsersPage() {
    const router = useRouter();

    const [checkingAuth, setCheckingAuth] = useState(true);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const userResponse = await getUser();
                const user = userResponse.data?.user || userResponse.data || userResponse;

                if (user.role !== "admin") {
                    router.push("/dashboard");
                    return;
                }

                const response = await getAdminUsers();
                setUsers(response.data.users || []);
            } catch (error) {
                console.log("ADMIN USERS ERROR:", error.response || error);
                router.push("/login");
            } finally {
                setCheckingAuth(false);
            }
        };

        loadData();
    }, [router]);

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    if (checkingAuth) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-100">
                <p className="font-semibold text-gray-600">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100">
            <AdminNavbar />

            <main className="mx-auto max-w-7xl p-8">
                <button
                    onClick={() => router.push("/admin/dashboard")}
                    className="mb-6 rounded-xl  px-4 py-2 text-sm font-bold text-gray-600 transition hover:text-green-600"
                >
                    ← Kembali ke Dashboard
                </button>

                <div className="mb-8">

                    <h1 className="mt-2 text-4xl font-black text-slate-950">
                        Kelola User
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Lihat data user, role, dan status membership.
                    </p>
                </div>

                <section className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead>
                            <tr className="border-b border-gray-200 text-sm text-gray-500">
                                <th className="py-3 pr-4">Nama</th>
                                <th className="py-3 pr-4">Email</th>
                                <th className="py-3 pr-4">Role</th>
                                <th className="py-3 pr-4">Membership</th>
                                <th className="py-3 pr-4">Aktif Sampai</th>
                                <th className="py-3 pr-4">Tanggal Daftar</th>
                            </tr>
                            </thead>

                            <tbody>
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="border-b border-gray-100 text-sm"
                                    >
                                        <td className="py-4 pr-4 font-bold text-slate-900">
                                            {user.name}
                                        </td>

                                        <td className="py-4 pr-4 text-gray-600">
                                            {user.email}
                                        </td>

                                        <td className="py-4 pr-4">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                                                        user.role === "admin"
                                                            ? "bg-slate-900 text-white"
                                                            : "bg-gray-100 text-gray-700"
                                                    }`}
                                                >
                                                    {user.role}
                                                </span>
                                        </td>

                                        <td className="py-4 pr-4">
                                            {user.membership_active ? (
                                                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                                                        Member Aktif
                                                    </span>
                                            ) : (
                                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600">
                                                        Bukan Member
                                                    </span>
                                            )}
                                        </td>

                                        <td className="py-4 pr-4 text-gray-600">
                                            {formatDate(user.membership_until)}
                                        </td>

                                        <td className="py-4 pr-4 text-gray-600">
                                            {formatDate(user.created_at)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="py-8 text-center text-gray-500"
                                    >
                                        Belum ada data user.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    );
}