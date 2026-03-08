import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get("tag");

    try {
        const logs = await prisma.log.findMany({
            where: tag ? {
                tags: {
                    contains: tag
                }
            } : {},
            include: {
                projects: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });
        return NextResponse.json(logs);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, description, tags, projectIds } = body;

        if (!title || !description) {
            return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
        }

        const log = await prisma.log.create({
            data: {
                title,
                description,
                tags: tags || "",
                projects: {
                    connect: projectIds?.map((id: string) => ({ id })) || []
                }
            },
            include: {
                projects: true
            }
        });

        return NextResponse.json(log, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to create log" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, title, description, tags, projectIds } = body;

        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        const log = await prisma.log.update({
            where: { id },
            data: {
                title,
                description,
                tags,
                projects: {
                    set: projectIds?.map((id: string) => ({ id })) || []
                }
            },
            include: {
                projects: true
            }
        });

        return NextResponse.json(log);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update log" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
        return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    try {
        await prisma.log.delete({
            where: { id }
        });
        return NextResponse.json({ message: "Log deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete log" }, { status: 500 });
    }
}
