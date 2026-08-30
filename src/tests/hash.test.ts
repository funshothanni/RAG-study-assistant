import { describe, expect, test } from "vitest";
import { hashFile } from "../lib/hash";

describe("hashFile", () => {
    test("produces the same hash for identical file contents", () => {
        const firstBuffer = Buffer.from("same PDF contents");
        const secondBuffer = Buffer.from("same PDF contents");

        const firstHash = hashFile(firstBuffer);
        const secondHash = hashFile(secondBuffer);

        expect(firstHash).toBe(secondHash);
    });

    test("produces different hashes for different file contents", () => {
        const firstBuffer = Buffer.from("first PDF");
        const secondBuffer = Buffer.from("second PDF");

        expect(hashFile(firstBuffer)).not.toBe(
            hashFile(secondBuffer)
        );
    });
});