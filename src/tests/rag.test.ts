import { beforeEach, describe, expect, it, vi } from "vitest";
const { mockEmbedText, mockSearchChunks, mockGenerateAnswer } = vi.hoisted(() => {
    return {
        mockEmbedText: vi.fn(),
        mockSearchChunks: vi.fn(),
        mockGenerateAnswer: vi.fn(),
    };
});

vi.mock("../lib/embed", () => ({
    embedText: mockEmbedText,
}));

vi.mock("../lib/db", () => ({
    searchChunks: mockSearchChunks,
}));

vi.mock("../lib/generate", () => ({
    generateAnswer: mockGenerateAnswer,
}));

import { askQuestion } from "../lib/rag";

describe("askQuestion", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns an answer using retrieved context", async () => {
        mockEmbedText.mockResolvedValue([0.1, 0.2, 0.3]);

       mockSearchChunks.mockResolvedValue([
            {
                id: 1,
                text: "Vector similarity compares numerical representations of text.",
                source_doc: "test.txt",
                metadata: { course: "TEST" },
                similarity: 0.9,
            },

            {
                id: 2,
                text: "RAG uses similarity search to retrieve relevant information.",
                source_doc: "test.txt",
                metadata: { course: "TEST" },
                similarity: 0.8,
            },
        ]);

       mockGenerateAnswer.mockResolvedValue(
            "Vector similarity compares text embeddings to find related information."
        );

        const question = "What is vector similarity?";
        const answer = await askQuestion(question);

        expect(answer).toBe("Vector similarity compares text embeddings to find related information.");
        expect(mockEmbedText).toHaveBeenCalledWith(question);
        expect(mockSearchChunks).toHaveBeenCalledWith([0.1, 0.2, 0.3], 0.5, 5);
        expect(mockGenerateAnswer).toHaveBeenCalledWith(question, "Vector similarity compares numerical representations of text.\n\n" + "RAG uses similarity search to retrieve relevant information.");
    })
})