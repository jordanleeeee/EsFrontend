import {elasticSearchUrl, highlightConfig, returnedSource} from "./config"
import axios from 'axios'
import {DocumentContentPart, MultiMatchType, Pagination} from "../types/search";
import {BoolQuery} from "../types/query";

function matchAllRequest<T>(path: string, pageInfo: Pagination, sorting: any[], pageRankIncluded: boolean): Promise<T> {
    const url = elasticSearchUrl + path
    let searchBody: BoolQuery = {
        query: {
            bool: {
                must: {
                    match_all: {}
                }
            }
        },
        _source: returnedSource,
        size: pageInfo.pageSize,
        from: pageInfo.pageSize * (pageInfo.currentPage - 1),
        highlight: highlightConfig,
        sort: sorting
    }
    if (pageRankIncluded) {
        searchBody.query.bool.should = [{
            rank_feature: {
                field: "pageRank"
            }
        }]
    }
    const response = axios.post(url, searchBody);
    return response.then(response => response.data)
}

function anyMatchRequest<T>(path: string, query: string, matchType: MultiMatchType, pageInfo: Pagination, sorting: any[], pageRankIncluded: boolean): Promise<T> {
    const url = elasticSearchUrl + path
    let searchBody: BoolQuery = {
        query: {
            bool: {
                must: {
                    multi_match: {
                        query,
                        type: matchType,
                        fields: ["title", "body.h1", "body.h2", "body.content"]
                    }
                }
            }
        },
        _source: returnedSource,
        size: pageInfo.pageSize,
        from: pageInfo.pageSize * (pageInfo.currentPage - 1),
        highlight: highlightConfig,
        sort: sorting
    }
    if (pageRankIncluded) {
        searchBody.query.bool.should = [{
            rank_feature: {
                field: "pageRank"
            }
        }]
    }
    const response = axios.post(url, searchBody);
    return response.then(response => response.data)
}

function weightedMatchRequest<T>(path: string, query: string, weight: Record<DocumentContentPart, number>, pageInfo: Pagination, sorting: any[], pageRankIncluded: boolean): Promise<T> {
    const url = elasticSearchUrl + path
    let searchBody: BoolQuery = {
        query: {
            bool: {
                must: {
                    multi_match: {
                        query,
                        type: "most_fields",
                        fields: ["title^" + weight.title, "body.h1^" + weight["body.h1"], "body.h2^" + weight["body.h2"], "body.content^" + weight["body.content"]]
                    }
                }
            }
        },
        _source: returnedSource,
        size: pageInfo.pageSize,
        from: pageInfo.pageSize * (pageInfo.currentPage - 1),
        highlight: highlightConfig,
        sort: sorting
    }
    if (pageRankIncluded) {
        searchBody.query.bool.should = [{
            rank_feature: {
                field: "pageRank"
            }
        }]
    }
    const response = axios.post(url, searchBody);
    return response.then(response => response.data)
}

function matchByFieldRequest<T>(path: string, query: string, selectedField: DocumentContentPart, pageInfo: Pagination, sorting: any[], pageRankIncluded: boolean): Promise<T> {
    const url = elasticSearchUrl + path
    let searchBody: BoolQuery = {
        query: {
            bool: {
                must: {
                    match: {}
                }
            }
        },
        _source: returnedSource,
        size: pageInfo.pageSize,
        from: pageInfo.pageSize * (pageInfo.currentPage - 1),
        highlight: highlightConfig,
        sort: sorting
    }

    let matchQuery: { [x: string]: string } = {}
    matchQuery[selectedField] = query
    searchBody.query.bool.must.match = matchQuery

    if (pageRankIncluded) {
        searchBody.query.bool.should = [{
            rank_feature: {
                field: "pageRank"
            }
        }]
    }

    const response = axios.post(url, searchBody);
    return response.then(response => response.data)
}

export {
    matchAllRequest,
    anyMatchRequest,
    weightedMatchRequest,
    matchByFieldRequest,
}
