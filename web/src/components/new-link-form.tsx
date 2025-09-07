import { Card, CardContent, CardFooter, CardHeader } from "./ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "./ui/input"
import { useLinkStore } from "@/store/useLinks"
import { CheckCircleIcon, WarningIcon } from "@phosphor-icons/react"
import { Alert } from "./ui/alert"

const formSchema = z.object({
    original: z.url({ message: 'Não é um endereço válido' }),
    short: z.string()
            .min(1, { message: 'Este campo não pode estar vazio' })
            .regex(/^[a-zA-Z0-9_-]+$/, {
                message: 'São aceitos apenas letras, números, traço e underline'
            })

})

function FormMessageWithIcon({ message }: { message?: string }) {
  if (!message) return null
  return (
    <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
      <WarningIcon size={16} /> 
      <span>{message}</span>
    </div>
  )
}

export function NewLinkForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            original: "",
            short: ""
        },
        // Valida o formulário assim que o usuário interage com ele
        mode: 'onChange'
    })

    const { 
        handleSubmit,
        control,
        formState: { isValid },
        reset
    } = form

    const { addLink, loading, error } = useLinkStore()
    const [messageType, setMessageType] = useState<'ok' | 'error' | null>(null)

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            await addLink(data.original, data.short)
            
            if (error) {
                setMessageType("error")
            } else {
                setMessageType("ok")
                reset()            // Limpa os campos após sucesso
            }
        } catch {
            setMessageType("error")
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex-1 mb-4 md:mb-0">
                <Card className="w-full">
                    <CardHeader>
                        <h1 className="my-text-xl">Novo Link</h1>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        {messageType && 
                            <Alert className="flex items-center gap-2">
                                { messageType === 'ok' ? 
                                    (
                                        <>
                                            <CheckCircleIcon size={24} className="text-green-600" /> 
                                            <span className="text-green-600">Link adicionado com sucesso!</span>
                                        </>
                                    ) : (
                                        <>
                                            <WarningIcon size={24} className="text-red-600" />
                                            <span className="text-red-600">Ocorreu um erro ao adicionar o link.</span>
                                        </>
                                    )
                                }
                            </Alert>
                        }
                        <FormField control={control} name="original"
                                   render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Link Original</FormLabel>
                                            <FormControl>
                                                <Input placeholder="www.exemplo.com.br" {...field} />
                                            </FormControl>
                                            <FormMessage>
                                                <FormMessageWithIcon message={form.formState.errors.original?.message} />
                                            </FormMessage>
                                        </FormItem>
                                   )}
                        />
                        <FormField control={form.control} name="short"
                                   render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Link Encurtado</FormLabel>
                                            <FormControl>
                                                <Input placeholder="brev.ly/" {...field} />
                                            </FormControl>
                                            <FormMessage>
                                                <FormMessageWithIcon message={form.formState.errors.short?.message} />
                                            </FormMessage>
                                        </FormItem>
                                   )}
                        />
                    </CardContent>
                    <CardFooter className="flex-col gap-2">
                        <Button type="submit" size="lg" 
                                className="w-full my-text-md bg-blue-800 hover:bg-blue-900 active:bg-blue-900 text-white"
                                disabled={!isValid || loading}>
                            {loading ? 'Salvando....' : 'Salvar Link'}                            
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    )
}