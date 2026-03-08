import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    try {
        const resources = await prisma.resource.findMany({
            where: category ? { category } : {},
            orderBy: {
                createdAt: "desc"
            }
        });
        return NextResponse.json(resources);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch resources" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, url, category } = body;

        if (!title || !url || !category) {
            return NextResponse.json({ error: "Title, URL, and category are required" }, { status: 400 });
        }

        const resource = await prisma.resource.create({
            data: {
                title,
                url,
                category
            }
        });

        return NextResponse.json(resource, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create resource" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, title, url, category } = body;

        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        const resource = await prisma.resource.update({
            where: { id },
            data: {
                title,
                url,
                category
            }
        });

        return NextResponse.json(resource);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update resource" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
        return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    try {
        await prisma.resource.delete({
            where: { id }
        });
        return NextResponse.json({ message: "Resource deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete resource" }, { status: 500 });
    }
}
