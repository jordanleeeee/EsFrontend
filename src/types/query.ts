export interface BoolQuery {
    query: {
        bool: {
            should?: {
                [x: string]: unknown;
            }[],
            must: {
                [x: string]: unknown;
            }
        }
    },
    _source: any,
    size: any,
    from: any,
    highlight: any,
    sort: any
}
