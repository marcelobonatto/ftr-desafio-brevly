import { deleteLink } from "@/app/functions/delete-link";
import { isRight } from "@/shared/either";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

// Constante da rota de exclusão de link
export const deleteLinkRoute: FastifyPluginAsyncZod = async app => {
    // Este endereço receberá o ID pelo parâmetro da rota
    app.delete('/links/:id', {
        schema: {
            summary: 'Delete a link by ID',
            tags: ['links'],
            params: z.object({
                id: z.uuid().describe('ID of the link to delete')
            }),
            response: {
                204: z.object({
                    message: z.string().describe('Link deleted successfully')
                }),

                404: z.object({
                    message: z.string().describe('Link not found')
                })
            }
        }
    }, async (request, reply) => {
        const { id } = request.params;

        // Exclui o registro
        const result = await deleteLink({ id })

        // Se retornar vazio no id, retorna 404 indicando que o link não foi encontrado pelo id
        if (isRight(result) && result.right.id === '') {
            return reply.status(404).send({ message: 'Link not found' });
        }

        return reply.status(204).send();
    })
}