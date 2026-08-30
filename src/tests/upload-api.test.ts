import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockIngestPdf } = vi.hoisted(() => ({
    mockIngestPdf: vi.fn(),
}));

vi.mock("../lib/ingest", () => ({
    ingestPdf: mockIngestPdf,
}));

import { POST } from "../app/api/upload/route";

describe("POST /api/upload", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("uploads and ingests a valid PDF", async () => {
        mockIngestPdf.mockResolvedValue(14);
        const file = new File(
            ["fake pdf contents"],
            "psychology.pdf",
            { type: "application/pdf" }
        );

        const formData = new FormData();

        formData.append("file", file);
        formData.append("subject", "PSYC");

        const request = new Request(
            "http://localhost:3000/api/upload",
            {
                method: "POST",
                body: formData,
            }
        );

        const response = await POST(request);
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body).toEqual({
            message: "PDF uploaded successfully.",
            count: 14,
        });
        expect(mockIngestPdf).toHaveBeenCalledWith(
            expect.any(Buffer),
            "psychology.pdf",
            { subject: "PSYC" }
        );
    });

    it("returns 400 when no file is provided", async () => {
        const formData = new FormData();
        formData.append("subject", "PSYC");

        const request = new Request(
            "http://localhost:3000/api/upload",
            {
                method: "POST",
                body: formData,
            }
        );

        const response = await POST(request);
        const body = await response.json();

        expect(response.status).toBe(400);

        expect(body).toEqual({
            error: "Please upload a file.",
        });

        expect(mockIngestPdf).not.toHaveBeenCalled();
    });

    it("returns 400 when the uploaded file is not a PDF", async () => {
        const file = new File(
            ["fake text contents"],
            "notes.txt",
            { type: "text/plain" }
        );

        const formData = new FormData();
        formData.append("file", file);
        formData.append("subject", "PSYC");

        const request = new Request(
            "http://localhost:3000/api/upload",
            {
                method: "POST",
                body: formData,
            }
        );

        const response = await POST(request);
        const body = await response.json();

        expect(response.status).toBe(400);

        expect(body).toEqual({
            error: "Only PDF files are supported.",
        });

        expect(mockIngestPdf).not.toHaveBeenCalled();
    });

    it("returns 400 when no subject is provided", async () => {
        const file = new File(
            ["fake pdf contents"],
            "psychology.pdf",
            { type: "application/pdf" }
        );

        const formData = new FormData();
        formData.append("file", file);

        const request = new Request(
            "http://localhost:3000/api/upload",
            {
                method: "POST",
                body: formData,
            }
        );

        const response = await POST(request);
        const body = await response.json();

        expect(response.status).toBe(400);

        expect(body).toEqual({
            error: "Please provide a subject.",
        });

        expect(mockIngestPdf).not.toHaveBeenCalled();
    });

    it("returns 500 when PDF ingestion fails", async () => {
        mockIngestPdf.mockRejectedValue(
            new Error("Ingestion failed")
        );

        const file = new File(
            ["fake pdf contents"],
            "psychology.pdf",
            { type: "application/pdf" }
        );

        const formData = new FormData();
        formData.append("file", file);
        formData.append("subject", "PSYC");

        const request = new Request(
            "http://localhost:3000/api/upload",
            {
                method: "POST",
                body: formData,
            }
        );

        const response = await POST(request);
        const body = await response.json();

        expect(response.status).toBe(500);

        expect(body).toEqual({
            error: "Internal server error",
        });

        expect(mockIngestPdf).toHaveBeenCalled();
    });

    it("returns 400 when subject is blank", async () => {
        const file = new File(
            ["fake pdf contents"],
            "psychology.pdf",
            { type: "application/pdf" }
        );

        const formData = new FormData();
        formData.append("file", file);
        formData.append("subject", "   ");

        const request = new Request(
            "http://localhost:3000/api/upload",
            {
                method: "POST",
                body: formData,
            }
        );

        const response = await POST(request);
        const body = await response.json();

        expect(response.status).toBe(400);

        expect(body).toEqual({
            error: "Please provide a subject.",
        });

        expect(mockIngestPdf).not.toHaveBeenCalled();
    });
});