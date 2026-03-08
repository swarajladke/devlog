"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    NotebookPen,
    FolderKanban,
    Bookmark,
    Settings,
    Code2,
    LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Learning Logs", href: "/logs", icon: NotebookPen },
    { name: "Projects", href: "/projects", icon: FolderKanban },
    { name: "Resources", href: "/resources", icon: Bookmark },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 border-r border-white/[0.05] bg-zinc-950/80 backdrop-blur-3xl h-screen sticky top-0 flex flex-col z-40 transition-all">
            <div className="p-8 flex items-center gap-3 group">
                <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-105 transition-all duration-300">
                    <Code2 size={18} className="text-zinc-950" />
                </div>
                <div>
                    <h1 className="font-bold text-lg tracking-tight text-white">DevLog</h1>
                    <p className="text-[10px] uppercase tracking-widest font-semibold text-zinc-600">Workspace</p>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-1 mt-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 relative group truncate",
                                isActive
                                    ? "bg-white/[0.05] text-white border border-white/[0.08]"
                                    : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.02] border border-transparent"
                            )}
                        >
                            <item.icon size={16} className={cn(
                                "transition-colors duration-300",
                                isActive ? "text-white" : "group-hover:text-zinc-300"
                            )} />
                            <span className="font-medium tracking-tight text-sm">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 mt-auto border-t border-white/[0.05]">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.03] flex items-center gap-3 group cursor-pointer hover:bg-white/[0.05] transition-all duration-300">
                    <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center font-bold text-[10px] text-zinc-400">
                        AX
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-zinc-200 truncate">Alex</p>
                        <p className="text-[10px] text-zinc-600 font-medium">Pro Plan</p>
                    </div>
                    <Settings size={14} className="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                </div>

                <button className="w-full flex items-center gap-3 px-3 py-2 mt-4 rounded-lg text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.02] transition-all duration-300 group border border-transparent">
                    <LogOut size={16} />
                    <span className="font-medium tracking-tight text-sm">Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
