import { db } from "@/infra/db"
import { schema } from "@/infra/db/schemas"
import { Either, makeRight } from "@/shared/either"
import z from "zod"

// Definição do tipo de entrada da função createLink
const createLinkInput = z.object({
    original: z.url(),
    short: z.string().min(3).max(40)
})

type CreateLinkInput = z.infer<typeof createLinkInput>

export async function createLink(input: CreateLinkInput): Promise<Either<never, { id: string }>> {
    const { original, short } = createLinkInput.parse(input);

    // Inclui o link com as informaçõese da URL original e URL encurtada
    // e retorna o id gerado
    const insertedLink = await db.insert(schema.links)
                                 .values({
                                    original,
                                    short
                                 }).returning({ id: schema.links.id })

    return makeRight({ id: insertedLink[0].id })
}