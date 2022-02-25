import {ShopDocument} from "./document";

export interface EsResponse {
    took: number
    timed_out: boolean
    hits: Hits
    [x: string]: unknown;
}

export interface Hits {
    total: {value: number, relation: string}
    max_score: number
    hits: HitDetails[]
}

export interface HitDetails {
    _index: string
    _id: string,
    _score: number,
    _source: ShopDocument,
    highlight: Highlight
}

export interface Highlight {
    "body.content": string[]
}

