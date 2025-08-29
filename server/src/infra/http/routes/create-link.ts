import { createLink } from "@/app/functions/create-link";
import { getLinks } from "@/app/functions/get-links";
import { isRight, unwrapEither } from "@/shared/either";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

export const createLinkRoute: FastifyPluginAsyncZod = async app => {
    app.post('/links', {
        schema: {
            summary: 'Create a new link',
            tags: ['links'],
            body: z.object({
                original: z.url(),
                short: z.string().min(3).max(40)
            }),
            response: {
                201: z.object({
                    id: z.uuidv7()
                }),

                400: z.object({
                    message: z.string()
                }),

                409: z.object({
                    message: z.string()
                })
            }
        }
    }, async (request, reply) => {
        const { original, short } = request.body

        // Valida se a URL original é válida
        if (!URL.canParse(original)) {
            return reply.status(400).send({ message: 'Invalid original URL' })
        }

        // Verifica se o link encurtado já existe
        const exists = await getLinks({ short, page: 1, pageSize: 1 })

        if (isRight(exists) && exists.right.links.length > 0) {
            return reply.status(409).send({ message: 'Short link already exists' })
        }

        // Se tudo está certo, cria o link
        const result = await createLink({ original, short })

        const { id } = unwrapEither(result)

        return reply.status(201).send({ id })
    });
}