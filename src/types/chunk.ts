export interface Chunk {
    text: string;
    sourceDoc: string;
    chunkIndex: number;
    metadata: Record<string, number | string | boolean>;
}