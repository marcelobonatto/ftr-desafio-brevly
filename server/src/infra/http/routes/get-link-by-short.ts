import { getLinks } from "@/app/functions/get-links";
import { unwrapEither } from "@/shared/either";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

// Constante da rota de listagem de links
export const getLinksByShortRoute: FastifyPluginAsyncZod = async (app) => {
    // O endereço da rota será links.
    app.get('/links/:short', {
        schema: {
            summary: 'Select link by short URL',
            tags: ['links'],
            params: z.object({
                short: z.string().describe('Short URL')
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
        const { short } = request.params;

        // Como esperamos apenas 1, então passo página 1 e tamanho da página 1
        const result = await getLinks({ short, page: 1, pageSize: 1 });

        const { links } = unwrapEither(result);

        // Se retornar vazio, então retorna 404
        if (links.length === 0) {
            return reply.status(404).send({ message: 'Link not found' });
        }

        return reply.status(200).send({ link: links[0] });
    });
}