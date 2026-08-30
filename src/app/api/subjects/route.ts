import { NextResponse } from "next/server";
import { getSubjects } from "../../../lib/db";

export async function GET() {
    try {
        const subjects = await getSubjects();

        return NextResponse.json({ subjects });
    } catch (error) {
        console.error("SUBJECTS ERROR:", error);

        return NextResponse.json(
            { error: "Failed to retrieve subjects" },
            { status: 500 }
        );
    }
}