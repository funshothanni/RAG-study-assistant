import {OpenAI} from "openai";
import {Chunk} from "@/types/chunk";
import {EmbeddedChunk} from "@/types/embeddedChunk";

// key comes from an environment variable
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

//async method because we send call to embeddings API, wait for it to return the embedding, then use it to create a embeddedChunk
export async function embedChunk(chunk: Chunk): Promise<EmbeddedChunk> {
    const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: chunk.text,
    });
    // get embedding from the API's response
    const embedding = response.data[0].embedding;
    //return a new Embedded Chunk
    return {...chunk, embedding};
}

//async method because we send call to embeddings API, wait for it to return the embeddings, then use to create multiple EmbeddedChunks
export async function embedChunks(chunks: Chunk[]): Promise<EmbeddedChunk[]> {
    //extract all texts from each chunk
    const texts = chunks.map(chunk => chunk.text);
    //if passed an empty chunk list, no need to call API, immediately return
    if (texts.length === 0) {
        return [];
    }
    const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: texts,
    });
    //map each embedding to its matching chunk and return them
    return chunks.map((chunk, index) => {
        const embedding = response.data[index].embedding;
        return {...chunk, embedding};
    });
}

export async function embedText(text: string): Promise<number[]> {
    const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text,
    });
    return response.data[0].embedding;
}
