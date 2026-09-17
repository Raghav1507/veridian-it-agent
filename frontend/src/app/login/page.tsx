"use client";

import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import api from "@/lib/api";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleLogin(event: FormEvent) {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            await api.post("/auth/login", {
                email,
                password,
            });

            router.push("/dashboard");
        } catch (err: any) {
            setError(
                err?.response?.data?.detail ||
                "Unable to sign in. Please check your credentials."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
            <div className="w-full max-w-md">

                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 mb-4 shadow-lg shadow-blue-600/20">
                        <ShieldCheck size={30} />
                    </div>

                    <h1 className="text-3xl font-bold text-white">
                        Veridian
                    </h1>

                    <p className="text-slate-400 mt-2">
                        Internal IT Support
                    </p>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-2xl">

                    <div className="mb-7">
                        <h2 className="text-2xl font-semibold text-slate-900">
                            Welcome back
                        </h2>

                        <p className="text-slate-500 mt-1">
                            Sign in to your employee account.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Work email
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@veridian.com"
                                required
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Password
                            </label>

                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-12 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                                >
                                    {showPassword ? (
                                        <EyeOff size={20} />
                                    ) : (
                                        <Eye size={20} />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                            {loading && <Loader2 size={18} className="animate-spin" />}
                            {loading ? "Signing in..." : "Sign in"}
                        </button>

                    </form>

                    <p className="text-center text-sm text-slate-500 mt-6">
                        Don't have an account?{" "}
                        <Link
                            href="/register"
                            className="font-semibold text-blue-600 hover:text-blue-700"
                        >
                            Create one
                        </Link>
                    </p>

                </div>

                <p className="text-center text-xs text-slate-600 mt-6">
                    Protected internal employee system
                </p>

            </div>
        </main>
    );
}