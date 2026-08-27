import { NextResponse } from "next/server";
import { askQuestion } from "../../../lib/rag";

export async function POST(request: Request){
    try{
        const body = await request.json();
        const question = body.question;

        if(typeof question !== "string" || question.trim().length === 0){
            return NextResponse.json(
                { error: "Please enter a question with words."},
                { status: 400}
            );
        }

        const answer = await askQuestion(question);
        return NextResponse.json( { answer: answer } );

    } catch(error){
        console.error(error);
        return NextResponse.json(
            { error: "Internal server error. Try again later" },
            { status: 500 });
    }
}