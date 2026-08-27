import { NextResponse } from "next/server";
import { askQuestion } from "@/lib/rag";

export async function POST(request: Request) {
    try {


        const body = await request.json();

        const question = body.question;

        const answer = await askQuestion(question);

        return NextResponse.json({ answer });
    } catch (error) {
        console.error("QUERY ERROR:", error);

        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}