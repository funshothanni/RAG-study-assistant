export class DuplicateDocumentError extends Error {
    constructor(fileName: string) {
        super(`Document '${fileName}' has already been uploaded`);
        this.name = "DuplicateDocumentError";
    }
}