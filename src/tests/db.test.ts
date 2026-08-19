import { describe, expect, test, vi } from "vitest";
import { insertChunks } from "../lib/db";
import { EmbeddedChunk } from "../types/embeddedChunk";

const { mockFrom, mockInsert, mockSelect } = vi.hoisted(() => {
    process.env.SUPABASE_URL = "https://fake-project.supabase.co";
    process.env.SUPABASE_SECRET_KEY = "fake-secret-key";
    return {
        mockFrom: vi.fn(),
        mockInsert: vi.fn(),
        mockSelect: vi.fn(),
    };
});

vi.mock("@supabase/supabase-js", () => {
    return {
        createClient: vi.fn(() => ({
            from: mockFrom,
        })),
    };
});

mockFrom.mockReturnValue({
    insert: mockInsert,
});

mockInsert.mockReturnValue({
    select: mockSelect,
});

mockSelect.mockResolvedValue({
    data: [{ id: 1 }],
    error: null,
});

describe("insertChunks", () => {
    test("returns an empty array and does not contact Supabase when given no chunks", async () => {
        const result = await insertChunks([]);

        expect(result).toEqual([]);
        expect(mockFrom).not.toHaveBeenCalled();
    });

    test("inserts chunks into Supabase with the correct database fields", async () => {
        const chunks: EmbeddedChunk[] = [
            {
                text: "first chunk",
                sourceDoc: "test.txt",
                chunkIndex: 0,
                metadata: {course: "TEST"},
                embedding: [0.1, 0.2],
            },
        ];

        const result = await insertChunks(chunks);
        expect(mockFrom).toHaveBeenCalledWith("note_chunks")
        expect(mockInsert).toHaveBeenCalledWith([
            {
                text: "first chunk",
                source_doc: "test.txt",
                chunk_index: 0,
                metadata: { course: "TEST" },
                embedding: [0.1, 0.2],
            }
        ])
        expect(mockSelect).toHaveBeenCalledWith()
        expect(result).toEqual([{ id: 1 }]);
    })

    test("throws an error when Supabase insertion fails", async () => {
        const chunks: EmbeddedChunk[] = [
            {
                text: "first chunk",
                sourceDoc: "test.txt",
                chunkIndex: 0,
                metadata: {course: "TEST"},
                embedding: [0.1, 0.2],
            },
        ];

        mockSelect.mockResolvedValueOnce({
            data: null,
            error: { message: "Database unavailable" },
        });

        expect(insertChunks(chunks)).rejects.toThrow(
            "Failed to insert chunks: Database unavailable");
    })
});