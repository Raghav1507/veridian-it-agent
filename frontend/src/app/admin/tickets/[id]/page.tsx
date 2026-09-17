"use client";

import { useParams, useRouter } from "next/navigation";
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
    updated_at: string;
    resolved_at: string | null;
};

export default function AdminTicketPage() {
    const params = useParams();
    const router = useRouter();

    const id = params.id as string;

    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [status, setStatus] = useState("");
    const [priority, setPriority] = useState("");
    const [assignedTo, setAssignedTo] = useState("");
    const [resolution, setResolution] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        loadTicket();
    }, [id]);

    async function loadTicket() {
        try {
            const response = await fetch(
                `${API_URL}/tickets/${id}`,
                {
                    credentials: "include",
                }
            );

            if (!response.ok) {
                throw new Error("Unable to load ticket.");
            }

            const data = await response.json();

            setTicket(data);
            setStatus(data.status);
            setPriority(data.priority);
            setAssignedTo(data.assigned_to || "");
            setResolution(data.resolution || "");
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

    async function saveChanges() {
        setSaving(true);
        setMessage("");
        setError("");

        try {
            const body: {
                status: string;
                priority: string;
                assigned_to?: string;
                resolution?: string;
            } = {
                status,
                priority,
            };

            if (assignedTo.trim()) {
                body.assigned_to = assignedTo.trim();
            }

            if (resolution.trim()) {
                body.resolution = resolution.trim();
            }

            const response = await fetch(
                `${API_URL}/tickets/${id}`,
                {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(body),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.detail || "Failed to update ticket."
                );
            }

            setTicket(data);
            setStatus(data.status);
            setPriority(data.priority);
            setAssignedTo(data.assigned_to || "");
            setResolution(data.resolution || "");

            setMessage("Ticket updated successfully.");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong."
            );
        } finally {
            setSaving(false);
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

    if (!ticket) {
        return (
            <main className="min-h-screen bg-[#020617] text-white">
                <div className="mx-auto max-w-5xl px-6 py-16">
                    <p className="text-red-400">
                        {error || "Ticket not found."}
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#020617] text-white">
            <header className="border-b border-slate-800 px-8 py-4">
                <div className="mx-auto flex max-w-5xl items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold">
                            Veridian
                        </h1>

                        <p className="text-xs text-slate-400">
                            IT Administration
                        </p>
                    </div>

                    <button
                        onClick={() => router.push("/admin")}
                        className="text-sm text-slate-300 hover:text-white"
                    >
                        ← All Tickets
                    </button>
                </div>
            </header>

            <section className="mx-auto max-w-5xl px-6 py-10">
                <p className="font-mono text-sm text-blue-400">
                    {ticket.ticket_number}
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                    {ticket.title}
                </h2>

                <p className="mt-2 text-slate-400">
                    Submitted{" "}
                    {new Date(ticket.created_at).toLocaleString()}
                </p>

                {/* Description */}
                <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                    <h3 className="font-semibold">
                        Issue Description
                    </h3>

                    <p className="mt-3 leading-7 text-slate-300">
                        {ticket.description}
                    </p>
                </div>

                {/* Ticket information */}
                <div className="mt-5 grid gap-5 md:grid-cols-3">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                        <p className="text-xs uppercase text-slate-500">
                            Category
                        </p>

                        <p className="mt-2 font-semibold capitalize">
                            {ticket.category}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                        <p className="text-xs uppercase text-slate-500">
                            Source
                        </p>

                        <p className="mt-2 font-semibold capitalize">
                            {ticket.source}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                        <p className="text-xs uppercase text-slate-500">
                            Ticket ID
                        </p>

                        <p className="mt-2 truncate font-mono text-xs text-slate-300">
                            {ticket.id}
                        </p>
                    </div>
                </div>

                {/* Admin controls */}
                <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                    <h3 className="text-lg font-semibold">
                        Manage Ticket
                    </h3>

                    <div className="mt-6 grid gap-5 md:grid-cols-2">
                        {/* Status */}
                        <div>
                            <label className="text-sm text-slate-400">
                                Status
                            </label>

                            <select
                                value={status}
                                onChange={(e) =>
                                    setStatus(e.target.value)
                                }
                                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                            >
                                <option value="open">
                                    Open
                                </option>

                                <option value="in_progress">
                                    In Progress
                                </option>

                                <option value="waiting_for_employee">
                                    Waiting for Employee
                                </option>

                                <option value="resolved">
                                    Resolved
                                </option>

                                <option value="closed">
                                    Closed
                                </option>
                            </select>
                        </div>

                        {/* Priority */}
                        <div>
                            <label className="text-sm text-slate-400">
                                Priority
                            </label>

                            <select
                                value={priority}
                                onChange={(e) =>
                                    setPriority(e.target.value)
                                }
                                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                            >
                                <option value="low">
                                    Low
                                </option>

                                <option value="medium">
                                    Medium
                                </option>

                                <option value="high">
                                    High
                                </option>

                                <option value="critical">
                                    Critical
                                </option>
                            </select>
                        </div>

                        {/* Assigned user */}
                        <div className="md:col-span-2">
                            <label className="text-sm text-slate-400">
                                Assign to IT Staff
                            </label>

                            <input
                                value={assignedTo}
                                onChange={(e) =>
                                    setAssignedTo(e.target.value)
                                }
                                placeholder="Enter IT staff user UUID"
                                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                            />

                            <p className="mt-2 text-xs text-slate-500">
                                Leave empty if the ticket is not assigned.
                            </p>
                        </div>

                        {/* Resolution */}
                        <div className="md:col-span-2">
                            <label className="text-sm text-slate-400">
                                Resolution
                            </label>

                            <textarea
                                value={resolution}
                                onChange={(e) =>
                                    setResolution(e.target.value)
                                }
                                rows={4}
                                placeholder="Describe how the issue was resolved..."
                                className="mt-2 w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {message && (
                        <div className="mt-5 rounded-xl border border-emerald-800 bg-emerald-950/30 p-4 text-sm text-emerald-400">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="mt-5 rounded-xl border border-red-800 bg-red-950/30 p-4 text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={saveChanges}
                        disabled={saving}
                        className="mt-6 rounded-xl bg-blue-600 px-7 py-3 font-semibold hover:bg-blue-500 disabled:opacity-50"
                    >
                        {saving
                            ? "Saving..."
                            : "Save Changes"}
                    </button>
                </div>
            </section>
        </main>
    );
}