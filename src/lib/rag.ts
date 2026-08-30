import {embedText} from "./embed";
import {searchChunks} from "./db";
import {generateAnswer} from "./generate";
import type { SearchResult } from "@/types/searchResult";

export async function askQuestion(question: string, subject: string): Promise<string> {
    const embeddedQuestion =await embedText(question);

    const result: SearchResult[] = await searchChunks(embeddedQuestion, subject, 5);
    // console.log(
    //     result.map((chunk) => ({
    //         source: chunk.source_doc,
    //         subject: chunk.metadata.subject,
    //         similarity: chunk.similarity,
    //     }))
    // );

    const context = result.map((chunk) => chunk.text).join("\n\n");

    return generateAnswer(question, context);
}