"use client";

import { useParams, useRouter } from "next/navigation";
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
    assigned_to: string | null;
    created_at: string;
    updated_at: string;
    resolved_at: string | null;
};

export default function TicketDetailsPage() {
    const params = useParams();
    const router = useRouter();

    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadTicket();
    }, []);

    async function loadTicket() {
        try {
            const response = await fetch(
                `${API_URL}/tickets/${params.id}`,
                {
                    credentials: "include",
                }
            );

            if (!response.ok) {
                throw new Error("Ticket not found.");
            }

            const data = await response.json();
            setTicket(data);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to load ticket."
            );
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <main className="min-h-screen bg-[#020617] text-white">
                <div className="mx-auto max-w-5xl px-6 py-16 text-center text-slate-400">
                    Loading ticket...
                </div>
            </main>
        );
    }

    if (error || !ticket) {
        return (
            <main className="min-h-screen bg-[#020617] text-white">
                <div className="mx-auto max-w-5xl px-6 py-16">
                    <p className="text-red-400">
                        {error || "Ticket not found."}
                    </p>

                    <button
                        onClick={() => router.push("/tickets")}
                        className="mt-5 rounded-xl border border-slate-700 px-5 py-3 text-sm"
                    >
                        ← Back to Tickets
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#020617] text-white">
            {/* Header */}
            <header className="border-b border-slate-800 px-8 py-4">
                <div className="mx-auto flex max-w-5xl items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold">
                            Veridian
                        </h1>

                        <p className="text-xs text-slate-400">
                            Internal IT Support
                        </p>
                    </div>

                    <button
                        onClick={() => router.push("/tickets")}
                        className="text-sm text-slate-300 hover:text-white"
                    >
                        ← My Tickets
                    </button>
                </div>
            </header>

            <section className="mx-auto max-w-5xl px-6 py-10">
                {/* Title */}
                <div className="mb-8">
                    <p className="font-mono text-sm text-blue-400">
                        {ticket.ticket_number}
                    </p>

                    <h2 className="mt-2 text-3xl font-bold">
                        {ticket.title}
                    </h2>

                    <p className="mt-2 text-slate-400">
                        Submitted on{" "}
                        {new Date(
                            ticket.created_at
                        ).toLocaleString()}
                    </p>
                </div>

                {/* Status */}
                <div className="grid gap-5 md:grid-cols-3">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                        <p className="text-xs uppercase text-slate-500">
                            Status
                        </p>

                        <p className="mt-2 text-lg font-semibold capitalize text-blue-400">
                            {ticket.status.replace(/_/g, " ")}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                        <p className="text-xs uppercase text-slate-500">
                            Priority
                        </p>

                        <p className="mt-2 text-lg font-semibold capitalize text-yellow-400">
                            {ticket.priority}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                        <p className="text-xs uppercase text-slate-500">
                            Category
                        </p>

                        <p className="mt-2 text-lg font-semibold capitalize">
                            {ticket.category}
                        </p>
                    </div>
                </div>

                {/* Description */}
                <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                    <h3 className="text-lg font-semibold">
                        Issue Description
                    </h3>

                    <p className="mt-4 leading-7 text-slate-300">
                        {ticket.description}
                    </p>
                </div>

                {/* Assignment */}
                <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                    <h3 className="text-lg font-semibold">
                        Assignment
                    </h3>

                    <p className="mt-3 text-sm text-slate-400">
                        {ticket.assigned_to
                            ? `Assigned to IT staff: ${ticket.assigned_to}`
                            : "Not assigned yet"}
                    </p>
                </div>

                {/* Resolution */}
                <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                    <h3 className="text-lg font-semibold">
                        Resolution
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-400">
                        {ticket.resolution ||
                            "No resolution has been provided yet."}
                    </p>
                </div>

                {/* Actions */}
                <div className="mt-8 flex gap-3">
                    <button
                        onClick={() => router.push("/tickets")}
                        className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold hover:border-slate-500"
                    >
                        ← Back to Tickets
                    </button>

                    <button
                        onClick={() => router.push("/chat")}
                        className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold hover:bg-blue-500"
                    >
                        Ask IT Support
                    </button>
                </div>
            </section>
        </main>
    );
}