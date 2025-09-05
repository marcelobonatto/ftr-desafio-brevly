export type Link = {
    id: string
    original: string
    short: string
    accesses: number
    createdAt: string
    status: 'active' | 'inactive'
}