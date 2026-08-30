import { NextResponse } from "next/server";
import { askQuestion } from "../../../lib/rag";

export async function POST(request: Request) {
    try {


        const body = await request.json();

        const question = body.question;
        const subject = body.subject;



        if (typeof question !== "string" || question.trim().length === 0) {
            return NextResponse.json(
                { error: "Please provide a question." },
                { status: 400 }
            );
        }
        if (typeof subject !== "string" || subject.trim().length === 0) {
            return NextResponse.json(
                { error: "Please provide a subject." },
                { status: 400 }
            );
        }

        const answer = await askQuestion(question.trim(), subject.trim());

        return NextResponse.json({ answer });
    } catch (error) {
        console.error("QUERY ERROR:", error);

        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}