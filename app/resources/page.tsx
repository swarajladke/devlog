"use client";

import { useEffect, useState } from "react";
import ResourceCard from "@/components/ResourceCard";
import { Plus, Search, Filter, X, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

interface Resource {
    id: string;
    title: string;
    url: string;
    category: string;
}

export default function ResourcesPage() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [editingResource, setEditingResource] = useState<Resource | null>(null);

    const [formData, setFormData] = useState({
        title: "",
        url: "",
        category: "Article"
    });

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        const res = await fetch("/api/resources");
        const data = await res.json();
        setResources(data);
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = "/api/resources";
        const method = editingResource ? "PUT" : "POST";
        const body = editingResource ? { ...formData, id: editingResource.id } : formData;

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (res.ok) {
            setIsModalOpen(false);
            setEditingResource(null);
            setFormData({ title: "", url: "", category: "Article" });
            fetchResources();
        }
    };

    const handleEdit = (resource: Resource) => {
        setEditingResource(resource);
        setFormData({
            title: resource.title,
            url: resource.url,
            category: resource.category
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        const res = await fetch(`/api/resources?id=${id}`, { method: "DELETE" });
        if (res.ok) fetchResources();
    };

    const filteredResources = resources.filter(r =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20 animate-reveal">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-white/[0.05]">
                <div className="space-y-2">
                    <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.3em]">Reference Archive</p>
                    <h1 className="text-5xl font-bold tracking-tight text-white leading-none">
                        Resource <span className="text-zinc-500 font-medium">Vault</span>
                    </h1>
                </div>
                <button
                    onClick={() => {
                        setEditingResource(null);
                        setFormData({ title: "", url: "", category: "Article" });
                        setIsModalOpen(true);
                    }}
                    className="btn-primary h-fit"
                >
                    <Plus size={16} />
                    <span>Add Resource</span>
                </button>
            </header>

            <div className="flex flex-col md:flex-row gap-6">
                <div className="relative flex-1 group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-indigo-400 transition-colors">
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search resources by title or category..."
                        className="input-field w-full pl-12 h-14"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-32">
                    <div className="w-12 h-12 border-4 border-white/5 border-t-indigo-500 rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredResources.map((resource, index) => (
                        <ResourceCard key={resource.id} resource={resource} onDelete={handleDelete} onEdit={handleEdit} index={index} />
                    ))}
                    {filteredResources.length === 0 && (
                        <div className="col-span-full py-20 text-center border border-dashed border-white/[0.05] rounded-2xl">
                            <p className="text-zinc-600 font-medium">No resources found matching your search.</p>
                        </div>
                    )}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="w-full max-w-lg bg-zinc-950 border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center px-6 py-4 border-b border-white/[0.05]">
                            <h2 className="text-lg font-bold text-white">{editingResource ? "Edit Resource" : "Add New Resource"}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Resource Name</label>
                                <input
                                    required
                                    className="input-field w-full"
                                    placeholder="e.g., Tailwind CSS Documentation"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">URL</label>
                                <input
                                    required
                                    type="url"
                                    className="input-field w-full"
                                    placeholder="https://example.com"
                                    value={formData.url}
                                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Category</label>
                                <select
                                    className="input-field w-full appearance-none"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option value="Article">Article</option>
                                    <option value="Documentation">Documentation</option>
                                    <option value="Tool">Tool</option>
                                    <option value="Video">Video</option>
                                    <option value="Course">Course</option>
                                </select>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 rounded-lg border border-white/[0.05] text-zinc-400 font-bold text-sm hover:bg-white/[0.02] transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-[2] btn-primary">
                                    Save Resource
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
