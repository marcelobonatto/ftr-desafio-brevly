import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { Either, makeRight } from "@/shared/either";
import { eq, sql } from "drizzle-orm";
import z from "zod";

const updateAccessNumberLinkInput = z.object({
    id: z.uuidv7()
})

type UpdateAccessNumberLinkInput = z.infer<typeof updateAccessNumberLinkInput>

type UpdateAccessNumberLinkOutput = {
    link: {
        id: string
        original: string
        short: string
        accesses: number
        createdAt: Date
    }
}

export async function updateAccessNumberLink(input: UpdateAccessNumberLinkInput): Promise<Either<never, UpdateAccessNumberLinkOutput>> {
    const { id } = updateAccessNumberLinkInput.parse(input)

    const links = await db.update(schema.links)
                          .set({
                                accesses: sql`${schema.links.accesses} + 1`
                          })
                          .where(eq(schema.links.id, id))
                          .returning({
                              id: schema.links.id,
                              original: schema.links.original,
                              short: schema.links.short,
                              accesses: schema.links.accesses,
                              createdAt: schema.links.createdAt
                          })

    return makeRight({ link: links[0] })
}