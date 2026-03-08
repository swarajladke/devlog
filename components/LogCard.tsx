"use client";

import { Calendar, Trash2, Tag, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogCardProps {
    log: {
        id: string;
        title: string;
        description: string;
        tags: string;
        createdAt: string;
    };
    onDelete: (id: string) => void;
    onEdit: (log: any) => void;
    index?: number;
}

export default function LogCard({ log, onDelete, onEdit, index = 0 }: LogCardProps) {
    const tagsArray = log.tags.split(",").map(t => t.trim()).filter(Boolean);

    return (
        <div
            className="glass-card group flex flex-col h-full animate-reveal"
            style={{ animationDelay: `${index * 40}ms` }}
        >
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest bg-white/[0.02] px-2.5 py-1 rounded-md border border-white/[0.05]">
                    <Calendar size={12} className="text-zinc-600" />
                    {new Date(log.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button
                        onClick={() => onEdit(log)}
                        className="p-1.5 rounded-lg text-zinc-600 hover:text-indigo-400 hover:bg-indigo-400/5 transition-all"
                    >
                        <Tag size={14} />
                    </button>
                    <button
                        onClick={() => onDelete(log.id)}
                        className="p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-400/5 transition-all"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>

            <h3 className="text-lg font-bold text-white mb-3 tracking-tight group-hover:text-indigo-400 transition-colors duration-300">
                {log.title}
            </h3>
            <p className="text-xs text-zinc-500 line-clamp-3 mb-8 leading-relaxed font-medium">
                {log.description}
            </p>

            <div className="mt-auto pt-6 border-t border-white/[0.03] flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                    {tagsArray.map((tag) => (
                        <span
                            key={tag}
                            className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-zinc-950 text-zinc-600 border border-white/[0.03] group-hover:border-white/[0.1] transition-all font-mono uppercase tracking-tighter"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
                <div className="p-1.5 rounded-md text-zinc-600 group-hover:text-zinc-300 transition-all">
                    <ArrowRight size={14} />
                </div>
            </div>
        </div>
    );
}
