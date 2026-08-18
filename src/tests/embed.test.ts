import { describe, expect, test, vi } from "vitest";
const { mockCreate } = vi.hoisted(() => {
    return {
        mockCreate: vi.fn(),
    };
});

vi.mock("openai", () => {
    const OpenAI = vi.fn(class {
        embeddings = {
            create: mockCreate,
        };
    });
    return { OpenAI };
});

import { embedChunks } from "../lib/embed";
import {Chunk} from "@/types/chunk";

describe("embedChunks", () => {
    test("returns an empty array for empty chunk", async () => {
        const result = await embedChunks([]);
        expect(result).toEqual([]);
    });

    test("maps embedding to the matching chunks", async () => {
        const chunks: Chunk[] = [
            {
                text: "first chunk",
                sourceDoc: "test.txt",
                chunkIndex: 0,
                metadata: { course: "TEST" },
            },
            {
                text: "second chunk",
                sourceDoc: "test.txt",
                chunkIndex: 1,
                metadata: { course: "TEST" },
            },
        ];

        mockCreate.mockResolvedValue({
            data: [
                { embedding: [0.1, 0.2] },
                { embedding: [0.3, 0.4] },
            ],
        });

        const result = await embedChunks(chunks);
        expect(result).toHaveLength(2);
        expect(result[0].embedding).toEqual([0.1, 0.2]);
        expect(result[1].embedding).toEqual([0.3, 0.4]);
        expect(result[0].text).toEqual("first chunk");
    });
});