import { db, pg } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { Either, makeRight } from "@/shared/either";

// Definição do tipo de saída da função getAllLinks
type GetAllLinksOutput = {
    links: {
        original: string
        short: string
        accesses: number
        createdAt: Date
    }[]
}
//TODO: ver app/functions/export-uploads.ts para ver o que fazer nesse caso
export async function exportToCsv(): Promise<Either<never, GetAllLinksOutput>> {
    // Seleciona todos os registro da tabela links por ordem de data criada
    const { sql, params } = db.select({
                                    original: schema.links.original,
                                    short: schema.links.short,
                                    accesses: schema.links.accesses,
                                    createdAt: schema.links.createdAt
                                }).from(schema.links)
                                  .orderBy(schema.links.createdAt)
                                  .toSQL()

    const cursor = pg.unsafe(sql, params as string[]).cursor()

    const headers = [ "URL Original", "URL Encurtada", "Acessos", "Data de Criação" ];

    const rows = links.map((link) => [
        link.original,
        link.short,
        link.accesses,
        format(link.createdAt, "yyyy-MM-dd HH:mm:ss")
    ])

    // Juntamos os cabeçalhos e os dados
    const csvData = [headers, ...rows];

    const content = Papa.unparse(csvData, {
        quotes: (value) => typeof value !== 'number' && value != null
    })

    return makeRight({ links });
}