import { db } from "@/infra/db"
import { schema } from "@/infra/db/schemas"
import { Either, makeRight } from "@/shared/either"
import { eq } from "drizzle-orm"
import z from "zod"

// Definição do tipo de entrada da função deleteLink
const deleteLinkInput = z.object({
    id: z.uuidv7()
})

type deleteLinkInput = z.input<typeof deleteLinkInput>

export async function deleteLink(input: deleteLinkInput): Promise<Either<never, { id: string }>> {
    const { id } = deleteLinkInput.parse(input)

    // Exclui o link pelo id indicado e retorna o id excluído
    const deletedLink = await db.delete(schema.links)
                                .where(eq(schema.links.id, id))
                                .returning({ id: schema.links.id })

    // Se o retorno vier com um array com mais de um registro, retorna o id.
    // Senão retorna vazio, indicando que nada foi excluido.
    return makeRight({ id: deletedLink.length > 0 ? deletedLink[0].id : '' })
}