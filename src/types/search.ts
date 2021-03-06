export type SearchMode = "MATCH_ALL" | "MATCH_ANY_FIELD_QUERY" | "BOOSTED_QUERY" | "MATCH_TARGETED_FIELD_QUERY" | "WILDCARD_QUERY"
export type DocumentContentPart = "title" | "body.h1" | "body.h2" | "body.content"
export type MultiMatchType = "best_fields" | "most_fields" | "cross_fields" | "phrase" | "phrase_prefix" | "bool_prefix"
export type SortBy = "size" | "_score" | "updatedTime" | "pageRank.numeric"
export interface Pagination {
    total: number
    currentPage: number
    pageSize: number
}
