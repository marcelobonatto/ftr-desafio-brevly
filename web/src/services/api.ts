import type { Link } from "@/types/Link";

type LinksResponse = {
  links: Link[];
};

type LinkResponse = {
  link: Link;
};

export const api = {
  url: import.meta.env.VITE_BACKEND_URL,

  async getLinks(): Promise<LinksResponse> {
    const response = await fetch(`${this.url}/links`);
    if (!response.ok) throw new Error("Erro ao buscar links");
    return response.json();
  },

  async getLinkByShort(short: string): Promise<LinkResponse> {
    const response = await fetch(`${this.url}/links/${short}`);
    if (!response.ok) throw new Error("Erro ao buscar o link");
    return response.json();
  },

  async createLink(
    data: Omit<Link, "id" | "createdAt" | "accesses">
  ): Promise<Link> {
    const response = await fetch(`${this.url}/links`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Erro ao criar link");
    return response.json();
  },

  async updateLink(id: string): Promise<Link> {
    const response = await fetch(`${this.url}/links/${id}`, {
      method: "PATCH",
    });
    if (!response.ok) throw new Error("Erro ao atualizar link");
    return response.json();
  },

  async deleteLink(id: string): Promise<void> {
    const response = await fetch(`${this.url}/links/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erro ao deletar link");
  },
};
