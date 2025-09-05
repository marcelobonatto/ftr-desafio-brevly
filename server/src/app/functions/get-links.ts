import { db } from "@/infra/db"
import { schema } from "@/infra/db/schemas"
import { Either, makeRight } from "@/shared/either"
import { asc, eq } from "drizzle-orm"
import z from "zod"

// Definição do tipo de entrada da função getLinks
const getLinksInput = z.object({
    short: z.string().min(3).max(40).optional(),
    page: z.number().optional().default(1),
    pageSize: z.number().optional().default(4)
})

type GetLinksInput = z.infer<typeof getLinksInput>;

// Definição do tipo de saída da função getLinks
type GetLinksOutput = {
    links: {
        id: string
        original: string
        short: string
        accesses: number
        createdAt: Date
    }[]
}

export async function getLinks(input: GetLinksInput): Promise<Either<never, GetLinksOutput>> {
    const { short, page, pageSize } = getLinksInput.parse(input);

    // Seleciona todos os registro da tabela links por ordem de data criada
    // limitada pela paginação
    const [ links ] = await Promise.all([
        db.select({
            id: schema.links.id,
            original: schema.links.original,
            short: schema.links.short,
            accesses: schema.links.accesses,
            createdAt: schema.links.createdAt
        }).from(schema.links)
          .where(short ? eq(schema.links.short, short) : undefined)
          .orderBy(asc(schema.links.createdAt))
        //   .limit(pageSize)
        //   .offset((page - 1) * pageSize)
    ])

    return makeRight({ links })
}