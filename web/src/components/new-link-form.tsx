import { Card, CardContent, CardFooter, CardHeader } from "./ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "./ui/input"
import { useLinkStore } from "@/store/useLinks"
import { WarningIcon } from "@phosphor-icons/react"
import { toast } from "sonner"

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

    const { handleSubmit, control, formState: { isValid }, reset} = form

    const { addLink, loading, error } = useLinkStore()

    async function onSubmit(data: z.infer<typeof formSchema>) {
        addLink(data.original, data.short)

        if (error)
            toast.error('Ocorreu um erro ao adicionar o link: ' + (error || 'Erro desconhecido'))
        else {
            toast.success('Link adicionado com sucesso!')
            reset()
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex-1 mb-4 md:mb-0">
                <Card className="w-full">
                    <CardHeader>
                        <h1 className="my-text-xl">Novo Link</h1>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
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