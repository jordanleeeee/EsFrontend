import {elasticSearchUrl, highlightConfig, returnedSource} from "./config"
import axios from 'axios'
import {DocumentContentPart, MultiMatchType, Pagination} from "../types/search";

function matchAllRequest<T>(path: string, pageInfo: Pagination): Promise<T> {
    const url = elasticSearchUrl + path
    const response = axios.post(url, {
        query: {
            match_all: {}
        },
        _source: returnedSource,
        size: pageInfo.pageSize,
        from: pageInfo.pageSize * (pageInfo.currentPage - 1),
        highlight: highlightConfig
    });
    return response.then(response => response.data)
}

function anyMatchRequest<T>(path: string, query: string, matchType: MultiMatchType, pageInfo: Pagination): Promise<T> {
    const url = elasticSearchUrl + path
    const response = axios.post(url, {
        query: {
            multi_match: {
                query,
                type: matchType,
                fields: ["title", "body.h1", "body.h2", "body.content"]
            }
        },
        _source: returnedSource,
        size: pageInfo.pageSize,
        from: pageInfo.pageSize * (pageInfo.currentPage - 1),
        highlight: highlightConfig
    });
    return response.then(response => response.data)
}

function weightedMatchRequest<T>(path: string, query: string, weight: Record<DocumentContentPart, number>, pageInfo: Pagination): Promise<T> {
    const url = elasticSearchUrl + path
    const response = axios.post(url, {
        query: {
            multi_match: {
                query,
                fields: ["title^" + weight.title, "body.h1^" + weight["body.h1"], "body.h2^" + weight["body.h2"], "body.content^" + weight["body.content"]]
            }
        },
        _source: returnedSource,
        size: pageInfo.pageSize,
        from: pageInfo.pageSize * (pageInfo.currentPage - 1),
        highlight: highlightConfig
    });
    return response.then(response => response.data)
}

function matchByFieldRequest<T>(path: string, query: string, selectedField: DocumentContentPart, pageInfo: Pagination): Promise<T> {
    const url = elasticSearchUrl + path
    let searchRequest = {
        query: {
            match: {}
        },
        _source: returnedSource,
        size: pageInfo.pageSize,
        from: pageInfo.pageSize * (pageInfo.currentPage - 1),
        highlight: highlightConfig
    }

    let matchQuery: { [x: string]: string } = {}
    matchQuery[selectedField] = query
    searchRequest.query.match = matchQuery

    const response = axios.post(url, searchRequest);
    return response.then(response => response.data)
}

export {
    matchAllRequest,
    anyMatchRequest,
    weightedMatchRequest,
    matchByFieldRequest
}
