import { beforeEach, describe, expect, it, vi } from "vitest";

const {
    mockExtractPdfText,
    mockChunkDocument,
    mockEmbedChunks,
    mockInsertChunks
} = vi.hoisted(() => ({
    mockExtractPdfText: vi.fn(),
    mockChunkDocument: vi.fn(),
    mockEmbedChunks: vi.fn(),
    mockInsertChunks: vi.fn(),
}));

vi.mock("../lib/extract", () => ({
    extractPdfText: mockExtractPdfText,
}));

vi.mock("../lib/chunk", () => ({
    chunkDocument: mockChunkDocument,
}));

vi.mock("../lib/embed", () => ({
    embedChunks: mockEmbedChunks,
}));

vi.mock("../lib/db", () => ({
    insertChunks: mockInsertChunks,
}));

import { ingestPdf } from "../lib/ingest";

describe("ingestPdf", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("extracts, chunks, embeds, and stores a PDF", async () => {
        mockExtractPdfText.mockResolvedValue("These are my psychology study notes.");

        const chunks = [
            {
                text: "These are my psychology",
                sourceDoc: "psychology.pdf",
                chunkIndex: 0,
                metadata: { course: "PSYC" },
            },
            {
                text: "psychology study notes.",
                sourceDoc: "psychology.pdf",
                chunkIndex: 1,
                metadata: { course: "PSYC" },
            },
        ];

        mockChunkDocument.mockReturnValue(chunks);


        const embeddedChunks = [
            {
                ...chunks[0],
                embedding: [0.1, 0.2],
            },
            {
                ...chunks[1],
                embedding: [0.3, 0.4],
            },
        ];

        mockEmbedChunks.mockResolvedValue(embeddedChunks);
        mockInsertChunks.mockResolvedValue(undefined);

        const buffer = Buffer.from("fake pdf data");
        const sourceDoc = "psychology.pdf";
        const metadata = { course: "PSYC" };

        const result = await ingestPdf(buffer, sourceDoc, metadata);
        expect(result).toBe(2);
        expect(mockExtractPdfText).toHaveBeenCalledWith(buffer);
        expect(mockChunkDocument).toHaveBeenCalledWith("These are my psychology study notes.", sourceDoc, metadata);
        expect(mockEmbedChunks).toHaveBeenCalledWith(chunks);
        expect(mockInsertChunks).toHaveBeenCalledWith(embeddedChunks);
    });

    it("throws when storing embedded chunks fails", async () => {
        mockExtractPdfText.mockResolvedValue(
            "These are my psychology study notes."
        );

        const chunks = [
            {
                text: "These are my psychology study notes.",
                sourceDoc: "psychology.pdf",
                chunkIndex: 0,
                metadata: { course: "PSYC" },
            },
        ];

        const embeddedChunks = [
            {
                ...chunks[0],
                embedding: [0.1, 0.2],
            },
        ];

        mockChunkDocument.mockReturnValue(chunks);
        mockEmbedChunks.mockResolvedValue(embeddedChunks);
        mockInsertChunks.mockRejectedValue(
            new Error("Database unavailable")
        );

        const buffer = Buffer.from("fake pdf data");
        await expect(ingestPdf(buffer, "psychology.pdf", { course: "PSYC" })).rejects.toThrow("Database unavailable");
    });
});