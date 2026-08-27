import {beforeEach, describe, expect, it, vi} from "vitest";

const { mockGetText, mockDestroy } = vi.hoisted(() => ({
    mockGetText: vi.fn(),
    mockDestroy: vi.fn(),
}));

vi.mock("pdf-parse/worker", () => ({
    getPath: vi.fn(() => "/fake/pdf.worker.mjs"),
}));

vi.mock("pdf-parse", () => {
    const PDFParse = vi.fn(class {
        getText = mockGetText;
        destroy = mockDestroy;
    });

    Object.assign(PDFParse, {
        setWorker: vi.fn(),
    });

    return { PDFParse };
});

import { extractPdfText } from "../lib/extract";

describe("extractPdfText", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns extracted text from a PDF", async () => {
        mockGetText.mockResolvedValue({
            text: "These are my psychology study notes."
        });

        const buffer = Buffer.from("fake pdf data");
        const result= await extractPdfText(buffer);
        expect(result).toBe("These are my psychology study notes.");
        expect(mockDestroy).toHaveBeenCalledOnce();
    });

    it("destroys the parser when PDF extraction fails", async () => {
        mockGetText.mockRejectedValue(
            new Error("Failed to parse PDF")
        );

        const buffer = Buffer.from("invalid pdf data");

        await expect(extractPdfText(buffer)).rejects.toThrow("Failed to parse PDF");
        expect(mockDestroy).toHaveBeenCalledOnce();
    });
});