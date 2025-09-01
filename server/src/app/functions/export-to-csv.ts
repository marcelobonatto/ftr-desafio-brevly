import { db, pg } from "@/infra/db"
import { schema } from "@/infra/db/schemas"
import { Either, makeRight } from "@/shared/either"
import { uploadFileToStorage } from "@/storage/upload-file-to-storage"
import { stringify } from "csv-stringify"
import { PassThrough, Transform } from "node:stream"
import { pipeline } from "stream/promises"

// Definição do tipo de saída da função getAllLinks
type GetAllLinksOutput = {
    reportUrl: string
}

export async function exportToCsv(): Promise<Either<never, GetAllLinksOutput>> {
    // Seleciona todos os registro da tabela links por ordem de data criada,
    // criando um SQL para selecionar via cursor do Postgres
    const { sql, params } = db.select({
                                    original: schema.links.original,
                                    short: schema.links.short,
                                    accesses: schema.links.accesses,
                                    createdAt: schema.links.createdAt
                                }).from(schema.links)
                                  .orderBy(schema.links.createdAt)
                                  .toSQL()

    const cursor = pg.unsafe(sql, params as string[]).cursor(4)

    // Configurando como será o nosso relatório em CSV
    const csv = stringify({
        delimiter: ',',
        header: true,
        columns: [
            { key: 'original', header: 'URL Original' },
            { key: 'short', header: 'URL Curta' },
            { key: 'accesses', header: 'Acessos' },
            { key: 'created_at', header: 'Criado em' }
        ]
    })
    
    // Agora vamos listar os dados do Postgres e passar para o CSV em forma de stream.
    // Primeiro definimos um PassThrough. Ele vai ser preenchido via pipeline, que permite
    // juntar várias entradas, que vão ser transformadas e resultar numa saída via stream, 
    // sem modificar os dados da entrada.
    const uploadToCloudStream = new PassThrough()

    // O primeiro parâmetro é a execução do cursor, que vai enviar pacotes de 4 registros.
    // No segundo parâmetro, vamos transformar os dados recebidos pelo cursor. Com isso,
    // o Transform recebe os 4 registros e, com isso, é enviado para para o CSV Stringfy
    // O último parâmetro recebe o texto CSV e permite enviar o stream.
    const createCsvPipeline = pipeline(
        cursor,
        new Transform({
            objectMode: true,
            transform(chunks: unknown[], encoding, callback) {
                for (const chunk of chunks) {
                    this.push(chunk)
                }

                callback()
            }
        }),
        csv,
        uploadToCloudStream
    )

    // Configura o upload do arquivo para Cloudflare R2
    const uploadToStorage = uploadFileToStorage({
        contentType: 'text/csv',
        fileName: `${new Date().toISOString()}-links.csv`,
        contentStream: uploadToCloudStream
    })

    // Execução paralela: inicia o upload dos bytes já gerados
    // e executa a obtenção dos próximos lotes de registros
    const [{ url }] = await Promise.all([ uploadToStorage, createCsvPipeline ])

    // O Cloudflare R2 devolve a URL quando finalizar o upload
    return makeRight({ reportUrl: url });
}