import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const totalLogs = await prisma.log.count();
        const totalProjects = await prisma.project.count();
        const totalResources = await prisma.resource.count();

        // Tag statistics
        const logs = await prisma.log.findMany({
            select: { tags: true }
        });

        const tagMap: Record<string, number> = {};
        logs.forEach(log => {
            log.tags.split(",").map(t => t.trim()).filter(Boolean).forEach(tag => {
                tagMap[tag] = (tagMap[tag] || 0) + 1;
            });
        });

        const tagStats = Object.entries(tagMap).map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);

        // Activity chart (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const logsLast7Days = await prisma.log.findMany({
            where: {
                createdAt: {
                    gte: sevenDaysAgo
                }
            },
            select: { createdAt: true }
        });

        const activityMap: Record<string, number> = {};
        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split("T")[0];
            activityMap[dateStr] = 0;
        }

        logsLast7Days.forEach(log => {
            const dateStr = log.createdAt.toISOString().split("T")[0];
            if (activityMap[dateStr] !== undefined) {
                activityMap[dateStr]++;
            }
        });

        const activityData = Object.entries(activityMap)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => a.date.localeCompare(b.date));

        // Simple streak counter
        const allLogsOrderByDate = await prisma.log.findMany({
            select: { createdAt: true },
            orderBy: { createdAt: "desc" }
        });

        let streak = 0;
        const uniqueDates = Array.from(new Set(allLogsOrderByDate.map(l => l.createdAt.toISOString().split("T")[0])));

        if (uniqueDates.length > 0) {
            const today = new Date().toISOString().split("T")[0];
            const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

            let currentCheck = uniqueDates[0] === today || uniqueDates[0] === yesterday ? 0 : -1;

            if (currentCheck !== -1) {
                for (let i = 0; i < uniqueDates.length; i++) {
                    const date = new Date(uniqueDates[i]);
                    const expected = new Date();
                    expected.setDate(expected.getDate() - i);
                    // Adjust for potential gap between today and first log
                    if (i === 0 && uniqueDates[0] === yesterday) {
                        // start from yesterday
                    }

                    // Simplified streak logic: consecutive days in uniqueDates
                    streak++;
                    if (i < uniqueDates.length - 1) {
                        const d1 = new Date(uniqueDates[i]);
                        const d2 = new Date(uniqueDates[i + 1]);
                        const diff = (d1.getTime() - d2.getTime()) / (1000 * 3600 * 24);
                        if (diff > 1.1) break; // gap more than 1 day
                    }
                }
            }
        }

        return NextResponse.json({
            totalLogs,
            totalProjects,
            totalResources,
            tagStats,
            activityData,
            streak
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
