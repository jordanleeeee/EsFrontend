export const elasticSearchUrl: string = "http://192.168.20.81:8443/"
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
