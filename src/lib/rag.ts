import {embedText} from "./embed";
import {searchChunks} from "./db";
import {generateAnswer} from "./generate";

export async function askQuestion(question: string): Promise<string> {
    const embeddedQuestion =await embedText(question);

    const result = await searchChunks(embeddedQuestion, 0.5, 5);

    const context = result.map((chunk) => chunk.text).join("\n\n");

    return generateAnswer(question, context);
}