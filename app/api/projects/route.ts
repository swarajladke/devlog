import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const projects = await prisma.project.findMany({
            include: {
                logs: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });
        return NextResponse.json(projects);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { projectName, description, status, logIds } = body;

        if (!projectName || !status) {
            return NextResponse.json({ error: "Project name and status are required" }, { status: 400 });
        }

        const project = await prisma.project.create({
            data: {
                projectName,
                description: description || "",
                status,
                logs: {
                    connect: logIds?.map((id: string) => ({ id })) || []
                }
            },
            include: {
                logs: true
            }
        });

        return NextResponse.json(project, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, projectName, description, status, logIds } = body;

        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        const project = await prisma.project.update({
            where: { id },
            data: {
                projectName,
                description,
                status,
                logs: {
                    set: logIds?.map((id: string) => ({ id })) || []
                }
            },
            include: {
                logs: true
            }
        });

        return NextResponse.json(project);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
        return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    try {
        await prisma.project.delete({
            where: { id }
        });
        return NextResponse.json({ message: "Project deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
    }
}
