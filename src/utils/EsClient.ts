import {elasticSearchUrl} from "./config"
import axios from 'axios'
import {BoolQuery} from "../types/query";


function searchRequest<T>(path: string, query: BoolQuery): Promise<T> {
    const url = elasticSearchUrl + path
    const response = axios.post(url, query);
    return response.then(response => response.data)
}

export {
    searchRequest
}
