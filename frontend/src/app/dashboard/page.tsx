"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
    Activity,
    AlertCircle,
    ArrowRight,
    Bot,
    CheckCircle2,
    Clock,
    LogOut,
    ShieldCheck,
    Ticket,
} from "lucide-react";

import api from "@/lib/api";

type User = {
    id: string;
    email: string;
    full_name: string;
    role: string;
    is_active: boolean;
};

type TicketType = {
    id: string;
    ticket_number: string;
    title: string;
    category: string;
    priority: string;
    status: string;
    created_at: string;
};

export default function Dashboard() {
    const router = useRouter();

    const [user, setUser] = useState<User | null>(null);
    const [tickets, setTickets] = useState<TicketType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadDashboard() {
            try {
                const [userResponse, ticketResponse] = await Promise.all([
                    api.get("/auth/me"),
                    api.get("/tickets"),
                ]);

                setUser(userResponse.data);
                setTickets(ticketResponse.data);
            } catch {
                router.push("/login");
            } finally {
                setLoading(false);
            }
        }

        loadDashboard();
    }, [router]);

    async function logout() {
        try {
            await api.post("/auth/logout");
        } finally {
            router.push("/login");
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
                Loading Veridian...
            </div>
        );
    }

    const openTickets = tickets.filter(
        (ticket) => ticket.status === "open"
    ).length;

    const resolvedTickets = tickets.filter(
        (ticket) => ticket.status === "resolved"
    ).length;

    return (
        <main className="min-h-screen bg-slate-950 text-white">

            {/* Header */}

            <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
                            <ShieldCheck size={21} />
                        </div>

                        <div>
                            <p className="font-bold">Veridian</p>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest">
                                IT Support
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-5">
                        <div className="hidden sm:block text-right">
                            <p className="text-sm font-medium">
                                {user?.full_name}
                            </p>
                            <p className="text-xs text-slate-500">
                                {user?.role}
                            </p>
                        </div>

                        <button
                            onClick={logout}
                            className="text-slate-400 hover:text-white transition"
                            title="Logout"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>

                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-10">

                {/* Greeting */}

                <section className="mb-10">
                    <p className="text-blue-400 text-sm font-medium mb-2">
                        INTERNAL IT SUPPORT
                    </p>

                    <h1 className="text-4xl font-bold">
                        Good evening, {user?.full_name?.split(" ")[0]}.
                    </h1>

                    <p className="text-slate-400 mt-2">
                        How can we help you today?
                    </p>
                </section>

                {/* AI Assistant */}

                <Link href="/chat">
                    <section className="group rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-7 mb-8 cursor-pointer hover:scale-[1.01] transition">

                        <div className="flex items-start justify-between">

                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center mb-5">
                                    <Bot size={26} />
                                </div>

                                <h2 className="text-2xl font-bold">
                                    Ask the IT Support Agent
                                </h2>

                                <p className="text-blue-100 mt-2 max-w-xl">
                                    Describe your IT problem and our support agent will
                                    help diagnose the issue, find the relevant policy,
                                    and create a ticket when necessary.
                                </p>
                            </div>

                            <ArrowRight
                                className="group-hover:translate-x-2 transition"
                                size={28}
                            />

                        </div>

                        <div className="mt-6 bg-white/10 rounded-xl px-5 py-4 text-sm text-blue-100">
                            Try: “My VPN isn't connecting” or “I need access to a software license”
                        </div>

                    </section>
                </Link>

                {/* Stats */}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

                    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
                        <div className="flex justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">
                                    Total tickets
                                </p>
                                <p className="text-3xl font-bold mt-2">
                                    {tickets.length}
                                </p>
                            </div>

                            <Ticket className="text-blue-400" />
                        </div>
                    </div>

                    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
                        <div className="flex justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">
                                    Open tickets
                                </p>
                                <p className="text-3xl font-bold mt-2">
                                    {openTickets}
                                </p>
                            </div>

                            <Clock className="text-amber-400" />
                        </div>
                    </div>

                    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
                        <div className="flex justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">
                                    Resolved
                                </p>
                                <p className="text-3xl font-bold mt-2">
                                    {resolvedTickets}
                                </p>
                            </div>

                            <CheckCircle2 className="text-emerald-400" />
                        </div>
                    </div>

                </div>

                {/* Navigation */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">

                    <Link
                        href="/tickets"
                        className="rounded-2xl bg-slate-900 border border-slate-800 p-6 hover:border-slate-600 transition"
                    >
                        <Ticket className="text-blue-400 mb-4" />

                        <h3 className="font-semibold text-lg">
                            My Tickets
                        </h3>

                        <p className="text-sm text-slate-400 mt-1">
                            View and track your IT support requests.
                        </p>
                    </Link>

                    <Link
                        href="/audit"
                        className="rounded-2xl bg-slate-900 border border-slate-800 p-6 hover:border-slate-600 transition"
                    >
                        <Activity className="text-purple-400 mb-4" />

                        <h3 className="font-semibold text-lg">
                            Activity & Audit Trail
                        </h3>

                        <p className="text-sm text-slate-400 mt-1">
                            See actions and events associated with your requests.
                        </p>
                    </Link>

                </div>

                {/* Recent tickets */}

                <section>
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-xl font-semibold">
                            Recent tickets
                        </h2>

                        <Link
                            href="/tickets"
                            className="text-sm text-blue-400 hover:text-blue-300"
                        >
                            View all
                        </Link>
                    </div>

                    {tickets.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-700 p-10 text-center">
                            <AlertCircle className="mx-auto text-slate-600 mb-3" />
                            <p className="text-slate-400">
                                You don't have any tickets yet.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {tickets.slice(0, 5).map((ticket) => (
                                <Link
                                    key={ticket.id}
                                    href={`/tickets/${ticket.id}`}
                                    className="block rounded-xl bg-slate-900 border border-slate-800 p-5 hover:border-slate-600 transition"
                                >
                                    <div className="flex items-center justify-between">

                                        <div>
                                            <p className="text-xs text-blue-400 font-mono">
                                                {ticket.ticket_number}
                                            </p>

                                            <p className="font-medium mt-1">
                                                {ticket.title}
                                            </p>

                                            <p className="text-xs text-slate-500 mt-1">
                                                {ticket.category}
                                            </p>
                                        </div>

                                        <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-300">
                                            {ticket.status.replaceAll("_", " ")}
                                        </span>

                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                </section>

            </div>
        </main>
    );
}