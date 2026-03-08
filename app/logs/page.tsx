"use client";

import { useEffect, useState } from "react";
import LogCard from "@/components/LogCard";
import { Plus, Search, Filter, X, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface Log {
    id: string;
    title: string;
    description: string;
    tags: string;
    projectId?: string;
    createdAt: string;
}

interface Project {
    id: string;
    projectName: string;
}

export default function LogsPage() {
    const [logs, setLogs] = useState<Log[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [editingLog, setEditingLog] = useState<Log | null>(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        tags: "",
        projectId: ""
    });

    useEffect(() => {
        fetchLogs();
        fetchProjects();
    }, []);

    const fetchLogs = async () => {
        const res = await fetch("/api/logs");
        const data = await res.json();
        setLogs(data);
        setLoading(false);
    };

    const fetchProjects = async () => {
        const res = await fetch("/api/projects");
        const data = await res.json();
        setProjects(data);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = "/api/logs";
        const method = editingLog ? "PUT" : "POST";
        const body = editingLog ? { ...formData, id: editingLog.id } : formData;

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (res.ok) {
            setIsModalOpen(false);
            setEditingLog(null);
            setFormData({ title: "", description: "", tags: "", projectId: "" });
            fetchLogs();
        }
    };

    const handleEdit = (log: Log) => {
        setEditingLog(log);
        setFormData({
            title: log.title,
            description: log.description,
            tags: log.tags,
            projectId: log.projectId || ""
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        const res = await fetch(`/api/logs?id=${id}`, { method: "DELETE" });
        if (res.ok) fetchLogs();
    };

    const filteredLogs = logs.filter(log =>
        log.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.tags.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20 animate-reveal">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-white/[0.05]">
                <div className="space-y-2">
                    <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.3em]">Knowledge Base</p>
                    <h1 className="text-5xl font-bold tracking-tight text-white leading-none">
                        Learning <span className="text-zinc-500 font-medium">Journals</span>
                    </h1>
                </div>
                <button
                    onClick={() => {
                        setEditingLog(null);
                        setFormData({ title: "", description: "", tags: "", projectId: "" });
                        setIsModalOpen(true);
                    }}
                    className="btn-primary h-fit"
                >
                    <Plus size={16} />
                    <span>Create Entry</span>
                </button>
            </header>

            <div className="flex flex-col md:flex-row gap-6">
                <div className="relative flex-1 group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-indigo-400 transition-colors">
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search logs by title or tag..."
                        className="input-field w-full pl-12 h-14"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3 px-6 h-14 bg-zinc-900/10 backdrop-blur-xl border border-white/[0.05] rounded-2xl text-[10px] font-black text-zinc-500 uppercase tracking-widest cursor-default font-mono">
                    <Filter size={14} strokeWidth={2.5} />
                    <span>LATEST_FIRST</span>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-32">
                    <div className="w-12 h-12 border-4 border-white/5 border-t-indigo-500 rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredLogs.map((log, index) => (
                        <LogCard key={log.id} log={log} onDelete={handleDelete} onEdit={handleEdit} index={index} />
                    ))}
                    {filteredLogs.length === 0 && (
                        <div className="col-span-full py-20 text-center border border-dashed border-white/[0.05] rounded-2xl">
                            <p className="text-zinc-600 font-medium">No logs found matching your search.</p>
                        </div>
                    )}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="w-full max-w-lg bg-zinc-950 border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center px-6 py-4 border-b border-white/[0.05]">
                            <h2 className="text-lg font-bold text-white">{editingLog ? "Edit Learning Entry" : "Create New Entry"}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Entry Title</label>
                                <input
                                    required
                                    className="input-field w-full"
                                    placeholder="e.g., Understanding React Server Components"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Content</label>
                                <textarea
                                    required
                                    rows={4}
                                    className="input-field w-full resize-none"
                                    placeholder="What did you learn today?"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Tags (comma separated)</label>
                                    <input
                                        className="input-field w-full"
                                        placeholder="react, nextjs"
                                        value={formData.tags}
                                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Link to Project</label>
                                    <select
                                        className="input-field w-full appearance-none"
                                        value={formData.projectId}
                                        onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                                    >
                                        <option value="">No Project</option>
                                        {projects.map(p => (
                                            <option key={p.id} value={p.id}>{p.projectName}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 rounded-lg border border-white/[0.05] text-zinc-400 font-bold text-sm hover:bg-white/[0.02] transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-[2] btn-primary">
                                    Save Entry
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
