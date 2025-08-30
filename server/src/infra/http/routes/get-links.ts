import { getLinks } from "@/app/functions/get-links";
import { unwrapEither } from "@/shared/either";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

// Constante da rota de listagem de links
export const getLinksRoute: FastifyPluginAsyncZod = async app => {
    // O endereço da rota será links e pode ter a divisão por páginas.
    // Exemplos:
    // - /links => lista a primeira página retornando 4 registros
    // - /links?page=2 => lista a segunda página retornando 4 registros
    // - /links?page=2&pageSize=10 => lista a segunda página retornando 10 registros
    //
    // Para referência desse link, verifique o segundo parâmetro,
    // que tem a formatação da entrada e da saída
    app.get('/links', {
        schema: {
            summary: 'List all links',
            tags: ['links'],
            querystring: z.object({
                page: z.coerce.number().optional().default(1).describe('Page number, starting from 1'),
                pageSize: z.coerce.number().optional().default(4).describe('Number of items per page, default is 4')    
            }),
            response: {
                200: z.object({
                    links: z.array(
                        z.object({
                            id: z.uuidv7().describe('Id'),
                            original: z.url().describe('Original URL'),
                            short: z.string().describe('Short URL'),
                            accesses: z.coerce.number().describe('Number of accesses'),
                            createdAt: z.coerce.date().describe('Creation date')
                        })
                    ).describe('Array of registered links')
                })
            }
        }
    }, async (request, reply) => {
        const { page, pageSize } = request.query;

        const result = await getLinks({ page, pageSize });

        const { links } = unwrapEither(result);

        return reply.status(200).send({ links });
    });
}