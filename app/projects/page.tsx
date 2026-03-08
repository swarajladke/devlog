"use client";

import { useEffect, useState } from "react";
import ProjectCard from "@/components/ProjectCard";
import { Plus, Search, Filter, X, FolderKanban } from "lucide-react";
import { cn } from "@/lib/utils";

interface Project {
    id: string;
    projectName: string;
    description: string;
    status: string;
    _count?: {
        logs: number;
    };
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    const [formData, setFormData] = useState({
        projectName: "",
        description: "",
        status: "Planning"
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        const res = await fetch("/api/projects");
        const data = await res.json();
        setProjects(data);
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = "/api/projects";
        const method = editingProject ? "PUT" : "POST";
        const body = editingProject ? { ...formData, id: editingProject.id } : formData;

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (res.ok) {
            setIsModalOpen(false);
            setEditingProject(null);
            setFormData({ projectName: "", description: "", status: "Planning" });
            fetchProjects();
        }
    };

    const handleEdit = (project: Project) => {
        setEditingProject(project);
        setFormData({
            projectName: project.projectName,
            description: project.description,
            status: project.status
        });
        setIsModalOpen(true);
    };

    const handleStatusUpdate = async (id: string, status: string) => {
        const res = await fetch("/api/projects", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, status }),
        });
        if (res.ok) fetchProjects();
    };

    const handleDelete = async (id: string) => {
        const res = await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
        if (res.ok) fetchProjects();
    };

    const filteredProjects = projects.filter(p =>
        p.projectName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20 animate-reveal">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-white/[0.05]">
                <div className="space-y-2">
                    <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.3em]">Development Registry</p>
                    <h1 className="text-5xl font-bold tracking-tight text-white leading-none">
                        Project <span className="text-zinc-500 font-medium">Pipeline</span>
                    </h1>
                </div>
                <button
                    onClick={() => {
                        setEditingProject(null);
                        setFormData({ projectName: "", description: "", status: "Planning" });
                        setIsModalOpen(true);
                    }}
                    className="btn-primary h-fit"
                >
                    <Plus size={16} />
                    <span>New Project</span>
                </button>
            </header>

            <div className="flex flex-col md:flex-row gap-6">
                <div className="relative flex-1 group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-indigo-400 transition-colors">
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Filter projects by name..."
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
                    {filteredProjects.map((project, index) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            onStatusUpdate={handleStatusUpdate}
                            onDelete={handleDelete}
                            onEdit={handleEdit}
                            index={index}
                        />
                    ))}
                    {filteredProjects.length === 0 && (
                        <div className="col-span-full py-20 text-center border border-dashed border-white/[0.05] rounded-2xl">
                            <p className="text-zinc-600 font-medium">No projects found matching your search.</p>
                        </div>
                    )}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="w-full max-w-lg bg-zinc-950 border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center px-6 py-4 border-b border-white/[0.05]">
                            <h2 className="text-lg font-bold text-white">{editingProject ? "Edit Project" : "Initiate New Project"}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Project Name</label>
                                <input
                                    required
                                    className="input-field w-full"
                                    placeholder="e.g., Performance Optimization Suite"
                                    value={formData.projectName}
                                    onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Overview</label>
                                <textarea
                                    required
                                    rows={4}
                                    className="input-field w-full resize-none"
                                    placeholder="Define the project scope and objectives..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Initial Status</label>
                                <select
                                    className="input-field w-full appearance-none"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="Planning">Planning</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 rounded-lg border border-white/[0.05] text-zinc-400 font-bold text-sm hover:bg-white/[0.02] transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-[2] btn-primary">
                                    Create Project
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
