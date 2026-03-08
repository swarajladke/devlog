"use client";

import { FolderKanban, Layers, MoreVertical, ArrowRight, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
    project: {
        id: string;
        projectName: string;
        description: string;
        status: string;
        _count?: {
            logs: number;
        };
    };
    onStatusUpdate: (id: string, status: string) => void;
    onDelete: (id: string) => void;
    onEdit: (project: any) => void;
    index?: number;
}

export default function ProjectCard({ project, onStatusUpdate, onDelete, onEdit, index = 0 }: ProjectCardProps) {
    const statusColors: Record<string, string> = {
        "Planning": "bg-zinc-950 text-zinc-500 border-white/[0.05]",
        "In Progress": "bg-indigo-500/5 text-indigo-400 border-indigo-500/10",
        "Completed": "bg-emerald-500/5 text-emerald-400 border-emerald-500/10",
    };

    return (
        <div
            className="glass-card group flex flex-col h-full animate-reveal"
            style={{ animationDelay: `${index * 40}ms` }}
        >
            <div className="flex justify-between items-start mb-6">
                <div className={cn(
                    "text-[10px] font-bold px-2.5 py-1 rounded-md border uppercase tracking-wider transition-all duration-300 font-mono",
                    statusColors[project.status] || statusColors["Planning"]
                )}>
                    {project.status}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button
                        onClick={() => onEdit(project)}
                        className="p-1.5 rounded-lg text-zinc-700 hover:text-indigo-400 transition-colors"
                    >
                        <MoreVertical size={16} />
                    </button>
                    <button
                        onClick={() => onDelete(project.id)}
                        className="p-1.5 rounded-lg text-zinc-700 hover:text-red-400 transition-colors"
                    >
                        <Trash2 size={16} className="text-zinc-700 hover:text-red-400" />
                    </button>
                </div>
            </div>

            <h3 className="text-lg font-bold text-white mb-3 tracking-tight group-hover:text-indigo-400 transition-colors duration-300">
                {project.projectName}
            </h3>
            <p className="text-xs text-zinc-500 line-clamp-3 mb-8 leading-relaxed font-medium">
                {project.description}
            </p>

            <div className="mt-auto pt-6 border-t border-white/[0.03] flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-zinc-600 transition-colors">
                        <Layers size={12} className="text-indigo-500" />
                        <span className="text-[10px] font-bold uppercase tracking-tight font-mono">{project._count?.logs || 0} Logs</span>
                    </div>
                </div>

                <div className="relative group/select">
                    <select
                        value={project.status}
                        onChange={(e) => onStatusUpdate(project.id, e.target.value)}
                        className="bg-transparent text-[10px] font-bold text-zinc-600 hover:text-zinc-400 transition-colors cursor-pointer focus:outline-none uppercase tracking-widest border-none outline-none ring-0 appearance-none font-mono py-1"
                    >
                        <option value="Planning" className="bg-zinc-950">PLN</option>
                        <option value="In Progress" className="bg-zinc-950">RUN</option>
                        <option value="Completed" className="bg-zinc-950">FIN</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
