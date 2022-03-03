// export const elasticSearchUrl: string = "http://127.0.0.1:9200/"
// export const elasticSearchUrl: string = "http://127.0.0.1:8443/ajax/"
export const elasticSearchUrl: string = "http://www.jordanleeeee.com/ajax/"
export const pageSize: number = 10
export const highlightConfig = {
    fields: {
        "body.content": {
            type: "plain",
            fragment_size: 200,
            number_of_fragments: 1
        }
    }
}
export const returnedSource = ["url", "title", "updatedTime", "size", "body.content", "pageRank"]
