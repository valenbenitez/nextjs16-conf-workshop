import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export function GET(request: NextRequest) {
    const tag = request.nextUrl.searchParams.get("tag");
    const secretParam = request.nextUrl.searchParams.get("secret");
    const secret = process.env.SECRET;

    if (secretParam !== secret) {
        return NextResponse.json({ error: "Secret no validated" }, { status: 401 })
    }

    if (!tag) {
        return NextResponse.json({ error: "Tag is required" }, { status: 400 })
    }

    revalidateTag(tag, "max")

    return NextResponse.json({ message: "Cache revalidated" })
}