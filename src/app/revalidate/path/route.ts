import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

type Type = 'page' | 'layout';

export function GET(request: NextRequest) {
    const path = request.nextUrl.searchParams.get("path");
    const type = request.nextUrl.searchParams.get("type") as Type;
    const secretParam = request.nextUrl.searchParams.get("secret");
    const secret = process.env.SECRET;
    const defaultType = type || 'page';

    if (secretParam !== secret) {
        return NextResponse.json({ error: "Secret no validated" }, { status: 401 })
    }

    if (!path) {
        return NextResponse.json({ error: "Path is required" }, { status: 400 })
    }

    revalidatePath(path, defaultType)

    return NextResponse.json({ message: "Cache revalidated" })
}