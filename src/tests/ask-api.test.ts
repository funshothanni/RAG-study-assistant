import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockAskQuestion } = vi.hoisted(() => {
    return {
        mockAskQuestion: vi.fn(),
    };
});

vi.mock("../lib/rag", () => ({
    askQuestion: mockAskQuestion,
}));

import { POST } from "../app/api/ask/route";

describe("POST /api/ask", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns an answer for a valid question", async () => {
        mockAskQuestion.mockResolvedValue(
            "Vector similarity compares numerical representations of text."
        );

        const request = new Request("http://localhost:3000/api/ask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                question: "What is vector similarity?",
            }),
        });

        const response = await POST(request);
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body).toEqual({
            answer: "Vector similarity compares numerical representations of text.",
        });
        expect(mockAskQuestion).toHaveBeenCalledWith(
            "What is vector similarity?",
        );
    });

    it("returns 400 for an empty question", async() => {
        const request = new Request("http://localhost:3000/api/ask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                question: "      ",
            }),
        });

        const response = await POST(request);
        const body = await response.json();

        expect(response.status).toBe(400);
        expect(body).toEqual({
            error: "Please enter a question with words."
        });
        expect(mockAskQuestion).not.toHaveBeenCalled();
    });

    it("returns 500 instead of crashing route when askQuestion fails", async () => {
        mockAskQuestion.mockRejectedValue(
            new Error("Something went wrong")
        );

        const request = new Request("http://localhost:3000/api/ask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                question: "What is vector similarity?",
            }),
        });

        const response = await POST(request);
        const body = await response.json();
        expect(response.status).toBe(500);
        expect(body).toEqual({ error: "Internal server error. Try again later" });
        expect(mockAskQuestion).toHaveBeenCalledWith("What is vector similarity?");
    })
});