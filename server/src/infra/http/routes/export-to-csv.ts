import { exportToCsv } from "@/app/functions/export-to-csv"
import { unwrapEither } from "@/shared/either"
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"

export const exportToCsvRoute: FastifyPluginAsyncZod = async app => {
    app.post('/export/csv', {
        schema: {
            summary: 'Generate a CSV report of links',
            tags: ['links'],
            response: {
                200: z.object({
                    url: z.url().describe('URL to download the CSV file')
                })
            }
        }
    }, async (request, reply) => {
        const result = await exportToCsv();

        const { reportUrl } = unwrapEither(result);

        return reply.status(200).send({ url: reportUrl })
    })
}