import { createClient } from "@supabase/supabase-js";
import { EmbeddedChunk } from "@/types/embeddedChunk";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseSecretKey) {
    throw new Error("Missing Supabase environment variables.");
}

const supabase = createClient(supabaseUrl, supabaseSecretKey);

export async function insertChunks(chunks: EmbeddedChunk[]){
    if(chunks.length === 0){
        return [];
    }
    const rows = chunks.map(chunk => {
        return {
            text: chunk.text,
            source_doc: chunk.sourceDoc,
            chunk_index: chunk.chunkIndex,
            metadata: chunk.metadata,
            embedding: chunk.embedding,
        };
    });

    const {data, error} = await supabase
        .from("note_chunks")
        .insert(rows)
        .select();

    if (error){
        throw new Error(`Failed to insert chunks: ${error.message}`)
    }
    return data;
}