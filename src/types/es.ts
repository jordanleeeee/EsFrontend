import {ShopDocument} from "./document";

export interface EsResponse {
    took: number
    timed_out: boolean
    hits: Hits
    [x: string]: unknown
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


export interface EsAggrResponse extends EsResponse {
    aggregations: MyCustomAggr
}

export interface MyCustomAggr {
    my_custom_aggregation: Buckets
}

export interface Buckets {
    buckets: Bucket[]
}

export interface Bucket {
    key_as_string: string,
    key: string,
    doc_count: number
}

export interface EsSuggestResponse extends EsResponse {
    suggest: MyCustomSuggest
}

export interface MyCustomSuggest {
    my_custom_suggest: Suggestion[]
}

export interface Suggestion {
    text: string
    offset: number
    length: number
    options: Option[]
}

export interface Option {
    text: string
    score: number
}
