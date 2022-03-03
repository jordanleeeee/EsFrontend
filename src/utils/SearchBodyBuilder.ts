import {DocumentContentPart, MultiMatchType, Pagination, SearchMode} from "../types/search";
import {BoolQuery} from "../types/query";
import {highlightConfig, pageSize, returnedSource} from "./config";

export default class SearchBodyBuilder {
    pagination: Pagination
    searchMode: SearchMode
    allowTypo: boolean = false
    includePageRank: boolean = false
    sorting?: any[] = undefined
    query?: string
    multiMatchType?: MultiMatchType
    selectedField?: DocumentContentPart
    boostSetting?: Record<DocumentContentPart, number> = undefined

    constructor(searchMode: SearchMode, pagination: Pagination) {
        this.pagination = pagination;
        this.searchMode = searchMode
    }

    setAllowTypo(allow: boolean): SearchBodyBuilder {
        this.allowTypo = allow
        return this
    }

    setIncludePageRank(include: boolean): SearchBodyBuilder {
        this.includePageRank = include
        return this
    }

    setSorting(sort: { [x: string]: unknown }): SearchBodyBuilder {
        if (this.sorting) {
            throw Error("sorting can only be config once")
        }

        this.sorting = [];
        this.sorting.push(sort)
        if (!sort._score) {
            this.sorting.push("_score")
        }
        return this
    }

    setQuery(query: string): SearchBodyBuilder {
        this.query = query
        return this
    }

    setMultiMatchType(type: MultiMatchType): SearchBodyBuilder {
        this.multiMatchType = type
        return this
    }

    setSelectedField(field: DocumentContentPart): SearchBodyBuilder {
        this.selectedField = field
        return this
    }

    setBoostSetting(setting: Record<DocumentContentPart, number>): SearchBodyBuilder {
        this.boostSetting = setting
        return this
    }


    build(): BoolQuery {
        let myBoolQuery
        if (this.searchMode === 'MATCH_ALL') {
            myBoolQuery = {
                bool: {
                    must: {
                        match_all: {}
                    }
                }
            }
        } else if (this.searchMode === 'MATCH_TARGETED_FIELD_QUERY') {
            if (!this.selectedField) throw new Error("selected field is missing in match target field myBoolQuery")
            if (!this.query) throw new Error("myBoolQuery is missing in match target field myBoolQuery")
            myBoolQuery = {
                bool: {
                    must: {
                        match: {}
                    }
                }
            }
            let matchQuery: { [x: string]: any } = {}
            let innerMatchQuery: { [x: string]: any } = {}
            innerMatchQuery.query = this.query
            if (this.allowTypo) {
                innerMatchQuery.fuzziness = "AUTO"
            }
            matchQuery[this.selectedField] = innerMatchQuery
            myBoolQuery.bool.must.match = matchQuery
        } else if (this.searchMode === 'MATCH_ANY_FIELD_QUERY') {
            if (!this.multiMatchType) throw new Error("multi match type is missing in match any field myBoolQuery")
            if (!this.query) throw new Error("myBoolQuery is missing in match any field myBoolQuery")
            myBoolQuery = {
                bool: {
                    must: {
                        multi_match: {}
                    }
                }
            }
            let multiMatchQuery: { [x: string]: any } = {
                query: this.query,
                type: this.multiMatchType,
                fields: ["title", "body.h1", "body.h2", "body.content"]
            }
            if (this.allowTypo) {
                multiMatchQuery.fuzziness = "AUTO"
            }
            myBoolQuery.bool.must.multi_match = multiMatchQuery
        } else if (this.searchMode === 'BOOSTED_QUERY') {
            if (!this.multiMatchType) throw new Error("multi match type is missing in boosted myBoolQuery")
            if (!this.boostSetting) throw new Error("boost setting is missing in boosted myBoolQuery")
            if (!this.query) throw new Error("query is missing in boosted myBoolQuery")
            myBoolQuery = {
                bool: {
                    must: {
                        multi_match: {}
                    }
                }
            }
            let multiMatchQuery: { [x: string]: any } = {
                query: this.query,
                type: this.multiMatchType,
                fields: ["title^" + this.boostSetting.title, "body.h1^" + this.boostSetting["body.h1"], "body.h2^" + this.boostSetting["body.h2"], "body.content^" + this.boostSetting["body.content"]]
            }
            if (this.allowTypo) {
                multiMatchQuery.fuzziness = "AUTO"
            }
            myBoolQuery.bool.must.multi_match = multiMatchQuery
        }

        let boolQuery: BoolQuery = {
            query: myBoolQuery,
            _source: returnedSource,
            size: pageSize,
            from: this.pagination.pageSize * (this.pagination.currentPage - 1),
            highlight: highlightConfig,
            sort: this.sorting
        }
        if (this.includePageRank) {
            boolQuery.query.bool.should = [{
                rank_feature: {
                    field: "pageRank"
                }
            }]
        }
        return boolQuery
    }
}
