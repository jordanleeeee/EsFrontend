import {elasticSearchUrl} from "./config"
import axios from 'axios'
import {BoolQuery} from "../types/query";
import {EsSuggestResponse} from "../types/es";


function searchRequest<T>(path: string, query: BoolQuery): Promise<T> {
    const url = elasticSearchUrl + path
    const response = axios.post(url, query);
    return response.then(response => response.data)
}

function aggregateRequest<T>(path: string, aggregation: any): Promise<T> {
    const url = elasticSearchUrl + path
    const response = axios.post(url, {
        size: 0,
        aggs: aggregation
    });
    return response.then(response => response.data)
}

function suggestPhraseRequest(path: string, query: string): Promise<string[]> {
    if (query.length === 0) return Promise.resolve([])
    const url = elasticSearchUrl + path
    const response = axios.post<EsSuggestResponse>(url, {
        suggest: {
            text: query,
            my_custom_suggest: {
                phrase: {
                    field: "body.content",
                }
            }
        },
        size: 0
    });
    return response.then(response => {
        return response.data.suggest.my_custom_suggest[0].options.reduce<string[]>((arr, option) => {
            arr.push(option.text)
            return arr
        }, [])
    })
}

function suggestTermRequest(path: string, query: string): Promise<string[]> {
    if (query.length === 0) return Promise.resolve([])
    const url = elasticSearchUrl + path
    const response = axios.post<EsSuggestResponse>(url, {
        suggest: {
            text: query,
            my_custom_suggest: {
                term: {
                    field: "body.content"
                }
            }
        },
        size: 0
    });
    const words = query.trim().split(" ").length - 1
    return response.then(response => {
        return response.data.suggest.my_custom_suggest[words].options.reduce<string[]>((arr, option) => {
            arr.push(option.text)
            return arr
        }, [])
    })
}

function suggestCompletionRequest(path: string, query: string): Promise<string[]> {
    if (query.length === 0) return Promise.resolve([])
    const url = elasticSearchUrl + path
    const response = axios.post<EsSuggestResponse>(url, {
        suggest: {
            my_custom_suggest: {
                text: query,
                completion: {
                    field: "tags.suggest",
                    skip_duplicates: true,
                    fuzzy: {}
                }
            }
        },
        size: 0
    });
    return response.then(response => {
        return response.data.suggest.my_custom_suggest[0].options.reduce<string[]>((arr, option) => {
            arr.push(option.text)
            return arr
        }, [])
    })
}

export {
    searchRequest,
    aggregateRequest,
    suggestPhraseRequest,
    suggestTermRequest,
    suggestCompletionRequest
}
