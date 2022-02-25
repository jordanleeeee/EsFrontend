import {useState} from 'react';
import './App.css';

import {matchAllRequest, anyMatchRequest, weightedMatchRequest, matchByFieldRequest} from './utils/EsClient'
import {EsResponse} from "./types/es";
import QueryResultDisplay from "./component/QueryResultDisplay";
import {SearchMode, DocumentContentPart, Pagination, MultiMatchType} from "./types/search";
import {pageSize} from "./utils/config";

function App() {
    const [query, setQuery] = useState<string>("")
    const [mcdonaldsSelected, setMcdonaldsSelected] = useState<boolean>(false)
    const [subwaySelected, setSubwaySelected] = useState<boolean>(false)
    const [starbucksSelected, setStarbucksSelected] = useState<boolean>(false)
    const [searchResponse, setSearchResponse] = useState<EsResponse>()
    const [searchMode, setSearchMode] = useState<SearchMode>("MATCH_ALL")
    const [multiMatchType, setMultiMatchType] = useState<MultiMatchType>("best_fields")
    const [selectedField, setSelectedField] = useState<DocumentContentPart>("title")
    const [weight, setWeight] = useState<Record<DocumentContentPart, number>>({
        "title": 1,
        "body.h1": 1,
        "body.h2": 1,
        "body.content": 1
    })
    const [pagination, setPagination] = useState<Pagination>({
        pageSize,
        total: 0,
        currentPage: 1
    })

    function search(page: number) {
        const shop: string[] = [];
        if (mcdonaldsSelected) shop.push("mcdonalds")
        if (subwaySelected) shop.push("subway")
        if (starbucksSelected) shop.push("starbucks")

        let url = "";
        if (shop.length > 0) url = shop.join(",") + "/"
        url += "_search"

        let currentPagination = pagination
        currentPagination.currentPage = page

        let response;
        switch (searchMode) {
            case "MATCH_ALL":
                response = matchAllRequest<EsResponse>(url, currentPagination)
                break
            case "MATCH_ANY_FIELD_QUERY":
                response = anyMatchRequest<EsResponse>(url, query, multiMatchType, currentPagination)
                break
            case "BOOSTED_QUERY":
                response = weightedMatchRequest<EsResponse>(url, query, weight, currentPagination)
                break
            case "MATCH_TARGETED_FIELD_QUERY":
                response = matchByFieldRequest<EsResponse>(url, query, selectedField, currentPagination)
                break
        }
        response.then(response => {
            currentPagination.total = response.hits.total.value
            setPagination(currentPagination)
            setSearchResponse(response)
        })
    }

    function nextPage() {
        if (pagination.currentPage < Math.ceil(pagination.total / pagination.pageSize)) {
            search(pagination.currentPage + 1)
        }
    }

    function previousPage() {
        if (pagination.currentPage > 1) {
            setPagination({...pagination, currentPage: pagination.currentPage - 1})
            search(pagination.currentPage - 1)
        }
    }

    function weightBox() {
        if (searchMode === 'BOOSTED_QUERY') {
            return (
                <div style={{display: 'flex', alignItems: "center"}}>
                    <div>weight of field:</div>
                    <table style={{margin: '0 10px'}}>
                        <tr>
                            <td>title</td>
                            <td><input style={{width: "50px"}} type={"number"} onChange={content => {
                                setWeight({...weight, title: content.target.value as unknown as number})
                            }} value={weight.title}/></td>
                            <td>h1</td>
                            <td><input style={{width: "50px"}} type={"number"} onChange={content => {
                                setWeight({...weight, "body.h1": content.target.value as unknown as number})
                            }} value={weight["body.h1"]}/></td>
                        </tr>
                        <tr>
                            <td>h2</td>
                            <td><input style={{width: "50px"}} type={"number"} onChange={content => {
                                setWeight({...weight, "body.h2": content.target.value as unknown as number})
                            }} value={weight["body.h2"]}/></td>
                            <td>other</td>
                            <td><input style={{width: "50px"}} type={"number"} onChange={content => {
                                setWeight({...weight, "body.content": content.target.value as unknown as number})
                            }} value={weight["body.content"]}/></td>
                        </tr>
                    </table>
                </div>
            )
        }
    }

    function selectFieldBox() {
        if (searchMode === 'MATCH_TARGETED_FIELD_QUERY') {
            return (
                <div style={{display: 'flex', alignItems: "center"}}>
                    <div>select one field:</div>
                    <table style={{margin: '0 10px'}}>
                        <tr>
                            <td><input onChange={event => setSelectedField(event.target.value as DocumentContentPart)} checked={selectedField === 'title'} name="field" value="title" type={"radio"}/></td>
                            <td>title</td>
                            <td><input onChange={event => setSelectedField(event.target.value as DocumentContentPart)} checked={selectedField === 'body.h1'} name="field" value="body.h1" type={"radio"}/></td>
                            <td>h1</td>
                        </tr>
                        <tr>
                            <td><input onChange={event => setSelectedField(event.target.value as DocumentContentPart)} checked={selectedField === 'body.h2'} name="field" value="body.h2" type={"radio"}/></td>
                            <td>h2</td>
                            <td><input onChange={event => setSelectedField(event.target.value as DocumentContentPart)} checked={selectedField === 'body.content'} name="field" value="body.content" type={"radio"}/></td>
                            <td>content</td>
                        </tr>
                    </table>
                </div>
            )
        }
    }

    function queryInputBox() {
        if (searchMode !== 'MATCH_ALL') {
            return (
                <>
                    <div>your query:</div>
                    <input id="queryBox" type={"text"} onChange={content => setQuery(content.target.value)}/>
                </>
            )
        }
    }

    function multiMatchTypeSelectBox() {
        if (searchMode === 'MATCH_ANY_FIELD_QUERY') {
            return (
                <>
                    <label htmlFor="cars">Choose a match type:</label>
                    <select style={{margin: '0 10px'}} onChange={event => setMultiMatchType(event.target.value as MultiMatchType)} value={multiMatchType}>
                        <option value="best_fields">best_fields</option>
                        <option value="most_fields">most_fields</option>
                        <option value="phrase">phrase</option>
                        <option value="phrase_prefix">phrase_prefix</option>
                    </select>
                </>
            )
        }
    }

    function paginationDisplay() {
        if (searchResponse !== undefined) {
            const totalPage = Math.ceil(pagination.total / pagination.pageSize)
            return (
                <div style={{display: "flex", alignItems: "flex-end", margin: '5px 0px', justifyContent: 'center'}}>
                    {
                        <div style={{margin: '0 12px', fontSize: '20px', cursor: 'pointer'}} onClick={() => previousPage()}>
                            {pagination.currentPage > 1 ? <span>&lt;</span> : <span>&nbsp;</span>}
                        </div>
                    }
                    <div style={{fontSize: '18px'}}>page {pagination.currentPage} out of {totalPage}</div>
                    {
                        <div style={{margin: '0 12px', fontSize: '20px', cursor: 'pointer'}} onClick={() => nextPage()}>
                            {pagination.currentPage !== totalPage ? <span>&gt;</span> : <span>&nbsp;</span>}
                        </div>
                    }
                </div>
            )
        }
    }

    return (
        <>
            <h1>Fast Food Shop Search Engine</h1>

            <div style={{display: "flex", justifyContent: "space-between", alignContent: "baseline"}}>
                <div>
                    <div style={{display: 'flex', margin: '5px 0px'}}>
                        <div>choose your target shop(s):</div>
                        <input onChange={() => setMcdonaldsSelected(!mcdonaldsSelected)} type={"checkbox"}/>
                        <label>mcdonalds</label>
                        <input onChange={() => setSubwaySelected(!subwaySelected)} type={"checkbox"}/>
                        <label>subway</label>
                        <input onChange={() => setStarbucksSelected(!starbucksSelected)} type={"checkbox"}/>
                        <label>starbucks</label>
                    </div>

                    <form onSubmit={event => {
                        event.preventDefault();
                        search(1)
                    }}>
                        <div style={{display: 'flex', margin: '5px 0px'}}>
                            <div>search mode:</div>
                            <input onChange={event => setSearchMode(event.target.value as SearchMode)} checked={searchMode === "MATCH_ALL"} name="mode" value="MATCH_ALL" type={"radio"}/>
                            <label>matchAll</label>

                            <input onChange={event => setSearchMode(event.target.value as SearchMode)} checked={searchMode === "MATCH_TARGETED_FIELD_QUERY"} name="mode" value="MATCH_TARGETED_FIELD_QUERY" type={"radio"}/>
                            <label>matchParticularFieldQuery</label>

                            <input onChange={event => setSearchMode(event.target.value as SearchMode)} checked={searchMode === "MATCH_ANY_FIELD_QUERY"} name="mode" value="MATCH_ANY_FIELD_QUERY" type={"radio"}/>
                            <label>matchAnyFieldQuery</label>

                            <input onChange={event => setSearchMode(event.target.value as SearchMode)} checked={searchMode === "BOOSTED_QUERY"} name="mode" value="BOOSTED_QUERY" type={"radio"}/>
                            <label>boostedQuery</label>
                        </div>

                        <div style={{display: 'flex', alignItems: 'center', margin: '5px 0px'}}>
                            {queryInputBox()}
                            {weightBox()}
                            {selectFieldBox()}
                            {multiMatchTypeSelectBox()}
                            <button type='submit' style={{height: '30px'}}>search</button>
                        </div>
                    </form>
                </div>
                {paginationDisplay()}
            </div>

            <hr/>

            {
                searchResponse !== undefined &&
                <QueryResultDisplay took={searchResponse.took} timed_out={searchResponse.timed_out} hits={searchResponse.hits}/>
            }
        </>
    );
}

export default App;
