"use client";

import { ExternalLink, Trash2, Bookmark, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResourceCardProps {
    resource: {
        id: string;
        title: string;
        url: string;
        category: string;
    };
    onDelete: (id: string) => void;
    onEdit: (resource: any) => void;
    index?: number;
}

export default function ResourceCard({ resource, onDelete, onEdit, index = 0 }: ResourceCardProps) {
    return (
        <div
            className="glass-card group flex flex-col h-full animate-reveal"
            style={{ animationDelay: `${index * 40}ms` }}
        >
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest bg-white/[0.02] px-2.5 py-1 rounded-md border border-white/[0.05] font-mono">
                    <Bookmark size={12} className="text-zinc-600" />
                    {resource.category}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button
                        onClick={() => onEdit(resource)}
                        className="p-1.5 rounded-lg text-zinc-600 hover:text-indigo-400 hover:bg-indigo-400/5 transition-all"
                    >
                        <Bookmark size={14} />
                    </button>
                    <button
                        onClick={() => onDelete(resource.id)}
                        className="p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-400/5 transition-all"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>

            <h3 className="text-lg font-bold text-white mb-10 tracking-tight group-hover:text-indigo-400 transition-colors duration-300 leading-tight">
                {resource.title}
            </h3>

            <div className="mt-auto pt-6 border-t border-white/[0.03]">
                <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] transition-all hover:bg-white/[0.05] hover:border-white/[0.1] group/btn"
                >
                    <span className="text-[10px] font-bold font-mono text-zinc-500 uppercase tracking-wider truncate max-w-[140px]">
                        {resource.url.replace(/^https?:\/\//, "")}
                    </span>
                    <ArrowUpRight size={14} className="text-zinc-600 group-hover/btn:text-indigo-400 transition-colors" />
                </a>
            </div>
        </div>
    );
}
