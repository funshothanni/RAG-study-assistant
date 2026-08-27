import { extractPdfText } from "./extract";
import { chunkDocument } from "./chunk";
import { embedChunks } from "./embed";
import { insertChunks } from "./db";

export async function ingestPdf( buffer: Buffer, sourceDoc: string, metadata: Record<string, string | number | boolean>): Promise<number> {
    const text = await extractPdfText(buffer);
    const chunks = chunkDocument(text, sourceDoc, metadata);
    const embeddedChunks = await embedChunks(chunks);
    await insertChunks(embeddedChunks);
    return embeddedChunks.length;
}