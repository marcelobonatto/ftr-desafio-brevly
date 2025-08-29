import { fastify } from 'fastify'
import { fastifyCors } from '@fastify/cors'
import { hasZodFastifySchemaValidationErrors, jsonSchemaTransform, serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod'
import { fastifySwagger } from '@fastify/swagger'
import scalarUI from '@scalar/fastify-api-reference'
import { env } from '@/env'
import { getLinksRoute } from './routes/get-links'
import { createLinkRoute } from './routes/create-link'
import { deleteLinkRoute } from './routes/delete-link'

// Cria a instância do Fastify
const app = fastify()

// Adiciona o validador de esquema e serializador
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

// Define um handler genérico de erro para erros inesperados
app.setErrorHandler((error, request, reply) => {
    if (hasZodFastifySchemaValidationErrors(error)) {
        return reply.status(400).send({
            message: 'Validation error',
            issues: error.validation
        })
    }

    // Esta linha imprime o erro para observalidade
    console.log(error);

    return reply.code(500).send({
        message: 'Internal server error'
    })
})

// Configura as origens permitidas pelo CORS
app.register(fastifyCors, { origin: '*' })

// Registrando o objeto para criar a documentação via OpenAPI
app.register(fastifySwagger, {
    openapi: {
        info: {
            title: 'Brev.ly Server',
            version: '1.0.0'
        }
    },
    transform: jsonSchemaTransform
})

app.get('/', async () => {
    return { status: 'Main API Function' }
})

// Health check de testes iniciais
app.get('/health', async () => {
    return { status: 'HTTP server is running!!!' }
})

// Endpoint que chama o Swagger para gerar a documentação
// acessado via UI do Scalar
app.get('/openapi.json', () => app.swagger())

app.register(scalarUI, {
    routePrefix: '/docs',
    configuration: {
        layout: 'modern'
    }
})

// Registrando as rotas
app.register(getLinksRoute)
app.register(createLinkRoute)
app.register(deleteLinkRoute)

// Executa o servidor
app.listen({ port: env.PORT, host: '0.0.0.0' })
   .then(() => {
        console.log(`HTTP Server running on port ${env.PORT}!!!`)
   })