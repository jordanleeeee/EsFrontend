import {elasticSearchUrl} from "./config"
import axios from 'axios'
import {BoolQuery} from "../types/query";


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

export {
    searchRequest,
    aggregateRequest
}
