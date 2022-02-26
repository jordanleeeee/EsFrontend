export interface ShopDocument {
    title: string
    url: string
    body: PageBody
    links: string[]
    size: number
    updatedTime: Date
    tags: string[]
    pageRank: number
}

export interface PageBody {
    h1: string[]
    h2: string[]
    content: string
}
