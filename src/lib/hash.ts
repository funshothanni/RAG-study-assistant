import { createHash } from "crypto";

export function hashFile(buffer: Buffer): string {
    return createHash("sha256")
        .update(buffer)
        .digest("hex");
}