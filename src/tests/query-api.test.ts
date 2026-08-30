import {beforeEach, describe, expect, it, vi} from "vitest";

const {mockAskQuestion} = vi.hoisted(() => ({
    mockAskQuestion: vi.fn(),
}));

vi.mock("../lib/rag", () => ({
    askQuestion: mockAskQuestion,
}));

import {POST} from "../app/api/query/route";

describe("POST /api/query", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("receives a valid question and subject", async () => {
        mockAskQuestion.mockResolvedValue("Operant conditioning is something in PSYC");

        const request = new Request(
            "http://localhost:3000/api/query",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    question: "What is operant conditioning?",
                    subject: "PSYC",
                }),
            }
        );

        const response = await POST(request);
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body).toEqual({answer: "Operant conditioning is something in PSYC"});
        expect(mockAskQuestion).toHaveBeenCalledWith("What is operant conditioning?", "PSYC");
    });

    it("returns 400 when no subject is provided", async () => {
        const request = new Request(
            "http://localhost:3000/api/query",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    question: "What is operant conditioning?",
                }),
            }
        );

        const response = await POST(request);
        const body = await response.json();

        expect(response.status).toBe(400);
        expect(body).toEqual({error: "Please provide a subject."});
        expect(mockAskQuestion).not.toHaveBeenCalled();
    });

    it("returns 400 when no question is provided", async () => {
        const request = new Request(
            "http://localhost:3000/api/query",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    subject: "PSYC",
                }),
            }
        );

        const response = await POST(request);
        const body = await response.json();

        expect(response.status).toBe(400);
        expect(body).toEqual({error: "Please provide a question."});
        expect(mockAskQuestion).not.toHaveBeenCalled();
    });

    it("returns 400 when question is blank", async () => {
        const request = new Request(
            "http://localhost:3000/api/query",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    question: "   ",
                    subject: "PSYC",
                }),
            }
        );

        const response = await POST(request);
        const body = await response.json();

        expect(response.status).toBe(400);
        expect(body).toEqual({error: "Please provide a question."});
        expect(mockAskQuestion).not.toHaveBeenCalled();
    });

    it("returns 500 when question answering fails", async () => {
        mockAskQuestion.mockRejectedValue(
            new Error("RAG failed")
        );

        const request = new Request(
            "http://localhost:3000/api/query",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    question: "What is operant conditioning?",
                    subject: "PSYC",
                }),
            }
        );

        const response = await POST(request);
        const body = await response.json();

        expect(response.status).toBe(500);
        expect(body).toEqual({error: "Something went wrong"});
        expect(mockAskQuestion).toHaveBeenCalledWith("What is operant conditioning?", "PSYC");
    });
});

