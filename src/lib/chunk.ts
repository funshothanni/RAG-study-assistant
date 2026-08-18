import { Chunk } from "../types/chunk";

export function chunkDocument(text: string, sourceDoc: string, metadata: Record<string, number | string | boolean>, chunkSize: number = 300, overlap: number = 50) {
    //safeguard check to return empty array on bad input
    if (text.trim().length === 0) {
        return [];
    }
    // splits the passed text into a big words array
    const words = text.trim().split(/\s+/);

    if (chunkSize <= 0) {
        throw new Error("Chunk size must be greater than 0.");
    }
    if (overlap >= chunkSize) {
        throw new Error("Overlap must be smaller than chunk size.");
    }

    // index of each chunk
    let chunkIndex = 0;
    //final chunk array to be returned
    const chunks: Chunk[] = [];

    // how many new words each chunk has
    const step = chunkSize - overlap;
    for (let i= 0; i < words.length; i+= step) {
        //splits chunks into appropriate size
        const chunkWords = words.slice(i, i + chunkSize);
        //join the chunk words back into a string
        const chunkText = chunkWords.join(" ");

        //create an object that satisfies the Chunk interface
        const chunk: Chunk = {
            text: chunkText,
            sourceDoc: sourceDoc,
            chunkIndex: chunkIndex,
            metadata: metadata
        };

        //add current chunk to the final chunk array
        chunks.push(chunk);

        //if current chunk has reached the end of the document, stop creating chunks
        if (i + chunkSize >= words.length) {
            break;
        }
        chunkIndex++;
    }
    return chunks;
}