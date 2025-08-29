import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { Either, makeRight } from "@/shared/either";
import z from "zod";

const createLinkInput = z.object({
    original: z.url(),
    short: z.string().min(3).max(40)
})

type createLinkInput = z.input<typeof createLinkInput>

export async function createLink(input: createLinkInput): Promise<Either<never, { id: string }>> {
    const { original, short } = createLinkInput.parse(input);

    const insertedLink = await db.insert(schema.links)
                                 .values({
                                    original,
                                    short
                                 }).returning({ id: schema.links.id })

    return makeRight({ id: insertedLink[0].id })
}