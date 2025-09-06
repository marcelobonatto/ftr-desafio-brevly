import { Card, CardContent, CardFooter, CardHeader } from "./ui/card"
import { Button } from "@/components/ui/button"
import { InputWithLabel } from "@/components/input-with-label"
import { useMemo, useState } from "react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "./ui/input"

const formSchema = z.object({
    original: z.url({ message: 'Não é um endereço válido' }),
    short: z.string()
            .trim()
            .min(1, { message: 'Este campo não pode estar vazio' })
            .regex(/^[a-zA-Z0-9_-]+$/, {
                message: 'São aceitos apenas letras, números, traço e underline'
            })

})

export function NewLinkForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            original: "",
            short: ""
        }
    })


    const [original, setOriginal] = useState("");
    const [short, setShort] = useState("");

    const getOriginal = (value: string) => {
        setOriginal(value);
    };

    const getShort = (value: string) => {
        setShort(value);
    };

    const isValid = useMemo(
        () => original.length > 0 && short.length > 0,
        [original, short]
    );

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log(values)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full md:w-2/5 max-h-[310px] mb-4 md:mb-0">
                {/* <Card className="w-full md:w-2/5 max-h-[310px] mb-4 md:mb-0"> */}
                <Card>
                    <CardHeader>
                        <h1 className="my-text-xl">Novo Link</h1>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        {/* <InputWithLabel id="original" label="Link Original" type="url" placeholder="www.exemplo.com.br" 
                                        onValueChange={getOriginal} />
                        <InputWithLabel id="short" label="Link Encurtado" type="text" placeholder="brev.ly/" 
                                        onValueChange={getShort} /> */}
                        <FormField control={form.control} name="original"
                                   render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Link Original</FormLabel>
                                        <FormControl>
                                            <Input placeholder="www.exemplo.com.br" {...field} />
                                        </FormControl>
                                        <FormMessage />
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
                                        <FormMessage />
                                    </FormItem>
                                   )}
                        />
                    </CardContent>
                    <CardFooter className="flex-col gap-2">
                        <Button type="submit" size="lg" 
                                className="w-full my-text-md bg-blue-800 hover:bg-blue-900 active:bg-blue-900 text-white"
                                disabled={!isValid}>
                            Salvar Link
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    )
}