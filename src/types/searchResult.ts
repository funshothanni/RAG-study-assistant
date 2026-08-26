export type SearchResult = {
    id: number;
    text: string;
    source_doc: string;
    metadata: Record<string, unknown>;
    similarity: number;
};
