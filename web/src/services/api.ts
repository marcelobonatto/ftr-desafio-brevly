import type { Link } from '@/types/Link'

type LinksResponse = {
    links: Link[]
}

export const api = {
    url: import.meta.env.VITE_BACKEND_URL,

    async getLinks(): Promise<LinksResponse> {
        const response = await fetch(`${this.url}/links`)
        if (!response.ok) throw new Error('Erro ao buscar links')
        return response.json()
    },

    async createLink(data: Omit<Link, 'id' | 'createdAt' | 'accesses'>): Promise<Link> {
        const response = await fetch(`${this.url}/links`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Erro ao criar link');
        return response.json();
    },
    
    async updateLink(id: string, data: Partial<Link>): Promise<Link> {
        const response = await fetch(`${this.url}/links/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Erro ao atualizar link');
        return response.json();
    },
    
    async deleteLink(id: string): Promise<void> {
        const response = await fetch(`${this.url}/links/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Erro ao deletar link');
    }
}