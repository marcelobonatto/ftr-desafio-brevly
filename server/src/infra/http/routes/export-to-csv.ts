import { getAllLinks } from "@/app/functions/export-to-csv"
import { unwrapEither } from "@/shared/either"
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import Papa from "papaparse"
import z from "zod"
import { format } from "date-fns"
import { uuidv7 } from "uuidv7"

export const exportToCsvRoute: FastifyPluginAsyncZod = async app => {
    app.post('/export/csv', {
        schema: {
            summary: 'Generate a CSV report of links',
            tags: ['links'],
            response: {
                // 200: z.object({
                //     url: z.url().describe('URL to download the CSV file')
                // })
                // 200: z.object({
                //     content: z.string().describe('CSV content')
                // }),
                200: z.object({
                    links: z.array(
                                    z.object({
                                        original: z.url().describe('Original URL'),
                                        short: z.string().describe('Short URL'),
                                        accesses: z.coerce.number().describe('Number of accesses'),
                                        createdAt: z.coerce.date().describe('Creation date')
                                    })
                                )
                }),

                404: z.object({
                    message: z.string().describe('Error message')
                })
            }
        }
    }, async (request, reply) => {
        const result = await getAllLinks();

        const { links } = unwrapEither(result);

        if (links.length === 0) {
            return reply.status(404).send({ message: 'No links found' })
        }

        // Definimos os cabeçalhos customizados


        const fileName = `relatorio-links-${uuidv7()}.csv`;
        console.log(`CSV generated. Uploading file: ${fileName}`);

console.log(fileName)

        return reply.status(200).send({ links })
    })
}