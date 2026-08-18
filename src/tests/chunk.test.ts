import { describe, test, expect } from "vitest";
import { chunkDocument } from "../lib/chunk";

describe("chunkDocument", () => {
    test("returns an empty array for empty text", () => {
        const text = "";
        const result = chunkDocument(text, "test.txt", {
            course: "TEST",
        });
        expect(result).toEqual([]);
    });

    test("returns an empty array for whitespace-only text", () => {
        const text = "        ";
        const result = chunkDocument(text, "test.txt", {
            course: "TEST",
        });
        expect(result).toEqual([]);
    });

    test("text shorter than the chunk size should produce exactly one chunk", () => {
        const text = "RAG uses retrieved course.";
        const result = chunkDocument(text, "test.txt", {
            course: "TEST",
        }, 5, 2);
        expect(result).toHaveLength(1);
        expect(result[0].text).toEqual(text);
        expect(result[0].sourceDoc).toEqual("test.txt");
        expect(result[0].chunkIndex).toEqual(0);
        expect(result[0].metadata).toEqual({course: "TEST"});
    });

    test("overlap occurs correctly from consecutive chunks", () => {
        const text = "one two three four five six seven eight nine ten eleven twelve";
        const result = chunkDocument(text, "test.txt", {
            course: "TEST",
        }, 5, 2);
        expect(result).toHaveLength(4);
        expect(result[0].text).toEqual("one two three four five");
        expect(result[1].text).toEqual("four five six seven eight");
        expect(result[2].text).toEqual("seven eight nine ten eleven");
        expect(result[3].text).toEqual("ten eleven twelve");
    });

    test("throws an error when chunk size is set to zero or less", () => {
        const text = "one two three four five six seven eight nine ten eleven twelve";
        expect(() => {chunkDocument(text, "test.txt", {
            course: "TEST",
        }, 0, 0);}).toThrow("Chunk size must be greater than 0.");
    });

    test("throws an error when overlap size is greater than or equal to chunk size", () => {
        const text = "one two three four five six seven eight nine ten eleven twelve";
        expect(() => {chunkDocument(text, "test.txt", {
            course: "TEST",
        }, 1, 2);}).toThrow("Overlap must be smaller than chunk size.");
    });
});