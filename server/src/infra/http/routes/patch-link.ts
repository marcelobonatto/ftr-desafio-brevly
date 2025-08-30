import { updateAccessNumberLink } from "@/app/functions/update-access-number-link"
import { unwrapEither } from "@/shared/either"
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"

export const patchLinkRoute: FastifyPluginAsyncZod = async app => {
    app.patch('/links/:id', {
        schema: {
            summary: 'Increment the link\'s hit count',
            tags: ['links'],
            params: z.object({
                id: z.uuidv7().describe('Id of the link to update')
            }),
            response: {
                200: z.object({
                        link: z.object({
                            id: z.uuidv7().describe('Id'),
                            original: z.url().describe('Original URL'),
                            short: z.string().describe('Short URL'),
                            accesses: z.coerce.number().describe('Number of accesses'),
                            createdAt: z.coerce.date().describe('Creation date')
                        })
                     }).describe('Link resolved from the shortened URL'),

                404: z.object({
                    message: z.string().describe('Link not found')
                })
            }
        }
    }, async (request, reply) => {
        const { id } = request.params

        const result = await updateAccessNumberLink({ id })

        const { link } = unwrapEither(result)

        if (link == null) {
            return reply.status(404).send({ message: 'Link not found' })
        }

        return reply.status(200).send({ link })
    })
}