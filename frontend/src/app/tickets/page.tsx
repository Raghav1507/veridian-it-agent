"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

type Ticket = {
    id: string;
    ticket_number: string;
    title: string;
    description: string;
    category: string;
    priority: string;
    status: string;
    source: string;
    resolution: string | null;
    created_at: string;
    updated_at: string;
    resolved_at: string | null;
};

export default function TicketsPage() {
    const router = useRouter();

    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadTickets();
    }, []);

    async function loadTickets() {
        try {
            const response = await fetch(`${API_URL}/tickets`, {
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Unable to load tickets.");
            }

            const data = await response.json();
            setTickets(data);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to load tickets."
            );
        } finally {
            setLoading(false);
        }
    }

    function statusStyle(status: string) {
        switch (status) {
            case "open":
                return "bg-blue-500/10 text-blue-400 border-blue-500/20";

            case "in_progress":
                return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";

            case "waiting_for_employee":
                return "bg-purple-500/10 text-purple-400 border-purple-500/20";

            case "resolved":
                return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";

            case "closed":
                return "bg-slate-500/10 text-slate-400 border-slate-500/20";

            default:
                return "bg-slate-500/10 text-slate-400 border-slate-500/20";
        }
    }

    function priorityStyle(priority: string) {
        switch (priority) {
            case "critical":
                return "text-red-400";

            case "high":
                return "text-orange-400";

            case "medium":
                return "text-yellow-400";

            case "low":
                return "text-emerald-400";

            default:
                return "text-slate-400";
        }
    }

    return (
        <main className="min-h-screen bg-[#020617] text-white">
            {/* HEADER */}
            <header className="border-b border-slate-800 px-8 py-4">
                <div className="mx-auto flex max-w-6xl items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold">
                            Veridian
                        </h1>

                        <p className="text-xs text-slate-400">
                            Internal IT Support
                        </p>
                    </div>

                    <button
                        onClick={() => router.push("/dashboard")}
                        className="text-sm text-slate-300 hover:text-white"
                    >
                        ← Dashboard
                    </button>
                </div>
            </header>

            {/* CONTENT */}
            <section className="mx-auto max-w-6xl px-6 py-10">
                <div className="mb-8 flex items-end justify-between">
                    <div>
                        <p className="text-sm font-medium text-blue-400">
                            SUPPORT REQUESTS
                        </p>

                        <h2 className="mt-2 text-3xl font-bold">
                            My Tickets
                        </h2>

                        <p className="mt-2 text-slate-400">
                            View and track your IT support requests.
                        </p>
                    </div>

                    <button
                        onClick={() => router.push("/chat")}
                        className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold hover:bg-blue-500"
                    >
                        + New Request
                    </button>
                </div>

                {/* LOADING */}
                {loading && (
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-10 text-center text-slate-400">
                        Loading tickets...
                    </div>
                )}

                {/* ERROR */}
                {!loading && error && (
                    <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-red-400">
                        {error}
                    </div>
                )}

                {/* EMPTY */}
                {!loading && !error && tickets.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-16 text-center">
                        <div className="text-4xl">🎫</div>

                        <h3 className="mt-4 text-lg font-semibold">
                            No tickets yet
                        </h3>

                        <p className="mt-2 text-sm text-slate-400">
                            Start a conversation with the IT Support Agent
                            to create your first request.
                        </p>

                        <button
                            onClick={() => router.push("/chat")}
                            className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold hover:bg-blue-500"
                        >
                            Ask IT Support
                        </button>
                    </div>
                )}

                {/* TICKETS */}
                {!loading && !error && tickets.length > 0 && (
                    <div className="space-y-4">
                        {tickets.map((ticket) => (
                            <div
                                key={ticket.id}
                                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition hover:border-slate-700"
                            >
                                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <span className="font-mono text-sm text-blue-400">
                                                {ticket.ticket_number}
                                            </span>

                                            <span
                                                className={`rounded-full border px-3 py-1 text-xs font-medium ${statusStyle(
                                                    ticket.status
                                                )}`}
                                            >
                                                {ticket.status.replace(
                                                    /_/g,
                                                    " "
                                                )}
                                            </span>
                                        </div>

                                        <h3 className="mt-3 text-lg font-semibold">
                                            {ticket.title}
                                        </h3>

                                        <p className="mt-2 text-sm leading-6 text-slate-400">
                                            {ticket.description}
                                        </p>

                                        <div className="mt-5 flex flex-wrap gap-5 text-xs">
                                            <div>
                                                <span className="text-slate-500">
                                                    Category
                                                </span>

                                                <span className="ml-2 text-slate-300">
                                                    {ticket.category}
                                                </span>
                                            </div>

                                            <div>
                                                <span className="text-slate-500">
                                                    Priority
                                                </span>

                                                <span
                                                    className={`ml-2 font-medium ${priorityStyle(
                                                        ticket.priority
                                                    )}`}
                                                >
                                                    {ticket.priority}
                                                </span>
                                            </div>

                                            <div>
                                                <span className="text-slate-500">
                                                    Created
                                                </span>

                                                <span className="ml-2 text-slate-300">
                                                    {new Date(
                                                        ticket.created_at
                                                    ).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>

                                        {ticket.resolution && (
                                            <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                                                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-400">
                                                    Resolution
                                                </p>

                                                <p className="mt-2 text-sm text-slate-300">
                                                    {ticket.resolution}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={() =>
                                            router.push(
                                                `/tickets/${ticket.id}`
                                            )
                                        }
                                        className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-blue-500 hover:text-white"
                                    >
                                        View Details →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}