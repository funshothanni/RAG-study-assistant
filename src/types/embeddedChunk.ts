import {Chunk} from "./chunk";

export interface EmbeddedChunk extends Chunk {
    embedding: number[];
}