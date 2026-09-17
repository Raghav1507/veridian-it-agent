"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

type Ticket = {
    id: string;
    ticket_number: string;
    user_id: string;
    assigned_to: string | null;
    title: string;
    description: string;
    category: string;
    priority: string;
    status: string;
    source: string;
    resolution: string | null;
    created_at: string;
};

export default function AdminPage() {
    const router = useRouter();

    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadTickets();
    }, []);

    async function loadTickets() {
        try {
            const response = await fetch(`${API_URL}/admin/tickets`, {
                credentials: "include",
            });

            if (response.status === 403) {
                setError("You do not have permission to access the admin dashboard.");
                return;
            }

            if (!response.ok) {
                throw new Error("Failed to load tickets.");
            }

            const data = await response.json();
            setTickets(data);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    }

    function statusClass(status: string) {
        if (status === "resolved" || status === "closed") {
            return "text-emerald-400";
        }

        if (status === "in_progress") {
            return "text-yellow-400";
        }

        return "text-blue-400";
    }

    function priorityClass(priority: string) {
        if (priority === "critical" || priority === "high") {
            return "text-red-400";
        }

        if (priority === "medium") {
            return "text-yellow-400";
        }

        return "text-slate-300";
    }

    return (
        <main className="min-h-screen bg-[#020617] text-white">
            {/* Header */}
            <header className="border-b border-slate-800 px-8 py-4">
                <div className="mx-auto flex max-w-6xl items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold">
                            Veridian
                        </h1>

                        <p className="text-xs text-slate-400">
                            IT Administration
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

            <section className="mx-auto max-w-6xl px-6 py-10">
                {/* Heading */}
                <div className="mb-8">
                    <p className="text-sm font-medium text-blue-400">
                        ADMINISTRATION
                    </p>

                    <h2 className="mt-2 text-3xl font-bold">
                        IT Support Tickets
                    </h2>

                    <p className="mt-2 text-slate-400">
                        Review and manage employee support requests.
                    </p>
                </div>

                {/* Stats */}
                <div className="mb-8 grid gap-5 md:grid-cols-3">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                        <p className="text-sm text-slate-400">
                            Total Tickets
                        </p>

                        <p className="mt-2 text-3xl font-bold">
                            {tickets.length}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                        <p className="text-sm text-slate-400">
                            Open
                        </p>

                        <p className="mt-2 text-3xl font-bold text-blue-400">
                            {
                                tickets.filter(
                                    (t) =>
                                        t.status === "open" ||
                                        t.status === "in_progress"
                                ).length
                            }
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                        <p className="text-sm text-slate-400">
                            Resolved
                        </p>

                        <p className="mt-2 text-3xl font-bold text-emerald-400">
                            {
                                tickets.filter(
                                    (t) =>
                                        t.status === "resolved" ||
                                        t.status === "closed"
                                ).length
                            }
                        </p>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="rounded-xl border border-red-900 bg-red-950/30 p-5 text-red-400">
                        {error}
                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <div className="py-10 text-center text-slate-400">
                        Loading tickets...
                    </div>
                )}

                {/* Tickets */}
                {!loading && !error && (
                    <div className="space-y-4">
                        {tickets.length === 0 ? (
                            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-10 text-center text-slate-400">
                                No tickets found.
                            </div>
                        ) : (
                            tickets.map((ticket) => (
                                <div
                                    key={ticket.id}
                                    className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6"
                                >
                                    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <span className="font-mono text-sm text-blue-400">
                                                    {ticket.ticket_number}
                                                </span>

                                                <span
                                                    className={`text-sm font-medium capitalize ${statusClass(
                                                        ticket.status
                                                    )}`}
                                                >
                                                    {ticket.status.replace(
                                                        /_/g,
                                                        " "
                                                    )}
                                                </span>
                                            </div>

                                            <h3 className="mt-2 text-lg font-semibold">
                                                {ticket.title}
                                            </h3>

                                            <p className="mt-2 text-sm text-slate-400">
                                                {ticket.description}
                                            </p>

                                            <div className="mt-4 flex flex-wrap gap-5 text-xs">
                                                <span>
                                                    Category:{" "}
                                                    <strong className="text-slate-200">
                                                        {ticket.category}
                                                    </strong>
                                                </span>

                                                <span>
                                                    Priority:{" "}
                                                    <strong
                                                        className={priorityClass(
                                                            ticket.priority
                                                        )}
                                                    >
                                                        {ticket.priority}
                                                    </strong>
                                                </span>

                                                <span>
                                                    Created:{" "}
                                                    <strong className="text-slate-200">
                                                        {new Date(
                                                            ticket.created_at
                                                        ).toLocaleDateString()}
                                                    </strong>
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() =>
                                                router.push(
                                                    `/admin/tickets/${ticket.id}`
                                                )
                                            }
                                            className="shrink-0 rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold hover:border-blue-500 hover:text-blue-400"
                                        >
                                            View Ticket →
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </section>
        </main>
    );
}