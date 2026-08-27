import { NextResponse } from "next/server";
import { ingestPdf } from "../../../lib/ingest";

export async function POST(request: Request) {
    try{
        const formData = await request.formData();
        const file = formData.get("file");

        if(!(file instanceof File)) {
            return NextResponse.json(
                { error: "Please upload a file." },
                { status: 400 }
            );
        }

        if (file.type !== "application/pdf") {
            return NextResponse.json(
                {error: "Only PDF files are supported."},
                {status: 400}
            );
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const course = formData.get("course");

        if (typeof course !== "string" || course.trim().length === 0) {
            return NextResponse.json(
                { error: "Please provide a course." },
                { status: 400 }
            );
        }

        const chunkCount = await ingestPdf(buffer, file.name, {course: course.trim()});
        return NextResponse.json(
            {
                message: "PDF uploaded successfully.",
                count: chunkCount
            },

            { status: 200 }
        );
    }catch(error){
        console.error(error);

        return NextResponse.json(
            { error: "Internal server error" },
            {status: 500}
        );
    }
}