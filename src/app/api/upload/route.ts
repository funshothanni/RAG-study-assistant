import { NextResponse } from "next/server";
import { ingestPdf } from "../../../lib/ingest";
import {DuplicateDocumentError} from "../../../lib/errors";

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

        const subject = formData.get("subject");

        if (typeof subject !== "string" || subject.trim().length === 0) {
            return NextResponse.json(
                { error: "Please provide a subject." },
                { status: 400 }
            );
        }

        const chunkCount = await ingestPdf(buffer, file.name, {subject: subject.trim()});
        return NextResponse.json(
            {
                message: "PDF uploaded successfully.",
                count: chunkCount
            },

            { status: 200 }
        );
    }catch(error){
        console.error(error);

        if (error instanceof DuplicateDocumentError) {
            return NextResponse.json(
                { error: error.message },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: "Internal server error" },
            {status: 500}
        );
    }
}