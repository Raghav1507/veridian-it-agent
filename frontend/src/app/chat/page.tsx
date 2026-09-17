"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Message = {
    role: "user" | "agent";
    content: string;
};

type Ticket = {
    id: string;
    ticket_number: string;
    title: string;
    description: string;
    category: string;
    priority: string;
    status: string;
};

const API_URL = "http://127.0.0.1:8000";

export default function ChatPage() {
    const router = useRouter();

    const [messages, setMessages] = useState<Message[]>([
        {
            role: "agent",
            content:
                "Hi! I'm Veridian IT Support. Tell me what you're having trouble with and I'll help diagnose it.",
        },
    ]);

    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [ticketLoading, setTicketLoading] = useState(false);

    const [issueData, setIssueData] = useState<{
        title: string;
        description: string;
        category: string;
        priority: string;
        needsTicket: boolean;
    } | null>(null);

    const analyzeIssue = (text: string) => {
        const lower = text.toLowerCase();

        // SECURITY ISSUES
        if (
            lower.includes("hack") ||
            lower.includes("breach") ||
            lower.includes("phishing") ||
            lower.includes("suspicious email") ||
            lower.includes("malware") ||
            lower.includes("virus") ||
            lower.includes("ransomware")
        ) {
            return {
                reply:
                    "This appears to be a security-sensitive issue. Do not click suspicious links, download unknown files, or share your credentials. I recommend escalating this immediately to IT Security.",
                title: "Security incident reported",
                category: "security",
                priority: "critical",
                needsTicket: true,
            };
        }

        // VPN / NETWORK
        if (
            lower.includes("vpn") ||
            lower.includes("network") ||
            lower.includes("internet") ||
            lower.includes("wifi") ||
            lower.includes("wi-fi")
        ) {
            return {
                reply:
                    "This appears to be a network/VPN issue. First, check whether normal internet access is working. If internet access works, disconnect and reconnect to the company VPN. If the VPN still fails, I can create an IT ticket with the details of this issue.",
                title: "VPN / Network connection problem",
                category: "network",
                priority: "medium",
                needsTicket: true,
            };
        }

        // PASSWORD / ACCOUNT
        if (
            lower.includes("password") ||
            lower.includes("login") ||
            lower.includes("account") ||
            lower.includes("locked")
        ) {
            return {
                reply:
                    "This appears to be an account access issue. Please verify that you are using your company credentials and check whether your account is locked. I can create an IT ticket if you still cannot access your account.",
                title: "Account access problem",
                category: "account",
                priority: "high",
                needsTicket: true,
            };
        }

        // SOFTWARE
        if (
            lower.includes("software") ||
            lower.includes("install") ||
            lower.includes("license") ||
            lower.includes("application")
        ) {
            return {
                reply:
                    "Software installation and licensing requests require IT review. Please provide the software name and explain why you need it. I can create a request for IT to review.",
                title: "Software installation or license request",
                category: "software",
                priority: "medium",
                needsTicket: true,
            };
        }

        // HARDWARE
        if (
            lower.includes("laptop") ||
            lower.includes("computer") ||
            lower.includes("keyboard") ||
            lower.includes("mouse") ||
            lower.includes("monitor") ||
            lower.includes("printer")
        ) {
            return {
                reply:
                    "This appears to be a hardware-related issue. Please provide the affected device and describe what is happening. I can create an IT hardware ticket for further investigation.",
                title: "Hardware support request",
                category: "hardware",
                priority: "medium",
                needsTicket: true,
            };
        }

        // SIMPLE ISSUE
        if (
            lower.includes("restart") ||
            lower.includes("slow") ||
            lower.includes("not working")
        ) {
            return {
                reply:
                    "Let's start with a basic troubleshooting step. Please restart the affected application or device and try again. If the issue continues, I can create an IT ticket for further investigation.",
                title: "General IT support issue",
                category: "general",
                priority: "medium",
                needsTicket: true,
            };
        }

        // UNKNOWN / FOLLOW-UP
        return {
            reply:
                "I want to make sure I understand the issue correctly. Could you tell me which device or application is affected, what you expected to happen, and what happened instead?",
            title: "IT support request",
            category: "general",
            priority: "medium",
            needsTicket: false,
        };
    };

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const userMessage = input.trim();

        setMessages((prev) => [
            ...prev,
            {
                role: "user",
                content: userMessage,
            },
        ]);

        setInput("");
        setLoading(true);
        setTicket(null);

        try {
            const result = analyzeIssue(userMessage);

            setIssueData({
                title: result.title,
                description: userMessage,
                category: result.category,
                priority: result.priority,
                needsTicket: result.needsTicket,
            });

            await new Promise((resolve) => setTimeout(resolve, 500));

            setMessages((prev) => [
                ...prev,
                {
                    role: "agent",
                    content: result.reply,
                },
            ]);
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    role: "agent",
                    content:
                        "Something went wrong while analyzing the issue. Please try again.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const createTicket = async () => {
        if (!issueData || ticketLoading) return;

        setTicketLoading(true);

        try {
            const response = await fetch(`${API_URL}/tickets`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: issueData.title,
                    description: issueData.description,
                    category: issueData.category,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);

                throw new Error(
                    errorData?.detail || "Unable to create ticket."
                );
            }

            const createdTicket = await response.json();

            setTicket(createdTicket);

            setMessages((prev) => [
                ...prev,
                {
                    role: "agent",
                    content:
                        `Your IT ticket ${createdTicket.ticket_number} has been created successfully. IT support can now review and handle the request.`,
                },
            ]);

            setIssueData(null);
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                {
                    role: "agent",
                    content:
                        error instanceof Error
                            ? error.message
                            : "Unable to create the ticket. Please try again.",
                },
            ]);
        } finally {
            setTicketLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#020617] text-white">
            {/* HEADER */}
            <header className="border-b border-slate-800 bg-[#020617]/95 px-8 py-4">
                <div className="mx-auto flex max-w-6xl items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold">Veridian</h1>
                        <p className="text-xs text-slate-400">
                            Internal IT Support
                        </p>
                    </div>

                    <button
                        onClick={() => router.push("/dashboard")}
                        className="text-sm text-slate-300 transition hover:text-white"
                    >
                        ← Dashboard
                    </button>
                </div>
            </header>

            {/* MAIN */}
            <section className="mx-auto flex max-w-5xl flex-col px-6 py-10">
                <div className="mb-8">
                    <p className="text-sm font-medium text-blue-400">
                        IT SUPPORT AGENT
                    </p>

                    <h2 className="mt-2 text-3xl font-bold">
                        How can we help?
                    </h2>

                    <p className="mt-2 text-slate-400">
                        Describe your IT issue. The agent will diagnose it,
                        provide relevant troubleshooting guidance, and
                        escalate requests when necessary.
                    </p>
                </div>

                {/* CHAT WINDOW */}
                <div className="min-h-[480px] space-y-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex ${message.role === "user"
                                    ? "justify-end"
                                    : "justify-start"
                                }`}
                        >
                            <div
                                className={`max-w-[75%] rounded-2xl px-5 py-4 text-sm leading-6 ${message.role === "user"
                                        ? "bg-blue-600 text-white"
                                        : "bg-slate-800 text-slate-200"
                                    }`}
                            >
                                {message.content}
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex justify-start">
                            <div className="rounded-2xl bg-slate-800 px-5 py-4 text-sm text-slate-400">
                                Agent is analyzing the issue...
                            </div>
                        </div>
                    )}
                </div>

                {/* TICKET ACTION */}
                {issueData?.needsTicket && (
                    <div className="mt-5 rounded-2xl border border-blue-500/30 bg-blue-500/10 p-5">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="font-semibold text-white">
                                    IT ticket recommended
                                </p>

                                <p className="mt-1 text-sm text-slate-400">
                                    The agent has prepared a structured ticket
                                    for IT support.
                                </p>

                                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                                    <span className="rounded-full bg-slate-800 px-3 py-1 text-slate-300">
                                        {issueData.category}
                                    </span>

                                    <span className="rounded-full bg-slate-800 px-3 py-1 text-slate-300">
                                        Priority: {issueData.priority}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={createTicket}
                                disabled={ticketLoading}
                                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {ticketLoading
                                    ? "Creating..."
                                    : "Create IT Ticket"}
                            </button>
                        </div>
                    </div>
                )}

                {/* CREATED TICKET */}
                {ticket && (
                    <div className="mt-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-semibold text-emerald-400">
                                    ✓ Ticket created
                                </p>

                                <h3 className="mt-1 text-lg font-bold">
                                    {ticket.ticket_number}
                                </h3>

                                <p className="mt-2 text-sm text-slate-300">
                                    {ticket.title}
                                </p>
                            </div>

                            <button
                                onClick={() =>
                                    router.push("/dashboard/tickets")
                                }
                                className="text-sm text-blue-400 hover:text-blue-300"
                            >
                                View ticket →
                            </button>
                        </div>
                    </div>
                )}

                {/* INPUT */}
                <div className="mt-5 flex gap-3">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                sendMessage();
                            }
                        }}
                        disabled={loading}
                        placeholder="Describe your IT problem..."
                        className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-5 py-4 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500"
                    />

                    <button
                        onClick={sendMessage}
                        disabled={loading || !input.trim()}
                        className="rounded-xl bg-blue-600 px-7 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Send
                    </button>
                </div>

                {/* SOURCE */}
                <div className="mt-5 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Source used
                        </p>

                        <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-medium text-emerald-400">
                            Internal Policy
                        </span>
                    </div>

                    <p className="mt-2 text-sm text-slate-300">
                        Veridian Internal IT Support Policy
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                        Responses are based on internal IT troubleshooting and
                        escalation rules.
                    </p>
                </div>

                {/* SECURITY NOTICE */}
                <div className="mt-4 text-center text-xs text-slate-600">
                    Protected internal employee system • Actions are logged
                    for audit purposes
                </div>
            </section>
        </main>
    );
}