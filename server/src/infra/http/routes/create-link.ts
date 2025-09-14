import { createLink } from "@/app/functions/create-link"
import { getLinks } from "@/app/functions/get-links"
import { isRight, unwrapEither } from "@/shared/either"
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"

// Constante da rota de criação de link
export const createLinkRoute: FastifyPluginAsyncZod = async app => {
    // Este endereço receberá apenas a URL original e a URL encurtada pelo corpo da API
    app.post('/links', {
        schema: {
            summary: 'Create a new link',
            tags: ['links'],
            body: z.object({
                original: z.url().describe('Original URL'),
                short: z.string().min(3).max(40).describe('Short URL')
            }),
            response: {
                201: z.object({
                    id: z.uuidv7().describe('Id of the created link')
                }),

                400: z.object({
                    message: z.string().describe('Error message')
                }),

                409: z.object({
                    message: z.string().describe('Error message')
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

        if (short.length < 3) {
            return reply.status(400).send({ message: 'Short link must be at least 3 characters long' })
        } else if (short.length > 40) {
            return reply.status(400).send({ message: 'Short link must be at most 40 characters long' })
        }

        // Se tudo está certo, cria o link
        const result = await createLink({ original, short })

        const { id } = unwrapEither(result)

        return reply.status(201).send({ id })
    })
}